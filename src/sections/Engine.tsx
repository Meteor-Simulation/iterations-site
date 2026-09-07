/**
 * The technical middle of the descent. One kind of evidence and nothing else:
 * the probe transcript. There used to be a row of three statistics above it,
 * and it was the second of four three-across grids in a row — but two of its
 * three numbers were restated within a screen of themselves (the bitwise zero
 * by the transcript six lines below it, CUDA 13 by the finale's requirements),
 * so the row was mostly the section repeating itself in a larger type size.
 * The argument has to tighten here, not get louder.
 *
 * What is left is deliberately narrow inside a wide container: the transcript
 * is a 2xl panel hanging in a 6xl column, and the air to its right is the
 * section saying it has only one thing to show.
 */
import { useState } from 'react'
import { motion } from 'motion/react'
import { useCopy } from '../lib/i18n'
import { inView, inViewEarly, line, prefersReducedMotion, rise, stagger } from '../lib/motion'

export function Engine() {
  const { engine } = useCopy()
  /* Read once at mount: the transcript is the only sequenced thing on the page,
     and a media-query flip mid-scroll must not restart it half-typed. */
  const [reduced] = useState(prefersReducedMotion)

  /* The panel is titled by the command it ran, so the title bar can never drift
     out of sync with the transcript printed under it. */
  const command = engine.code[0].replace(/^>\s*/, '')
  const lastLine = engine.code.length - 1

  return (
    <section id="engine" className="bg-deep scroll-mt-24">
      {/* Third of four in the ranking: the page opens up as it goes deeper, and
          this is the tightest of the four sections below the mesh. */}
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-40 lg:px-12">
        <motion.header initial="hidden" whileInView="show" viewport={inView} variants={stagger()}>
          <motion.p variants={rise} className="font-mono text-xs tracking-[0.32em] text-glow uppercase">
            {engine.kicker}
          </motion.p>

          <motion.h2 variants={stagger(0.1)} className="mt-6 text-section">
            {engine.title.split('\n').map((l) => (
              <motion.span key={l} variants={line} className="block">
                {l}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p variants={rise} className="mt-8 max-w-2xl text-lead text-mist">
            {engine.lead.split('\n').map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </motion.p>
        </motion.header>

        {/* Line by line, once, then still. No cursor blinks here — nothing on
            this page is allowed to move while the reader is reading. */}
        <motion.div
          initial={reduced ? false : 'hidden'}
          whileInView={reduced ? undefined : 'show'}
          viewport={inViewEarly}
          variants={reduced ? undefined : stagger(0.1, 0.15)}
          className="pane mt-16 max-w-2xl rounded-lg md:mt-24"
        >
          <div className="flex items-center gap-2.5 border-b border-tide/30 px-4 py-2.5 sm:px-5">
            <span className="h-1.5 w-1.5 rounded-full bg-glow/70" />
            <span className="font-mono text-xs text-mist">{command}</span>
          </div>

          {/* Long lines scroll inside the panel; the page never scrolls sideways. */}
          <div className="overflow-x-auto px-4 py-5 sm:px-5">
            {engine.code.map((l, i) => (
              <motion.p
                key={i}
                variants={reduced ? undefined : line}
                className={`font-mono text-[13px] leading-7 whitespace-pre ${
                  i === lastLine ? 'text-glow' : i === 0 ? 'text-foam' : 'text-mist'
                }`}
              >
                {l || ' '}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
