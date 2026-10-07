// Blog archive page: lists every post, newest first.
(function () {
  var c = window.SITE, $ = function (s) { return document.querySelector(s); };
  function el(t, a, k) {
    var e = document.createElement(t);
    if (a) for (var x in a) { if (x === "text") e.textContent = a[x]; else e.setAttribute(x, a[x]); }
    (k || []).forEach(function (n) { if (n) e.appendChild(n); });
    return e;
  }
  document.title = "Blog | " + c.name;
  $("#brand").textContent = c.name.split(" ")[0].toLowerCase();
  fetch("posts/index.json").then(function (r) { return r.json(); }).then(function (p) {
    var B = $("#all");
    if (!p.length) { B.appendChild(el("p", { class: "dim", text: "No posts yet." })); return; }
    p.forEach(function (x) {
      var h = el("h3", null, [el("a", { href: "post.html?p=" + encodeURIComponent(x.slug), text: x.title })]);
      if (x.date) h.appendChild(el("span", { class: "tag", text: x.date }));
      B.appendChild(el("div", { class: "item" }, [h, el("p", { text: x.summary || "" })]));
    });
  }).catch(function () { $("#all").appendChild(el("p", { class: "dim", text: "No posts yet." })); });
})();
