# QA LOG — VAJNA GÉPÉSZET

## Futtatások — 2026-10-07, live: https://daekon-ship.github.io/vajna-gepeszet/
- Desktop 1440px: — PASS (hero, service index hover stage, garancia, galéria, rólam, folyamat, Budapest, kapcsolat, footer)
- Tablet 768px: — PASS (burger aktív, nincs overflow)
- Mobil 390px: — PASS (2 overflow-bug javítva: contain:paint, min-width:0; nincs vízszintes scroll)
- Képek: 0 broken (minden webp+jpeg fallback betölt; lazy security net JS-ben)
- Mobil menü: nyit/zár ESC-sel, tel látszik — PASS
- Űrlap: üres submit → 3 hibajelölés; kitöltve → mailto összeállítás — PASS
- Footer credit DAEKON link — PASS; horizontal overflow minden viewporton — PASS
- Asset 200 OK mind (8/8); cold load ~0.22s (GitHub Pages)
- Screenshot motor: az app preview kép módja meghibásodott (nem projekt-hiba); DOM-szintű ellenőrzés helyettesítette.

## Ismert limitációk
- Fotók jelleg-képek (Pexels, szerzői jog szerint szabad felhasználású licenc) — valódi ügyfélfotók érkezésekor cserélendő.
- Az űrlap mailto-alapú (nincs backend). Megrendeléskor Formspree/Netlify Forms beillesztendő.
- Hotlink/CDN nincsen; minden self-hosted.
- Jogi oldalakon a székhely/adószág mező a tulajdonossal pontosítandó.

## Megjegyzések
- Fotók: ügyfélfotó várólista. A "reference slot" megoldás ideiglenes; valódi
  fotók érkezésekor csak a src + alt cserélendő.
