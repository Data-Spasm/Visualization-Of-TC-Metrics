import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Allows external connections
    port: process.env.PORT || 5173,  // Use Render's assigned port
    strictPort: true,
    allowedHosts: ['visualization-of-tc-metrics.onrender.com']  // Add your custom domain here
  }
});