import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,  // This ensures process.env variables are available
  },
  base:"/project-bazaar-src/"
})
