# Portfolio

Minimal portfolio + markdown blog. Static, no build tools, hosted on GitHub Pages.

## Deploy
1. Create a **public** repo named exactly `<your-username>.github.io` (e.g. `deagle2.github.io`).
2. Push this folder to its `main` branch.
3. Repo Settings > Pages > Source: **GitHub Actions**.
4. Site appears at `https://<your-username>.github.io`.

## Add a blog post
1. Add `posts/my-post.md` with front matter (title, date, summary; `draft: true` hides it).
2. Commit and push. The Action regenerates `posts/index.json` and redeploys.
3. That's it — one md file is the whole flow. The home page shows the latest 3
   posts (`postsOnHome` in `js/config.js`); everything lives on `blog.html`.

## Edit content
Everything personal is in `js/config.js` (name, about, links, pinned projects, email, resume path).
Projects load live from your public GitHub repos; private repos never appear.

## Local preview
`python scripts/build_index.py && python -m http.server 8000`, open http://localhost:8000 (needs a server, `file://` blocks texture loading).

## Credits

The relighting background — flat 2D images that react to a moving point light with surface detail and self-shadowing — is
**["Relighting Images with Three.js" by Dominik Fojcik (Codrops)](https://github.com/DGFX/codrops-relightning-images)**, MIT licensed.
[Write-up on Codrops](https://tympanus.net/codrops/?p=119000) · [Live demo](https://tympanus.net/Tutorials/RelightingImages/)

Its `src/effect/` tree is ported here almost verbatim — same file names, same node graph, same math — with attribution
headers on every file. Three things differ, all forced by running without a bundler:

- **three.js comes from an import map**, not npm. `index.html` maps `three`, `three/webgpu`, `three/tsl` and `three/addons/`
  to a pinned `three@0.184.0` build on jsDelivr. `three` and `three/webgpu` point at the same WebGPU build on purpose, so
  the Inspector addon and the renderer share one module instance. Bump the version in both HTML files together.
- **The debug panel is opt-in.** Upstream imports `three/addons/inspector/Inspector.js` eagerly and always shows it, which is
  right for a demo page but not for a live site. Here `src/debug.js` exports a recording stub for `gui`, and only loads the
  Inspector when the page is opened with `?debug`, replaying the recorded controls onto it. Normal visitors load three files.
- **The shell is this site's.** `#bg` is the existing fixed canvas, the background choice persists in `localStorage`, and
  `window.__bgPause` (set by `js/main.js`) stops the render loop while a gallery iframe is on screen.

### Upstream files, as mapped here

| Upstream | Here | Change |
| --- | --- | --- |
| `src/effect/textures.js` | same | texture URLs are relative (`public/textures/…`) so any sub-path works |
| `src/effect/depth-map.js` | same | verbatim |
| `src/effect/light.js` | same | verbatim |
| `src/effect/plane.js` | same | verbatim |
| `src/effect/nodes/diffuse.js` | same | verbatim |
| `src/effect/nodes/normal.js` | same | verbatim |
| `src/effect/nodes/shadow.js` | same | verbatim |
| `src/effect/nodes/texture-fit.js` | same | verbatim |
| `src/lib/blur.js` | same | verbatim |
| `src/debug.js` | same | lazy Inspector behind `?debug`, recording stub |
| `src/demos.js` | same | keyed by name instead of URL path, adds elephant, presets dimmed for the page scrim |
| `src/app.js` | same | draws into `#bg`, adds selector / pause / idle drift / reduced motion / renderer fallback |

## Background images

Depth maps live in `public/textures/` as `<name>.jpg` + `<name>-depth.jpg` (white = near), the same
convention upstream uses. To add one, drop both files in and register it in the `DEMOS` map in
`src/demos.js`:

```js
elephant: {
  map: 'public/textures/elephant.jpg',
  depth: 'public/textures/elephant-depth.jpg',
  setUniforms() { /* relief strength, shadow, light colour … */ },
},
```

The square picker in the corner and the `localStorage` choice both fall out of that map automatically.
The slider next to it is relief strength (the displacement scale) — it follows each
background's preset on switch. `mother` is the default background.

Make real depth maps with [Depth Anything 3](https://github.com/ByteDance-Seed/Depth-Anything-3) or upstream's
[depth generation tool](https://depth.fojcikdominik.com/); luminance-derived depth (relief, elephant) is a rough
approximation. Add `?debug` for the full inspector: displacement scale, normal scale, detail, shadow intensity and
softness, light colour / brightness / radius / elevation / ambient, depth smoothing, and a depth / normal / diffuse /
shadow buffer view.

## Layout
```
index.html  post.html  blog.html   (archive: every post, newest first)
css/style.css
js/config.js  main.js  post.js  blog.js
src/app.js  debug.js  demos.js
src/effect/{textures,depth-map,light,plane}.js
src/effect/nodes/{diffuse,normal,shadow,texture-fit}.js
src/lib/blur.js
public/textures/*.jpg   (image + matching *-depth.jpg)
posts/*.md  posts/index.json (generated)
data/projects.json (offline fallback)
scripts/build_index.py
.github/workflows/pages.yml
```
Third-party: [three.js](https://threejs.org/) 0.184.0 (WebGPU build + TSL, via import map), marked + DOMPurify (jsDelivr),
and the [Codrops relighting effect](https://github.com/DGFX/codrops-relightning-images) (MIT).