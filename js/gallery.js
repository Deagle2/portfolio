// Gallery page: click-to-load embeds (Luma splats, videos, anything iframeable).
// Add or remove items in js/config.js -> gallery. Nothing here needs editing.
// Embeds only load when clicked, so WebGL and bandwidth stay idle until asked.
(function () {
  var c = window.SITE, $ = function (s) { return document.querySelector(s); };
  function el(t, a, k) {
    var e = document.createElement(t);
    if (a) for (var x in a) { if (x === "text") e.textContent = a[x]; else e.setAttribute(x, a[x]); }
    (k || []).forEach(function (n) { if (n) e.appendChild(n); });
    return e;
  }
  document.title = "Gallery | " + c.name;
  $("#brand").textContent = c.name.split(" ")[0].toLowerCase();
  (c.gallery || []).forEach(function (g) {
    var box = el("div", { class: "frame" });
    var b = el("button", { class: "load", text: "load 3D: " + g.title });
    b.onclick = function () {
      var f = el("iframe", { src: g.src, title: g.title, allow: "fullscreen; xr-spatial-tracking", loading: "lazy", referrerpolicy: "no-referrer" });
      box.textContent = ""; box.appendChild(f); window.__bgPause = true;
    };
    box.appendChild(b); $("#gal").appendChild(box);
    $("#gal").appendChild(el("p", { class: "dim", text: g.title + ". Background relight pauses while it runs." }));
  });
  if (!(c.gallery || []).length) $("#gal").appendChild(el("p", { class: "dim", text: "Nothing here yet." }));
})();
