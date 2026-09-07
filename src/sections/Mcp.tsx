/**
 * Principle 8 — the last screen keeps the first screen's mood.
 *
 * The page has spent seven sections saying "we drive it for you". This is the
 * turn at the end: you can also take the wheel. Same abyss, same terminal
 * panel the Engine section uses, same quiet — the difference is that this one
 * ends in a link out rather than a download.
 *
 * Holds `abyss`, which Proof handed over, and hands it to the footer.
 */
import { motion } from 'motion/react'
import { useCopy } from '../lib/i18n'
import { inView, inViewEarly, line, prefersReducedMotion, rise, stagger } from '../lib/motion'

/** Reduced motion: everything is already where it belongs. */
const still = { hidden: { opacity: 1 }, show: { opacity: 1 } }

export function Mcp() {
  const { mcp } = useCopy()
  const reduced = prefersReducedMotion()
  const headline = reduced ? still : line
  const step = reduced ? still : rise

  return (
    <section id="mcp" className="bg-abyss scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-6 py-28 sm:px-8 md:py-44 lg:px-12">
        <motion.header initial="hidden" whileInView="show" viewport={inView} variants={stagger()}>
          <motion.p variants={step} className="font-mono text-xs tracking-[0.32em] text-glow uppercase">
            {mcp.kicker}
          </motion.p>

          <motion.h2 variants={stagger(0.1)} className="mt-6 text-section text-foam">
            {mcp.title.split('\n').map((l) => (
              <motion.span key={l} variants={headline} className="block">
                {l}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p variants={step} className="mt-8 max-w-2xl text-lead leading-relaxed text-mist">
            {mcp.lead}
          </motion.p>
        </motion.header>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-20 lg:grid-cols-12 lg:gap-x-14">
          {/* The command and what it hands over, in the same panel the Engine
              section uses — this is the same machine, reached another way. */}
          <motion.div
            initial={reduced ? false : 'hidden'}
            whileInView={reduced ? undefined : 'show'}
            viewport={inViewEarly}
            variants={reduced ? undefined : stagger(0.07, 0.1)}
            className="pane rounded-lg lg:col-span-7"
          >
            <div className="flex items-center gap-2.5 border-b border-tide/30 px-4 py-2.5 sm:px-5">
              <span className="h-1.5 w-1.5 rounded-full bg-glow/70" />
              <span className="font-mono text-xs text-mist">{mcp.tools}</span>
            </div>

            {/* Long lines scroll inside the panel; the page never scrolls sideways. */}
            <div className="overflow-x-auto px-4 py-5 sm:px-5">
              {mcp.code.map((l, i) => (
                <motion.p
                  key={i}
                  variants={reduced ? undefined : line}
                  className={`font-mono text-[13px] leading-7 whitespace-pre ${
                    i === 0 ? 'text-foam' : 'text-mist'
                  }`}
                >
                  {l || ' '}
                </motion.p>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial="hidden"
            whileInView="show"
            viewport={inViewEarly}
            variants={stagger(0.09)}
          >
            <dl className="space-y-7">
              {mcp.steps.map((s) => (
                <motion.div key={s.k} variants={step}>
                  <dt className="font-mono text-xs tracking-[0.2em] text-glow uppercase">{s.k}</dt>
                  <dd className="mt-2.5 text-sm leading-relaxed text-mist sm:text-base">{s.v}</dd>
                </motion.div>
              ))}
            </dl>

            <motion.div variants={step} className="mt-12">
              <a
                href={mcp.ctaHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-glow/45 px-6 py-3 text-sm text-foam transition-colors duration-300 hover:border-glow hover:bg-glow/10 sm:text-base"
              >
                {mcp.cta}
                <span aria-hidden className="text-glow">
                  →
                </span>
              </a>
              <p className="mt-5 max-w-sm text-xs leading-relaxed text-mist/70 sm:text-sm">{mcp.note}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
