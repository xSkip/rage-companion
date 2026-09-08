import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/rage-companion/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
