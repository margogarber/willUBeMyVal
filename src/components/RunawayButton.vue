<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { config } from '../config.js'
import { useRunawayPosition } from '../composables/useRunawayPosition.js'

const emit = defineEmits(['escaped'])

const { x, y, hasEscaped, attempts, escape, reset } = useRunawayPosition()

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
 * We look for [data-avoid-overlap] elements in the parent.
 */
function getAvoidRects() {
  const els = document.querySelectorAll('[data-avoid-overlap]')
  return Array.from(els).map((el) => el.getBoundingClientRect())
}

/**
 * Trigger escape! Called on multiple events for reliability.
 */
function runAway() {
  escape(getAvoidRects())
  emit('escaped')
}

/**
 * Transition duration gets shorter as attempts increase (progressive difficulty).
 * Starts at 400ms, minimum 100ms.
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

  // Threshold shrinks with attempts (harder to approach)
  const threshold = Math.max(100 - attempts.value * 5, 40)

  const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
  if (dist < threshold) {
    runAway()
  }
}

onMounted(() => {
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  reset()
})

/** Expose reset for parent */
defineExpose({ reset })
</script>

<template>
  <div class="runaway-wrapper">
    <!-- Button: either in-flow (initial) or positioned (after first escape) -->
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

    <!-- Hint after many attempts -->
    <Transition name="hint">
      <p v-if="showHint" class="hint-text" aria-live="polite">
        {{ config.hintText }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.runaway-wrapper {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.no-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 130px;
  min-height: 52px;
  padding: 14px 28px;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--red-700);
  background: var(--white);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-soft);
  transition-property: left, top, transform, box-shadow;
  transition-timing-function: var(--ease-bounce);
  transition-duration: 400ms;
  user-select: none;
  z-index: 10;
  white-space: nowrap;
}

.no-btn:hover {
  box-shadow: var(--shadow-button);
}

.no-btn:active {
  animation: tapBounce 0.25s var(--ease-bounce);
}

.no-btn.is-escaped {
  /* Override display when positioned */
  pointer-events: auto;
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
  z-index: 20;
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
