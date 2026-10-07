(function () {
  var c = window.SITE, $ = function (s) { return document.querySelector(s); };
  function el(t, a, k) {
    var e = document.createElement(t);
    if (a) for (var x in a) { if (x === "text") e.textContent = a[x]; else e.setAttribute(x, a[x]); }
    (k || []).forEach(function (n) { if (n) e.appendChild(n); });
    return e;
  }
  function link(h, t) { return el("a", { href: h, text: t, target: "_blank", rel: "noopener" }); }
  document.title = c.name + " | Digital Design";
  $("#brand").textContent = c.name.split(" ")[0].toLowerCase();
  $("#name").textContent = c.name;
  $("#tag").textContent = c.tagline;
  c.about.forEach(function (t) { $("#about-body").appendChild(el("p", { text: t })); });
  $("#about-body").appendChild(el("p", { class: "dim", text: "Tools: " + c.skills }));
  var ct = $("#contact-body");
  ct.appendChild(el("p", null, [link("https://github.com/" + c.github, "github.com/" + c.github)]));
  ct.appendChild(el("p", null, [link(c.linkedin, "linkedin.com/in/nathan-mathew")]));
  if (c.email) ct.appendChild(el("p", null, [el("a", { href: "mailto:" + c.email, text: c.email })]));
  if (c.resume) ct.appendChild(el("p", null, [link(c.resume, "Resume (PDF)")]));
  $("#year").textContent = new Date().getFullYear() + " " + c.name;

  // Projects: live from GitHub API (public repos only), fallback to data/projects.json
  function repos() {
    var K = "repos-v1";
    try { var s = JSON.parse(sessionStorage.getItem(K)); if (s && Date.now() - s.t < 36e5) return Promise.resolve(s.d); } catch (e) {}
    return fetch("https://api.github.com/users/" + c.github + "/repos?per_page=100&sort=updated")
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { try { sessionStorage.setItem(K, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {} return d; })
      .catch(function () { return fetch("data/projects.json").then(function (r) { return r.json(); }); });
  }
  function card(r, note) {
    var h = el("h3", null, [link(r.html_url, r.name)]);
    if (r.language) h.appendChild(el("span", { class: "tag", text: r.language }));
    if (r.stargazers_count) h.appendChild(el("span", { class: "tag", text: "\u2605 " + r.stargazers_count }));
    return el("div", { class: "item" }, [h, el("p", { text: note || r.description || "" })]);
  }
  repos().then(function (all) {
    var pub = all.filter(function (r) { return !r.private; });
    var by = {}; pub.forEach(function (r) { by[r.name] = r; });
    var F = $("#featured"), shown = {};
    c.featured.forEach(function (f) { var r = by[f.repo]; if (r) { F.appendChild(card(r, f.note)); shown[r.name] = 1; } });
    var rest = pub.filter(function (r) {
      return !shown[r.name] && !r.archived && (c.showForks || !r.fork) && c.hideRepos.indexOf(r.name) < 0;
    });
    if (rest.length) {
      var d = el("details", null, [el("summary", { text: "other public repos (" + rest.length + ")" })]);
      rest.forEach(function (r) { d.appendChild(card(r)); });
      $("#more").appendChild(d);
    }
  }).catch(function () { $("#featured").appendChild(el("p", { class: "dim", text: "Could not load projects. See github.com/" + c.github })); });

  // Gallery: click-to-load Luma embeds (keeps WebGL and bandwidth idle until asked)
  (c.gallery || []).forEach(function (g) {
    var box = el("div", { class: "frame" });
    var b = el("button", { class: "load", text: "load 3D: " + g.title });
    b.onclick = function () {
      var f = el("iframe", { src: g.src, title: g.title, allow: "fullscreen; xr-spatial-tracking", loading: "lazy", referrerpolicy: "no-referrer" });
      box.textContent = ""; box.appendChild(f); window.__bgPause = true;
    };
    box.appendChild(b); $("#gal").appendChild(box);
    $("#gal").appendChild(el("p", { class: "dim", text: g.title + ". Hosted on Luma. Background relight pauses while it runs." }));
  });

  // Blog index: latest few on the home page, the full archive lives on blog.html
  fetch("posts/index.json").then(function (r) { return r.json(); }).then(function (p) {
    var B = $("#posts");
    if (!p.length) { B.appendChild(el("p", { class: "dim", text: "No posts yet." })); return; }
    var n = Math.min(p.length, c.postsOnHome || 3);
    p.slice(0, n).forEach(function (x) {
      var h = el("h3", null, [el("a", { href: "post.html?p=" + encodeURIComponent(x.slug), text: x.title })]);
      if (x.date) h.appendChild(el("span", { class: "tag", text: x.date }));
      B.appendChild(el("div", { class: "item" }, [h, el("p", { text: x.summary || "" })]));
    });
    if (p.length > n) B.appendChild(el("p", null, [el("a", { href: "blog.html", text: "all posts (" + p.length + ") →" })]));
  }).catch(function () { $("#posts").appendChild(el("p", { class: "dim", text: "No posts yet." })); });
})();
