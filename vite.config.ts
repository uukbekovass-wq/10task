import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Название /10task/ должно строго совпадать с названием репозитория
export default defineConfig({
  plugins: [react()],
  base: '/10task/',
})