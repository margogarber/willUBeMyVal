<script setup>
import { ref } from 'vue'
import ProposalCard from './components/ProposalCard.vue'
import CatParty from './components/CatParty.vue'

/** Current screen: 'proposal' or 'celebration' */
const screen = ref('proposal')

/** Floating hearts for background decoration */
const hearts = ['💕', '❤️', '💗', '💖', '💘', '♥️', '💝', '💞']

function onYes() {
  screen.value = 'celebration'
}

function onReplay() {
  screen.value = 'proposal'
}
</script>

<template>
  <div class="app-shell">
    <!-- Floating hearts background -->
    <div class="hearts-bg" aria-hidden="true">
      <span
        v-for="(h, i) in 12"
        :key="i"
        class="floating-heart"
        :style="{
          left: `${6 + (i * 8) % 90}%`,
          animationDelay: `${(i * 1.3) % 8}s`,
          animationDuration: `${8 + (i % 5) * 2}s`,
          fontSize: `${16 + (i % 4) * 8}px`,
        }"
      >{{ hearts[i % hearts.length] }}</span>
    </div>

    <!-- Screens -->
    <Transition name="screen" mode="out-in">
      <ProposalCard v-if="screen === 'proposal'" key="proposal" @yes="onYes" />
      <CatParty v-else key="celebration" @replay="onReplay" />
    </Transition>
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    160deg,
    var(--red-900) 0%,
    var(--red-700) 35%,
    var(--red-500) 70%,
    var(--red-400) 100%
  );
  padding: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
  overflow: hidden;
}

/* ── Floating Hearts ─────────────────────────────── */
.hearts-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.floating-heart {
  position: absolute;
  bottom: -40px;
  animation: floatUp linear infinite;
  opacity: 0.5;
  will-change: transform, opacity;
}

/* ── Screen Transitions ──────────────────────────── */
.screen-enter-active {
  animation: popIn 0.5s var(--ease-bounce) both;
}

.screen-leave-active {
  animation: popIn 0.3s var(--ease-smooth) reverse both;
}
</style>
