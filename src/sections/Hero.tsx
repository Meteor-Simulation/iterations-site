/**
 * The first screen.
 *
 * One sentence, one button, one quiet way down, over water that is actually
 * being solved. Everything that could have gone here and did not — a logo
 * wall, a feature strip, a product shot, a second button, the name of the
 * graphics backend that won — is somewhere further down the page or nowhere,
 * because the only job of this screen is to be worth three more seconds.
 *
 * The two title lines are the only thing that animates in, and nothing here
 * moves once it has arrived. The sea is this page's one continuous motion; a
 * hairline pulsing in the corner would only be competing with it.
 */
import { motion } from 'motion/react'
import { GatedDownload } from '../components/DownloadButton'
import { LocaleToggle } from '../components/LocaleToggle'
import { useCopy } from '../lib/i18n'
import { line, prefersReducedMotion, stagger } from '../lib/motion'
import { OceanCanvas } from '../ocean/OceanCanvas'
import { useState } from 'react'

/**
 * Legibility over moving water, in two passes: a soft wash from the left that
 * follows the text column, and a vertical fall that lands on --color-abyss so
 * the section below can open on the same value with no seam.
 */
const SCRIM =
  'linear-gradient(102deg,' +
  ' color-mix(in oklab, var(--color-abyss) 74%, transparent) 0%,' +
  ' color-mix(in oklab, var(--color-abyss) 40%, transparent) 44%,' +
  ' transparent 78%),' +
  'linear-gradient(180deg,' +
  ' color-mix(in oklab, var(--color-abyss) 72%, transparent) 0%,' +
  ' color-mix(in oklab, var(--color-abyss) 22%, transparent) 16%,' +
  ' transparent 36%,' +
  ' color-mix(in oklab, var(--color-deep) 40%, transparent) 64%,' +
  ' color-mix(in oklab, var(--color-abyss) 86%, transparent) 90%,' +
  ' var(--color-abyss) 100%)'

export function Hero() {
  const { hero } = useCopy()
  const [still] = useState(prefersReducedMotion)

  return (
    <section id="hero" className="relative isolate min-h-[100svh] w-full overflow-hidden">
      <OceanCanvas />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: SCRIM }} />

      {/* The nav is inert over this screen, so the switch has to live here too. */}
      <LocaleToggle className="absolute right-6 top-6 z-20 bg-abyss/40 backdrop-blur-sm sm:right-10 sm:top-8 lg:right-16" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1400px] flex-col justify-center px-6 pb-36 pt-28 sm:px-10 sm:pb-40 sm:pt-32 lg:px-16">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.42em] text-glow/85">{hero.eyebrow}</p>

        <motion.h1
          className="mt-7 text-hero font-semibold text-foam"
          variants={stagger(0.15)}
          initial={still ? 'show' : 'hidden'}
          animate="show"
        >
          {hero.title.map((text) => (
            <motion.span key={text} variants={line} className="block">
              {text}
            </motion.span>
          ))}
        </motion.h1>

        <p className="mt-9 max-w-[52ch] text-lead leading-[1.75] text-mist">
          {hero.lead.split('\n').map((text) => (
            <span key={text} className="block">
              {text}
            </span>
          ))}
        </p>

        <div className="mt-12 flex flex-col gap-2.5">
          <GatedDownload className="inline-flex w-fit cursor-pointer items-center gap-3 rounded-full bg-glow px-8 py-4 text-[0.95rem] font-semibold text-abyss transition-transform duration-500 ease-out-deep hover:-translate-y-0.5">
            {hero.cta}
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M7.5 1v11M2.8 7.6l4.7 4.7 4.7-4.7M1.5 14h12" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </GatedDownload>
          <span className="pl-1 font-mono text-[0.7rem] tracking-[0.08em] text-mist/70">{hero.ctaSub}</span>
        </div>
      </div>

      {/* The one way down, and it holds still. */}
      <div className="pointer-events-none absolute bottom-8 left-6 z-10 flex items-center gap-3 sm:left-10 lg:left-16">
        <span aria-hidden="true" className="rule-glow block h-px w-12" />
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.34em] text-mist/70">{hero.scroll}</span>
      </div>
    </section>
  )
}
