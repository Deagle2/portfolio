// ---------------------------------------------------------------------------
// Source: "Relighting Images with Three.js" by Dominik Fojcik (Codrops)
// https://github.com/DGFX/codrops-relightning-images  (MIT)
// Article: https://tympanus.net/codrops/?p=119000
//
// Used as-is from the upstream repository: derives the "cover" UV transform
// so the image fills the viewport at any aspect ratio without letterboxing,
// and the matching scale used to keep the depth gradient in proportion.
// ---------------------------------------------------------------------------
import { Fn, screenSize, screenUV, vec2 } from 'three/tsl'
import { mapNode } from '../textures.js'

export const coverScaleNode = Fn(() => {
  const viewAspect = screenSize.x.div(screenSize.y).toVar()
  const mapSize = vec2(mapNode.size()).toVar()
  const imageAspect = mapSize.x.div(mapSize.y).toVar()

  return imageAspect
    .greaterThan(viewAspect)
    .select(
      vec2(viewAspect.div(imageAspect), 1),
      vec2(1, imageAspect.div(viewAspect)),
    )
})

export const coverUv = Fn(() =>
  screenUV.flipY().sub(0.5).mul(coverScaleNode()).add(0.5),
)