/**
 * The sea state, written down once.
 *
 * A compute-shader FFT (Tessendorf 2001, Horvath 2015) would be WebGPU-only,
 * and this page has to hold up on a WebGL2 fallback — so the surface is a
 * truncated sum of Gerstner waves instead. Two properties are worth the
 * truncation: it is analytically differentiable, which buys correct normals
 * and a folding (Jacobian) foam term without a normal map, and it is cheap
 * enough that the whole sum runs per vertex, every frame, on a laptop.
 *
 * Four disjoint bands, because one band never reads as mass: a long swell that
 * carries the horizon, a wind sea that gives it texture, chop that breaks the
 * wind sea into individual waves, and ripple within sight of the camera.
 *
 * A truncated sum has one failure mode, and it is the one that makes rendered
 * water look rendered: too few components, so the surface reads as a handful of
 * smooth hills. The bands below are deliberately broad and overlapping, and the
 * short ones are carried much further out than the grid can resolve them —
 * DETAIL picks them up from there as slope alone, which is what keeps texture
 * all the way to the horizon instead of stopping at a visible radius.
 */

const G = 9.81

export interface GerstnerWave {
  /** Unit direction of travel in the xz plane. */
  dx: number
  dz: number
  /** Wavenumber, 2pi / wavelength. */
  k: number
  /** Deep-water dispersion, sqrt(g k). */
  omega: number
  /** Vertical amplitude, metres. */
  amp: number
  /**
   * Steepness. The horizontal amplitude is q/k, so the sum of q over every
   * wave must stay under 1 or the surface folds through itself everywhere
   * instead of only on the crests, which is the whole point of the foam term.
   */
  q: number
  /** Fixed phase offset, so every reload renders the same sea. */
  phase: number
}

export interface Cascade {
  waves: GerstnerWave[]
  /**
   * Distance in metres where this band starts and finishes fading out, or
   * null for a band that reaches the horizon. Short waves alias badly once
   * the grid is coarser than half their wavelength, so each band dies before
   * its cells do.
   */
  fade: readonly [number, number] | null
}

/** Dominant wind heading. The swell rolls toward the camera, slightly across. */
const WIND_DEG = 96

/** [wavelength m, amplitude m, steepness, spread from the wind direction deg] */
type Spec = readonly [number, number, number, number]

/*
 * A heavy sea, not a calm one. Amplitudes below are roughly three times what a
 * gentle swell carries: at a four-metre eye height, a half-metre wave is a
 * texture and a two-metre wave is a wave - the crests have to break the horizon
 * line for the surface to read as something with weight behind it.
 */
const SWELL: Spec[] = [
  [1024, 5.6, 0.082, 0],
  [760, 4.1, 0.076, 13],
  [585, 2.9, 0.068, -17],
  [430, 2.05, 0.058, 26],
]

const WIND_SEA: Spec[] = [
  [188, 2.35, 0.084, -7],
  [144, 1.86, 0.082, 9],
  [108, 1.4, 0.078, -21],
  [82, 1.02, 0.07, 30],
  [61, 0.72, 0.062, -34],
  [45, 0.5, 0.055, 41],
]

const CHOP: Spec[] = [
  [33, 0.38, 0.088, 12],
  [24, 0.3, 0.086, 18],
  [17.5, 0.22, 0.082, -27],
  [12.4, 0.155, 0.076, 45],
  [8.6, 0.105, 0.066, -52],
  [5.9, 0.07, 0.056, 64],
]

/**
 * Ripple. Barely displaces anything — its job is to break the near water into
 * individual facets, which is what a real sea does and a smooth surface cannot.
 */
const RIPPLE: Spec[] = [
  [4.1, 0.048, 0.064, -71],
  [2.9, 0.034, 0.058, 83],
  [2.0, 0.023, 0.05, -96],
  [1.35, 0.015, 0.042, 108],
  [0.9, 0.009, 0.034, -124],
]

