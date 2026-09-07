/**
 * React's only job here: own the element, own the lifetime, and stay out of
 * the frame loop. No props, no state changes while the ocean is running.
 */
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'
import type { OceanHandle } from './ocean'

/**
 * What the page shows if WebGPU and WebGL2 both fail: the same horizon, the
 * same glitter to the right of frame, drawn with the same three tokens. It
 * also sits behind the canvas at all times, so nothing flashes during init.
 */
const STILL_SEA =
  'radial-gradient(58% 30% at 79% 45%, color-mix(in oklab, var(--color-glow) 14%, transparent) 0%, transparent 72%),' +
  'linear-gradient(180deg,' +
  ' var(--color-abyss) 0%,' +
  ' var(--color-deep) 30%,' +
  ' color-mix(in oklab, var(--color-shelf) 55%, var(--color-deep)) 45.5%,' +
  ' var(--color-sea) 48%,' +
  ' var(--color-deep) 72%,' +
  ' var(--color-abyss) 100%)'

export function OceanCanvas() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let cancelled = false
    let handle: OceanHandle | null = null

    // three/webgpu is a megabyte of the bundle and nothing above the fold
    // needs it: the STILL_SEA gradient is already painted underneath, so the
    // renderer is fetched as its own chunk and swapped in when it is ready.
    import('./ocean')
      .then(({ createOcean }) => createOcean(host, { still: prefersReducedMotion() }))
      .then((ocean) => {
        // The effect can be torn down mid-await; whatever was built must still
        // be released or the GPU device leaks.
        if (cancelled) {
          ocean.dispose()
          return
        }
        handle = ocean
        setReady(true)
      })
      .catch(() => {
        // Both backends refused. The gradient underneath is the fallback, and
        // it is already on screen, so there is nothing left to do.
      })

    return () => {
      cancelled = true
      handle?.dispose()
      setReady(false)
    }
    // Built once for the life of the host element.
  }, [])

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: STILL_SEA }} />
      <div
        ref={hostRef}
        className="absolute inset-0 transition-opacity duration-1000 ease-out-deep"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  )
}
