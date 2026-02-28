import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/BNUZ-Feed/',  // GitHub Pages 仓库名（如果仓库名不同请修改）
  server: {
    port: 3000,
    open: true
  }
})
