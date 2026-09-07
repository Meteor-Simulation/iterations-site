/**
 * Principle 7 — the message deepens on the way down.
 *
 * Scenes showed that someone uses the thing. This shows what they get to see
 * once they do: the same solved case opened four ways. A two-up grid rather
 * than four more alternating rows, because these are one exhibit read across,
 * not four separate arguments read down -- and two columns leave each capture
 * wide enough that the mesh edges survive the downscale.
 *
 * Holds `deep` — Scenes handed it over at deep and Engine picks it up there.
 * Nothing after the mesh gets lighter again.
 */
import { motion } from 'motion/react'
import { Shot } from '../components/Shot'
import { useCopy } from '../lib/i18n'
import { inView, inViewEarly, line, prefersReducedMotion, rise, stagger } from '../lib/motion'

/** Reduced motion: everything is already where it belongs. */
const still = { hidden: { opacity: 1 }, show: { opacity: 1 } }

export function Cutaway() {
  const { cutaway } = useCopy()
  const reduced = prefersReducedMotion()
  const headline = reduced ? still : line
  const step = reduced ? still : rise

  return (
    <section id="cutaway" className="bg-deep scroll-mt-24 pb-28 sm:pb-36 lg:pb-44">
      <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <motion.header
          className="max-w-3xl"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >
          <motion.div variants={step} className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-glow/60" />
            <span className="text-xs tracking-[0.3em] text-glow sm:text-sm">{cutaway.kicker}</span>
          </motion.div>

          <h2 className="mt-7 text-section text-foam">
            {cutaway.title.split('\n').map((l) => (
              <motion.span key={l} variants={headline} className="block">
                {l}
              </motion.span>
            ))}
          </h2>

          <motion.p variants={step} className="mt-8 max-w-2xl text-lead leading-relaxed text-mist">
            {cutaway.lead}
          </motion.p>
        </motion.header>

        <motion.div
          className="mt-16 grid grid-cols-1 gap-14 sm:mt-20 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-20"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={inViewEarly}
        >
          {cutaway.items.map((item) => (
            <motion.figure key={item.shot} variants={step} className="flex flex-col">
              <Shot src={item.shot} alt={item.alt} caption={item.title} />
              <figcaption className="mt-7">
                <h3 className="text-xl text-foam sm:text-2xl">{item.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist sm:text-base">{item.body}</p>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>

        <motion.p
          variants={step}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-16 max-w-2xl text-sm leading-relaxed text-mist/70"
        >
          {cutaway.note}
        </motion.p>
      </div>
    </section>
  )
}
