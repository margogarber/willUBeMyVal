<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { config } from '../config.js'
import { useRunawayPosition } from '../composables/useRunawayPosition.js'

const emit = defineEmits(['escaped'])

const { x, y, hasEscaped, attempts, escape, reclamp, reset } = useRunawayPosition()

/** DOM refs */
const btnRef = ref(null)

/** Current taunt text */
const tauntText = computed(() => {
  if (!hasEscaped.value) return ''
  const taunts = config.noTaunts
  return taunts[(attempts.value - 1) % taunts.length]
})

/** Show hint after 10+ attempts */
const showHint = computed(() => attempts.value >= 10)

/**
 * Collect rects of elements the button should not overlap.
 */
function getAvoidRects() {
  const els = document.querySelectorAll('[data-avoid-overlap]')
  return Array.from(els).map((el) => el.getBoundingClientRect())
}

/**
 * Trigger escape! Passes the button element so its real size is measured.
 */
function runAway() {
  escape(btnRef.value, getAvoidRects())
  emit('escaped')
}

/**
 * Transition duration gets shorter as attempts increase (progressive difficulty).
 */
const transitionDuration = computed(() => {
  const base = 400
  const min = 100
  const speed = Math.max(base - attempts.value * 30, min)
  return `${speed}ms`
})

/**
 * On pointer proximity (desktop): if pointer is within a
 * threshold of the button, trigger escape.
 */
function handlePointerMove(e) {
  if (!btnRef.value || !hasEscaped.value) return

  const rect = btnRef.value.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  const threshold = Math.max(100 - attempts.value * 5, 40)

  const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
  if (dist < threshold) {
    runAway()
  }
}

onMounted(() => {
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('resize', reclamp, { passive: true })
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', reclamp, { passive: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('resize', reclamp)
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', reclamp)
  }
  reset()
})

defineExpose({ reset })
</script>

<template>
  <!--
    Before first escape: button is in normal document flow (inside the card).
    After escape: button teleports to <body> so position:fixed works correctly.
    (backdrop-filter on the card breaks fixed positioning for children)
  -->
  <Teleport to="body" :disabled="!hasEscaped">
    <button
      ref="btnRef"
      class="no-btn"
      :class="{ 'is-escaped': hasEscaped }"
      :style="
        hasEscaped
          ? {
              position: 'fixed',
              left: `${x}px`,
              top: `${y}px`,
              transitionDuration,
              zIndex: 9999,
            }
          : {}
      "
      :aria-label="config.noButtonText"
      @pointerdown.prevent="runAway"
      @touchstart.prevent="runAway"
      @click.prevent="runAway"
    >
      {{ hasEscaped ? tauntText : config.noButtonText }}
    </button>
  </Teleport>

  <!-- Hint after many attempts -->
  <Teleport to="body">
    <Transition name="hint">
      <p v-if="showHint" class="hint-text" aria-live="polite">
        {{ config.hintText }}
      </p>
    </Transition>
  </Teleport>
</template>

<style>
/* These styles are NOT scoped because the button teleports to <body> */
.no-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 130px;
  min-height: 52px;
  padding: 14px 28px;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: inherit;
  color: var(--red-700);
  background: var(--white);
  border: none;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  transition-property: left, top, transform, box-shadow;
  transition-timing-function: var(--ease-bounce);
  transition-duration: 400ms;
  user-select: none;
  white-space: nowrap;
}

.no-btn:focus-visible {
  outline: 3px solid var(--white);
  outline-offset: 3px;
}

.no-btn:hover {
  box-shadow: var(--shadow-button);
}

.no-btn:active {
  animation: tapBounce 0.25s var(--ease-bounce);
}

/* ── Hint ─────────────────────────────────────────── */
.hint-text {
  position: fixed;
  bottom: calc(24px + var(--safe-bottom));
  left: 50%;
  transform: translateX(-50%);
  background: var(--white-alpha-80);
  color: var(--red-800);
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: var(--shadow-soft);
  z-index: 9999;
  white-space: nowrap;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.hint-enter-active {
  animation: fadeInUp 0.4s var(--ease-bounce) both;
}

.hint-leave-active {
  animation: fadeInUp 0.3s var(--ease-smooth) reverse both;
}
</style>
