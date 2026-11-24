import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// تنظیمات پروکسی برای اتصال به Supabase در زمان اجرای لوکال
const supabaseProxy = {
  '/api/supabase': {
    target: 'https://ipagkuramdxouavavexr.supabase.co',
    changeOrigin: true,
    secure: true,
    ws: true,
    rewrite: (path: string) => path.replace(/^\/api\/supabase/, ''),
  },
}

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister:null,
      manifest: {
        name: 'Sherpider-Study',
        short_name: 'Sherpider',
        description: 'برنامه مدیریت تحصیلی شرپایدر استادی',
        theme_color: '#E53935',
        background_color: '#ffffff',
        display: 'standalone',
        lang: 'fa',
        dir: 'rtl',
        id: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // این خط بسیار مهم است! به PWA می‌گوید درخواست‌های API را کش یا بلاک نکن
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // یک هفته
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // یک سال
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'charts'
            if (id.includes('framer-motion')) return 'animations'
            if (id.includes('@supabase')) return 'supabase'
            return 'vendor'
          }
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    proxy: supabaseProxy
  },
  preview: {
    port: 4173,
    open: true,
    proxy: supabaseProxy
  }
})
