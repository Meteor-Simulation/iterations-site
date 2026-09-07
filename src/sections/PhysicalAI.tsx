/**
 * Three physics, one solver. The layout has to say that before the copy does:
 * the columns hang from a single rule, share one baseline, and carry no boxes
 * of their own — three products would have three frames.
 *
 * They also carry no coloured bullets any more. There was one ember dot and
 * two tide dots here, and ember appeared nowhere else on the page: a warm
 * accent used exactly once, on decoration, is not a signal, it is drift. The
 * token went with the dots.
 */
import { motion } from 'motion/react'
import { useCopy } from '../lib/i18n'
import { inView, line, rise, stagger } from '../lib/motion'

export function PhysicalAI() {
  const { physical } = useCopy()
  return (
    <section id="physical" className="band-deep scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-6 py-28 sm:px-8 md:py-48 lg:px-12">
        <motion.header initial="hidden" whileInView="show" viewport={inView} variants={stagger()}>
          <motion.p variants={rise} className="font-mono text-xs tracking-[0.32em] text-glow uppercase">
            {physical.kicker}
          </motion.p>

          <motion.h2 variants={stagger(0.1)} className="mt-6 text-section">
            {physical.title.split('\n').map((l) => (
              <motion.span key={l} variants={line} className="block">
                {l}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p variants={rise} className="mt-8 max-w-3xl text-lead text-mist">
            {physical.lead.split('\n').map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </motion.p>
        </motion.header>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={stagger(0.12)}
          className="mt-16 md:mt-24"
        >
          {/* One rule for all three — the shared waterline they hang from. */}
          <div className="rule-glow h-px w-full" />

          <div className="grid gap-y-14 md:grid-cols-3 md:gap-x-10">
            {physical.cards.map((c) => (
              <motion.article key={c.title} variants={rise} className="pt-10 md:pt-12">
                <h3 className="text-xl sm:text-2xl">{c.title}</h3>

                <p className="mt-5 text-sm leading-relaxed text-mist sm:text-base">{c.body}</p>

                {/* The binaries are the claim's receipts, so they stay literal:
                    mono, quiet, wrapping rather than truncating. */}
                <ul className="mt-7 flex flex-wrap gap-2">
                  {c.bins.map((b) => (
                    <li
                      key={b}
                      className="rounded-full border border-tide/40 px-2.5 py-1 font-mono text-[11px] text-mist"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
