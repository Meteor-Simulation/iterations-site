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
 * Three disjoint bands, because one band never reads as mass: a long swell
 * that carries the horizon, a wind sea that gives it texture, and chop that
 * only exists within a hundred metres of the camera.
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

const SWELL: Spec[] = [
  [1024, 1.9, 0.075, 0],
  [760, 1.3, 0.065, 13],
  [585, 0.9, 0.055, -17],
]

const WIND_SEA: Spec[] = [
  [144, 0.62, 0.075, 9],
  [108, 0.44, 0.07, -21],
  [82, 0.31, 0.062, 30],
  [61, 0.21, 0.055, -34],
]

const CHOP: Spec[] = [
  [24, 0.105, 0.085, 18],
  [17.5, 0.075, 0.08, -27],
  [12.4, 0.052, 0.072, 45],
  [8.6, 0.036, 0.062, -52],
  [5.9, 0.024, 0.052, 64],
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
  { waves: build(WIND_SEA, 7), fade: [900, 3200] },
  { waves: build(CHOP, 19), fade: [45, 320] },
]

/** Roughly the highest the surface ever reaches; used to normalise the crest mask. */
export const CREST_HEIGHT = CASCADES.reduce(
  (sum, c) => sum + c.waves.reduce((s, w) => s + w.amp, 0),
  0,
)
