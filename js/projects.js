// Projects archive page: every featured repo, in config order.
// Add repos in js/config.js -> featured; nothing here needs editing.
(function () {
  var c = window.SITE, $ = function (s) { return document.querySelector(s); };
  function el(t, a, k) {
    var e = document.createElement(t);
    if (a) for (var x in a) { if (x === "text") e.textContent = a[x]; else e.setAttribute(x, a[x]); }
    (k || []).forEach(function (n) { if (n) e.appendChild(n); });
    return e;
  }
  function link(h, t) { return el("a", { href: h, text: t, target: "_blank", rel: "noopener" }); }
  document.title = "Projects | " + c.name;
  function card(r, note) {
    var h = el("h3", null, [link(r.html_url, r.name)]);
    return el("div", { class: "item" }, [h, el("p", { text: note || r.description || "" })]);
  }
  function repos() {
    return fetch("https://api.github.com/users/" + c.github + "/repos?per_page=100&sort=updated")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .catch(function () { return fetch("data/projects.json").then(function (r) { return r.json(); }); });
  }
  repos().then(function (all) {
    var by = {};
    all.filter(function (r) { return !r.private; }).forEach(function (r) { by[r.name] = r; });
    var B = $("#all"), any = false;
    c.featured.forEach(function (f) {
      var r = by[f.repo];
      if (r) { B.appendChild(card(r, f.note)); any = true; }
    });
    if (!any) B.appendChild(el("p", { class: "dim", text: "Could not load projects. See github.com/" + c.github }));
  }).catch(function () { $("#all").appendChild(el("p", { class: "dim", text: "Could not load projects. See github.com/" + c.github })); });
})();
