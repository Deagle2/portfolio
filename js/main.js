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
  $("#name").textContent = c.name;
  $("#tag").textContent = c.tagline;
  c.about.forEach(function (t) { $("#about-body").appendChild(el("p", { text: t })); });
  $("#about-body").appendChild(el("p", { class: "dim", text: "Tools: " + c.skills }));
  var ct = $("#contact-body");
  // Contact rows with inlined Lucide icons (ISC licensed, no extra fetch).
  var ICON = function (inner) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + "</svg>";
  };
  var ICONS = {
    github: ICON('<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>'),
    linkedin: ICON('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>'),
    mail: ICON('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
    file: ICON('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>')
  };
  function row(icon, a) {
    var s = document.createElement("span");
    s.className = "ic"; s.innerHTML = ICONS[icon];
    return el("p", { class: "contact-row" }, [s, a]);
  }
  ct.appendChild(row("github", link("https://github.com/" + c.github, "github.com/" + c.github)));
  ct.appendChild(row("linkedin", link(c.linkedin, "linkedin.com/in/nathan-mathew")));
  if (c.email) ct.appendChild(row("mail", el("a", { href: "mailto:" + c.email, text: c.email })));
  if (c.resume) ct.appendChild(row("file", link(c.resume, "Resume (PDF)")));
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
    return el("div", { class: "item" }, [h, el("p", { text: note || r.description || "" })]);
  }
  repos().then(function (all) {
    var pub = all.filter(function (r) { return !r.private; });
    var by = {}; pub.forEach(function (r) { by[r.name] = r; });
    var F = $("#featured"), shown = {}, order = [];
    c.featured.forEach(function (f) { var r = by[f.repo]; if (r) { order.push({ r: r, note: f.note }); shown[r.name] = 1; } });
    // Home shows the first few; the full list lives on projects.html
    var n = Math.min(order.length, c.projectsOnHome || 3);
    order.slice(0, n).forEach(function (x) { F.appendChild(card(x.r, x.note)); });
    if (order.length > n) F.appendChild(el("p", null, [el("a", { href: "projects.html", text: "all projects (" + order.length + ") →" })]));
    var rest = pub.filter(function (r) {
      return !shown[r.name] && !r.archived && (c.showForks || !r.fork) && c.hideRepos.indexOf(r.name) < 0;
    });
    // Plug-and-play: js/config.js -> showOthers. False = featured repos only.
    if (c.showOthers !== false && rest.length) {
      var d = el("details", null, [el("summary", { text: "other public repos (" + rest.length + ")" })]);
      rest.forEach(function (r) { d.appendChild(card(r)); });
      $("#more").appendChild(d);
    }
  }).catch(function () { $("#featured").appendChild(el("p", { class: "dim", text: "Could not load projects. See github.com/" + c.github })); });

  // Gallery lives on gallery.html now (js/gallery.js), so the home page stays
  // uncrowded. The pause flag below is set there when an embed opens.

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
