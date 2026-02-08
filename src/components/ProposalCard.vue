<script setup>
import { ref } from 'vue'
import { config } from '../config.js'
import RunawayButton from './RunawayButton.vue'

const emit = defineEmits(['yes'])

const yesPressed = ref(false)

/** Ref to the playground container where the No button bounces */
const playgroundRef = ref(null)

/** "Yes" button with scale-bounce feedback */
function handleYes() {
  if (yesPressed.value) return
  yesPressed.value = true

  // Small delay for the bounce animation to play
  setTimeout(() => {
    emit('yes')
  }, 300)
}
</script>

<template>
  <main class="proposal" role="main" aria-label="Valentine proposal">
    <!-- Playground: visible box where the No button bounces -->
    <div ref="playgroundRef" class="playground">
      <!-- Card sits inside the playground -->
      <div class="card" data-avoid-overlap>
        <!-- Decorative top emoji -->
        <div class="card-emoji" aria-hidden="true">💌</div>

        <!-- Question -->
        <h1 class="question">
          {{ config.questionText }}
        </h1>

        <!-- Playful subtitle / instructions -->
        <p class="subtitle">
          {{ config.subtitleText }}
        </p>

        <!-- Yes button stays in the card -->
        <div class="buttons">
          <button
            class="yes-btn"
            :class="{ 'is-pressed': yesPressed }"
            :aria-label="config.yesButtonText"
            @click="handleYes"
          >
            {{ config.yesButtonText }}
          </button>

          <!-- No button (in-flow initially, then flies inside playground) -->
          <RunawayButton :container-el="playgroundRef" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.proposal {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100dvh;
  padding: 12px;
  padding-top: calc(12px + var(--safe-top));
  padding-bottom: calc(12px + var(--safe-bottom));
}

/* ── Playground: visible bounded area ────────────── */
.playground {
  position: relative;
  width: 100%;
  max-width: 440px;
  /* Take most of the viewport height, minus safe margins */
  height: calc(100dvh - 24px - var(--safe-top) - var(--safe-bottom));
  max-height: 750px;
  border: 2px dashed var(--white-alpha-50);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ── Card ──────────────────────────────────────────── */
.card {
  background: var(--white-alpha-20);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--white-alpha-20);
  border-radius: var(--radius-lg);
  padding: 40px 28px 36px;
  max-width: 360px;
  width: calc(100% - 24px);
  text-align: center;
  animation: popIn 0.6s var(--ease-bounce) both;
  box-shadow: var(--shadow-soft);
  /* Keep card above the bouncing button */
  position: relative;
  z-index: 5;
}

.card-emoji {
  font-size: 3rem;
  margin-bottom: 16px;
  animation: pulse 2s ease-in-out infinite;
}

/* ── Question ──────────────────────────────────────── */
.question {
  font-size: clamp(1.5rem, 6vw, 2rem);
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 10px;
  color: var(--white);
  text-shadow: 0 2px 12px rgba(136, 19, 55, 0.3);
}

/* ── Subtitle ─────────────────────────────────────── */
.subtitle {
  font-size: clamp(0.9rem, 3.5vw, 1.05rem);
  font-weight: 500;
  color: var(--pink-200);
  margin-bottom: 28px;
  line-height: 1.4;
  opacity: 0;
  animation: fadeInUp 0.6s var(--ease-smooth) 0.4s both;
}

/* ── Buttons ─────────────────────────────────────── */
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

.yes-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 130px;
  min-height: 52px;
  padding: 14px 28px;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--white);
  background: linear-gradient(135deg, var(--red-500), var(--red-600));
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-button);
  transition: transform 0.2s var(--ease-bounce), box-shadow 0.2s ease;
  white-space: nowrap;
}

.yes-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(225, 29, 72, 0.5);
}

.yes-btn:active,
.yes-btn.is-pressed {
  animation: tapBounce 0.3s var(--ease-bounce);
}

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 360px) {
  .card {
    padding: 32px 20px 28px;
  }

  .buttons {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
