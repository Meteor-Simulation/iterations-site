import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative so the same build serves from a project page, a custom domain or
  // a file:// preview without a rebuild.
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
    // Two documents, not two routes. The guidebook is a reference someone
    // arrives at directly, and it should not have to load the front page's
    // ocean to show them a table.
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        guide: fileURLToPath(new URL('./guide.html', import.meta.url)),
      },
    },
  },
})
