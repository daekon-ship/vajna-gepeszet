# DAEKON — DESIGN DECISIONS — VAJNA GÉPÉSZET

## Pozicionálás
Prémium mérnöki/műszaki márka. A "vízszerelő + kék + csavarkulcs" klisé tiltott.
Cél-asztal: prémium architecture studio + svájci industrial brand + épületgépészeti
mérnöki iroda. A gépészet mint PRECÍZ MÉRNÖKI MUNKA jelenik meg.

## Szín
- Grafit alap: #0E0E0C (page), #141412 (panel), #1B1B18 (emelt felület)
- Törtfehér: #EDEAE3 (szöveg/felületek), hullámos értékek opacitásban
- Akcent: #C96F3B oxidált réz (hover, szám-utótag, kiemelt aláhúzás), 5–10% felhasználás
- Hairline rendszer: 1px rgba(237,234,227,.14) vonalak a kártyák helyett

## Tipográfia
- Archivo Variable (wght 100–900, latin-ext): headline condensed hangulatban
  (szűk tracking, 0.94–0.98 line-height), nagy méretek clamp()-tel (40–136px)
- IBM Plex Mono (400/500, latin-ext): mikro-címkék, sorszámok, koordináták,
  trust strip, technische Notizen (pl. "BUDAPEST / HU — MECHANICAL SERVICES")
- Nem minden uppercase: editorial kontraszt — nagy condensed headline vs.
  apró mono címke vs. normál case body

## Kompozíció
- 12 oszlopos aszimmetrikus editorial grid, nagy negatív terek
- Hero: teljes viewport cinematic kompozíció, vertikális mono edge-label,
  alsó trust strip hairline-okkal (nem stat-kártyák)
- Service index: full-width sorok, nagy sorszám + név, hover-re jobb oldali
  kép-panel váltás (desktop), mobilon teljes szélességű vizuális blokk
- Garancia: plakátszerű 05 ÉV blokk, háttérben finom SVG blueprint-rács
- Munkák: editorial gallery (óriás / kettő kisebb / full-width / vertikális)
- Folyamat: horizontális 5 lépés, óriás mono számok, hairline oszlopok
- Budapest: stilizált SVG Duna-vonal háttérben, nagyon visszafogott
- Záró CTA: viewport-széles telefonszám, hover reveal animációval

## Motion
- IntersectionObserver-es line/clip reveal-ek (translateY + clip-path),
  lassú cubic-bezier(0.16,1,0.3,1), prefers-reduced-motion tiszteletben
- Nincs bounce/parallax-overload/particle. Header: scroll után solid blur.

## Fotó stratégia
- Nincs valódi ügyfélfotó → UI-szintű "reference slot" blokkok (SVG textúra +
  mono felirat), a layout valódi fotókat vár: img/services/*.jpg, img/work/*.jpg
- A <figure> struktúrák, aspect ratio-k és object-positionök készen állnak.

## Tiltott elemek ellenőrzőlistája
Kártyaerdő, gradient blob, glassmorphism, pill-gombok, hamis értékelések,
Lucide-ikon sorok, "Why choose us", szimmetrikus szekcióismétlés — mindegyik tiltva.
