import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { FloatingWidget } from './components/FloatingWidget'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <h1 style={{ color: 'white', textAlign: 'center', paddingTop: '2rem' }}>
        Floating Widget Demo
      </h1>
      <p style={{ color: 'white', textAlign: 'center' }}>
        The widget appears at the bottom center of the page
      </p>
      <FloatingWidget position="bottom-center" />
    </div>
  </StrictMode>,
)
