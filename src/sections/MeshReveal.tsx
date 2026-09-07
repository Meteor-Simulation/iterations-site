/**
 * The turn of the page.
 *
 * Until here the reader has been watching water and has been allowed to think
 * it was decoration. This section says it was a solve. So the argument is made
 * literally: a wireframe of the same surface draws itself as they scroll, and
 * the legend puts three numbers under the claim. Nothing here loops — the mesh
 * is knitted by the reader's own scrolling and then it holds still.
 *
 * This is the turn of the argument, so it is one of the two headings on the
 * page set in --text-major: bigger than the four sections that support it,
 * smaller than the hero it is answering.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { useCopy } from '../lib/i18n'
import { RISE_PX, prefersReducedMotion } from '../lib/motion'

/* ---------------------------------------------------------------------------
   The camera: eight metres above a 158 m corridor of water, looking down it.
   These numbers decide the whole read — how hard the grid converges and where
   the horizon sits inside the viewBox. F/Z_NEAR and F/Z_FAR were picked so the
   drawn band lands inside y 200..620 of a 150..640 viewBox with the nearest
   troughs still clear of the bottom edge.
   --------------------------------------------------------------------------- */
const F = 1125
const CAM_Y = 8
const HORIZON = 150
const CX = 500
const Z_NEAR = 22
const Z_FAR = 180
const HALF_W = 12

/** A crest is lit above this height, in metres. */
const CREST = 0.45

/* Four Gerstner components, longest first. Steepness falls with the wavelength
   so the short chop rides the swell instead of pinching it into cusps. */
const WAVES = [
  { dx: 0.97, dz: 0.24, len: 17, amp: 0.62, ph: 0.0, q: 0.55 },
  { dx: -0.62, dz: 0.78, len: 9.5, amp: 0.34, ph: 1.7, q: 0.45 },
  { dx: 0.35, dz: -0.94, len: 5.6, amp: 0.17, ph: 3.9, q: 0.35 },
  { dx: -0.9, dz: -0.44, len: 3.1, amp: 0.085, ph: 5.2, q: 0.25 },
].map((w) => {
  const m = Math.hypot(w.dx, w.dz)
  return { ...w, dx: w.dx / m, dz: w.dz / m, k: (2 * Math.PI) / w.len }
})

/** Rows sit evenly in 1/z, which is what makes them evenly spaced on screen. */
function depthAt(t: number): number {
  return 1 / ((1 - t) / Z_NEAR + t / Z_FAR)
}

function surface(x0: number, z0: number) {
  let x = x0
  let z = z0
  let y = 0
  for (const w of WAVES) {
    const f = w.k * (w.dx * x0 + w.dz * z0) + w.ph
    y += w.amp * Math.sin(f)
    const c = w.q * w.amp * Math.cos(f)
    x += c * w.dx
    z += c * w.dz
  }
  return { x, y, z }
}

function project(x: number, y: number, z: number) {
  return { sx: CX + (F * x) / z, sy: HORIZON + (F * (CAM_Y - y)) / z }
}

interface Mesh {
  /** Cross-lines split near / mid / far so the three depths can draw in order. */
  rows: [string[], string[], string[]]
  cols: string[]
  crests: { pts: string; o: number }[]
}

function buildMesh(rowCount: number, colCount: number, samples: number): Mesh {
  const rows: [string[], string[], string[]] = [[], [], []]
  const crests: { pts: string; o: number }[] = []

  for (let i = 0; i < rowCount; i++) {
    const t = i / (rowCount - 1)
    const z = depthAt(t)
    const pts: string[] = []
    let run: string[] = []

    // A stroke cannot brighten along its own length, so the lit part of a crest
    // is lifted out here and redrawn as its own short line on top.
    const flush = () => {
      if (run.length >= 4) crests.push({ pts: run.join(' '), o: 0.58 - 0.34 * t })
      run = []
    }

    for (let j = 0; j < samples; j++) {
      const x0 = -HALF_W + (2 * HALF_W * j) / (samples - 1)
      const p = surface(x0, z)
      const s = project(p.x, p.y, p.z)
      const xy = s.sx.toFixed(1) + ',' + s.sy.toFixed(1)
      pts.push(xy)
      // Past 0.62 a crest is under a pixel tall; it would only add noise.
      if (t < 0.62 && p.y > CREST) run.push(xy)
      else flush()
    }
    flush()

    rows[t < 0.3 ? 0 : t < 0.62 ? 1 : 2].push(pts.join(' '))
  }

  const cols: string[] = []
  for (let j = 0; j < colCount; j++) {
    const x0 = -HALF_W + (2 * HALF_W * j) / (colCount - 1)
    const pts: string[] = []
    for (let i = 0; i < samples; i++) {
      // Sampled far to near, so the dash runs out of the horizon toward the reader.
      const t = 1 - i / (samples - 1)
      const p = surface(x0, depthAt(t))
      const s = project(p.x, p.y, p.z)
      pts.push(s.sx.toFixed(1) + ',' + s.sy.toFixed(1))
    }
    cols.push(pts.join(' '))
  }

  return { rows, cols, crests }
}

const GLOW = 'var(--color-glow)'