function build(specs: Spec[], seed: number): GerstnerWave[] {
  return specs.map(([lengthM, amp, q, spreadDeg], i) => {
    const a = ((WIND_DEG + spreadDeg) * Math.PI) / 180
    const k = (2 * Math.PI) / lengthM
    // Deterministic irrational phases: the bands must not share a beat, or the
    // whole sea flattens at the same instant every period.
    const phase = ((seed + i) * 2.399963) % (Math.PI * 2)
    return { dx: Math.cos(a), dz: Math.sin(a), k, omega: Math.sqrt(G * k), amp, q, phase }
  })
}

export const CASCADES: Cascade[] = [
  { waves: build(SWELL, 0), fade: null },
  // The wind sea now reaches the horizon haze rather than stopping short of it.
  { waves: build(WIND_SEA, 7), fade: [2600, 5600] },
  // Chop is carried far past where the grid resolves it geometrically; it dies
  // gradually while DETAIL keeps its slope, so texture never simply stops.
  { waves: build(CHOP, 19), fade: [420, 1900] },
  { waves: build(RIPPLE, 31), fade: [60, 340] },
]

/**
 * Slope-only detail. These never move a vertex — they are added to the normal
 * after the displacement is built, so their wavelength is not bounded by the
 * grid and they run to the horizon without aliasing the silhouette. This is
 * the term that turns a smooth swell into a surface that glitters.
 */
export interface DetailWave {
  dx: number
  dz: number
  k: number
  omega: number
  /** Contribution to dY/dx and dY/dz, dimensionless. */
  slope: number
  phase: number
  /** Distance fade, metres. */
  near: number
  far: number
}

/** [wavelength m, slope, spread deg, fade near m, fade far m] */
const DETAIL_SPEC: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [7.4, 0.058, 22, 900, 3600],
  [4.6, 0.052, -38, 620, 2600],
  [3.1, 0.045, 57, 420, 1800],
  [2.05, 0.038, -74, 300, 1250],
  [1.3, 0.032, 96, 190, 820],
  [0.82, 0.026, -118, 120, 520],
  [0.52, 0.019, 141, 70, 300],
  [0.33, 0.013, -163, 40, 170],
]

export const DETAIL_WAVES: DetailWave[] = DETAIL_SPEC.map(([lengthM, slope, spreadDeg, near, far], i) => {
  const a = ((WIND_DEG + spreadDeg) * Math.PI) / 180
  const k = (2 * Math.PI) / lengthM
  return { dx: Math.cos(a), dz: Math.sin(a), k, omega: Math.sqrt(G * k), slope, phase: ((i + 3) * 1.7320508) % (Math.PI * 2), near, far }
})

/**
 * The same sum the shader evaluates, on the CPU, for the one thing that has to
 * know where the water actually is: the wordmark floating on it. Only the
 * vertical component and the two slopes — the horizontal Gerstner displacement
 * moves a point along the surface rather than off it, and a floating body does
 * not care which particle it is sitting on.
 */
export function sampleSurface(x: number, z: number, t: number): { y: number; slopeX: number; slopeZ: number } {
  const dist = Math.hypot(x, z)
  let y = 0
  let slopeX = 0
  let slopeZ = 0
  for (const cascade of CASCADES) {
    let fade = 1
    if (cascade.fade) {
      const [a, b] = cascade.fade
      const u = Math.min(1, Math.max(0, (dist - a) / (b - a)))
      fade = 1 - u * u * (3 - 2 * u)
    }
    if (fade <= 0) continue
    for (const w of cascade.waves) {
      const phase = x * w.dx * w.k + z * w.dz * w.k - t * w.omega + w.phase
      y += Math.sin(phase) * w.amp * fade
      const c = Math.cos(phase) * fade
      slopeX += c * w.amp * w.k * w.dx
      slopeZ += c * w.amp * w.k * w.dz
    }
  }
  return { y, slopeX, slopeZ }
}

/** Roughly the highest the surface ever reaches; used to normalise the crest mask. */
export const CREST_HEIGHT = CASCADES.reduce(
  (sum, c) => sum + c.waves.reduce((s, w) => s + w.amp, 0),
  0,
)
