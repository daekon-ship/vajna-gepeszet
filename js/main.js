(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };

  // Év a láblécben
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  // Fejléc: görgetés után tömör háttér
  var hdr = $("#hdr");
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle("solid", window.scrollY > 24); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobil menü
  var mnav = $("#mnav"), open = $("#menuBtn"), close = $("#menuClose");
  function setMenu(v) {
    if (!mnav) return;
    mnav.classList.toggle("open", v);
    mnav.setAttribute("aria-hidden", v ? "false" : "true");
    if (open) open.setAttribute("aria-expanded", v ? "true" : "false");
    document.body.classList.toggle("menu-open", v);
    document.documentElement.style.overflow = v ? "hidden" : "";
  }
  if (open) open.addEventListener("click", function () { setMenu(true); if (close) close.focus(); });
  if (close) close.addEventListener("click", function () { setMenu(false); if (open) open.focus(); });
  if (mnav) mnav.querySelectorAll("[data-close]").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && mnav && mnav.classList.contains("open")) setMenu(false); });

  // Finom belépés (csak transform; a tartalom mindig látható)
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
    rv.forEach(function (el) { io.observe(el); });

    var steps = document.querySelectorAll(".step");
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("on", e.isIntersecting); });
    }, { rootMargin: "-40% 0px -40% 0px" });
    steps.forEach(function (s) { so.observe(s); });
  } else {
    rv.forEach(function (el) { el.classList.add("in"); });
  }

  // Telefonszám másolása
  var cb = $("#copyBtn");
  if (cb) cb.addEventListener("click", function () {
    var done = function () { cb.textContent = "Másolva"; setTimeout(function () { cb.textContent = "Szám másolása"; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText("+36 20 416 1316").then(done, function () {});
  });

  // Űrlap → előre kitöltött e-mail
  var form = $("#ajanlat"), st = $("#fStatus");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name, tel = form.elements.tel, ok = true;
    [name, tel].forEach(function (el) {
      var bad = !el.value.trim(); el.parentNode.classList.toggle("err", bad); if (bad) ok = false;
    });
    if (!ok) { st.textContent = "Kérem, adja meg a nevét és a telefonszámát."; (name.value.trim() ? tel : name).focus(); return; }
    var type = form.elements.type.value || "Egyéb";
    var body = "Név: " + name.value.trim() + "\nTelefon: " + tel.value.trim() + "\nMunka: " + type + "\n\n" + form.elements.msg.value.trim();
    window.location.href = "mailto:vajnagepeszet@gmail.com?subject=" + encodeURIComponent("Ajánlatkérés — " + type) + "&body=" + encodeURIComponent(body);
    st.textContent = "Megnyílt a levelezője. Ha nem, írjon a vajnagepeszet@gmail.com címre, vagy hívjon: +36 20 416 1316.";
  });
})();
