/**
 * The bar that is not there yet.
 *
 * Principle 2: nothing lands in the hero that did not earn its place, and a
 * navigation bar has not earned it — the reader has not seen a single section
 * to navigate to. So the nav stays fully out of the way (invisible and inert,
 * so it cannot be clicked or tabbed into over the headline) until the hero has
 * been left behind, then fades down into place and stays.
 */
import { useEffect, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { GatedDownload } from './DownloadButton'
import { LocaleToggle } from './LocaleToggle'
import { useCopy } from '../lib/i18n'
import { RISE_PX, enter, prefersReducedMotion } from '../lib/motion'

/** The favicon, inline: the same two curves, so the tab and the page agree. */
function WaveMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path d="M4 20c4-6 8-6 12 0s8 6 12 0" fill="none" stroke="var(--color-glow)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M4 13c4-6 8-6 12 0s8 6 12 0" fill="none" stroke="var(--color-tide)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function Nav() {
  const { hero, nav } = useCopy()
  const { scrollY } = useScroll()
  const [past, setPast] = useState(false)
  const [active, setActive] = useState('')
  const [still] = useState(prefersReducedMotion)

  // A little past the first screen: the hero is gone before the bar exists.
  useEffect(() => {
    const check = () => setPast(window.scrollY > window.innerHeight * 0.8)
    check() // a restored scroll position must not start the page bare
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useMotionValueEvent(scrollY, 'change', (y) => setPast(y > window.innerHeight * 0.8))

  // Whichever section is crossing the middle of the screen owns the highlight.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const item of nav.items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
    // The ids are the same in both languages; only the labels change.
  }, [nav.items])

  return (
    <motion.header
      inert={!past}
      initial={false}
      animate={past ? 'show' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: still ? 0 : -RISE_PX },
        show: { opacity: 1, y: 0 },
      }}
      transition={enter}
      className="fixed inset-x-0 top-0 z-50 border-b border-tide/20 bg-abyss/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-3.5 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-2.5 text-foam" aria-label="Iterations">
          <WaveMark />
          <span className="text-[0.95rem] font-semibold tracking-tight">Iterations</span>
        </a>

        <nav className="ml-auto hidden items-center gap-8 md:flex">
          {nav.items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              className={`relative text-sm transition-colors duration-300 hover:text-foam ${
                active === item.id ? 'text-foam' : 'text-mist'
              }`}
            >
              {item.label}
              {active === item.id && <span className="rule-glow absolute inset-x-0 -bottom-2 h-px" />}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {/* A page, not a section: it leaves the scroll rather than moving
              inside it, so it sits with the controls and not with the marks. */}
          <a
            href="./guide.html"
            className="hidden rounded-full border border-tide/35 px-4 py-1.5 text-xs text-mist transition-colors duration-300 hover:border-glow/50 hover:text-foam sm:block"
          >
            {nav.guide}
          </a>
          <LocaleToggle />
          <GatedDownload className="cursor-pointer rounded-full border border-glow/40 bg-glow/10 px-4 py-1.5 text-xs font-medium text-glow transition-colors duration-300 hover:bg-glow/20">
            {hero.cta}
          </GatedDownload>
        </div>
      </div>
    </motion.header>
  )
}