export function MeshReveal() {
  const { mesh } = useCopy()
  const ref = useRef<HTMLElement>(null)
  const [reduced] = useState(prefersReducedMotion)
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setNarrow(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // 26 lines on a phone, 40 on a desktop: enough to read as a surface, few
  // enough that every one of them stays a hairline.
  const geo = useMemo(() => (narrow ? buildMesh(12, 14, 48) : buildMesh(18, 22, 72)), [narrow])

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // The grid arrives out of the distance: far rows first, then mid, then the
  // near water, then the lines running into depth, and only then the crests.
  const drawFar = useTransform(p, [0.06, 0.34], [100, 0])
  const drawMid = useTransform(p, [0.16, 0.52], [100, 0])
  const drawNear = useTransform(p, [0.26, 0.68], [100, 0])
  const drawCols = useTransform(p, [0.3, 0.86], [100, 0])
  const drawCrest = useTransform(p, [0.5, 0.95], [100, 0])

  const kickerO = useTransform(p, [0.02, 0.16], [0, 1])
  const kickerY = useTransform(p, [0.02, 0.16], [RISE_PX, 0])
  const titleO = useTransform(p, [0.08, 0.24], [0, 1])
  const titleY = useTransform(p, [0.08, 0.24], [RISE_PX, 0])
  const leadO = useTransform(p, [0.2, 0.36], [0, 1])
  const leadY = useTransform(p, [0.2, 0.36], [RISE_PX, 0])
  const legendO = useTransform(p, [0.5, 0.72], [0, 1])
  const legendY = useTransform(p, [0.5, 0.72], [RISE_PX, 0])

  const still = { opacity: 1, y: 0 }
  const kickerStyle = reduced ? still : { opacity: kickerO, y: kickerY }
  const titleStyle = reduced ? still : { opacity: titleO, y: titleY }
  const leadStyle = reduced ? still : { opacity: leadO, y: leadY }
  const legendStyle = reduced ? still : { opacity: legendO, y: legendY }

  // Reduced motion gets the finished mesh on arrival, never a scrubbed redraw.
  const drawn = (v: MotionValue<number>) => ({
    stroke: 'url(#mesh-fade)',
    strokeDashoffset: reduced ? 0 : v,
  })

  return (
    <section id="mesh" ref={ref} className="relative h-[185vh]">
      {/* One ramp across the whole section. It opens on --color-abyss, where the
          hero's scrim ended, and finishes on --color-sea, where Scenes' band
          begins — so the brightest water on the page is the moment the mesh
          finishes drawing, and nothing after it ever gets lighter again. */}
      <div aria-hidden className="band-surface pointer-events-none absolute inset-0" />

      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-9 px-6 pb-10 md:px-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-16">
          {/* On a phone the grid sits above the words; from lg it sits beside them. */}
          <div className="lg:order-2 lg:col-span-7">
            <div className="aspect-[1000/490] w-full">
              <svg
                viewBox="0 150 1000 490"
                className="h-full w-full"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <defs>
                  {/* One colour, three alphas: the mesh dissolves into the horizon
                      instead of knotting up there. */}
                  <linearGradient id="mesh-fade" x1="0" y1="200" x2="0" y2="620" gradientUnits="userSpaceOnUse">
                    <stop offset="0" style={{ stopColor: GLOW, stopOpacity: 0.05 }} />
                    <stop offset="0.45" style={{ stopColor: GLOW, stopOpacity: 0.17 }} />
                    <stop offset="1" style={{ stopColor: GLOW, stopOpacity: 0.34 }} />
                  </linearGradient>
                </defs>

                {/* pathLength normalises every line to 100 units, so a single
                    inherited dashoffset on the group draws all of its children. */}
                <motion.g strokeDasharray="100 100" strokeWidth={1.1} style={drawn(drawFar)}>
                  {geo.rows[2].map((pts) => (
                    <polyline key={pts} points={pts} pathLength={100} vectorEffect="non-scaling-stroke" />
                  ))}
                </motion.g>
                <motion.g strokeDasharray="100 100" strokeWidth={1.1} style={drawn(drawMid)}>
                  {geo.rows[1].map((pts) => (
                    <polyline key={pts} points={pts} pathLength={100} vectorEffect="non-scaling-stroke" />
                  ))}
                </motion.g>
                <motion.g strokeDasharray="100 100" strokeWidth={1.1} style={drawn(drawNear)}>
                  {geo.rows[0].map((pts) => (
                    <polyline key={pts} points={pts} pathLength={100} vectorEffect="non-scaling-stroke" />
                  ))}
                </motion.g>
                <motion.g strokeDasharray="100 100" strokeWidth={1.1} style={drawn(drawCols)}>
                  {geo.cols.map((pts) => (
                    <polyline key={pts} points={pts} pathLength={100} vectorEffect="non-scaling-stroke" />
                  ))}
                </motion.g>
                <motion.g
                  strokeDasharray="100 100"
                  strokeWidth={1.5}
                  style={{ stroke: GLOW, strokeDashoffset: reduced ? 0 : drawCrest }}
                >
                  {geo.crests.map((c) => (
                    <polyline
                      key={c.pts}
                      points={c.pts}
                      pathLength={100}
                      strokeOpacity={c.o}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </motion.g>
              </svg>
            </div>
          </div>

          <div className="lg:order-1 lg:col-span-5">
            {/* Kicker and title are one sentence broken across two sizes, and the
                break is exactly where the claim turns. */}
            <motion.p style={kickerStyle} className="text-lead text-mist">
              {mesh.kicker}
            </motion.p>
            <motion.h2 style={titleStyle} className="mt-2 text-major text-foam">
              {mesh.title}
            </motion.h2>
            <motion.p
              style={leadStyle}
              className="mt-6 max-w-[46ch] text-sm leading-relaxed text-mist md:text-base md:leading-relaxed"
            >
              {mesh.lead.split('\n').map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </motion.p>

            <motion.dl style={legendStyle} className="mt-8 max-w-[46ch] font-mono text-[0.7rem] md:text-xs">
              {mesh.legend.map((row) => (
                <div
                  key={row.k}
                  className="flex flex-col gap-1 border-t border-tide/30 py-3 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <dt className="shrink-0 text-glow sm:w-20">{row.k}</dt>
                  <dd className="m-0 text-mist">{row.v}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </div>
    </section>
  )
}
