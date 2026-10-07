// ---------------------------------------------------------------------------
// Source: "Relighting Images with Three.js" by Dominik Fojcik (Codrops)
// https://github.com/DGFX/codrops-relightning-images  (MIT)
// Article: https://tympanus.net/codrops/?p=119000
//
// Adapted from the upstream repository. Upstream keys its demos off the URL
// pathname and swaps whole pages; here the background is one of three images
// chosen with the little square selector in the corner and remembered in
// localStorage, so DEMOS is keyed by name and setupDemo() reads the saved
// choice. applyDemo() is also called directly by the selector.
//
// The relief and mother presets are upstream's own demo2/demo3 values, scaled
// down for this site: the background sits behind a dim scrim and the text
// needs to stay readable, so it runs darker than the standalone demo. Elephant
// has no upstream preset, so it is a middle-of-the-road guess. Every value is
// live-editable via ?debug.
// ---------------------------------------------------------------------------
import { depthSmoothing } from './effect/depth-map.js'
import { ambientLight, pointLight } from './effect/light.js'
import {
  uDetailScale,
  uDisplacementScale,
  uNormalScale,
} from './effect/nodes/normal.js'
import { uShadowIntensity, uShadowSoftness } from './effect/nodes/shadow.js'

const STORAGE_KEY = 'bg'

// Plug-and-play: the default background comes from js/config.js -> bgDefault
// ("relief", "elephant" or "mother"), falling back to mother. config.js is a
// classic script that always runs before this module, so window.SITE exists.
function configuredDefault() {
  try {
    const key = window.SITE && window.SITE.bgDefault
    if (key && key in DEMOS) return key
  } catch {
    /* fall through to the default */
  }
  return 'mother'
}

const DEMOS = {
  relief: {
    map: 'public/textures/relief.jpg',
    depth: 'public/textures/relief-depth.jpg',
    setUniforms() {
      depthSmoothing.percent = 0.6
      uDisplacementScale.value = 0.905
      uNormalScale.value = 0.86
      uDetailScale.value = 0.83
      uShadowIntensity.value = 0.55
      uShadowSoftness.value = 0.164
      pointLight.color.set('#ffcb8f')
      pointLight.intensity = 3.4
      pointLight.decay = 2.95
      pointLight.position.z = 0.77
      ambientLight.intensity = 0.05
    },
  },
  elephant: {
    map: 'public/textures/elephant.jpg',
    depth: 'public/textures/elephant-depth.jpg',
    setUniforms() {
      depthSmoothing.percent = 1.1
      uDisplacementScale.value = 1.35
      uNormalScale.value = 1.25
      uDetailScale.value = 1.1
      uShadowIntensity.value = 0.7
      uShadowSoftness.value = 0.12
      pointLight.color.set('#e8e2d4')
      pointLight.intensity = 3.8
      pointLight.decay = 3.2
      pointLight.position.z = 1.1
      ambientLight.intensity = 0.06
    },
  },
  mother: {
    map: 'public/textures/mother.jpg',
    depth: 'public/textures/mother-depth.jpg',
    setUniforms() {
      depthSmoothing.percent = 0.5
      uDisplacementScale.value = 1.9
      uNormalScale.value = 2.16
      uDetailScale.value = 0.7
      uShadowIntensity.value = 0.86
      uShadowSoftness.value = 0.152
      pointLight.color.set('#e7dcd0')
      pointLight.intensity = 5.2
      pointLight.decay = 3.8
      pointLight.position.z = 1.97
      ambientLight.intensity = 0.03
    },
  },
}

export function demoKeys() {
  return Object.keys(DEMOS)
}

export function currentDemoKey() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && saved in DEMOS) return saved
  } catch {
    /* storage blocked, fall through to the default */
  }
  return configuredDefault()
}

export function applyDemo(key) {
  const demo = DEMOS[key] ?? DEMOS[configuredDefault()]
  demo.setUniforms?.()
  try {
    localStorage.setItem(STORAGE_KEY, key)
  } catch {
    /* storage blocked, the choice just will not persist */
  }
  return demo
}

export function setupDemo() {
  return applyDemo(currentDemoKey())
}