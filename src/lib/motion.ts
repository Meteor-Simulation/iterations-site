/**
 * The page's whole motion vocabulary. Four things, reused everywhere.
 *
 * Principle 4 — movement must not outshout the content. So: one easing, one
 * distance (24px), one duration band (0.6-0.9s), and nothing loops in the
 * reader's periphery while they are reading. Everything enters once and stays.
 */
import type { Transition, Variants } from 'motion/react'

/** Long tail, no overshoot: it arrives and settles rather than bouncing. */
export const EASE = [0.16, 1, 0.3, 1] as const

export const RISE_PX = 24

export const enter: Transition = { duration: 0.75, ease: EASE }
export const enterSlow: Transition = { duration: 1.1, ease: EASE }

/** Enter once, when a third of the block has crossed into view. */
export const inView = { once: true, amount: 0.3 } as const
export const inViewEarly = { once: true, amount: 0.15 } as const

export const rise: Variants = {
  hidden: { opacity: 0, y: RISE_PX },
  show: { opacity: 1, y: 0, transition: enter },
}

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: enterSlow },
}

/** Children rise in order; the gap is short enough to read as one gesture. */
export function stagger(gap = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: gap, delayChildren: delay } },
  }
}

/** A headline that arrives line by line, which is how it is read. */
export const line: Variants = {
  hidden: { opacity: 0, y: '0.5em', filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
