(function () {
  var $ = function (s) { return document.querySelector(s); };
  var slug = new URLSearchParams(location.search).get("p") || "";
  var box = $("#post");
  if (!/^[A-Za-z0-9_-]+$/.test(slug)) { box.textContent = "Post not found."; return; }
  fetch("posts/" + slug + ".md").then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (t) {
    var m = t.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/), meta = {};
    if (m) { m[1].split(/\r?\n/).forEach(function (l) { var i = l.indexOf(":"); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^["']|["']$/g, ""); }); t = t.slice(m[0].length); }
    document.title = (meta.title || slug) + " | " + window.SITE.name;
    var h = document.createElement("h1"); h.textContent = meta.title || slug;
    var d = document.createElement("p"); d.className = "dim"; d.textContent = meta.date || "";
    var body = document.createElement("div"); body.className = "md";
    body.innerHTML = DOMPurify.sanitize(marked.parse(t));
    [].forEach.call(body.querySelectorAll("a[href^='http']"), function (a) { a.target = "_blank"; a.rel = "noopener"; });
    box.textContent = ""; box.appendChild(h); box.appendChild(d); box.appendChild(body);
  }).catch(function () { box.textContent = "Post not found."; });
})();
