import { defineConfig } from 'vite'

export default defineConfig({
  base: '/shudao-main/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    host: true
  }
})