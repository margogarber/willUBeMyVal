import { ref, readonly } from 'vue'

/**
 * Composable: manages the runaway "No" button position.
 *
 * - Keeps the button within a safe viewport area (margins from edges).
 * - Avoids overlapping with the "Yes" button and question text.
 * - Gets progressively faster/harder after each escape.
 */
export function useRunawayPosition() {
  /** Current button position (top-left, in px) */
  const x = ref(0)
  const y = ref(0)

  /** Whether the button has started running */
  const hasEscaped = ref(false)

  /** Number of escape attempts */
  const attempts = ref(0)

  /* Safe area margins (px) — keeps button away from edges & browser chrome */
  const MARGIN_TOP = 100
  const MARGIN_BOTTOM = 80
  const MARGIN_X = 20

  /** Button approximate size */
  const BTN_W = 130
  const BTN_H = 52

  /**
   * Check if two rectangles overlap.
   */
  function rectsOverlap(r1, r2) {
    return !(
      r1.right < r2.left ||
      r1.left > r2.right ||
      r1.bottom < r2.top ||
      r1.top > r2.bottom
    )
  }

  /**
   * Move button to a new random position that does not overlap
   * with the provided avoid-rects (e.g., "Yes" button, question text).
   *
   * @param {DOMRect[]} avoidRects - Rects to avoid overlapping
   * @param {number} [maxRetries=20] - Max random attempts before giving up
   */
  function escape(avoidRects = [], maxRetries = 30) {
    const vw = window.innerWidth
    const vh = window.innerHeight

    const safeLeft = MARGIN_X
    const safeTop = MARGIN_TOP
    const safeRight = vw - MARGIN_X - BTN_W
    const safeBottom = vh - MARGIN_BOTTOM - BTN_H

    // Don't allow negative ranges on very small screens
    const rangeX = Math.max(safeRight - safeLeft, 0)
    const rangeY = Math.max(safeBottom - safeTop, 0)

    let newX, newY
    let tries = 0
    let valid = false

    while (tries < maxRetries && !valid) {
      newX = safeLeft + Math.random() * rangeX
      newY = safeTop + Math.random() * rangeY

      const btnRect = {
        left: newX,
        top: newY,
        right: newX + BTN_W,
        bottom: newY + BTN_H,
      }

      // Check overlap with all avoid-rects (with some padding)
      const PAD = 16
      valid = avoidRects.every((rect) => {
        const padded = {
          left: rect.left - PAD,
          top: rect.top - PAD,
          right: rect.right + PAD,
          bottom: rect.bottom + PAD,
        }
        return !rectsOverlap(btnRect, padded)
      })

      tries++
    }

    // Even if we couldn't find a perfect spot, use the last computed one
    x.value = newX ?? safeLeft
    y.value = newY ?? safeTop
    hasEscaped.value = true
    attempts.value++
  }

  /** Reset to initial state */
  function reset() {
    x.value = 0
    y.value = 0
    hasEscaped.value = false
    attempts.value = 0
  }

  return {
    x: readonly(x),
    y: readonly(y),
    hasEscaped: readonly(hasEscaped),
    attempts: readonly(attempts),
    escape,
    reset,
  }
}
