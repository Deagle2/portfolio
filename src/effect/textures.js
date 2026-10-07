// ---------------------------------------------------------------------------
// Source: "Relighting Images with Three.js" by Dominik Fojcik (Codrops)
// https://github.com/DGFX/codrops-relightning-images  (MIT)
// Article: https://tympanus.net/codrops/?p=119000
//
// Used as-is from the upstream repository: uploads the colour map and the
// depth map into two TSL texture nodes and hands the raw depth image to
// depth-map.js so the smoothed depth can be baked on the CPU.
//
// Adaptation: texture URLs come from src/demos.js (relative paths under
// public/textures/) so the site works from any sub-path, not just a root.
// ---------------------------------------------------------------------------
import { texture } from 'three/tsl'
import { SRGBColorSpace, Texture, TextureLoader } from 'three/webgpu'
import { setDepthImage } from './depth-map.js'

export const mapNode = texture(new Texture())
export const depthNode = texture(new Texture())

const loader = new TextureLoader()

async function setMap(url) {
  const map = await loader.loadAsync(url)
  map.colorSpace = SRGBColorSpace
  mapNode.value.dispose()
  mapNode.value = map
}

async function setDepth(url) {
  const map = await loader.loadAsync(url)
  depthNode.value.dispose()
  depthNode.value = map
  setDepthImage(map.image)
}

export function setupTextures({ map, depth }) {
  return Promise.all([setMap(map), setDepth(depth)])
}