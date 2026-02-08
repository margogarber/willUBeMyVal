<script setup>
import { ref, computed, onMounted } from 'vue'
import { config } from '../config.js'

const emit = defineEmits(['replay'])

/** Whether the main content is visible (for entrance animation) */
const show = ref(false)

onMounted(() => {
  // Tiny delay to trigger entrance animation
  requestAnimationFrame(() => {
    show.value = true
  })
})

/**
 * Generate random cat stickers data.
 * Uses images if provided, otherwise falls back to emojis.
 */
const cats = computed(() => {
  const count = config.catCount || 18
  const hasImages = config.catImages && config.catImages.length > 0
  const emojis = config.catEmojis

  return Array.from({ length: count }, (_, i) => {
    const useImage = hasImages && config.catImages[i % config.catImages.length]

    return {
      id: i,
      emoji: emojis[i % emojis.length],
      image: useImage ? `/cats/${useImage}` : null,
      // Random positioning
      left: `${3 + Math.random() * 88}%`,
      top: `${5 + Math.random() * 80}%`,
      size: `${28 + Math.random() * 44}px`,
      rotation: `${-30 + Math.random() * 60}deg`,
      delay: `${i * 0.1}s`,
      duration: `${0.5 + Math.random() * 0.4}s`,
      // Gentle float animation offset
      floatOffset: `${Math.random() * 4}s`,
    }
  })
})

/** Track images that failed to load — fall back to emoji */
const failedImages = ref(new Set())

function onImageError(catId) {
  failedImages.value.add(catId)
}
</script>

<template>
  <main class="celebration" role="main" aria-label="Celebration screen">
    <!-- Cat stickers background -->
    <div class="cats-layer" aria-hidden="true">
      <div
        v-for="cat in cats"
        :key="cat.id"
        class="cat-sticker"
        :style="{
          left: cat.left,
          top: cat.top,
          fontSize: cat.size,
          '--rotation': cat.rotation,
          animationDelay: cat.delay,
          animationDuration: cat.duration,
          '--float-offset': cat.floatOffset,
        }"
      >
        <img
          v-if="cat.image && !failedImages.has(cat.id)"
          :src="cat.image"
          :alt="`Cat sticker ${cat.id}`"
          class="cat-img"
          @error="onImageError(cat.id)"
        />
        <span v-else class="cat-emoji">{{ cat.emoji }}</span>
      </div>
    </div>

    <!-- Floating hearts burst -->
    <div class="hearts-burst" aria-hidden="true">
      <span
        v-for="i in 20"
        :key="'h' + i"
        class="burst-heart"
        :style="{
          left: `${5 + Math.random() * 85}%`,
          top: `${5 + Math.random() * 85}%`,
          animationDelay: `${i * 0.08}s`,
          fontSize: `${14 + Math.random() * 20}px`,
        }"
      >{{ ['💖', '💗', '💕', '❤️', '💘', '💝'][i % 6] }}</span>
    </div>

    <!-- Success message overlay -->
    <div class="message-panel" :class="{ 'is-visible': show }">
      <div class="success-emoji" aria-hidden="true">😻</div>

      <h1 class="success-title">
        {{ config.successTitle }}
      </h1>

      <p class="success-subtitle">
        {{ config.successSubtitle }}
      </p>

      <button
        class="replay-btn"
        :aria-label="config.replayButtonText"
        @click="emit('replay')"
      >
        {{ config.replayButtonText }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.celebration {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100dvh;
  padding: 24px 16px;
  padding-top: calc(24px + var(--safe-top));
  padding-bottom: calc(24px + var(--safe-bottom));
  overflow: hidden;
}

/* ── Cats Layer ───────────────────────────────────── */
.cats-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.cat-sticker {
  position: absolute;
  animation: catPop var(--ease-bounce) both;
  will-change: transform, opacity;
}

@keyframes catPop {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  70% {
    transform: scale(1.2) rotate(var(--rotation, 0deg));
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(var(--rotation, 0deg));
    opacity: 1;
  }
}

.cat-sticker::after {
  content: '';
  position: absolute;
  inset: 0;
  animation: catFloat 3s ease-in-out infinite;
  animation-delay: var(--float-offset, 0s);
}

@keyframes catFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.cat-emoji {
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  animation: catFloat 3s ease-in-out infinite;
  animation-delay: var(--float-offset, 0s);
}

.cat-img {
  width: 1.8em;
  height: 1.8em;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
  animation: catFloat 3s ease-in-out infinite;
  animation-delay: var(--float-offset, 0s);
}

/* ── Hearts Burst ─────────────────────────────────── */
.hearts-burst {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.burst-heart {
  position: absolute;
  animation: confettiFall 1.5s var(--ease-bounce) both;
  will-change: transform, opacity;
}

/* ── Message Panel ────────────────────────────────── */
.message-panel {
  position: relative;
  z-index: 10;
  background: var(--white-alpha-80);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--white-alpha-50);
  border-radius: var(--radius-lg);
  padding: 44px 32px 36px;
  max-width: 380px;
  width: 100%;
  text-align: center;
  box-shadow:
    0 8px 40px rgba(136, 19, 55, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);

  /* Entrance animation */
  opacity: 0;
  transform: scale(0.8) translateY(20px);
  transition:
    opacity 0.5s var(--ease-smooth),
    transform 0.6s var(--ease-bounce);
}

.message-panel.is-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.success-emoji {
  font-size: 3.5rem;
  margin-bottom: 12px;
  animation: pulse 1.5s ease-in-out infinite;
}

.success-title {
  font-size: clamp(1.6rem, 7vw, 2.2rem);
  font-weight: 800;
  color: var(--red-700);
  line-height: 1.2;
  margin-bottom: 8px;
}

.success-subtitle {
  font-size: clamp(1rem, 4vw, 1.2rem);
  color: var(--red-600);
  font-weight: 500;
  margin-bottom: 28px;
  line-height: 1.4;
}

/* ── Replay Button ────────────────────────────────── */
.replay-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--white);
  background: linear-gradient(135deg, var(--red-500), var(--red-600));
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-button);
  transition: transform 0.2s var(--ease-bounce), box-shadow 0.2s ease;
}

.replay-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(225, 29, 72, 0.5);
}

.replay-btn:active {
  animation: tapBounce 0.3s var(--ease-bounce);
}

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 360px) {
  .message-panel {
    padding: 32px 20px 28px;
  }
}
</style>
