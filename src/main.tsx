import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize Yandex Metrika
const ymId = Number(import.meta.env.VITE_YM_ID)
if (ymId && typeof window !== 'undefined' && typeof window.ym === 'function') {
  window.ym(ymId, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  } as unknown as string)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
