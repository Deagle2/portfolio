// ===========================================================================
// PLUG AND PLAY: this is the only file you normally edit. Everything personal
// about the site lives here — name, links, pinned repos, gallery, background.
// Save, commit, push, done. Nothing else needs touching for normal use.
// ===========================================================================
window.SITE = {
  // -- identity -----------------------------------------------------------
  name: "Nathan Mathews",
  tagline: "RTL / digital design. FPGA, hardware security, EDA tooling.",

  // -- contact ------------------------------------------------------------
  // Shown in the contact section, one line each. Leave email "" to hide it,
  // resume "" to hide it (or point it at a PDF you drop in assets/, e.g.
  // "assets/resume.pdf").
  github: "Deagle2",
  linkedin: "https://www.linkedin.com/in/nathan-mathew/",
  email: "nathanmath3ws@gmail.com",
  resume: "",

  // -- about --------------------------------------------------------------
  // One string per paragraph.
  about: [
    "B.Tech Electronics Engineering (VLSI Design and Technology) at MIT Manipal, 2024 to 2028.",
    "Undergraduate student researcher at MAHE.",
    "Targeting RTL design roles, DV second. Interests: secure boot, FPGA bitstream reverse engineering, CIRCT/MLIR, open-source hardware."
  ],
  skills: "SystemVerilog, Verilog, Vivado, cocotb, Python, C",

  // -- projects -----------------------------------------------------------
  // ONLY the repos listed here ever show up, in this order. New repos you
  // create will NOT appear on their own — add them here when you want them.
  //   repo: exact public repo name on your GitHub.
  //   note: optional one-liner shown instead of the GitHub description.
  // data/projects.json is just the offline fallback when the GitHub API is
  // unreachable — you never edit it by hand.
  featured: [
    { repo: "Secure-Boot-For-FPGAs", note: "Secure boot FSM controller for FPGAs." },
    { repo: "Reverse-Engineering-Bitstreams", note: "Reverse engineering Renesas ForgeFPGA bitstreams via differential fuzzing. Work in progress." },
    { repo: "AudioReactive", note: "A 3D audio visualizer built with Three.js as a learning project." },
    { repo: "vcdinfo", note: "packaging exercise --debian" }
  ],
  // showOthers: true also lists every other public repo under a collapsed
  // "other public repos" row. Keep false so ONLY the featured ones above show.
  showOthers: false,
  hideRepos: ["Deagle2"],   // repos never listed (profile README etc.)
  showForks: false,         // true to include forked repos in the others list

  // -- blog ---------------------------------------------------------------
  // postsOnHome: how many of the newest posts show on the home page.
  // Everything (all posts, newest first) always lives on blog.html.
  // To publish: add posts/my-post.md with title/date/summary front matter,
  // push, done — the Action rebuilds the index. draft: true hides a post.
  postsOnHome: 3,

  // -- gallery ------------------------------------------------------------
  // One entry per embed on gallery.html. src is anything iframeable
  // (Luma splats, YouTube/Vimeo embeds…). Click-to-load: nothing runs
  // until the visitor presses the button.
  gallery: [
    { title: "Colosseum Gaussian Splat (By me :D)", src: "https://lumalabs.ai/embed/76873160-318a-4dec-91c9-7a5ee64755c3?mode=lf&background=%23050506&color=%23ffffff&showTitle=false&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&showMenu=true" }
  ],

  // -- background ---------------------------------------------------------
  // Which relighting image loads first: "relief", "elephant" or "mother".
  // (Images + depth maps live in public/textures/; presets in src/demos.js.)
  bgDefault: "mother"
};
