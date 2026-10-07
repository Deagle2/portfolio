// ---------------------------------------------------------------------------
// Source: "Relighting Images with Three.js" by Dominik Fojcik (Codrops)
// https://github.com/DGFX/codrops-relightning-images  (MIT)
// Article: https://tympanus.net/codrops/?p=119000
//
// Used as-is from the upstream repository: the material's albedo. The depth
// threshold lets the sky/near-white part of a depth map be faded out from the
// colour map so the background of the image keeps the site's flat colour.
// ---------------------------------------------------------------------------
import { Fn, step, uniform } from 'three/tsl'
import { depthFolder } from '../depth-map.js'
import { mapNode } from '../textures.js'

const uDepthThreshold = uniform(0)

export const diffuseNode = Fn(([vUv, depth]) =>
  mapNode.sample(vUv).rgb.mul(step(uDepthThreshold, depth)),
)

depthFolder.add(uDepthThreshold, 'value', 0, 1, 0.01).name('depth threshold')