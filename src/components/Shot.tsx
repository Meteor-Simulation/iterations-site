/**
 * A screenshot you can open.
 *
 * The captures are 3200 px wide and the page shows them at a third of that, so
 * the residual chart, the log lines and the mesh edges are all there and all
 * unreadable. Clicking one lifts it out onto a dimmed page at whatever size the
 * viewport allows, and Escape or a click anywhere puts it back.
 *
 * Principle 4 — the motion is a fade and a hair of scale. An overlay that flies
 * in from somewhere would be the loudest thing on a page that has spent seven
 * sections staying quiet.
 */
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { useCopy } from '../lib/i18n'
import { EASE, prefersReducedMotion } from '../lib/motion'

export interface ShotProps {
  /** File name under `public/shots/`. */
  src: string
  alt: string
  /** Caption shown under the enlarged image; the row's own title. */
  caption?: string
  className?: string
}

export function Shot({ src, alt, caption, className }: ShotProps) {
  const { a11y } = useCopy()
  const [open, setOpen] = useState(false)
  const reduced = prefersReducedMotion()
  const url = `${import.meta.env.BASE_URL}shots/${src}`
  const close = useCallback(() => setOpen(false), [])

  // Escape closes it, and the page underneath must not scroll away behind it.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  const t = reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} — ${a11y.enlarge}`}
        className={`group pane block w-full cursor-zoom-in rounded-2xl p-1.5 text-left shadow-2xl shadow-abyss/70 transition-shadow duration-500 hover:shadow-glow/10 sm:p-2 ${className ?? ''}`}
      >
        <span className="relative block">
          <img
            src={url}
            alt={alt}
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full rounded-xl"
          />
          {/* Only appears on hover, and only on pointers that have hover. */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-3 right-3 hidden rounded-full bg-abyss/80 px-3 py-1 text-xs tracking-wide text-mist opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 sm:block"
          >
            {a11y.enlarge}
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center gap-5 bg-abyss/92 px-4 pb-6 pt-16 backdrop-blur-sm sm:px-8 sm:pb-8 sm:pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={t}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            <motion.img
              src={url}
              alt={alt}
              initial={reduced ? undefined : { scale: 0.985, opacity: 0 }}
              animate={reduced ? undefined : { scale: 1, opacity: 1 }}
              exit={reduced ? undefined : { scale: 0.99, opacity: 0 }}
              transition={t}
              className="max-h-[78vh] w-auto max-w-full rounded-lg shadow-2xl shadow-abyss"
              onClick={(e) => e.stopPropagation()}
            />
            {caption && <p className="max-w-3xl text-center text-sm text-mist sm:text-base">{caption}</p>}
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 rounded-full border border-mist/25 bg-abyss/80 px-4 py-1.5 text-xs tracking-wide text-mist backdrop-blur transition-colors hover:border-glow/60 hover:text-foam sm:right-8 sm:top-6"
            >
              {a11y.close}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
