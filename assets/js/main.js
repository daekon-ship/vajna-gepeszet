/* VAJNA GÉPÉSZET — interakciók */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header állapot ---------- */
  const head = $("#siteHead");
  const onScroll = () => head.classList.toggle("solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobil menü ---------- */
  const burger = $("#burger");
  const menu = $("#mobileMenu");
  const setMenu = (open) => {
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Menü bezárása" : "Menü megnyitása");
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add("open"));
      document.body.style.overflow = "hidden";
    } else {
      menu.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => { menu.hidden = true; }, 520);
    }
  };
  burger.addEventListener("click", () => setMenu(!burger.classList.contains("open")));
  $$(".mmenu-nav a, .mmenu-tel", menu).forEach(a =>
    a.addEventListener("click", () => setMenu(false))
  );
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && burger.classList.contains("open")) setMenu(false);
  });

  /* ---------- Reveal: vonalak, fade-ek, folyamat-lépések ---------- */
  const targets = $$(".reveal-line, .reveal-fade, .proc-step");
  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach(t => t.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        if (el.parentElement) {
          const idx = Array.from(el.parentElement.children).indexOf(el);
          el.style.transitionDelay = (Math.min(Math.max(idx, 0), 6) * 0.09) + "s";
        }
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(t => io.observe(t));
  }

  /* ---------- Szolgáltatás index: hover stage ---------- */
  const stage = $("#svcStage");
  const rows = $$(".svc-row");
  const coarse = window.matchMedia("(hover: none)").matches;
  if (stage && rows.length && !coarse) {
    const layers = new Map();
    rows.forEach(row => {
      const webp = row.dataset.img, jpg = row.dataset.jpg;
      const div = document.createElement("div");
      div.className = "im";
      // A stage elem csak díszítő (aria-hidden), WebP elég; <picture> fallback nem szükséges.
      div.style.backgroundImage = `url("${webp}")`;
      stage.appendChild(div);
      layers.set(row, div);
    });
    let active = null;
    const show = (row) => {
      stage.classList.add("on");
      layers.forEach((el, r) => el.classList.toggle("on", r === row));
      active = row;
    };
    rows.forEach(row => {
      row.addEventListener("mouseenter", () => show(row));
      row.addEventListener("focusin", () => show(row));
    });
    $("#svcIndex").addEventListener("mouseleave", () => {
      stage.classList.remove("on");
      active = null;
    });
  }

  /* ---------- Űrlap ---------- */
  const form = $("#cform");
  if (form) {
    const state = $("#formState");
    const fields = ["name", "phone", "work"];
    form.addEventListener("submit", e => {
      e.preventDefault();
      let ok = true;
      fields.forEach(n => {
        const input = form.elements[n];
        const wrap = input.closest(".cfield");
        const good = input.value.trim().length > (n === "name" ? 1 : 3);
        wrap.classList.toggle("err", !good);
        if (!good) ok = false;
      });
      if (!ok) {
        state.textContent = "KÉREM TÖLTSE KI A KÖTELEZŐ MEZŐKET";
        return;
      }
      // mailto összeállítás — nincs backend, az ügyfél e-mail kliense nyílik
      const data = new FormData(form);
      const body = [
        `Név: ${data.get("name")}`,
        `Telefon: ${data.get("phone")}`,
        `Munka: ${data.get("work")}`,
        `Üzenet: ${data.get("message") || "—"}`
      ].join("\n");
      const mail = "vajnagepeszet@gmail.com";
      const href = `mailto:${mail}?subject=${encodeURIComponent("Ajánlatkérés — weboldal")}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      state.textContent = "AZ E-MAIL KLIENS MEGNYÍLIK — HA NEM TÖRTÉNIK SEMMI, HÍVJON TELEFONON";
      form.reset();
    });
  }

  /* ---------- Biztonsági háló: lazy képek, amelyek soha nem léptek a viewportba ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => {
      Array.from(document.images).forEach(img => {
        if (!img.complete || img.naturalWidth === 0) {
          const r = img.getBoundingClientRect();
          if (r.height === 0 || !img.currentSrc) {
            img.loading = "eager";
          }
        }
      });
    }, 1200);
  });

  /* ---------- Év ---------- */
  $("#year").textContent = String(new Date().getFullYear());
})();
