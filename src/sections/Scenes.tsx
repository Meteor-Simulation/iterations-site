/**
 * Principle 6 — the scene of use, before the feature list.
 *
 * Three captures of the real application, alternating left and right so the
 * eye walks down instead of scanning a grid. No card chrome: the only surface
 * is the pane bezel around each screenshot, and the space between rows is what
 * separates them.
 *
 * First of the four sections below the mesh, and so the tightest outer margin
 * of the four: the page's vertical air grows as the argument deepens, and this
 * section already carries its own generous space between the rows.
 */
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { useCopy } from '../lib/i18n'
import { RISE_PX, enterSlow, inView, inViewEarly, line, prefersReducedMotion, rise, stagger } from '../lib/motion'

/** The screenshot is the hero of its row, so it gets the slower arrival and a
 *  fraction of scale — enough to read as settling into place, then still. */
const shotEnter: Variants = {
  hidden: { opacity: 0, y: RISE_PX, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: enterSlow },
}

/** Reduced motion: everything is already where it belongs. */
const still: Variants = { hidden: { opacity: 1 }, show: { opacity: 1 } }

export function Scenes() {
  const { scenes } = useCopy()
  const reduced = prefersReducedMotion()
  const headline = reduced ? still : line
  const step = reduced ? still : rise
  const shot = reduced ? still : shotEnter

  return (
    <section id="scenes" className="band-mid scroll-mt-24 py-24 sm:py-32 lg:py-36">
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
            <span className="text-xs tracking-[0.3em] text-glow sm:text-sm">{scenes.kicker}</span>
          </motion.div>

          <h2 className="mt-7 text-section text-foam">
            {scenes.title.split('\n').map((l) => (
              <motion.span key={l} variants={headline} className="block">
                {l}
              </motion.span>
            ))}
          </h2>

          <motion.p variants={step} className="mt-8 max-w-2xl text-lead leading-relaxed text-mist">
            {scenes.lead}
          </motion.p>
        </motion.header>

        <div className="mt-24 space-y-28 sm:mt-32 lg:mt-40 lg:space-y-44">
          {scenes.items.map((item, i) => {
            const flipped = i % 2 === 1
            return (
              <motion.article
                key={item.n}
                className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-x-12"
                variants={stagger(0.09)}
                initial="hidden"
                whileInView="show"
                viewport={inViewEarly}
              >
                {/* Image first in the DOM so a phone reads shot-then-text on
                    every row; the column starts do the alternating on desktop. */}
                <motion.figure
                  variants={shot}
                  className={flipped ? 'lg:col-span-7 lg:col-start-6' : 'lg:col-span-7 lg:col-start-1'}
                >
                  <div className="pane rounded-2xl p-1.5 shadow-2xl shadow-abyss/70 sm:p-2">
                    <img
                      src={`${import.meta.env.BASE_URL}shots/${item.shot}`}
                      alt={item.alt}
                      width={1680}
                      height={940}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full rounded-xl"
                    />
                  </div>
                </motion.figure>

                <div
                  className={
                    flipped
                      ? 'lg:col-span-4 lg:col-start-1 lg:row-start-1'
                      : 'lg:col-span-4 lg:col-start-9 lg:row-start-1'
                  }
                >
                  <motion.div variants={step} className="flex items-center gap-5">
                    <span className="font-mono text-3xl leading-none text-glow/70 sm:text-4xl">{item.n}</span>
                    <span aria-hidden className="rule-glow h-px flex-1" />
                  </motion.div>

                  <motion.h3 variants={step} className="mt-6 text-2xl text-foam sm:text-3xl">
                    {item.title}
                  </motion.h3>

                  <motion.p variants={step} className="mt-5 text-base leading-relaxed text-mist sm:text-lg">
                    {item.body}
                  </motion.p>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
