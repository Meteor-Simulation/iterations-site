/**
 * "Iterations", floating on the sea.
 *
 * One mass, not a caption: a slab the size of a ship standing a hundred metres
 * out, riding the swell. It samples the same wave sum the shader displaces the
 * water with (`sampleSurface`), so it rises on a crest and heels on a slope
 * because the water under it moved — nothing here is a canned bob.
 *
 * The glyphs come from a canvas rather than a font asset: three r185 ships no
 * typeface JSON, and a hero element must not depend on a network font arriving.
 * The canvas is drawn once, at a size that stays crisp on a 2x display.
 */
import { CanvasTexture, DoubleSide, LinearFilter, Mesh, MeshBasicNodeMaterial, PlaneGeometry, SRGBColorSpace } from 'three/webgpu'
import { color, mix, positionGeometry, saturate, smoothstep, texture, vec4 } from 'three/tsl'
import { sampleSurface } from './waves'

const WORD = 'Iterations'

/** Metres. Large enough to read as a structure on the water, not a label. */
const WIDTH = 112
const HEIGHT = 28
/**
 * Out to starboard, into the sun path, and well clear of the text column. The
 * headline owns the left of the frame; anything that crosses it is competing
 * with the one sentence the page has three seconds to land.
 */
const DISTANCE = 178
const OFFSET_X = 104

const TEX_W = 2048
const TEX_H = 512

const FOAM = 0xe9f5f3
const GLOW = 0x4fd1c5
const DEEP = 0x06101a

function drawWord(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = TEX_W
  canvas.height = TEX_H
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  ctx.clearRect(0, 0, TEX_W, TEX_H)
  // Weight and tracking chosen to match the page's own display type, so the
  // thing on the water is recognisably the same wordmark as the one in the nav.
  ctx.font = `700 ${Math.round(TEX_H * 0.62)}px "Pretendard Variable", Pretendard, Inter, system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = '-0.02em'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(WORD, TEX_W / 2, TEX_H / 2, TEX_W * 0.94)
  return canvas
}

export interface Wordmark {
  mesh: Mesh
  /** Put it where the water is at this instant. */
  update(seconds: number): void
  dispose(): void
}

export function createWordmark(): Wordmark {
  const map = new CanvasTexture(drawWord())
  map.colorSpace = SRGBColorSpace
  map.minFilter = LinearFilter
  map.magFilter = LinearFilter
  map.anisotropy = 8

  const material = new MeshBasicNodeMaterial()
  material.transparent = true
  material.depthWrite = false
  material.side = DoubleSide
  material.fog = false

  const alpha = texture(map).a
  // Lit from the waterline up: the bottom of the slab sits in the sea's own
  // colour and the top catches the sky, which is what stops a flat billboard
  // from reading as a sticker on the lens.
  const up = saturate(positionGeometry.y.div(HEIGHT).add(0.5))
  // A dark mass with a lit top edge, not white type: the headline is the only
  // white thing in this frame, and a second one would halve it.
  const body = mix(color(DEEP), mix(color(GLOW), color(FOAM), 0.62), smoothstep(0.3, 0.98, up))
  // Fades into the haze at the waterline so it looks half-submerged rather than
  // stood on the water like a card, and fades again at the top so it belongs to
  // the horizon band it is standing in.
  const submerge = smoothstep(0.0, 0.3, up)
  material.colorNode = vec4(body, alpha.mul(submerge).mul(0.88))

  const geometry = new PlaneGeometry(WIDTH, HEIGHT, 1, 1)
  const mesh = new Mesh(geometry, material)
  mesh.frustumCulled = false
  mesh.renderOrder = 10

  function update(seconds: number) {
    const x = OFFSET_X
    const z = -DISTANCE
    const { y, slopeX, slopeZ } = sampleSurface(x, z, seconds)
    // Sits with its waterline on the surface, so a crest lifts it bodily.
    mesh.position.set(x, y + HEIGHT * 0.42, z)
    // Heels with the surface it is floating on. Damped hard: a slab this size
    // would not follow a two-metre wave one for one, and the letters have to
    // stay readable.
    mesh.rotation.z = Math.atan(slopeX) * 0.38
    mesh.rotation.x = Math.atan(slopeZ) * 0.16
  }

  return {
    mesh,
    update,
    dispose() {
      geometry.dispose()
      material.dispose()
      map.dispose()
    },
  }
}

