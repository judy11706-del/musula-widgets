(function () {
  var script = document.currentScript;
  var base = script ? script.src.replace(/[^/]*$/, "") : "./";
  var MONTHS = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];

  var css = [
    ".mo{--mo-ink:#333;--mo-muted:#777;--mo-line:#e4dfe0;--mo-card:#fff;--mo-star:#f2b01e;font-family:'Lato 400 normal',Lato,'Helvetica Neue',Arial,sans-serif;color:var(--mo-ink);box-sizing:border-box;width:100%;position:relative}",
    ".mo *{box-sizing:border-box}",
    ".mo-head{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin:0 0 22px}",
    ".mo-score{display:flex;align-items:center;gap:12px}",
    ".mo-score b{font-family:'Tenor Sans 400 normal','Tenor Sans',Georgia,serif;font-weight:400;font-size:38px;line-height:1}",
    ".mo-score small{display:block;font-size:13px;color:var(--mo-muted);margin-top:4px}",
    ".mo-stars{color:var(--mo-star);letter-spacing:2px;font-size:16px;line-height:1}",
    ".mo-btn{font-family:'Montserrat 400 normal',Montserrat,Arial,sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#fff;background:#333;border-radius:4px;padding:13px 22px;text-decoration:none;white-space:nowrap;transition:background .2s}",
    ".mo-btn:hover{background:#555}",
    ".mo-track{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none;padding:4px 2px 8px}",
    ".mo-track::-webkit-scrollbar{display:none}",
    ".mo-card{flex:0 0 calc((100% - 40px)/3);scroll-snap-align:start;background:var(--mo-card);border:1px solid var(--mo-line);border-radius:14px;padding:26px 24px 22px;display:flex;flex-direction:column;min-height:270px}",
    "@media (max-width:999px){.mo-card{flex-basis:calc((100% - 20px)/2)}}",
    "@media (max-width:639px){.mo-card{flex-basis:88%}.mo-head{flex-direction:column;text-align:center}.mo-score{flex-direction:column;gap:8px}}",
    ".mo-quote{font-family:'Tenor Sans 400 normal','Tenor Sans',Georgia,serif;font-size:54px;line-height:.6;height:26px;color:#333}",
    ".mo-text{font-size:15px;line-height:1.6;margin:12px 0 0;display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden;white-space:pre-line}",
    ".mo-card.mo-open .mo-text{-webkit-line-clamp:unset;display:block}",
    ".mo-more{background:none;border:0;padding:0;margin-top:8px;font:inherit;font-size:13px;color:var(--mo-muted);text-decoration:underline;cursor:pointer;align-self:flex-start}",
    ".mo-who{display:flex;align-items:center;gap:12px;margin-top:auto;padding-top:18px}",
    ".mo-who img,.mo-who span.mo-ini{width:40px;height:40px;border-radius:50%;flex:0 0 40px;object-fit:cover;background:#efebec;display:flex;align-items:center;justify-content:center;font-size:16px;color:#333}",
    ".mo-who strong{display:block;font-weight:400;font-size:14px}",
    ".mo-who small{display:block;font-size:12px;color:var(--mo-muted)}",
    ".mo-g{margin-left:auto;width:20px;height:20px;flex:0 0 20px}",
    ".mo-nav{display:flex;justify-content:center;align-items:center;gap:14px;margin-top:18px}",
    ".mo-arrow{width:38px;height:38px;border-radius:50%;border:1px solid var(--mo-line);background:#fff;color:#333;cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center}",
    ".mo-arrow:hover{border-color:#333}",
    ".mo-count{font-size:12px;letter-spacing:2px;color:var(--mo-muted);min-width:70px;text-align:center}"
  ].join("");

  var G =
    '<svg class="mo-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/><path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.2-8.5 2.2-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function stars(n) {
    var r = Math.round(n);
    return "★★★★★".slice(0, r) + "☆☆☆☆☆".slice(0, 5 - r);
  }
  function fmtDate(ms) {
    if (!ms) return "";
    var d = new Date(ms);
    return MONTHS[d.getMonth()] + " " + d.getFullYear();
  }
  function plural(n) {
    if (n === 1) return "opinia";
    var t = n % 10, h = n % 100;
    return t >= 2 && t <= 4 && (h < 12 || h > 14) ? "opinie" : "opinii";
  }

  function render(el, data) {
    var reviews = data.reviews.filter(function (r) { return r.rating >= 4 && r.text; });
    var cards = reviews.map(function (r) {
      var avatar = r.avatar
        ? '<img src="' + esc(r.avatar) + '" alt="" loading="lazy" referrerpolicy="no-referrer">'
        : '<span class="mo-ini">' + esc(r.name.charAt(0)) + "</span>";
      return (
        '<article class="mo-card">' +
        '<div class="mo-quote">”</div>' +
        '<div class="mo-stars" aria-label="Ocena ' + r.rating + ' na 5">' + stars(r.rating) + "</div>" +
        '<p class="mo-text">' + esc(r.text) + "</p>" +
        '<button class="mo-more" type="button" hidden>Czytaj więcej</button>' +
        '<div class="mo-who">' + avatar + "<div><strong>" + esc(r.name) + "</strong><small>" + fmtDate(r.date) + "</small></div>" + G + "</div>" +
        "</article>"
      );
    }).join("");

    el.innerHTML =
      '<div class="mo">' +
      '<div class="mo-head"><div class="mo-score"><b>' + data.average.toFixed(1).replace(".", ",") + '</b><div><div class="mo-stars">' + stars(data.average) +
      "</div><small>" + data.total + " " + plural(data.total) + " w Google</small></div></div>" +
      '<a class="mo-btn" href="' + esc(data.reviewUrl) + '" target="_blank" rel="noopener">Wystaw opinię</a></div>' +
      '<div class="mo-track" tabindex="0" aria-label="Opinie klientów">' + cards + "</div>" +
      '<div class="mo-nav"><button class="mo-arrow mo-prev" type="button" aria-label="Poprzednie">‹</button><span class="mo-count"></span><button class="mo-arrow mo-next" type="button" aria-label="Następne">›</button></div>' +
      "</div>";

    var track = el.querySelector(".mo-track");
    var count = el.querySelector(".mo-count");

    el.querySelectorAll(".mo-card").forEach(function (card) {
      var text = card.querySelector(".mo-text");
      var more = card.querySelector(".mo-more");
      if (text.scrollHeight > text.clientHeight + 2) more.hidden = false;
      more.addEventListener("click", function () {
        var open = card.classList.toggle("mo-open");
        more.textContent = open ? "Zwiń" : "Czytaj więcej";
      });
    });

    function step() {
      var card = track.querySelector(".mo-card");
      return card ? card.offsetWidth + 20 : track.clientWidth;
    }
    function update() {
      var s = step();
      var first = Math.round(track.scrollLeft / s) + 1;
      var visible = Math.max(1, Math.round(track.clientWidth / s));
      var last = Math.min(first + visible - 1, reviews.length);
      count.textContent = (last > first ? first + "–" + last : first) + " / " + reviews.length;
    }
    function go(dir) {
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
      if (dir > 0 && atEnd) track.scrollTo({ left: 0 });
      else track.scrollBy({ left: dir * step() });
    }
    el.querySelector(".mo-prev").addEventListener("click", function () { go(-1); });
    el.querySelector(".mo-next").addEventListener("click", function () { go(1); });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(update); });
    window.addEventListener("resize", update);
    update();

    var paused = false;
    ["mouseenter", "focusin", "touchstart"].forEach(function (e) { el.addEventListener(e, function () { paused = true; }, { passive: true }); });
    ["mouseleave", "focusout"].forEach(function (e) { el.addEventListener(e, function () { paused = false; }); });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInterval(function () { if (!paused && !document.hidden) go(1); }, 6000);
    }
  }

  function init() {
    var targets = document.querySelectorAll("#musula-opinie,[data-musula-opinie]");
    if (!targets.length) return;
    if (!document.getElementById("mo-style")) {
      var st = document.createElement("style");
      st.id = "mo-style";
      st.textContent = css;
      document.head.appendChild(st);
    }
    fetch(base + "data/opinie.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (data) { targets.forEach(function (el) { render(el, data); }); })
      .catch(function () {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
