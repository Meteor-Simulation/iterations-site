/**
 * The shader graph, in TSL.
 *
 * TSL rather than GLSL because `WebGPURenderer` compiles the same node graph
 * down to WGSL or GLSL depending on which backend won — one surface, both
 * paths, no second shader to keep in sync.
 *
 * Two rules hold this file together. Every colour is one of the seven tokens
 * from index.css or a mix of two of them, so the water cannot drift out of the
 * page's palette. And nothing here is a lookup: the normals and the foam come
 * out of the same closed-form wave sum as the displacement, differentiated by
 * hand, so the lighting is always consistent with the geometry it lights.
 */
import { Color, MeshBasicNodeMaterial, Vector3 } from 'three/webgpu'
import type { Node, UniformNode } from 'three/webgpu'
import {
  cameraPosition,
  color,
  cos,
  cross,
  dot,
  float,
  length,
  mix,
  normalize,
  positionGeometry,
  positionLocal,
  positionWorld,
  pow,
  saturate,
  sin,
  smoothstep,
  uniform,
  varying,
  vec2,
  vec3,
  vec4,
} from 'three/tsl'
import { CASCADES, CREST_HEIGHT, DETAIL_WAVES } from './waves'

type F = Node<'float'>
type V3 = Node<'vec3'>

/* The palette, verbatim from index.css. Nothing else enters this file. */
const ABYSS = 0x03060a
const DEEP = 0x06101a
const SEA = 0x0a1f2e
const SHELF = 0x10394a
const TIDE = 0x1c6b7c
const GLOW = 0x4fd1c5
const FOAM = 0xe9f5f3

/** Clear colour for the canvas, so nothing flashes before the first frame. */
export const CLEAR_COLOR = new Color(ABYSS)

/**
 * Low, and far enough off the view axis that the glitter path enters from the
 * right edge instead of sitting behind the headline. ~6 degrees of elevation:
 * a blue-hour sun, not a sunset.
 */
export const SUN_DIRECTION = new Vector3(0.615, 0.1, -0.787).normalize()

interface WaveField {
  /** Gerstner displacement, to be added to the rest position. */
  disp: V3
  /** Surface normal from the analytic tangents. */
  normal: V3
  /** Whitecap coverage, 0..1, from the folding of the horizontal map. */
  foam: F
}

/**
 * The sum, evaluated at a rest position in the xz plane.
 *
 * Every band is faded out by distance before the grid gets too coarse to carry
 * it, which is what keeps the far water from boiling into moire.
 */
