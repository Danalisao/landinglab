import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.googleapis.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https:;
        connect-src 'self' http://localhost:5001 https://api.openai.com https://api.stripe.com https://m.stripe.network https://*.googleapis.com https://identitytoolkit.googleapis.com https://*.firebaseapp.com https://*.firebase.com;
        frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.firebaseapp.com;
      `.replace(/\s+/g, ' ').trim()
    }
  }
})
