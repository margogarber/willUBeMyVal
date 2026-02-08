import { ref, readonly } from 'vue'

/**
 * Composable: manages the runaway "No" button position.
 *
 * - Measures the actual button size before repositioning.
 * - Uses visualViewport for accurate mobile bounds.
 * - Clamps position so button always stays fully visible.
 * - Re-clamps on resize / orientation change.
 */
export function useRunawayPosition() {
  /** Current button position (top-left, in px) */
  const x = ref(0)
  const y = ref(0)

  /** Stored button dimensions (updated on every escape) */
  let btnW = 130
  let btnH = 52

  /** Whether the button has started running */
  const hasEscaped = ref(false)

  /** Number of escape attempts */
  const attempts = ref(0)

  /** Safe inset from each screen edge (px) */
  const INSET = 20

  /**
   * Get the visible viewport size.
   * For position:fixed, we don't need offsets — just width & height.
   */
  function getViewportSize() {
    const vv = window.visualViewport
    return {
      w: vv ? vv.width : window.innerWidth,
      h: vv ? vv.height : window.innerHeight,
    }
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max)
  }

  function rectsOverlap(r1, r2) {
    return !(
      r1.right < r2.left ||
      r1.left > r2.right ||
      r1.bottom < r2.top ||
      r1.top > r2.bottom
    )
  }

  /** Safe bounds for the button's top-left corner */
  function getSafeBounds() {
    const vp = getViewportSize()
    return {
      minX: INSET,
      minY: INSET,
      maxX: Math.max(vp.w - btnW - INSET, INSET),
      maxY: Math.max(vp.h - btnH - INSET, INSET),
    }
  }

  /**
   * Move button to a random on-screen position.
   *
   * @param {HTMLElement|null} btnEl - The button DOM element (to measure its real size)
   * @param {DOMRect[]} avoidRects - Rects to avoid overlapping
   */
  function escape(btnEl, avoidRects = [], maxRetries = 30) {
    // Measure the real button size if element is available
    if (btnEl) {
      const rect = btnEl.getBoundingClientRect()
      btnW = Math.ceil(rect.width) || 130
      btnH = Math.ceil(rect.height) || 52
    }

    const bounds = getSafeBounds()
    const rangeX = Math.max(bounds.maxX - bounds.minX, 0)
    const rangeY = Math.max(bounds.maxY - bounds.minY, 0)

    let newX, newY
    let tries = 0
    let valid = false

    while (tries < maxRetries && !valid) {
      newX = bounds.minX + Math.random() * rangeX
      newY = bounds.minY + Math.random() * rangeY

      const btnRect = {
        left: newX,
        top: newY,
        right: newX + btnW,
        bottom: newY + btnH,
      }

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

    // Final clamp — button will ALWAYS be fully on screen
    x.value = clamp(newX ?? bounds.minX, bounds.minX, bounds.maxX)
    y.value = clamp(newY ?? bounds.minY, bounds.minY, bounds.maxY)
    hasEscaped.value = true
    attempts.value++
  }

  /** Re-clamp to current viewport (resize, rotation) */
  function reclamp() {
    if (!hasEscaped.value) return
    const bounds = getSafeBounds()
    x.value = clamp(x.value, bounds.minX, bounds.maxX)
    y.value = clamp(y.value, bounds.minY, bounds.maxY)
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
    reclamp,
    reset,
  }
}
