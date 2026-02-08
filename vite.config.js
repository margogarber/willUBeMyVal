import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // './' works for GitHub Pages regardless of repo name
  base: './',
  server: {
    host: true,
    port: 5173,
  },
})
