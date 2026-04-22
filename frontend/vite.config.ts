import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Replace this with your actual Aspire backend URL
// Example: "https://server-fingridapi.dev.localhost:7354"
//const backend = process.env.SERVER_HTTPS || process.env.SERVER_HTTP || "https://server-fingridapi.dev.localhost:7354";
const backend = "https://server-fingridapi.dev.localhost:7354";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: backend,
                changeOrigin: true,
                secure: false
            }
        }
    }
})
