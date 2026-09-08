import { MotionConfig } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GuideApp from './GuideApp.tsx'
import { Footer } from './components/Footer'
import { LocaleProvider } from './lib/i18n'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <LocaleProvider>
        <GuideApp />
        <Footer />
      </LocaleProvider>
    </MotionConfig>
  </StrictMode>,
)
