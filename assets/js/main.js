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
          el.style.transitionDelay = (Math.min(Math.max(idx, 0), 6) * 0.06) + "s";
        }
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -4% 0px" });
    targets.forEach(t => io.observe(t));
  }

  /* ---------- Szolgáltatás index: fix oldalsáv kép-váltó ---------- */
  const stage = $("#svcStage");
  const stageCap = $("#svcStageCap");
  const rows = $$(".svc-row[data-img]");
  const NICE = { viz: "VÍZ", gaz: "GÁZ", futes: "FŰTÉS", klima: "KLÍMA", csatorna: "CSATORNA" };

  if (stage && rows.length) {
    const layers = new Map();
    rows.forEach(row => {
      const div = document.createElement("div");
      div.className = "im";
      div.style.backgroundImage = `url("${row.dataset.img}")`;
      stage.appendChild(div);
      layers.set(row, div);
    });
    const show = (row) => {
      stage.classList.add("on");
      layers.forEach((el, r) => el.classList.toggle("on", r === row));
      if (stageCap) {
        const key = Object.keys(NICE).find(k => row.dataset.img.includes("/" + k + "."));
        stageCap.textContent = key ? NICE[key] + " — RÉSZLET" : "GÉPÉSZET — RÉSZLET";
        stageCap.classList.add("cap-on");
      }
    };
    const hide = () => {
      stage.classList.remove("on");
      layers.forEach(el => el.classList.remove("on"));
      if (stageCap) {
        stageCap.textContent = "VÁLASZON EGY SOR";
        stageCap.classList.remove("cap-on");
      }
    };
    if (window.matchMedia("(hover: hover)").matches) {
      rows.forEach(row => {
        row.addEventListener("mouseenter", () => show(row));
        row.addEventListener("focusin", () => show(row));
      });
      $("#svcIndex").addEventListener("mouseleave", hide);
    } else {
      // érintőképernyő: a sticky panel az első képet mutatja alapból
      show(rows[0]);
    }
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
        const wrapEl = input.closest(".cfield");
        const good = input.value.trim().length > (n === "name" ? 1 : 3);
        wrapEl.classList.toggle("err", !good);
        if (!good) ok = false;
      });
      if (!ok) {
        state.textContent = "KÉREM TÖLTSE KI A KÖTELEZŐ MEZŐKET";
        return;
      }
      const data = new FormData(form);
      const body = [
        `Név: ${data.get("name")}`,
        `Telefon: ${data.get("phone")}`,
        `Munka: ${data.get("work")}`,
        `Üzenet: ${data.get("message") || "—"}`
      ].join("\n");
      const href = `mailto:vajnagepeszet@gmail.com?subject=${encodeURIComponent("Ajánlatkérés — weboldal")}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      state.textContent = "AZ E-MAIL KLIENS MEGNYÍLIK — HA NEM TÖRTÉNIK SEMMI, HÍVJON TELEFONON";
      form.reset();
    });
  }

  /* ---------- Biztonsági háló: lazy képek, amelyek nem léptek viewportba ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => {
      Array.from(document.images).forEach(img => {
        if (!img.complete || img.naturalWidth === 0) {
          img.loading = "eager";
        }
      });
    }, 1200);
  });

  /* ---------- Év ---------- */
  $("#year").textContent = String(new Date().getFullYear());
})();
