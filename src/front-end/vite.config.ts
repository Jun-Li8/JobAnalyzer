import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/test': 'http://localhost:3000',
      '/api/get-data': 'http://localhost:3000',
      '/api/get-data-from-db': 'http://localhost:3000',
      '^/api' : 'http://localhost:3000',
    },
    port:3001,
  },
})
