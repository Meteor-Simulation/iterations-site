/**
 * The floor of the descent (principle 7): after the scene, the engine and the
 * physics, the last thing left to say is why any of it should be believed.
 *
 * So this is the stillest section on the page. No rise, no stagger, no parallax
 * — the three numbers count up once when they are first read and then never
 * move again. Everything else is type and space.
 *
 * And it is a ledger, not a row. Three numbers side by side in equal thirds is
 * the same shape the physics section directly above it uses, and two identical
 * triptychs back to back read as one template applied twice. Stacked, each
 * number gets a full line of the page to itself, the reading order does the
 * ranking that three equal columns refused to do, and the section ends up as
 * the most spacious on the page — which is what the floor of a descent should
 * feel like.
 */
import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import type { Copy } from '../lib/copy'
import { useCopy } from '../lib/i18n'
import { EASE, fade, inView, prefersReducedMotion } from '../lib/motion'

type Item = Copy['proof']['items'][number]

/**
 * A figure that arrives at its value instead of being stamped there. The count
 * is the section's only movement, so it is spent on the one thing the reader is
 * meant to weigh — and it is skipped entirely when motion is unwelcome.
 */
function Figure({ item, still }: { item: Item; still: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, inView)
  const count = useMotionValue(0)
  const shown = useTransform(count, (v) => String(Math.round(v)))
  const target = Number(item.v)
  const countable = !still && Number.isFinite(target)

  useEffect(() => {
    if (!countable || !seen) return
    // enterSlow's numbers, spelled out: a value animation takes a
    // ValueAnimationTransition, and the shared object is typed as a Transition.
    const controls = animate(count, target, { duration: 1.1, ease: EASE })
    return () => controls.stop()
  }, [count, countable, seen, target])

  return (
    <div
      ref={ref}
      className="grid gap-x-12 gap-y-4 border-t border-tide/20 py-10 md:grid-cols-12 md:items-baseline md:py-16"
    >
      <div className="font-mono text-6xl leading-none tracking-tight text-foam tabular-nums md:col-span-4 md:text-7xl">
        {countable ? <motion.span>{shown}</motion.span> : item.v}
      </div>
      <div className="md:col-span-8">
        <div className="text-base font-medium text-glow">{item.k}</div>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-mist">{item.d}</p>
      </div>
    </div>
  )
}

export function Proof() {
  const { proof } = useCopy()
  // Read once: the section renders the plain value rather than swapping mid-scroll.
  const [still] = useState(prefersReducedMotion)

  return (
    <section id="proof" className="bg-abyss scroll-mt-24">
      {/* The deepest section gets the most air. The four sections below the
          mesh run 24 / 24 / 28 / 36 at the base and 32 / 40 / 48 / 56 from md,
          so the page opens out as the argument goes down rather than repeating
          one padding value five times. */}
      <div className="mx-auto w-full max-w-6xl px-6 py-36 sm:px-8 md:py-56 lg:px-12 lg:py-64">
        <motion.header initial="hidden" whileInView="show" viewport={inView} variants={fade}>
          <p className="font-mono text-xs tracking-[0.35em] text-glow/70">{proof.kicker}</p>
          <h2 className="mt-7 text-section text-foam">
            {proof.title.split('\n').map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
          <p className="mt-8 max-w-2xl text-lead leading-relaxed text-mist">
            {proof.lead.split('\n').map((l, i) => (
              <span key={l}>
                {i > 0 && <br className="hidden md:inline" />}
                {l}
              </span>
            ))}
          </p>
        </motion.header>

        {/* Hairlines instead of cards: boxes would make three claims look like
            three products, and columns would make them look interchangeable. */}
        <motion.div initial="hidden" whileInView="show" viewport={inView} variants={fade} className="mt-20 md:mt-28">
          {proof.items.map((item) => (
            <Figure key={item.k} item={item} still={still} />
          ))}
        </motion.div>

        {/* The strongest sentence on the page, so it gets a rule and nothing
            else — and the rule closes the ledger it sits under. */}
        <motion.div initial="hidden" whileInView="show" viewport={inView} variants={fade}>
          <div className="rule-glow h-px w-full" />
          <p className="mt-10 max-w-3xl text-sm leading-loose text-mist md:text-base">{proof.note}</p>
        </motion.div>
      </div>
    </section>
  )
}
