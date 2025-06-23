import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['zing.com', 'localhost', '127.0.0.1'], // ajoute ici ton nom de domaine
  },
})
