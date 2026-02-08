/**
 * ✏️ CUSTOMIZE YOUR VALENTINE PROPOSAL HERE
 * Change any text below to personalize the experience!
 */

export const config = {
  /* ── Proposal Screen ──────────────────────────── */
  questionText: 'Will you be my Valentine?',
  // Playful subtitle shown below the question
  subtitleText: 'Try to catch the "No" button… good luck 😏👆',
  yesButtonText: 'Yes 💖',
  noButtonText: 'No 😤',

  /* ── Runaway "No" Button Taunts ────────────────── */
  // Shown after each escape attempt, cycles through
  noTaunts: [
    'Nope 😼',
    'Too slow for a soldier! 🐱',
    'Hehe 😸',
    'Can\'t catch me! 🏃',
    'Not today! 😹',
    'Almost! 🙈',
    'Nuh-uh 💅',
    'Try again~ 😜',
    'Wrong answer! 🤨',
    'Are you a soldier? 🤔',
    'You must be joking! 😂',
    'IDF has to see this! 😅',
    'Not even close! 😅',
    'You wanna break my heart? 💔',
  ],

  // Shown after 10+ failed attempts
  hintText: 'Okay okay… just press YES 😭',

  /* ── Success / Celebration Screen ──────────────── */
  successTitle: 'YAY! soldier is caught 💘',
  successSubtitle: 'I knew you\'d say yes! 😻',
  replayButtonText: 'Play again? 😏',

  /* ── Cat Stickers on Success Screen ────────────── */
  // Emoji fallback cats used when images aren't available
  catEmojis: ['😺', '😸', '😻', '😽', '🐱', '😹', '🙀', '🐈'],

  // If you place images in /public/cats/, list filenames here.
  // Example: ['cat1.png', 'cat2.png']
  // Leave empty to use emoji-only mode.
  catImages: [],

  // Number of cat stickers on success screen
  catCount: 18,
}
