// Edit this file to personalise the site. Nothing else needs touching for normal use.
window.SITE = {
  name: "Nathan Mathews",
  tagline: "RTL / digital design. FPGA, hardware security, EDA tooling.",
  github: "Deagle2",
  linkedin: "https://www.linkedin.com/in/nathan-mathew/",
  email: "nathanmath3ws@gmail.com",             
  resume: "",           // e.g. "assets/resume.pdf". Empty = hidden
  about: [
    "B.Tech Electronics Engineering (VLSI Design and Technology) at MIT Manipal, 2024 to 2028.",
    "Undergraduate student researcher at MAHE.",
    "Targeting RTL design roles, DV second. Interests: secure boot, FPGA bitstream reverse engineering, CIRCT/MLIR, open-source hardware."
  ],
  skills: "SystemVerilog, Verilog, Vivado, cocotb, Python, C",
  // Pinned projects (must be PUBLIC repos). Optional note overrides the GitHub description.
  featured: [
    { repo: "Secure-Boot-For-FPGAs", note: "Secure boot FSM controller for FPGAs." },
    { repo: "Reverse-Engineering-Bitstreams", note: "Reverse engineering Renesas ForgeFPGA bitstreams via differential fuzzing. Work in progress." }
  ],
  gallery: [
    { title: "Colosseum Gaussian Splat (By me :D)", src: "https://lumalabs.ai/embed/76873160-318a-4dec-91c9-7a5ee64755c3?mode=lf&background=%23050506&color=%23ffffff&showTitle=false&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&showMenu=true" }
  ],
  hideRepos: ["Deagle2"],   // repos never listed (profile README etc.)
  showForks: false,
  postsOnHome: 3
};
