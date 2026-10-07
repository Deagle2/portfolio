// ---------------------------------------------------------------------------
// Source: "Relighting Images with Three.js" by Dominik Fojcik (Codrops)
// https://github.com/DGFX/codrops-relightning-images  (MIT)
// Article: https://tympanus.net/codrops/?p=119000
//
// Adapted from the upstream repository. Upstream imports the Inspector eagerly
// and always shows its panel, which is right for a demo page but not for a live
// portfolio background. Here the panel is opt-in via ?debug, so `gui` starts
// life as a recording stub that logs every control the effect registers. When
// the real Inspector loads, those registrations are replayed onto it, so the
// effect modules stay the same as upstream and cost nothing for normal visitors.
//
// Only the Inspector submodule is loaded, and only when ?debug is present:
// three/addons/inspector/Inspector.js and friends resolve through the
// "three/addons/" import map entry.
// ---------------------------------------------------------------------------
import { int, output, select, uniform, vec3, vec4 } from 'three/tsl'

export const DEBUG_ENABLED = /[?&]debug\b/.test(location.search)

export let inspector = null

// Folder name -> { controls, closed }. null is the root group.
const recorded = new Map()
// Folder name -> live Inspector group, once it exists.
const live = new Map()

function folderRecord(name) {
  let entry = recorded.get(name)
  if (!entry) recorded.set(name, (entry = { controls: [], closed: false }))
  return entry
}

function makeControl(entry) {
  entry.handlers ??= {}
  entry.label ??= undefined
  entry.bound = null

  const forward = (type, handler) => {
    ;(entry.handlers[type] ??= []).push(handler)
    if (entry.bound) entry.bound.addEventListener(type, handler)
    return control
  }

  const control = {
    name(label) {
      entry.label = label
      entry.bound?.name(label)
      return control
    },
    addEventListener: forward,
    onChange: (handler) => forward('change', handler),
    listen() {
      return control
    },
  }

  return control
}

function bind(name, entry) {
  const group = live.get(name)
  if (!group) return

  const bound =
    entry.kind === 'addColor'
      ? group.addColor(entry.object, entry.property)
      : group.add(entry.object, entry.property, ...entry.params)

  entry.bound = bound
  if (entry.label) bound.name(entry.label)
  for (const [type, handlers] of Object.entries(entry.handlers)) {
    for (const handler of handlers) bound.addEventListener(type, handler)
  }
}

function record(name, entry) {
  const control = makeControl(entry)
  folderRecord(name).controls.push({ entry, control })
  bind(name, entry)
  return control
}

// Mirrors the ParametersGroup surface upstream actually uses.
function groupApi(name) {
  const group = {
    add(object, property, ...params) {
      return record(name, { kind: 'add', object, property, params })
    },
    addColor(object, property) {
      return record(name, { kind: 'addColor', object, property })
    },
    close() {
      folderRecord(name).closed = true
      return group
    },
  }
  return group
}

// Stable identity: effect modules hold this reference forever.
export const gui = {
  ...groupApi(null),
  addFolder(name) {
    folderRecord(name)
    return groupApi(name)
  },
}

export async function loadInspector() {
  if (inspector || !DEBUG_ENABLED) return inspector
  try {
    const { Inspector } = await import('three/addons/inspector/Inspector.js')
    inspector = new Inspector()
    const parameters = inspector.createParameters('Light plane')
    live.set(null, parameters)

    for (const [name, { controls, closed }] of recorded) {
      const group = name === null ? parameters : parameters.addFolder(name)
      live.set(name, group)
      for (const { entry } of controls) bind(name, entry)
      if (closed) group.close()
    }
  } catch (error) {
    console.warn('[relight] debug inspector unavailable:', error)
    inspector = null
  }
  return inspector
}

const uDebugView = uniform(0, 'int')

const DEBUG_VIEWS = [
  { label: 'depth', node: (_material, depth) => vec3(depth) },
  {
    label: 'normal',
    node: (material) => material.normalNode.mul(0.5).add(0.5),
  },
  { label: 'diffuse', node: (material) => material.colorNode },
  { label: 'shadow', node: (material) => vec3(material.aoNode) },
]

export function setDebugView(material, depth) {
  material.outputNode = vec4(
    DEBUG_VIEWS.reduceRight(
      (fallback, { node }, index) =>
        select(
          uDebugView.equal(int(index + 1)),
          node(material, depth),
          fallback,
        ),
      output.rgb,
    ),
    output.a,
  )

  const debugView = gui.addFolder('Debug View').close()
  debugView
    .add(
      uDebugView,
      'value',
      Object.fromEntries([
        ['final', 0],
        ...DEBUG_VIEWS.map(({ label }, index) => [label, index + 1]),
      ]),
    )
    .name('output')
}