function waveField(px: F, pz: F, time: F): WaveField {
  const dist = length(vec2(px, pz))

  let dispX: F = float(0)
  let dispY: F = float(0)
  let dispZ: F = float(0)
  // dY/dx and dY/dz.
  let slopeX: F = float(0)
  let slopeZ: F = float(0)
  // The horizontal Jacobian, minus the identity: dX/dx, dZ/dz, dX/dz (= dZ/dx).
  let jxx: F = float(0)
  let jzz: F = float(0)
  let jxz: F = float(0)

  for (const cascade of CASCADES) {
    const fade: F =
      cascade.fade === null
        ? float(1)
        : float(1).sub(smoothstep(cascade.fade[0], cascade.fade[1], dist))

    for (const w of cascade.waves) {
      const phase = px
        .mul(w.dx * w.k)
        .add(pz.mul(w.dz * w.k))
        .sub(time.mul(w.omega))
        .add(w.phase)

      // Shared once per wave: TSL hoists a node with several dependents into a
      // temporary, so each sine is evaluated once and read six times.
      const s = sin(phase).mul(fade)
      const c = cos(phase).mul(fade)
      const h = w.q / w.k // horizontal amplitude

      dispY = dispY.add(s.mul(w.amp))
      dispX = dispX.add(c.mul(h * w.dx))
      dispZ = dispZ.add(c.mul(h * w.dz))

      slopeX = slopeX.add(c.mul(w.amp * w.k * w.dx))
      slopeZ = slopeZ.add(c.mul(w.amp * w.k * w.dz))

      jxx = jxx.sub(s.mul(w.q * w.dx * w.dx))
      jzz = jzz.sub(s.mul(w.q * w.dz * w.dz))
      jxz = jxz.sub(s.mul(w.q * w.dx * w.dz))
    }
  }

  // Slope-only detail, added after the displacement. The grid cannot carry a
  // one-metre wave at two kilometres, but the normal can, and the normal is
  // what the specular term reads - so the sea keeps glittering all the way out
  // instead of going glassy at the radius where the last band faded.
  for (const d of DETAIL_WAVES) {
    const amp = float(d.slope).mul(float(1).sub(smoothstep(d.near, d.far, dist)))
    const c = cos(px.mul(d.dx * d.k).add(pz.mul(d.dz * d.k)).sub(time.mul(d.omega)).add(d.phase))
    slopeX = slopeX.add(c.mul(amp).mul(d.dx))
    slopeZ = slopeZ.add(c.mul(amp).mul(d.dz))
  }

  const tangentX = vec3(jxx.add(1), slopeX, jxz)
  const tangentZ = vec3(jxz, slopeZ, jzz.add(1))

  // Where the horizontal map folds (determinant below 1) the surface is
  // overturning, and that is exactly where a real sea breaks. Gated by crest
  // height so the foam sits on top of waves rather than in the troughs.
  const jacobian = jxx.add(1).mul(jzz.add(1)).sub(jxz.mul(jxz))
  const fold = float(1).sub(smoothstep(0.3, 0.86, jacobian))
  const crest = smoothstep(0.2, 0.72, dispY.div(CREST_HEIGHT))

  return {
    disp: vec3(dispX, dispY, dispZ),
    normal: normalize(cross(tangentZ, tangentX)),
    foam: saturate(fold.mul(crest).mul(1.7)),
  }
}

/**
 * The sky, as a function of direction. The water reflects it, and the dome
 * behind the horizon draws it, so both agree by construction and the horizon
 * line is a change of material rather than a seam.
 */
function skyColor(dir: V3, sun: V3): V3 {
  const up = saturate(dir.y.mul(2.4))
  // Bright at the horizon, dark overhead: the band of haze just above the water
  // is what gives a sea its depth, and it is the first thing missing when water
  // is rendered against a flat sky.
  // Overhead runs to DEEP, not to black. A bumpy foreground reflects mostly
  // upward, so a sky that is black above the horizon leaves the near water with
  // nothing to catch and it reads as a smooth sheet however bumpy it really is.
  const base = mix(mix(color(SHELF), color(TIDE), 0.35), mix(color(DEEP), color(SEA), 0.45), pow(up, 0.8))
  // Below the horizon the dome must go to water colour, or a bright band shows
  // beyond the last ring of the mesh.
  // Below the horizon the dome runs to the deep water colour rather than to
  // black, so the last ring of the mesh dissolves instead of ending.
  const below = mix(base, color(DEEP), saturate(dir.y.mul(-7)))

  const toSun = saturate(dot(dir, sun))
  // Tight enough to read as a sun rather than a bloom: the wide term was making
  // a soft blob on the horizon instead of a bright band with a path under it.
  const glint = pow(toSun, 420).mul(1.15).add(pow(toSun, 40).mul(0.13)).add(pow(toSun, 6).mul(0.05)).add(pow(toSun, 1.5).mul(0.03))
  // The glow is killed below the horizon so the glitter path cannot leak under it.
  const above = saturate(dir.y.mul(9).add(0.1))

  return below.add(mix(color(GLOW), color(FOAM), 0.3).mul(glint.mul(above)))
}

export interface OceanNodes {
  /** Seconds. Held by the ocean so a paused loop freezes the sea exactly. */
  time: UniformNode<'float', number>
  water: MeshBasicNodeMaterial
  sky: MeshBasicNodeMaterial
}

