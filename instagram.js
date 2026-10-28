(function () {
  var script = document.currentScript;
  var base = script ? script.src.replace(/[^/]*$/, "") : "./";

  var css = [
    ".mi{font-family:'Lato 400 normal',Lato,'Helvetica Neue',Arial,sans-serif;color:#333;width:100%;box-sizing:border-box}",
    ".mi *{box-sizing:border-box}",
    ".mi-head{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin:0 0 20px}",
    ".mi-user{display:flex;align-items:center;gap:10px;font-family:'Montserrat 400 normal',Montserrat,Arial,sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#333;text-decoration:none}",
    ".mi-user svg{width:22px;height:22px}",
    ".mi-btn{font-family:'Montserrat 400 normal',Montserrat,Arial,sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#333;border:1px solid #333;border-radius:4px;padding:12px 20px;text-decoration:none;transition:background .2s,color .2s}",
    ".mi-btn:hover{background:#333;color:#fff}",
    ".mi-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}",
    "@media (max-width:999px){.mi-grid{grid-template-columns:repeat(3,1fr)}}",
    "@media (max-width:639px){.mi-grid{grid-template-columns:repeat(2,1fr);gap:8px}.mi-head{justify-content:center}}",
    ".mi-post{position:relative;display:block;aspect-ratio:4/5;overflow:hidden;border-radius:10px;background:#efebec}",
    ".mi-post img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}",
    ".mi-post:hover img{transform:scale(1.04)}",
    ".mi-post:after{content:'';position:absolute;inset:0;background:rgba(51,51,51,0);transition:background .3s}",
    ".mi-post:hover:after{background:rgba(51,51,51,.18)}",
    ".mi-play{position:absolute;top:10px;right:10px;width:26px;height:26px;z-index:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))}"
  ].join("");

  var IG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>';
  var PLAY =
    '<svg class="mi-play" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M8 5.5v13l10.5-6.5z"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function render(el, data) {
    var posts = data.posts.slice(0, 6).map(function (p) {
      return (
        '<a class="mi-post" href="' + esc(p.url) + '" target="_blank" rel="noopener" aria-label="' + esc(p.caption || "Post na Instagramie") + '">' +
        '<img src="' + esc(p.image) + '" alt="" loading="lazy">' + (p.isVideo ? PLAY : "") + "</a>"
      );
    }).join("");
    el.innerHTML =
      '<div class="mi"><div class="mi-head">' +
      '<a class="mi-user" href="' + esc(data.profileUrl) + '" target="_blank" rel="noopener">' + IG + "@" + esc(data.username) + "</a>" +
      '<a class="mi-btn" href="' + esc(data.profileUrl) + '" target="_blank" rel="noopener">Obserwuj</a></div>' +
      '<div class="mi-grid">' + posts + "</div></div>";
  }

  function init() {
    var targets = document.querySelectorAll("#musula-instagram,[data-musula-instagram]");
    if (!targets.length) return;
    if (!document.getElementById("mi-style")) {
      var st = document.createElement("style");
      st.id = "mi-style";
      st.textContent = css;
      document.head.appendChild(st);
    }
    fetch(base + "data/instagram.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (data) { if (data.posts && data.posts.length) targets.forEach(function (el) { render(el, data); }); })
      .catch(function () {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
