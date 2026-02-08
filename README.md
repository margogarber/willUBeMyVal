# Will You Be My Valentine? 💖

A cute, mobile-first Valentine proposal mini web app built with Vue 3 + Vite.

The "No" button runs away when you try to click it. The only real option is **Yes**!

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

The output goes to `dist/` — deploy it to any static hosting (Vercel, Netlify, GitHub Pages, etc.).

## Customization

Edit **`src/config.js`** to change:

| Field              | Description                              |
| ------------------ | ---------------------------------------- |
| `questionText`     | The main proposal question               |
| `yesButtonText`    | Text on the "Yes" button                 |
| `noButtonText`     | Text on the "No" button (before escape)  |
| `noTaunts`         | Array of texts shown after each escape   |
| `hintText`         | Hint after 10+ failed "No" attempts      |
| `successTitle`     | Title on the celebration screen          |
| `successSubtitle`  | Subtitle on the celebration screen       |
| `replayButtonText` | Text on the replay button                |
| `catEmojis`        | Emoji cats used as stickers              |
| `catImages`        | Filenames for custom cat images          |
| `catCount`         | Number of cat stickers on success screen |

## Adding Custom Cat Images

1. Create a folder: `public/cats/`
2. Add your images (PNG/WEBP recommended, small size): `cat1.png`, `cat2.png`, etc.
3. Update `src/config.js`:

```js
catImages: ['cat1.png', 'cat2.png', 'cat3.png'],
```

If images fail to load, the app automatically falls back to emoji cats.

## Tech Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite** (fast dev server & build)
- **Pure CSS** animations (no heavy dependencies)
- **Mobile-first** design with iOS safe area support

## Project Structure

```
src/
├── main.js                    # App entry point
├── config.js                  # ✏️ Editable text & settings
├── App.vue                    # Root layout + background
├── styles/
│   └── global.css             # Theme variables & animations
├── components/
│   ├── ProposalCard.vue       # Question card with buttons
│   ├── RunawayButton.vue      # The escaping "No" button
│   └── CatParty.vue           # Celebration screen
└── composables/
    └── useRunawayPosition.js  # Runaway position logic
```

## License

MIT — use it, share it, have fun! 💕
