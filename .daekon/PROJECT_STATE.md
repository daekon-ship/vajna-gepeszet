# VAJNA GÉPÉSZET — PROJECT STATE

## Current goal
Ultra-prémium, art-directed egylapos (és mini jogi oldalak) weboldal a VAJNA GÉPÉSZET
(Vajna János, víz–gáz–fűtésszerelés, klíma, légtechnika, Budapest) számára.
Cél: nemzetközi showcase szintű, characteres prémium megjelenés — nem "szerelős sablon".

## Tech decisions
- Statikus, build-mentes: egyetlen `index.html` + `assets/css/style.css` + `assets/js/main.js`.
  Ok: egyszerű üzemeltetés, max sebesség, nincs függőség.
- Fontok: Archivo (variable, latin-ext) — condensed grotesk headline + body;
  IBM Plex Mono (latin-ext) — mikro-tipográfia, sorszámok, műszaki jelölések.
  Lokálisan self-hosted (assets/fonts), preloaded, font-display: swap.
- Színpaletta: #0E0E0C / #141412 grafítok, #EDEAE3 törtfehér, #C96F3B oxidált réz akcent (5–10%).
- Designrendszer: editorial grid, hairline vonalak (1px, rgba fehér 12–16%),
  nagy sorszámok, mono mikro-címkék, klamp()-es fluid típus.

## Completed work
- Teljes oldal elkészült és ELŐVÁ (live): https://daekon-ship.github.io/vajna-gepeszet/
- GitHub repo: https://github.com/daekon-ship/vajna-gepeszet (main, gh-pages élő)
- Fontok: Archivo var (wdth 62–125) + IBM Plex Mono 400/500, self-hosted latin/latin-ext
- Fotók: Pexels jelleg-képek film-grade-elve (Color .92, Contrast 1.06, Bright .97–.98)
- QA: desktop/tablet/mobil pass, overflow fixek, forma + menü + űrlap tesztelve

## Open tasks
- Valódi ügyfélfotók beszerzése → img/ csere (a layout készen fogadja őket)
- Jogi adatok pontosítása (adószám/székhely) ha szükséges
- Backend űrlap (Formspree) ha a mailto nem elég

## Blockers
- Valódi referenciafotók nincsenek → elegáns "reference slot" megoldás.

## Constraints
- Csak megerősített tények: 15+ év, 5 év garancia, felelősségbiztosítás, számla,
  Budapest ingyenes felmérés, tel: +36 20 416 1316, vajnagepeszet@gmail.com.
- TILOS: hamis vélemények, statisztikák, partnerek, 0–24 szolgáltatás.
- Footer credit: "Weboldal: DAEKON" → https://daekon.hu

## Next best action
Fontok letöltése, majd index.html felépítése.
