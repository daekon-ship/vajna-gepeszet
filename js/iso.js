/* Vajna Gépészet — saját, kódból rajzolt műszaki illusztrációk (izometria).
   Nincs fotó, nincs külső kép: minden SVG itt készül. */
(function () {
  "use strict";
  var C = Math.cos(Math.PI / 6);
  // anyagok: [kontúr, sötét, alap, fény, csúcsfény]
  var MAT = {
    cu:  ["#1f0f07", "#6e381c", "#a95c36", "#d0845a", "#f8cfae"],
    st:  ["#0d0e0f", "#383c40", "#5b6065", "#868c92", "#d9dee3"],
    bk:  ["#000000", "#141414", "#242424", "#363636", "#8a8a8a"],
    pvc: ["#1f2021", "#6a6d6f", "#8b8e90", "#aaadaf", "#eceded"],
    br:  ["#1f1505", "#73541b", "#a37d36", "#c9a456", "#f3dc9c"],
    wh:  ["#2a2926", "#b9b5ad", "#d3cfc7", "#e4e0d8", "#ffffff"],
    rd:  ["#1a0806", "#6a1d16", "#9b2f25", "#c04a3c", "#f0a196"]
  };
  var FACE = {
    wh: ["#e2ded6", "#c9c5bd", "#aeaaa2"],
    st: ["#7d8288", "#5d6166", "#43474b"],
    dk: ["#3a3c3e", "#2a2c2e", "#1e2021"]
  };
  function f(n) { return Math.round(n * 10) / 10; }

  function Iso() {
    var L = [], b = [1e9, 1e9, -1e9, -1e9], uid = Math.random().toString(36).slice(2, 7);
    function P(x, y, z) { var X = (x - y) * C, Y = (x + y) * 0.5 - z; if (X < b[0]) b[0] = X; if (Y < b[1]) b[1] = Y; if (X > b[2]) b[2] = X; if (Y > b[3]) b[3] = Y; return [X, Y]; }
    function d(pts) { return "M" + pts.map(function (p) { var q = P(p[0], p[1], p[2]); return f(q[0]) + " " + f(q[1]); }).join("L"); }
    var a = {};
    a.floor = function (x0, x1, y0, y1, z, step, col) {
      var s = "", x, y;
      for (x = x0; x <= x1; x += step) s += d([[x, y0, z], [x, y1, z]]);
      for (y = y0; y <= y1; y += step) s += d([[x0, y, z], [x1, y, z]]);
      L.push('<path d="' + s + '" stroke="' + (col || "rgba(235,231,223,.07)") + '" stroke-width="1" fill="none"/>');
      return a;
    };
    a.pipe = function (pts, r, m, cap) {
      var M = MAT[m], p = d(pts), lc = cap || "round";
      L.push('<g fill="none" stroke-linejoin="round" stroke-linecap="' + lc + '">' +
        '<path d="' + p + '" stroke="' + M[0] + '" stroke-width="' + f(2 * r + 2) + '"/>' +
        '<path d="' + p + '" stroke="' + M[1] + '" stroke-width="' + f(2 * r) + '"/>' +
        '<path d="' + p + '" stroke="' + M[2] + '" stroke-width="' + f(r * 1.35) + '" transform="translate(' + f(-r * .12) + ' ' + f(-r * .16) + ')"/>' +
        '<path d="' + p + '" stroke="' + M[3] + '" stroke-width="' + f(r * .62) + '" transform="translate(' + f(-r * .3) + ' ' + f(-r * .38) + ')"/>' +
        '<path d="' + p + '" stroke="' + M[4] + '" stroke-width="' + f(Math.max(1, r * .2)) + '" opacity=".85" transform="translate(' + f(-r * .46) + ' ' + f(-r * .56) + ')"/>' +
        "</g>");
      return a;
    };
    a.band = function (p, dir, r, m, len, k) {
      len = len || r * 1.2; k = k || 1.28;
      a.pipe([[p[0] - dir[0] * len / 2, p[1] - dir[1] * len / 2, p[2] - dir[2] * len / 2], [p[0] + dir[0] * len / 2, p[1] + dir[1] * len / 2, p[2] + dir[2] * len / 2]], r * k, m, "butt");
      return a;
    };
    a.valve = function (p, dir, r, handle, hdir, body) {
      body = body || "br";
      a.band(p, dir, r, body, r * 3.4, 1.55);
      a.band([p[0] - dir[0] * r * 2, p[1] - dir[1] * r * 2, p[2] - dir[2] * r * 2], dir, r, body, r * .9, 1.3);
      a.band([p[0] + dir[0] * r * 2, p[1] + dir[1] * r * 2, p[2] + dir[2] * r * 2], dir, r, body, r * .9, 1.3);
      var h = r * 2.1, top = [p[0], p[1], p[2] + h], len = 30 + r;
      var end = [top[0] + hdir[0] * len, top[1] + hdir[1] * len, top[2] + hdir[2] * len];
      L.push('<path d="' + d([p, top]) + '" stroke="#2a2a2a" stroke-width="4" stroke-linecap="round"/>');
      L.push('<path d="' + d([top, end]) + '" stroke="#111" stroke-width="9" stroke-linecap="round"/>');
      L.push('<path d="' + d([top, end]) + '" stroke="' + handle + '" stroke-width="6.5" stroke-linecap="round"/>');
      return a;
    };
    a.gauge = function (p, h, R) {
      R = R || 13;
      a.pipe([p, [p[0], p[1], p[2] + h]], 2.6, "st");
      var c = P(p[0], p[1], p[2] + h + R * .9);
      L.push('<circle cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="' + (R + 2.5) + '" fill="#4a4e52" stroke="#0d0e0f"/>' +
        '<circle cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="' + R + '" fill="#ece8df"/>' +
        '<path d="M' + f(c[0]) + " " + f(c[1]) + "l" + f(R * .55) + " " + f(-R * .5) + '" stroke="#b8352b" stroke-width="1.6" stroke-linecap="round"/>' +
        '<circle cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="1.6" fill="#222"/>');
      return a;
    };
    a.box = function (x, y, z, dx, dy, dz, fc) {
      var F = FACE[fc] || fc, s = ' stroke="#0f0f0e" stroke-width=".8" stroke-linejoin="round"';
      L.push('<path d="' + d([[x, y, z + dz], [x + dx, y, z + dz], [x + dx, y + dy, z + dz], [x, y + dy, z + dz]]) + 'Z" fill="' + F[0] + '"' + s + "/>");
      L.push('<path d="' + d([[x, y + dy, z], [x + dx, y + dy, z], [x + dx, y + dy, z + dz], [x, y + dy, z + dz]]) + 'Z" fill="' + F[1] + '"' + s + "/>");
      L.push('<path d="' + d([[x + dx, y, z], [x + dx, y + dy, z], [x + dx, y + dy, z + dz], [x + dx, y, z + dz]]) + 'Z" fill="' + F[2] + '"' + s + "/>");
      return a;
    };
    a.line = function (pts, col, w, extra) {
      L.push('<path d="' + d(pts) + '" stroke="' + col + '" stroke-width="' + (w || 1) + '" fill="none" stroke-linecap="round"' + (extra || "") + "/>");
      return a;
    };
    a.cyl = function (x, y, z0, z1, r, m) {
      var M = MAT[m], cb = P(x, y, z0), ct = P(x, y, z1), rx = 1.2247 * r, ry = 0.7071 * r, gid = "g" + uid + m;
      if (!a["_" + m]) {
        a["_" + m] = 1;
        L.unshift('<defs><linearGradient id="' + gid + '" x1="0" x2="1"><stop offset="0" stop-color="' + M[1] + '"/><stop offset=".3" stop-color="' + M[3] + '"/><stop offset=".45" stop-color="' + M[4] + '" stop-opacity=".9"/><stop offset=".62" stop-color="' + M[2] + '"/><stop offset="1" stop-color="' + M[0] + '"/></linearGradient></defs>');
      }
      P(x - r, y + r, z0); P(x + r, y - r, z1);
      L.push('<path d="M' + f(cb[0] - rx) + " " + f(cb[1]) + "L" + f(ct[0] - rx) + " " + f(ct[1]) + "L" + f(ct[0] + rx) + " " + f(ct[1]) + "L" + f(cb[0] + rx) + " " + f(cb[1]) + "A" + f(rx) + " " + f(ry) + " 0 0 1 " + f(cb[0] - rx) + " " + f(cb[1]) + 'Z" fill="url(#' + gid + ')" stroke="' + M[0] + '" stroke-width=".8"/>');
      L.push('<ellipse cx="' + f(ct[0]) + '" cy="' + f(ct[1]) + '" rx="' + f(rx) + '" ry="' + f(ry) + '" fill="' + M[3] + '" stroke="' + M[0] + '" stroke-width=".8"/>');
      return a;
    };
    a.label = function (p, dx, dy, txt) {
      var q = P(p[0], p[1], p[2]), ex = q[0] + dx, ey = q[1] + dy, dir = dx >= 0 ? 1 : -1;
      L.push('<circle cx="' + f(q[0]) + '" cy="' + f(q[1]) + '" r="2" fill="rgba(235,231,223,.7)"/><path d="M' + f(q[0]) + " " + f(q[1]) + "L" + f(ex) + " " + f(ey) + "h" + dir * 26 + '" stroke="rgba(235,231,223,.45)" fill="none"/>' +
        '<text x="' + f(ex + dir * 32) + '" y="' + f(ey + 3.5) + '" text-anchor="' + (dir > 0 ? "start" : "end") + '" fill="rgba(235,231,223,.62)" font-size="9.5" font-family="IBM Plex Mono,monospace" letter-spacing="1.2">' + txt + "</text>");
      if (ex + dir * 150 > b[2]) b[2] = ex + dir * 150; if (ex + dir * 150 < b[0]) b[0] = ex + dir * 150;
      return a;
    };
    a.svg = function (pad) {
      pad = pad || 14;
      var x = b[0] - pad, y = b[1] - pad, w = b[2] - b[0] + 2 * pad, h = b[3] - b[1] + 2 * pad;
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + f(x) + " " + f(y) + " " + f(w) + " " + f(h) + '" preserveAspectRatio="xMidYMid meet" focusable="false">' + L.join("") + "</svg>";
    };
    return a;
  }

  var RED = "#b8352b", BLUE = "#2f5f93", YEL = "#d9a619";
  var X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];

  var SCENES = {
    hero: function (thumb) {
      var s = Iso();
      s.floor(-320, 440, -160, 300, 0, 40);
      // tágulási tartály + bekötés
      s.pipe([[-30, -5, 40], [-30, -100, 40], [-30, -100, 70]], 6, "cu");
      s.cyl(-30, -100, 70, 230, 36, "rd");
      s.cyl(-30, -100, 230, 240, 8, "st");
      // kazán
      s.box(-300, -60, 150, 160, 80, 240, "wh");
      s.box(-270, 20, 330, 90, 1, 34, "dk");
      s.line([[-262, 21, 344], [-205, 21, 344]], "#c8774a", 2);
      s.line([[-262, 21, 352], [-230, 21, 352]], "rgba(235,231,223,.5)", 1.5);
      s.box(-300, -60, 150, 160, 80, 6, "st");
      // füstcső
      s.cyl(-220, -20, 390, 470, 22, "st");
      // visszatérő gerinc
      s.pipe([[-250, -5, 150], [-250, -5, 40], [400, -5, 40]], 11, "cu");
      // előremenő gerinc
      s.pipe([[-180, -5, 150], [-180, -5, 120], [400, -5, 120]], 11, "cu");
      // szivattyú a visszatérőn
      s.band([-80, -5, 40], X, 11, "st", 34, 1.5);
      s.cyl(-80, -5, 52, 96, 19, "st");
      s.cyl(-80, -5, 96, 102, 13, "bk");
      // manométer
      s.gauge([-130, -5, 131], 46, 14);
      // leágazások
      [70, 160, 250, 340].forEach(function (x) {
        s.pipe([[x + 34, -5, 40], [x + 34, 250, 40]], 8, "cu");
        s.band([x + 34, 6, 40], Y, 8, "cu", 9, 1.35);
        s.valve([x + 34, 150, 40], Y, 8, BLUE, X);
      });
      [70, 160, 250, 340].forEach(function (x) {
        s.pipe([[x, -5, 120], [x, 250, 120]], 8, "cu");
        s.band([x, 6, 120], Y, 8, "cu", 9, 1.35);
        s.valve([x, 105, 120], Y, 8, RED, X);
        s.band([x, 250, 120], Y, 8, "br", 10, 1.4);
      });
      [104, 194, 284, 374].forEach(function (x) { s.band([x, 250, 40], Y, 8, "br", 10, 1.4); });
      if (!thumb) {
        s.label([400, -5, 120], 30, -40, "ELŐREMENŐ  Ø28×1,5 Cu");
        s.label([400, -5, 40], 30, 26, "VISSZATÉRŐ  Ø28×1,5 Cu");
        s.label([0, -100, 190], 60, -40, "TÁGULÁSI TARTÁLY");
        s.label([-80, -5, 90], -60, 60, "KERINGETŐ SZIVATTYÚ");
        s.label([-220, 20, 300], -70, 10, "KAZÁN");
      }
      return s.svg();
    },
    viz: function () {
      var s = Iso();
      s.floor(-160, 160, -80, 160, -20, 40);
      s.pipe([[-170, 0, 30], [170, 0, 30]], 10, "cu");
      s.pipe([[0, 0, 30], [0, 0, 150], [0, 140, 150]], 10, "cu");
      s.pipe([[-120, 0, 30], [-120, 0, -20]], 7, "cu");
      s.band([0, 0, 30], X, 10, "cu", 26, 1.3);
      s.band([-80, 0, 30], X, 10, "cu", 9);
      s.band([100, 0, 30], X, 10, "cu", 9);
      s.valve([0, 0, 92], Z, 10, RED, X);
      s.band([0, 140, 150], Y, 10, "br", 12, 1.4);
      s.label([130, 0, 30], 24, 24, "Ø22×1 Cu");
      return s.svg();
    },
    gaz: function () {
      var s = Iso();
      s.floor(-200, 160, -80, 160, 0, 40);
      s.box(-220, -40, 20, 80, 70, 120, "st");
      s.box(-200, 30, 80, 44, 1, 26, "dk");
      s.pipe([[-140, -5, 120], [60, -5, 120], [60, -5, 30], [60, 150, 30]], 9, "bk");
      s.pipe([[-160, -5, 140], [-160, -5, 200]], 9, "bk");
      s.valve([-60, -5, 120], X, 9, YEL, Y);
      s.valve([60, 80, 30], Y, 9, YEL, X);
      s.band([60, -5, 120], X, 9, "bk", 14, 1.35);
      s.label([60, -5, 80], 26, -10, "DN25 ACÉL");
      return s.svg();
    },
    futes: function () {
      var s = Iso();
      s.floor(-140, 160, -40, 140, 0, 40);
      s.box(-110, 0, 50, 220, 18, 120, "wh");
      for (var x = -100; x <= 100; x += 10) s.line([[x, 18.5, 56], [x, 18.5, 164]], "rgba(15,15,14,.18)", 1);
      s.pipe([[-96, 9, 50], [-96, 9, 25], [-96, 120, 25], [-96, 120, 0]], 6, "cu");
      s.pipe([[96, 9, 50], [96, 9, 25], [96, 120, 25], [96, 120, 0]], 6, "cu");
      s.valve([-96, 60, 25], Y, 6, "#e7e3db", X, "st");
      s.cyl(-96, 9, 170, 196, 9, "wh");
      s.label([96, 120, 20], 30, 10, "Ø15 Cu");
      return s.svg();
    },
    klima: function () {
      var s = Iso();
      s.floor(-140, 200, -60, 120, 0, 40);
      s.box(-120, 0, 140, 240, 46, 64, "wh");
      s.line([[-110, 46.5, 150], [110, 46.5, 150]], "rgba(15,15,14,.5)", 2);
      s.line([[-110, 46.5, 158], [110, 46.5, 158]], "rgba(15,15,14,.25)", 1);
      s.line([[60, 46.5, 190], [100, 46.5, 190]], "#c8774a", 2);
      s.pipe([[120, 14, 160], [190, 14, 160], [190, 14, 0]], 4.5, "cu");
      s.pipe([[120, 30, 168], [176, 30, 168], [176, 30, 0]], 6, "cu");
      s.pipe([[120, 24, 148], [206, 24, 148], [206, 24, 0]], 3, "pvc");
      s.label([190, 14, 60], 30, 10, "Ø6,35 / Ø9,52 Cu");
      return s.svg();
    },
    csatorna: function () {
      var s = Iso();
      s.floor(-180, 180, -60, 140, 0, 40);
      s.pipe([[-180, 0, 70], [180, 0, 40]], 15, "pvc");
      s.pipe([[-60, 0, 170], [-60, 0, 110], [-20, 0, 63]], 11, "pvc");
      s.band([-20, 0, 63], [0.92, 0, -0.08], 15, "pvc", 34, 1.25);
      s.band([-180, 0, 70], [0.99, 0, -0.08], 15, "pvc", 10, 1.3);
      s.band([100, 0, 47], [0.99, 0, -0.08], 15, "pvc", 22, 1.22);
      s.label([150, 0, 43], 24, 20, "KG Ø110 · 2%");
      return s.svg();
    }
  };

  window.VajnaIso = {
    render: function (root) {
      (root || document).querySelectorAll("[data-iso]").forEach(function (el) {
        var fn = SCENES[el.getAttribute("data-iso")];
        if (fn) el.innerHTML = fn(el.classList.contains("svc-thumb"));
      });
    }
  };

  /* Nyomásmérő óra — 0…5 év skála */
  window.VajnaGauge = function (el) {
    if (!el) return;
    var cx = 120, cy = 120, R = 100, a0 = -225, a1 = 45, s = "";
    function pt(a, r) { var t = a * Math.PI / 180; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; }
    for (var i = 0; i <= 50; i++) {
      var a = a0 + (a1 - a0) * i / 50, big = i % 10 === 0, mid = i % 5 === 0;
      var p1 = pt(a, R - 6), p2 = pt(a, R - (big ? 22 : mid ? 15 : 11));
      s += '<path d="M' + f(p1[0]) + " " + f(p1[1]) + "L" + f(p2[0]) + " " + f(p2[1]) + '" stroke="' + (i >= 40 ? "#8c4f2c" : "#151412") + '" stroke-width="' + (big ? 2.4 : 1) + '"/>';
      if (big) { var t = pt(a, R - 36); s += '<text x="' + f(t[0]) + '" y="' + f(t[1] + 5) + '" text-anchor="middle" font-size="15" font-weight="600" fill="#151412" font-family="Archivo,Arial,sans-serif">' + (i / 10) + "</text>"; }
    }
    var arc0 = pt(a0 + (a1 - a0) * .8, R - 3), arc1 = pt(a1, R - 3);
    el.innerHTML = '<svg viewBox="0 0 240 240" focusable="false">' +
      '<circle cx="120" cy="120" r="117" fill="#151412"/><circle cx="120" cy="120" r="111" fill="#5b6065"/><circle cx="120" cy="120" r="106" fill="#f3efe6"/>' +
      '<path d="M' + f(arc0[0]) + " " + f(arc0[1]) + "A" + (R - 3) + " " + (R - 3) + " 0 0 1 " + f(arc1[0]) + " " + f(arc1[1]) + '" stroke="#c8774a" stroke-width="5" fill="none"/>' + s +
      '<text x="120" y="203" text-anchor="middle" font-size="9.5" letter-spacing="2" fill="#5f5a51" font-family="IBM Plex Mono,monospace">ÉV · GARANCIA</text>' +
      '<g class="needle" style="transform-origin:120px 120px;transform:rotate(-225deg)"><path d="M120 124L210 120L120 116Z" fill="#b8352b"/><path d="M120 120L92 120" stroke="#b8352b" stroke-width="5"/></g>' +
      '<circle cx="120" cy="120" r="9" fill="#151412"/><circle cx="120" cy="120" r="3" fill="#5b6065"/></svg>';
  };

  /* Budapest vonalas térkép */
  window.VajnaMap = function (el) {
    if (!el) return;
    var R = [[440, -20], [455, 120], [470, 240], [490, 330], [495, 420], [485, 500], [478, 560], [490, 640], [510, 720], [530, 800], [545, 900], [560, 1020]];
    function cr(p) { var o = "M" + p[0][0] + " " + p[0][1]; for (var i = 0; i < p.length - 1; i++) { var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2; o += "C" + f(p1[0] + (p2[0] - p0[0]) / 6) + " " + f(p1[1] + (p2[1] - p0[1]) / 6) + " " + f(p2[0] - (p3[0] - p1[0]) / 6) + " " + f(p2[1] - (p3[1] - p1[1]) / 6) + " " + p2[0] + " " + p2[1]; } return o; }
    function rx(y) { for (var i = 0; i < R.length - 1; i++) if (y >= R[i][1] && y <= R[i + 1][1]) { var t = (y - R[i][1]) / (R[i + 1][1] - R[i][1]); return R[i][0] + t * (R[i + 1][0] - R[i][0]); } return 560; }
    var bound = [[300, 90], [420, 40], [560, 70], [640, 140], [760, 130], [860, 220], [900, 360], [960, 470], [900, 560], [860, 690], [760, 760], [660, 820], [600, 930], [520, 960], [470, 880], [380, 820], [300, 760], [220, 700], [150, 600], [110, 480], [160, 380], [140, 280], [210, 180], [300, 90]];
    var br = ""; [120, 300, 410, 480, 515, 555, 625, 700].forEach(function (y) { var x = rx(y); br += "M" + f(x - 26) + " " + y + "h52"; });
    var river = cr(R);
    el.innerHTML = '<svg viewBox="80 20 900 960" focusable="false">' +
      '<path d="' + cr(bound) + '" fill="rgba(235,231,223,.035)" stroke="rgba(235,231,223,.3)" stroke-dasharray="5 5"/>' +
      '<path d="M' + f(rx(410) + 18) + ' 410Q700 520 ' + f(rx(625) + 18) + ' 625M' + f(rx(300) + 18) + ' 300Q910 520 ' + f(rx(720) + 18) + ' 720" stroke="rgba(235,231,223,.18)" fill="none"/>' +
      '<path d="' + river + '" stroke="rgba(235,231,223,.55)" stroke-width="30" fill="none"/><path d="' + river + '" stroke="#0f0f0e" stroke-width="26" fill="none"/>' +
      '<path d="M525 770C590 830 615 900 640 1020" stroke="rgba(235,231,223,.4)" stroke-width="12" fill="none"/><path d="M525 770C590 830 615 900 640 1020" stroke="#0f0f0e" stroke-width="9" fill="none"/>' +
      '<path d="' + br + '" stroke="rgba(235,231,223,.5)" stroke-width="3"/>' +
      '<circle cx="' + f(rx(500) + 80) + '" cy="500" r="9" fill="#c8774a"/><circle cx="' + f(rx(500) + 80) + '" cy="500" r="28" stroke="#c8774a" fill="none" opacity=".6"/>' +
      '<text x="270" y="520" fill="rgba(235,231,223,.5)" font-size="34" font-family="IBM Plex Mono,monospace" letter-spacing="4">BUDA</text><text x="690" y="420" fill="rgba(235,231,223,.5)" font-size="34" font-family="IBM Plex Mono,monospace" letter-spacing="4">PEST</text></svg>';
  };
})();
