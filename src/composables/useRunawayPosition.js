import { ref, readonly } from 'vue'

/**
 * Composable: manages the runaway "No" button position.
 *
 * - Keeps the button within the visible playground container.
 * - Avoids overlapping with the "Yes" button and question text.
 * - Gets progressively faster/harder after each escape.
 */
export function useRunawayPosition() {
  /** Current button position relative to the container (px) */
  const x = ref(0)
  const y = ref(0)

  /** Whether the button has started running */
  const hasEscaped = ref(false)

  /** Number of escape attempts */
  const attempts = ref(0)

  /** Button approximate size */
  const BTN_W = 130
  const BTN_H = 52

  /** Inner padding inside the container */
  const PAD_INNER = 8

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
   * Move button to a new random position within the container,
   * avoiding overlap with the provided avoid-rects.
   *
   * @param {HTMLElement} containerEl - The playground container element
   * @param {DOMRect[]} avoidRects - Rects to avoid overlapping (in viewport coords)
   * @param {number} [maxRetries=30] - Max random attempts
   */
  function escape(containerEl, avoidRects = [], maxRetries = 30) {
    if (!containerEl) return

    const box = containerEl.getBoundingClientRect()

    // Available range inside the container
    const minX = PAD_INNER
    const minY = PAD_INNER
    const maxX = Math.max(box.width - BTN_W - PAD_INNER, PAD_INNER)
    const maxY = Math.max(box.height - BTN_H - PAD_INNER, PAD_INNER)

    const rangeX = Math.max(maxX - minX, 0)
    const rangeY = Math.max(maxY - minY, 0)

    let newX, newY
    let tries = 0
    let valid = false

    while (tries < maxRetries && !valid) {
      newX = minX + Math.random() * rangeX
      newY = minY + Math.random() * rangeY

      // Convert to viewport coords for overlap check
      const btnViewport = {
        left: box.left + newX,
        top: box.top + newY,
        right: box.left + newX + BTN_W,
        bottom: box.top + newY + BTN_H,
      }

      // Check overlap with all avoid-rects (with padding)
      const AVOID_PAD = 12
      valid = avoidRects.every((rect) => {
        const padded = {
          left: rect.left - AVOID_PAD,
          top: rect.top - AVOID_PAD,
          right: rect.right + AVOID_PAD,
          bottom: rect.bottom + AVOID_PAD,
        }
        return !rectsOverlap(btnViewport, padded)
      })

      tries++
    }

    x.value = newX ?? minX
    y.value = newY ?? minY
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
