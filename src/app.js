// ---------------------------------------------------------------------------
// Source: "Relighting Images with Three.js" by Dominik Fojcik (Codrops)
// https://github.com/DGFX/codrops-relightning-images  (MIT)
// Article: https://tympanus.net/codrops/?p=119000
//
// Adapted from the upstream repository. Same scene graph, same ordering, same
// TSL effect — only the surrounding shell is this site's:
//
//   - upstream appends its own <canvas> to a #app div; here the effect draws
//     into the existing fixed #bg canvas that css/style.css positions.
//   - upstream exposes the Inspector unconditionally; here it loads on demand
//     when the page is opened with ?debug.
//   - the background selector, the localStorage choice and window.__bgPause
//     (set by js/main.js when a gallery iframe opens) are this site's.
//
// The load order matters: setupDemo() has to apply its uniform presets before
// setupTextures() bakes the depth map, and both have to finish before
// createPlane() reads the texture dimensions for the cover UV transform.
//
// three.js is loaded through an import map in index.html rather than a bundler,
// so "three/webgpu" and "three/tsl" resolve to the pinned CDN build.
// ---------------------------------------------------------------------------
import {
  AgXToneMapping,
  Color,
  OrthographicCamera,
  Scene,
  WebGPURenderer,
} from 'three/webgpu'
import { loadInspector } from './debug.js'
import { applyDemo, currentDemoKey, demoKeys, setupDemo } from './demos.js'
import { pointLight, setupLight } from './effect/light.js'
import { uDisplacementScale } from './effect/nodes/normal.js'
import { createPlane } from './effect/plane.js'
import { setupTextures } from './effect/textures.js'

const MAX_PIXEL_RATIO = 1.5
const VIEW_HEIGHT = 4
const IDLE_AFTER_MS = 3000

const canvas = document.getElementById('bg')
if (canvas) start().catch(fallback)

// No WebGPU and no WebGL2: drop the canvas and let the page's flat background
// show through. The header controls stay: switching backgrounds and moving
// the slider are harmless without a renderer.
function fallback(error) {
  console.warn('[relight] disabled:', error)
  canvas?.style.setProperty('display', 'none')
}

async function start() {
  const demo = setupDemo()

  // Built first so the picker + slider are always on the page, even if the
  // renderer below fails to initialise.
  buildSelector(selectDemo)

  const renderer = new WebGPURenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_PIXEL_RATIO))
  renderer.setSize(innerWidth, innerHeight, false)
  renderer.toneMapping = AgXToneMapping

  await renderer.init()

  const inspector = await loadInspector()
  if (inspector) renderer.inspector = inspector

  await setupTextures(demo)

  const scene = new Scene()
  scene.background = new Color('#050506')

  const camera = new OrthographicCamera()
  camera.position.set(0, 0, 5)

  setupLight(scene, camera)

  const plane = createPlane()
  scene.add(plane)

  function onResize() {
    const aspect = innerWidth / innerHeight

    camera.top = VIEW_HEIGHT * 0.5
    camera.bottom = -camera.top
    camera.right = camera.top * aspect
    camera.left = -camera.right
    camera.updateProjectionMatrix()
    plane.scale.set(VIEW_HEIGHT * aspect, VIEW_HEIGHT, 1)
  }

  onResize()

  addEventListener('resize', () => {
    renderer.setSize(innerWidth, innerHeight, false)
    onResize()
  })

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  let lastPointer = performance.now()

  addEventListener(
    'pointermove',
    () => {
      lastPointer = performance.now()
    },
    { passive: true },
  )

  renderer.setAnimationLoop((time) => {
    // js/main.js sets this while a gallery iframe is on screen.
    if (window.__bgPause) return
    if (!reduceMotion && time - lastPointer > IDLE_AFTER_MS) {
      pointLight.position.x = Math.sin(time * 0.00021) * camera.right * 0.72
      pointLight.position.y = Math.cos(time * 0.00016) * camera.top * 0.62
    }
    renderer.render(scene, camera)
  })
}

// Texture swaps are serialised so that, if someone clicks two backgrounds
// quickly, the second one cannot be overwritten by the slower first load.
let queue = Promise.resolve()

function selectDemo(key) {
  const demo = applyDemo(key)
  queue = queue
    .then(() => setupTextures(demo))
    .catch((error) => console.warn('[relight] texture load failed:', error))
  return queue
}

// The little square picker in the corner, styled by #ui / #seg in css/style.css.
function buildSelector(onPick) {
  const ui = document.createElement('div')
  ui.id = 'ui'

  const seg = document.createElement('div')
  seg.id = 'seg'
  seg.setAttribute('role', 'group')
  seg.setAttribute('aria-label', 'Background image')

  demoKeys().forEach((key) => {
    const button = document.createElement('button')
    button.setAttribute('aria-label', key)
    button.title = key
    button.classList.toggle('on', key === currentDemoKey())
    button.onclick = () => {
      for (const other of seg.children) other.classList.remove('on')
      button.classList.add('on')
      onPick(key)
      str.value = String(uDisplacementScale.value)
    }
    seg.appendChild(button)
  })

  // Single relief-strength slider: drives the displacement scale live.
  // Each background resets it to its own preset on switch.
  const str = document.createElement('input')
  str.type = 'range'
  str.id = 'str'
  str.min = '0'
  str.max = '4'
  str.step = '0.05'
  str.value = String(uDisplacementScale.value)
  str.setAttribute('aria-label', 'Relief strength')
  str.addEventListener('input', () => {
    uDisplacementScale.value = parseFloat(str.value)
  })

  ui.appendChild(str)
  ui.appendChild(seg)
  // Parked in the header next to the mark; falls back to the page corner on
  // pages without the slot.
  var slot = document.getElementById('bgctl')
  if (slot) slot.appendChild(ui)
  else document.body.appendChild(ui)
}