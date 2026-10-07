// Light/dark toggle. Loaded in <head> so the stored theme applies before
// first paint (no dark flash). The #theme-btn button is wired once it exists.
// Light mode inverts the relighting canvas and swaps the palette to paper.
(function () {
  var KEY = "theme";
  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function apply(t) {
    document.documentElement.setAttribute("data-theme", t);
    var b = document.getElementById("theme-btn");
    if (b) {
      var light = t === "light";
      b.textContent = light ? "dark" : "light";
      b.setAttribute("aria-label", "Switch to " + (light ? "dark" : "light") + " mode");
    }
  }
  apply(stored() || "dark");
  function toggle() {
    var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply(next);
  }
  function wire() {
    var b = document.getElementById("theme-btn");
    if (b) b.onclick = toggle;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
