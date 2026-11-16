import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './lib/i18n'
import { registerSW } from 'virtual:pwa-register'
import { toast } from 'sonner'

// 🌟 مدیریت آپدیت PWA
const updateSW = registerSW({
  onNeedRefresh() {
    toast('نسخه جدید برنامه آماده است!', {
      action: {
        label: 'آپدیت',
        onClick: () => updateSW(true),
      },
      duration: Infinity,
    })
  },
  onOfflineReady() {
    toast.success('برنامه برای استفاده آفلاین آماده است! ✅')
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)