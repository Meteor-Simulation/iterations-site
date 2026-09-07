/**
 * The scene, the loop, and the manners.
 *
 * Everything here is imperative and framework-free: React mounts it, hands it
 * a host element, and gets a handle back. Nothing in this file knows the page
 * exists, which is what makes it safe to instantiate more than once.
 *
 * The grid is a polar O-grid centred under the camera, and the radius grows
 * geometrically: the near water is metres apart and the far water hundreds of
 * metres apart for the same vertex budget, which is what lets one mesh carry
 * both the chop at the reader's feet and the horizon.
 */
import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Mesh,
  NoToneMapping,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGPURenderer,
} from 'three/webgpu'
import { CLEAR_COLOR, STILL_TIME, createOceanNodes } from './oceanNodes'
import { createWordmark } from './wordmark'

export interface OceanOptions {
  /** One still frame and no loop. The caller decides; this file only obeys. */
  still: boolean
}

export interface OceanHandle {
  dispose(): void
}

/* The grid. 225 x 257 vertices — 115k triangles, which is a rounding error on
   anything that can run WebGL2 at all. */
const RINGS = 224
const SECTORS = 256
const R_MIN = 0.6
const R_MAX = 6000

/** Geometric spacing: constant angular size, so screen-space density is flat. */
function ringRadius(ring: number): number {
  if (ring === 0) return 0
  return R_MIN * Math.pow(R_MAX / R_MIN, (ring - 1) / (RINGS - 1))
}

function buildWaterGeometry(): BufferGeometry {
  const cols = SECTORS + 1 // the seam column repeats sector 0, at the same xz
  const rows = RINGS + 1
  const positions = new Float32Array(rows * cols * 3)
  const normals = new Float32Array(rows * cols * 3)

  for (let r = 0; r < rows; r++) {
    const radius = ringRadius(r)
    for (let c = 0; c < cols; c++) {
      const angle = (c / SECTORS) * Math.PI * 2
      const i = (r * cols + c) * 3
      positions[i] = Math.cos(angle) * radius
      positions[i + 2] = Math.sin(angle) * radius
      normals[i + 1] = 1
    }
  }

  const indices = new Uint32Array(RINGS * SECTORS * 6)
  let n = 0
  for (let r = 0; r < RINGS; r++) {
    for (let c = 0; c < SECTORS; c++) {
      const a = r * cols + c
      const b = a + 1
      const d = a + cols
      const e = d + 1
      indices[n++] = a
      indices[n++] = e
      indices[n++] = d
      indices[n++] = a
      indices[n++] = b
      indices[n++] = e
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  // Never read by the shader — the normal is analytic — but a node material
  // will warn and fall back to a constant if the attribute is absent.
  geometry.setAttribute('normal', new BufferAttribute(normals, 3))
  geometry.setIndex(new BufferAttribute(indices, 1))
  return geometry
}

/** Camera height in metres. Low enough that a big crest passes near eye level. */
/* Low and wide, the way the reference photographs are framed: the closer the
   eye is to the water the more of the surface is seen at a grazing angle, and
   grazing angles are where Fresnel and the glitter path do their work. */
const EYE = 3.4

export async function createOcean(host: HTMLElement, options: OceanOptions): Promise<OceanHandle> {
  // A WebGL2 fallback is wired in by the renderer itself, but asking for it up
  // front avoids a failed WebGPU adapter request and its console warning.
  // Feature-tested with `in` rather than `navigator.gpu`, which the DOM lib
  // does not declare and this project does not pull @webgpu/types for.
  const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator
  const renderer = new WebGPURenderer({ forceWebGL: !hasWebGPU, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(CLEAR_COLOR, 1)
  renderer.toneMapping = NoToneMapping

  await renderer.init()

  const canvas = renderer.domElement
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  host.appendChild(canvas)

  const nodes = createOceanNodes()

  const waterGeometry = buildWaterGeometry()
  const skyGeometry = new SphereGeometry(8500, 48, 24)

  nodes.sky.side = BackSide
  nodes.sky.depthWrite = false
  nodes.sky.depthTest = false
  nodes.sky.fog = false

  const scene = new Scene()

  const sky = new Mesh(skyGeometry, nodes.sky)
  sky.renderOrder = -1000
  sky.frustumCulled = false
  scene.add(sky)

  const water = new Mesh(waterGeometry, nodes.water)
  water.frustumCulled = false // displacement pushes the surface past its bounds
  scene.add(water)

  const wordmark = createWordmark()
  scene.add(wordmark.mesh)

  const camera = new PerspectiveCamera(56, 1, 0.35, 24000)
  camera.position.set(0, EYE, 0)

  /** Slow enough to be felt rather than seen; the headline must stay still. */
  function aimCamera(t: number) {
    const yaw = Math.sin(t / 74) * 0.016
    const lift = Math.sin(t / 41) * 0.25
    camera.position.y = EYE + lift
    camera.lookAt(Math.sin(yaw) * 160, 0.3 + lift, -Math.cos(yaw) * 160)
  }

  let width = 1
  let height = 1

  function resize() {
    const rect = host.getBoundingClientRect()
    width = Math.max(1, Math.round(rect.width))
    height = Math.max(1, Math.round(rect.height))
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  let disposed = false
  let raf = 0
  let pending = 0
  let running = false
  let visible = false
  const start = performance.now()

  function draw(seconds: number) {
    nodes.time.value = seconds
    wordmark.update(seconds)
    aimCamera(seconds)
    renderer.render(scene, camera)
  }

  /** One frame, outside the loop: used when the loop is parked. */
  function drawOnce() {
    if (disposed || pending !== 0) return
    pending = requestAnimationFrame(() => {
      pending = 0
      if (disposed) return
      draw(options.still ? STILL_TIME : (performance.now() - start) / 1000)
    })
  }

  function loop() {
    if (disposed) return
    raf = requestAnimationFrame(loop)
    draw((performance.now() - start) / 1000)
  }

  function sync() {
    if (disposed) return
    const shouldRun = visible && !document.hidden && !options.still
    if (shouldRun === running) {
      if (!shouldRun) drawOnce()
      return
    }
    running = shouldRun
    if (shouldRun) {
      raf = requestAnimationFrame(loop)
    } else {
      cancelAnimationFrame(raf)
      raf = 0
      drawOnce()
    }
  }

  resize()

  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting)
      sync()
    },
    { threshold: 0 },
  )
  observer.observe(host)

  const resizeObserver = new ResizeObserver(() => {
    resize()
    if (!running) drawOnce()
  })
  resizeObserver.observe(host)

  const onVisibility = () => sync()
  document.addEventListener('visibilitychange', onVisibility)

  // Prime the pipelines before the first painted frame, so the hero never
  // shows a bare clear colour while the shader compiles.
  nodes.time.value = options.still ? STILL_TIME : 0
  aimCamera(nodes.time.value)
  try {
    await renderer.renderAsync(scene, camera)
  } catch {
    // A failed priming render is not fatal; the loop will try again.
  }
  sync()

  return {
    dispose() {
      if (disposed) return
      disposed = true
      cancelAnimationFrame(raf)
      cancelAnimationFrame(pending)
      observer.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      scene.clear()
      waterGeometry.dispose()
      wordmark.dispose()
      skyGeometry.dispose()
      nodes.water.dispose()
      nodes.sky.dispose()
      renderer.dispose()
      canvas.remove()
    },
  }
}