export function createOceanNodes(): OceanNodes {
  const time = uniform(0)
  const sun = uniform(SUN_DIRECTION.clone())

  /* ---- water ---------------------------------------------------------- */

  const field = waveField(positionGeometry.x, positionGeometry.z, time)
  const water = new MeshBasicNodeMaterial()
  water.positionNode = positionLocal.add(field.disp)

  // The mesh sits at the origin with an identity transform, so the displaced
  // local position is already the world position — one varying instead of two.
  const worldPos = varying(positionGeometry.add(field.disp), 'oceanWorld')
  const normal = normalize(varying(field.normal, 'oceanNormal'))
  const foam = saturate(varying(field.foam, 'oceanFoam'))

  const view = normalize(cameraPosition.sub(worldPos))
  const nDotV = saturate(dot(normal, view))

  // Schlick for a dielectric at n = 1.34. At the grazing angles this camera
  // spends most of its time at, this term is what makes water look like water.
  const fresnel = float(0.0212).add(float(0.9788).mul(pow(float(1).sub(nDotV), 5)))

  const reflected = normal.mul(dot(normal, view).mul(2)).sub(view)
  const sky = skyColor(reflected, sun)

  // Body colour: troughs sit in the abyss, crests lift toward sea green.
  const height = worldPos.y
  // Troughs are dark but never black: even a trough sees most of the sky dome,
  // and a body colour that reaches true black is what makes the near water look
  // like a hole rather than like water.
  const body = mix(mix(color(ABYSS), color(DEEP), 0.55), mix(color(SEA), color(SHELF), 0.6), saturate(height.mul(0.19).add(0.46)))
  const ambient = mix(color(DEEP), color(SEA), 0.5).mul(0.5)

  // Light that went through a thin crest and came back out. Only when the
  // camera is looking roughly down-sun, only near the top of a wave.
  const backlit = pow(saturate(dot(view, sun).mul(-1)), 2.5)
  const subsurface = mix(color(TIDE), color(GLOW), 0.35).mul(
    saturate(height.mul(0.3)).mul(backlit).mul(float(1).sub(nDotV)).mul(0.5),
  )

  const half = normalize(view.add(sun))
  const nDotH = saturate(dot(normal, half))
  // Three lobes, not one. The tight lobe is the individual glint off a single
  // facet, the middle one is the glitter path those glints live in, and the
  // broad one is the sheen that tells you the sky is bright over there. With
  // one lobe the sun is a dot on flat water; with three it is a path.
  const glitter = pow(nDotH, 900).mul(3.4).add(pow(nDotH, 110).mul(0.45)).add(pow(nDotH, 16).mul(0.09))
  // Only where the sun is actually up-view, so the left of the frame - where
  // the headline sits - stays dark.
  const sunSide = saturate(dot(normalize(vec3(view.x.mul(-1), 0, view.z.mul(-1))), vec3(sun.x, 0, sun.z)).mul(0.85).add(0.35))
  const specular = mix(color(GLOW), color(FOAM), 0.72).mul(glitter.mul(sunSide))

  const lit = mix(body, sky, fresnel).add(ambient).add(subsurface).add(specular.mul(float(1).sub(foam)))
  const surface = mix(lit, mix(color(TIDE), color(FOAM), 0.88), foam.mul(0.92))

  // Aerial perspective. The far water dissolves into the sky along the view
  // azimuth, so the last ring of the grid is never a visible edge.
  const horizon = skyColor(normalize(vec3(view.x.mul(-1), 0.012, view.z.mul(-1))), sun)
  const range = length(vec2(worldPos.x.sub(cameraPosition.x), worldPos.z.sub(cameraPosition.z)))
  // Starts nearer and lands harder than before: the reference photographs all
  // show the far water collapsing into a bright band well before the horizon,
  // and that band is most of what reads as distance.
  const faded = mix(surface, horizon, smoothstep(240, 3400, range).mul(0.95))

  water.colorNode = vec4(faded, 1)

  /* ---- sky dome ------------------------------------------------------- */

  const skyMaterial = new MeshBasicNodeMaterial()
  skyMaterial.colorNode = vec4(skyColor(normalize(positionWorld.sub(cameraPosition)), sun), 1)

  return { time, water, sky: skyMaterial }
}

/** A moment in the swell that reads well frozen, for `prefers-reduced-motion`. */
export const STILL_TIME = 41.7
