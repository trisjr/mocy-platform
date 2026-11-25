import { C, place, cr, lineD } from './lib.mjs';
const PI = Math.PI;
// ---------- hạt, quả ----------
function goji(p, x, y, len = 13, a = 0) {
  const w = len * 0.44;
  p.shape(p.ell(x, y, len / 2, w / 2, a, 12, 0.07), C.red, 1.35);
  p.hi(cr(place([[-len * 0.25, -w * 0.1], [-len * 0.02, -w * 0.25], [len * 0.15, -w * 0.2]], x, y, a), false), 1.1);
  const e = place([[len * 0.48, 0], [len * 0.66, -1.6], [len * 0.62, 1.7]], x, y, a);
  p.ink(lineD([e[0], e[1]]) + lineD([e[0], e[2]]), 1);
}
function jujubeSeed(p, x, y, len = 12, a = 0) {
  const w = len * 0.68;
  p.shape(p.ell(x, y, len / 2, w / 2, a, 12, 0.05), C.brown, 1.3);
  p.ink(cr(place([[-len * 0.34, p.j(0.4)], [0, p.j(0.5)], [len * 0.34, p.j(0.4)]], x, y, a), false), 0.85);
  const e = place([[len * 0.5, 0], [len * 0.36, -1.2], [len * 0.36, 1.2]], x, y, a);
  p.ink(lineD([e[1], e[0], e[2]]), 0.85);
}
function lotusSeed(p, x, y, r = 7, a = 0) {
  p.shape(p.ell(x, y, r, r * 0.9, a, 12, 0.04), C.ivory, 1.3);
  p.ink(cr(place([[-r * 0.35, -r * 0.5], [0, -r * 0.78], [r * 0.35, -r * 0.5]], x, y, a), false), 0.9);
  const g = place([[0, -r * 0.42]], x, y, a)[0];
  p.flat(cr(p.ell(g[0], g[1], r * 0.18, r * 0.14, 0, 8, 0.05), true), C.leafDark);
}
function longan(p, x, y, r = 7.5) {
  p.shape(p.ell(x, y, r, r * 0.88, p.rnd(0, 3), 14, 0.11), '#b07a46', 1.3);
  for (let i = 0; i < 2; i++) p.ink(cr(place([[-r * 0.4, 0], [0, r * 0.16], [r * 0.35, -0.5]], x + p.j(r * 0.25), y + p.j(r * 0.25), p.rnd(0, 6.28)), false), 0.75);
}
function redDate(p, x, y, len = 17, a = 0) {
  p.shape(p.ell(x, y, len / 2, len * 0.36, a, 14, 0.08), C.deepRed, 1.4);
  for (let i = 0; i < 3; i++) { const yy = (i - 1) * len * 0.11; p.ink(cr(place([[-len * 0.3, yy + p.j(0.5)], [-len * 0.05, yy + p.j(1)], [len * 0.28, yy + p.j(0.5)]], x, y, a), false), 0.75); }
  p.hi(cr(place([[-len * 0.2, -len * 0.19], [len * 0.08, -len * 0.23]], x, y, a), false), 1.1);
  const s = place([[len * 0.5, 0]], x, y, a)[0]; p.dot(s[0], s[1], 0.9);
}
function barley(p, x, y, a = 0) {
  p.shape(p.ell(x, y, 4.2, 3.3, a, 10, 0.05), C.ivory, 1.05);
  p.ink(cr(place([[-1.4, -2.6], [0, -1.4], [1.4, -2.6]], x, y, a), false), 0.75);
}
function heap(p, cx, cy, wid, hgt, n, draw) {
  const items = [];
  for (let i = 0; i < n; i++) {
    const u = ((p.R() + p.R() + p.R()) / 3) * 2 - 1;
    const x = cx + (u * wid) / 2;
    const y = cy - p.R() * hgt * (1 - u * u);
    items.push([x, y]);
  }
  items.sort((a, b) => a[1] - b[1]);
  for (const [x, y] of items) draw(x, y);
}
// ---------- lát thái ----------
function angelicaSlice(p, x, y, r, a = 0, tilt = 1) {
  const loc = []; const n = 18; const ph = p.R() * 6.28;
  for (let i = 0; i < n; i++) { const t = ph + (i / n) * 6.28; const k = 1 + p.j(0.12); loc.push([Math.cos(t) * r * k, Math.sin(t) * r * k * tilt]); }
  p.shape(place(loc, x, y, a), '#dcc28f', 1.4);
  p.ink(cr(place(loc.map((q) => [q[0] * 0.6 + p.j(0.7), q[1] * 0.6 + p.j(0.7)]), x, y, a), true), 0.8);
  for (let i = 0; i < 11; i++) {
    const t = (i / 11) * 6.28 + p.j(0.15); const r1 = r * 0.13, r2 = r * p.rnd(0.4, 0.55);
    p.ink(lineD(place([[Math.cos(t) * r1, Math.sin(t) * r1 * tilt], [Math.cos(t) * r2, Math.sin(t) * r2 * tilt]], x, y, a)), 0.7);
  }
  p.ink(cr(place(loc.map((q) => [q[0] * 0.3, q[1] * 0.3]), x, y, a), true), 0.7);
  p.flat(cr(place(p.ell(0, 0, r * 0.1, r * 0.1 * tilt, 0, 8, 0.1), x, y, a), true), '#8a5a2c');
}
function yamSlice(p, x, y, rx, a = 0, tilt = 0.6) {
  const ry = rx * tilt; const T = 2.6;
  const loc = []; const n = 16; const ph = p.R() * 6.28;
  for (let i = 0; i < n; i++) { const t = ph + (i / n) * 6.28; const k = 1 + p.j(0.035); loc.push([Math.cos(t) * rx * k, Math.sin(t) * ry * k]); }
  p.tint(cr(place(loc.map((q) => [q[0], q[1] + T]), x, y, a), true), '#e2d2a8');
  const under = Array.from({ length: 9 }, (_, i) => { const t = (i / 8) * PI; return [Math.cos(t) * rx, Math.sin(t) * ry + T]; });
  p.ink(cr(place(under, x, y, a), false), 1.1);
  p.ink(lineD(place([[-rx, 0], [-rx, T]], x, y, a)) + lineD(place([[rx, 0], [rx, T]], x, y, a)), 1);
  p.shape(place(loc, x, y, a), C.ivory, 1.3);
  for (let i = 0; i < 9; i++) { const t = p.R() * 6.28, rr = Math.sqrt(p.R()) * 0.7; const q = place([[Math.cos(t) * rx * rr, Math.sin(t) * ry * rr]], x, y, a)[0]; p.dot(q[0], q[1], p.rnd(0.45, 0.8)); }
}
function hawSlice(p, x, y, r = 8, tilt = 0.85) {
  p.shape(p.ell(x, y, r, r * tilt, p.rnd(0, 3), 14, 0.07), '#c4623f', 1.3);
  p.flat(cr(p.ell(x, y, r * 0.66, r * 0.66 * tilt, 0, 12, 0.08), true), '#e9bf8f');
  for (let i = 0; i < 4; i++) { const t = (i / 4) * 6.28 + p.j(0.3); p.dot(x + Math.cos(t) * r * 0.3, y + Math.sin(t) * r * 0.3 * tilt, 0.9); }
}
// ---------- lá, cành, hoa ----------
function leaf(p, x, y, len, wid, a, color = C.green, veins = true) {
  const n = 7; const loc = [];
  for (let i = 0; i <= n; i++) { const t = i / n; loc.push([t * len, -Math.pow(Math.sin(PI * t), 0.85) * wid * (1 + p.j(0.06))]); }
  for (let i = n - 1; i >= 1; i--) { const t = i / n; loc.push([t * len, Math.pow(Math.sin(PI * t), 0.85) * wid * (1 + p.j(0.06))]); }
  p.shape(place(loc, x, y, a), color, 1.25);
  p.ink(cr(place([[len * 0.03, 0], [len * 0.5, p.j(0.5)], [len * 0.9, 0]], x, y, a), false), 0.85);
  if (veins) for (let k = 1; k <= 3; k++) { const t = 0.16 + k * 0.18; for (const s of [-1, 1]) p.ink(cr(place([[len * t, 0], [len * (t + 0.08), s * wid * 0.35], [len * (t + 0.13), s * wid * 0.55]], x, y, a), false), 0.65); }
}
function lobedLeaf(p, x, y, len, wid, a, color = C.sage) {
  const loc = [[0, 0]]; const lobes = 3;
  for (let i = 1; i <= lobes; i++) { const t = i / (lobes + 1); loc.push([len * (t - 0.07), -wid * 0.32]); loc.push([len * (t + 0.04), -wid * (0.95 - t * 0.4)]); }
  loc.push([len, 0]);
  for (let i = lobes; i >= 1; i--) { const t = i / (lobes + 1); loc.push([len * (t + 0.04), wid * (0.95 - t * 0.4)]); loc.push([len * (t - 0.07), wid * 0.32]); }
  p.shape(place(p.jit(loc, 0.45), x, y, a), color, 1.25);
  p.ink(cr(place([[0, 0], [len * 0.5, p.j(0.4)], [len * 0.9, 0]], x, y, a), false), 0.85);
}
function sprig(p, x, y, len, a, n = 4, o = {}) {
  const S = place([[0, 0], [len * 0.35, p.j(2)], [len * 0.7, p.j(2)], [len, p.j(1)]], x, y, a);
  p.ink(cr(S, false), o.stemW || 1.6);
  for (let i = 0; i < n; i++) {
    const t = 0.22 + (i / Math.max(1, n - 1)) * 0.72; const side = i % 2 ? 1 : -1;
    const q = place([[len * t, 0]], x, y, a)[0];
    (o.lobed ? lobedLeaf : leaf)(p, q[0], q[1], (o.leafLen || len * 0.42) * p.rnd(0.85, 1.1), o.leafWid || len * 0.12, a + side * p.rnd(0.6, 0.9), o.color || (o.lobed ? C.sage : C.green));
    if (o.berries && i % 2 === 0) { const b = place([[len * t + 4, side * 6]], x, y, a)[0]; goji(p, b[0], b[1], 12, a + PI / 2); }
  }
}
function rosebud(p, x, y, s = 1, a = 0) {
  p.ink(cr(place([[0, 0], [0.8, 6], [0, 11]], x, y, a, s), false), 1.2);
  for (const sa of [-0.75, 0.75, 0]) { const b = place([[0, 0.5]], x, y, a, s)[0]; leaf(p, b[0], b[1], 7.5 * s, 2.3 * s, a + PI / 2 + sa, C.green, false); }
  const loc = [[0, 0], [-6.5, -5], [-6, -11], [-2.5, -16], [0, -17.5], [2.5, -16], [6, -11], [6.5, -5]];
  p.shape(place(p.jit(loc, 0.3), x, y, a, s), C.pink, 1.3);
  p.ink(cr(place([[-4.4, -3.6], [-1, -9], [1.4, -15]], x, y, a, s), false), 0.85);
  p.ink(cr(place([[4.4, -4], [1.4, -10], [-0.4, -14]], x, y, a, s), false), 0.85);
}
function chrysanthemum(p, x, y, r = 10, tilt = 1) {
  const n = 18;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 6.28 + p.j(0.08); const pl = r * p.rnd(0.5, 0.62);
    const cx = x + Math.cos(t) * (r * 0.55 + pl * 0.3), cy = y + Math.sin(t) * (r * 0.55 + pl * 0.3) * tilt;
    p.shape(p.ell(cx, cy, pl / 2, r * 0.13, Math.atan2(Math.sin(t) * tilt, Math.cos(t)), 8, 0.04), C.ochreLt, 0.8);
  }
  p.shape(p.ell(x, y, r * 0.33, r * 0.33 * tilt, 0, 10, 0.05), '#c99a3e', 1);
  for (let i = 0; i < 6; i++) p.dot(x + p.j(r * 0.17), y + p.j(r * 0.17 * tilt), 0.5);
}
// ---------- đồ đựng ----------
function vessel(p, x, y, rx, ry, prof, color, o = {}) {
  const right = prof.slice().reverse().map(([a, b]) => [-a, b]);
  const back = Array.from({ length: 9 }, (_, i) => { const t = (-i / 8) * PI; return [Math.cos(t) * rx, Math.sin(t) * ry]; });
  p.shape(place(p.jit([...prof, ...right, ...back.slice(1, -1)], 0.25), x, y), color, o.w || 1.5);
  if (o.inner) p.flat(cr(place(Array.from({ length: 14 }, (_, i) => { const t = (i / 14) * 6.28; return [Math.cos(t) * rx * 0.88, Math.sin(t) * ry * 0.72 + ry * 0.14]; }), x, y), true), o.inner);
  if (o.fill) {
    p.flat(cr(place(Array.from({ length: 14 }, (_, i) => { const t = (i / 14) * 6.28; return [Math.cos(t) * rx * 0.86, Math.sin(t) * ry * 0.66 + ry * 0.2]; }), x, y), true), o.fill);
    p.hi(cr(place([[-rx * 0.45, ry * 0.05], [-rx * 0.15, -ry * 0.12], [rx * 0.1, -ry * 0.1]], x, y), false), 1.1);
  }
  const front = Array.from({ length: 9 }, (_, i) => { const t = PI - (i / 8) * PI; return [Math.cos(t) * rx, Math.sin(t) * ry]; });
  p.ink(cr(place(p.jit(front, 0.2), x, y), false), 1.2);
}
function cup(p, x, y, w = 40, o = {}) {
  const rx = w / 2, ry = w * 0.13, h = w * 0.55;
  p.shape(place(p.jit([[-rx * 0.4, h - 1], [rx * 0.4, h - 1], [rx * 0.42, h + 3], [-rx * 0.42, h + 3]], 0.15), x, y), o.color || C.celadon, 1.1);
  vessel(p, x, y, rx, ry, [[-rx, 0], [-rx * 0.96, h * 0.35], [-rx * 0.72, h * 0.8], [-rx * 0.42, h]], o.color || C.celadon, { fill: o.tea || C.amber });
  if (o.band) p.ink(cr(place([[-rx * 0.95, h * 0.25], [0, h * 0.36], [rx * 0.95, h * 0.25]], x, y), false), 0.8);
}
function bowl(p, x, y, rx = 26, o = {}) {
  const ry = rx * 0.24, h = rx * 0.82;
  p.shape(place(p.jit([[-rx * 0.38, h - 1], [rx * 0.38, h - 1], [rx * 0.4, h + 4], [-rx * 0.4, h + 4]], 0.2), x, y), o.color || C.celadon, 1.2);
  vessel(p, x, y, rx, ry, [[-rx, 0], [-rx * 0.95, h * 0.35], [-rx * 0.75, h * 0.72], [-rx * 0.45, h * 0.95], [-rx * 0.38, h]], o.color || C.celadon, { fill: o.fill, inner: o.inner });
  if (o.band) p.ink(cr(place([[-rx * 0.93, h * 0.32], [0, h * 0.44], [rx * 0.93, h * 0.32]], x, y), false), 0.8);
}
function dish(p, x, y, rx = 46, color = C.celadon) {
  const ry = rx * 0.27;
  const under = Array.from({ length: 11 }, (_, i) => { const t = PI - (i / 10) * PI; return [Math.cos(t) * rx * (0.82 + 0.18 * Math.abs(Math.cos(t))), Math.sin(t) * ry + Math.sin(t) * 7]; });
  p.shape(place(p.jit(under, 0.3), x, y), color, 1.4);
  p.shape(p.ell(x, y, rx, ry, 0, 20, 0.01), C.celadonLt, 1.4);
  p.ink(cr(p.ell(x, y + 1, rx * 0.8, ry * 0.72, 0, 18, 0.01), true), 0.8);
}
function steam(p, x, y, h = 26, n = 3, gap = 7) {
  for (let i = 0; i < n; i++) { const x0 = x + (i - (n - 1) / 2) * gap; const pts = []; for (let k = 0; k <= 6; k++) pts.push([x0 + Math.sin(k * 1.1 + i * 2) * 2.4 + p.j(0.3), y - (k * h) / 6]); p.ink(cr(pts, false), 1, 0.5); }
}
function teapot(p, x, y, s = 1, color = C.clay) {
  const S = (pts) => place(pts, x, y, 0, s);
  const hd = [[-24, -27], [-37, -30], [-42, -18], [-35, -7], [-25, -9]];
  p.ink(cr(S(p.jit(hd, 0.3)), false), 2.8 * Math.sqrt(s));
  p.shape(S(p.jit([[20, -22], [30, -27], [38, -35], [44, -41], [47.5, -39], [41, -31], [33, -19], [25, -9]], 0.25)), color, 1.4);
  p.shape(S(p.ell(0, -17, 28, 17, 0, 18, 0.02).map(([a, b]) => [a, Math.min(b, -1.5)])), color, 1.6);
  p.ink(cr(S([[-26, -11], [0, -8], [26, -11]]), false), 0.8);
  p.shape(S([[-11, -33], [-9, -36.5], [-4, -38.5], [0, -39], [4, -38.5], [9, -36.5], [11, -33], [0, -31.5]]), color, 1.3);
  p.shape(S(p.ell(0, -41, 2.6, 2.2, 0, 8, 0.04)), color, 1.2);
  p.hi(cr(S([[-19, -24], [-11, -28], [-3, -29.5]]), false), 1.4);
}
function herbPot(p, x, y, s = 1, color = '#8a5232') {
  const S = (pts) => place(pts, x, y, 0, s);
  p.shape(S(p.jit([[-24, -31], [-52, -38], [-54, -31], [-25, -23]], 0.25)), color, 1.4);
  p.shape(S(p.ell(-53, -34.5, 2.2, 3.6, 0.25, 8, 0.03)), '#6e3b22', 1);
  p.shape(S(p.jit([[21, -31], [33, -38], [36.5, -35.5], [25, -24]], 0.25)), color, 1.3);
  p.shape(S(p.ell(0, -22, 27, 22, 0, 18, 0.02).map(([a, b]) => [a, Math.min(b, -1)])), color, 1.6);
  p.shape(S([[-13, -40], [-14, -45], [14, -45], [13, -40], [0, -38.5]]), color, 1.3);
  p.shape(S([[-15.5, -45], [-12, -49], [-5, -51], [0, -51.5], [5, -51], [12, -49], [15.5, -45], [0, -44]]), color, 1.3);
  p.shape(S(p.ell(0, -53.5, 3, 2.4, 0, 8, 0.04)), color, 1.2);
  p.hi(cr(S([[-18, -29], [-10, -36], [-1, -37.5]]), false), 1.4);
}
function stove(p, x, y, s = 1) {
  const S = (pts) => place(pts, x, y, 0, s);
  p.shape(S(p.jit([[-31, 0], [31, 0], [27, 32], [-27, 32]], 0.4)), C.stone, 1.5);
  p.shape(S([[-10, 32], [-10, 17], [-6, 12], [0, 11], [6, 12], [10, 17], [10, 32]]), '#5d4a3b', 1.2);
  for (let i = 0; i < 4; i++) p.flat(cr(S(p.ell(-6 + i * 4, 28 - (i % 2) * 2.5, 2.4, 1.8, 0, 8, 0.1)), true), i % 2 ? '#e07a3a' : '#c4452d');
  p.ink(cr(S([[-32, 0], [0, 3.5], [32, 0]]), false), 1.2);
}
function cylinder(p, x, y, rx, ry, h, color, w = 1.5, top) {
  const pts = [];
  for (let i = 0; i <= 8; i++) { const t = PI - (i / 8) * PI; pts.push([Math.cos(t) * rx, Math.sin(t) * ry]); }
  for (let i = 0; i <= 8; i++) { const t = (i / 8) * -PI; pts.push([Math.cos(t) * rx, -h + Math.sin(t) * ry]); }
  p.shape(place(p.jit(pts, 0.25), x, y), color, w);
  if (top) p.shape(p.ell(x, y - h, rx, ry, 0, 16, 0.01), top, w * 0.8);
  else { const fr = []; for (let i = 0; i <= 8; i++) { const t = PI - (i / 8) * PI; fr.push([Math.cos(t) * rx, -h + Math.sin(t) * ry]); } p.ink(cr(place(fr, x, y), false), w * 0.8); }
}
function balmJar(p, x, y, w = 44, h = 30, o = {}) {
  const rx = w / 2, ry = w * 0.14;
  cylinder(p, x, y, rx, ry, h, o.body || '#a8683a', 1.5);
  // nhãn bao quanh thân
  const band = [];
  for (let i = 0; i <= 8; i++) { const t = PI - (i / 8) * PI; band.push([Math.cos(t) * rx, -h * 0.72 + Math.sin(t) * ry]); }
  for (let i = 8; i >= 0; i--) { const t = PI - (i / 8) * PI; band.push([Math.cos(t) * rx, -h * 0.26 + Math.sin(t) * ry]); }
  p.shape(place(band, x, y), C.ivory, 1.1);
  leaf(p, x - rx * 0.42, y - h * 0.42 + ry * 0.9, rx * 0.34, ry * 0.45, -0.35, C.green, false);
  p.line(place([[-rx * 0.02, -h * 0.5 + ry * 0.95], [rx * 0.55, -h * 0.5 + ry * 0.8]], x, y), 0.8);
  p.line(place([[-rx * 0.02, -h * 0.38 + ry * 0.95], [rx * 0.4, -h * 0.38 + ry * 0.85]], x, y), 0.8);
  cylinder(p, x, y - h + 1, rx + 1.6, ry + 0.4, h * 0.3, o.lid || '#5f7d55', 1.4, o.lidTop || '#7f9b6a');
  p.hi(cr(place([[-rx * 0.8, -h * 0.2], [-rx * 0.82, -h * 0.05]], x, y), false), 1.6);
}
function box(p, x, y, w, h, d, col, o = {}) {
  const dx = d * 0.8, dy = -d * 0.45;
  p.poly(place([[w, 0], [w + dx, dy], [w + dx, -h + dy], [w, -h]], x, y), col.side, 1.4);
  p.poly(place([[0, -h], [w, -h], [w + dx, -h + dy], [dx, -h + dy]], x, y), col.top, 1.4);
  p.poly(place([[0, 0], [w, 0], [w, -h], [0, -h]], x, y), col.front, 1.5);
  if (o.lid) p.line(place([[0, -h * 0.8], [w, -h * 0.8], [w + dx, -h * 0.8 + dy]], x, y), 1);
  if (o.label) {
    const lw = w * 0.64, lh = h * 0.4, lx = (w - lw) / 2, ly = -h * 0.66;
    p.poly(place([[lx, ly], [lx + lw, ly], [lx + lw, ly + lh], [lx, ly + lh]], x, y), C.ivory, 1);
    const q = place([[lx + lw * 0.14, ly + lh * 0.62]], x, y)[0];
    leaf(p, q[0], q[1], lw * 0.3, lh * 0.15, -0.6, o.labelLeaf || C.green, false);
    p.line(place([[lx + lw * 0.52, ly + lh * 0.38], [lx + lw * 0.86, ly + lh * 0.38]], x, y), 0.8);
    p.line(place([[lx + lw * 0.52, ly + lh * 0.64], [lx + lw * 0.78, ly + lh * 0.64]], x, y), 0.8);
  }
  return { dx, dy };
}
function packet(p, x, y, w = 46, h = 18, d = 30, o = {}) {
  const { dx, dy } = box(p, x, y, w, h, d, { front: C.paperT, top: C.paperLt, side: '#d8c18f' });
  p.line(place([[2, -h], [w * 0.5 + dx * 0.5, -h + dy * 0.5]], x, y), 0.7);
  p.line(place([[w - 2, -h], [w * 0.5 + dx * 0.5, -h + dy * 0.5]], x, y), 0.7);
  p.line(place([[w * 0.5, 0], [w * 0.5, -h], [w * 0.5 + dx, -h + dy]], x, y), 1.1);
  p.line(place([[dx * 0.5, -h + dy * 0.5], [w + dx * 0.5, -h + dy * 0.5], [w + dx * 0.5, dy * 0.5]], x, y), 1.1);
  const k = place([[w * 0.5 + dx * 0.5, -h + dy * 0.5]], x, y)[0];
  p.ink(cr([[k[0], k[1]], [k[0] - 6, k[1] - 5], [k[0] - 7, k[1] + 1], [k[0], k[1]]], false) + cr([[k[0], k[1]], [k[0] + 6, k[1] - 5], [k[0] + 7, k[1] + 1], [k[0], k[1]]], false), 1);
  if (o.seal !== false) p.poly(place([[w * 0.12, -h * 0.72], [w * 0.3, -h * 0.72], [w * 0.3, -h * 0.25], [w * 0.12, -h * 0.25]], x, y), '#c2452d', 0.9);
}
function pouch(p, x, y, w = 40, h = 52, color = C.kraft, o = {}) {
  p.shape(place(p.jit([[-w / 2, 0], [w / 2, 0], [w / 2 - 1.5, -h], [-w / 2 + 1.5, -h]], 0.4), x, y), color, 1.5);
  p.shape(place(p.jit([[-w / 2 + 1.5, -h], [w / 2 - 1.5, -h], [w / 2 - 3, -h - 10], [-w / 2 + 3, -h - 10]], 0.3), x, y), o.top || '#b8925f', 1.3);
  p.line(place([[-w / 2 + 3, -h - 5], [w / 2 - 3, -h - 5]], x, y), 0.7);
  p.line(place([[-w / 2 + 4, -h + 4], [-w * 0.2, -h - 2], [w * 0.15, -h + 3], [w / 2 - 4, -h - 1]], x, y), 1);
  p.line(place([[-w * 0.38, -4], [-w * 0.3, -h * 0.15]], x, y), 0.6);
  p.line(place([[w * 0.38, -4], [w * 0.3, -h * 0.15]], x, y), 0.6);
  const lw = w * 0.66, lh = h * 0.42, lx = -lw / 2, ly = -h * 0.72;
  p.poly(place([[lx, ly], [lx + lw, ly], [lx + lw, ly + lh], [lx, ly + lh]], x, y), C.ivory, 1);
  const q = place([[0, ly + lh * 0.34]], x, y)[0];
  (o.mark || ((pp, a, b) => leaf(pp, a - lw * 0.22, b, lw * 0.44, lh * 0.14, 0, C.green, false)))(p, q[0], q[1]);
  p.line(place([[lx + lw * 0.2, ly + lh * 0.7], [lx + lw * 0.8, ly + lh * 0.7]], x, y), 0.8);
}
function glassJar(p, x, y, rx, h, contents) {
  const ry = rx * 0.22;
  const pts = [];
  for (let i = 0; i <= 8; i++) { const t = PI - (i / 8) * PI; pts.push([Math.cos(t) * rx, Math.sin(t) * ry]); }
  for (let i = 0; i <= 8; i++) { const t = (i / 8) * -PI; pts.push([Math.cos(t) * rx * 0.9, -h + Math.sin(t) * ry]); }
  p.flat(cr(place(pts, x, y), true), '#e9e4d2', 0.8);
  contents();
  p.outline(place(p.jit(pts, 0.2), x, y), 1.4);
  const fr = []; for (let i = 0; i <= 8; i++) { const t = PI - (i / 8) * PI; fr.push([Math.cos(t) * rx * 0.9, -h + Math.sin(t) * ry]); }
  p.ink(cr(place(fr, x, y), false), 1.1);
  p.hi(cr(place([[-rx * 0.72, -h * 0.82], [-rx * 0.78, -h * 0.45], [-rx * 0.72, -h * 0.15]], x, y), false), 2);
  cylinder(p, x, y - h + 1, rx * 0.95, ry * 0.95, 8, C.wood || '#8a5a3c', 1.3, '#a77b53');
}
// ---------- củ, rễ, vỏ ----------
function ginger(p, x, y, s = 1, a = 0) {
  for (const [kx, ky, rx, ry, ka] of [[-15, -6, 9, 6, -0.7], [12, -7, 8, 5.5, 0.8], [0, 0, 17, 8.5, 0.1], [21, 2, 7, 5, 0.2]]) {
    const q = place([[kx, ky]], x, y, a, s)[0];
    p.shape(p.ell(q[0], q[1], rx * s, ry * s, a + ka, 14, 0.09), '#d8a75a', 1.3);
    for (const t of [-0.35, 0.3]) p.ink(cr(place([[t * rx, -ry * 0.82], [t * rx + 1.2, 0], [t * rx, ry * 0.82]], q[0], q[1], a + ka, s), false), 0.7);
  }
}
function gingerSlice(p, x, y, r = 9) {
  p.shape(p.ell(x, y, r, r * 0.7, p.rnd(0, 3), 14, 0.1), '#ead08d', 1.2);
  p.ink(cr(p.ell(x, y, r * 0.65, r * 0.45, 0, 12, 0.08), true), 0.6);
}
function peel(p, x, y, r = 14, a = 0) {
  const outer = [], inner = [];
  for (let i = 0; i <= 10; i++) { const t = -0.3 + (i / 10) * 2.6; outer.push([Math.cos(t) * r, Math.sin(t) * r * 0.7]); inner.push([Math.cos(t) * r * 0.6 + 2, Math.sin(t) * r * 0.4 + 1]); }
  p.shape(place(p.jit([...outer, ...inner.reverse()], 0.45), x, y, a), C.orange, 1.3);
  for (let i = 0; i < 8; i++) { const t = -0.2 + p.R() * 2.4; const rr = r * p.rnd(0.72, 0.9); const q = place([[Math.cos(t) * rr, Math.sin(t) * rr * 0.6]], x, y, a)[0]; p.dot(q[0], q[1], 0.55); }
}
function bark(p, x, y, len = 54, wid = 13, a = 0) {
  const top = [], bot = []; const n = 9;
  for (let i = 0; i <= n; i++) { const t = i / n; top.push([t * len, -wid / 2 + p.j(1.2)]); bot.push([t * len, wid / 2 + p.j(1.2)]); }
  const pts = place([...top, ...bot.reverse()], x, y, a);
  p.tint(cr(pts, true), C.bark);
  p.ink(lineD([...pts, pts[0]]), 1.35);
  for (let k = 0; k < 3; k++) { const yy = -wid * 0.25 + k * wid * 0.25; const s0 = p.rnd(0.06, 0.3), s1 = p.rnd(0.62, 0.94); p.ink(lineD(place([[len * s0, yy + p.j(0.5)], [len * ((s0 + s1) / 2), yy + p.j(0.7)], [len * s1, yy + p.j(0.5)]], x, y, a)), 0.7); }
}
function barkBroken(p, x, y, len, wid, a = 0) {
  bark(p, x, y, len * 0.47, wid, a);
  const q = place([[len * 0.56, 0]], x, y, a)[0];
  bark(p, q[0], q[1], len * 0.44, wid, a + 0.06);
  for (let i = 0; i < 5; i++) { const yy = (i - 2) * wid * 0.17; p.ink(cr(place([[len * 0.46, yy], [len * 0.51, yy + p.j(1.6)], [len * 0.565, yy + p.j(0.8)]], x, y, a), false), 0.55); }
}
function rootStick(p, x, y, len, w, a, color = '#b28a63') {
  const pts = []; const n = 8;
  for (let i = 0; i <= n; i++) { const t = i / n; pts.push([t * len, (-w / 2) * (1 - t * 0.55) + p.j(0.3)]); }
  for (let i = n; i >= 0; i--) { const t = i / n; pts.push([t * len, (w / 2) * (1 - t * 0.55) + p.j(0.3)]); }
  p.shape(place(pts, x, y, a), color, 1.2);
  for (let i = 1; i < 6; i++) { const t = i / 6 + p.j(0.03); const ww = (w / 2) * (1 - t * 0.55); p.ink(lineD(place([[t * len, -ww], [t * len + 0.8, ww]], x, y, a)), 0.55); }
}
function ginseng(p, x, y, s = 1, a = 0) {
  const S = (pts) => place(pts, x, y, a, s);
  for (const [px, py, l, ang] of [[-4, 30, 26, 2.2], [6, 32, 30, 1.0], [-10, 18, 20, 2.7], [10, 14, 18, 0.4]]) {
    const st = S([[px, py]])[0]; const pts = [st]; let cx = st[0], cy = st[1];
    for (let k = 1; k <= 4; k++) { cx += Math.cos(a + ang + p.j(0.25)) * (l * s) / 4; cy += Math.sin(a + ang + p.j(0.25)) * (l * s) / 4; pts.push([cx, cy]); }
    p.ink(cr(pts, false), 0.7);
  }
  rootStick(p, ...S([[-3, 20]])[0], 34 * s, 9 * s, a + 2.05, '#e2c38e');
  rootStick(p, ...S([[3, 20]])[0], 38 * s, 10 * s, a + 1.15, '#e2c38e');
  p.shape(S(p.jit([[-9, -22], [9, -22], [11, 0], [8, 22], [0, 26], [-8, 22], [-11, 0]], 0.4)), '#e2c38e', 1.4);
  for (let i = 0; i < 6; i++) { const yy = -16 + i * 6.5; p.ink(cr(S([[-9.5, yy], [0, yy + 1.6], [9.5, yy]]), false), 0.55); }
  p.shape(S(p.jit([[-4, -22], [-4.5, -38], [4.5, -38], [4, -22]], 0.2)), '#d3ae74', 1.1);
  for (let i = 0; i < 5; i++) { const yy = -24 - i * 3; p.ink(lineD(S([[-4.4, yy], [4.4, yy + 0.6]])), 0.55); }
}
function codonopsis(p, x, y, len, a) { // đẳng sâm
  rootStick(p, x, y, len, 8, a, '#c9a77a');
  for (let i = 0; i < 9; i++) { const t = 0.05 + i * 0.1; const ww = 4 * (1 - t * 0.55); p.ink(lineD(place([[t * len, -ww], [t * len + 1, ww]], x, y, a)), 0.5); }
}
// ---------- sen, cối, nia ----------
function lotusPod(p, x, y, r = 22, a = 0) {
  const S = (pts) => place(pts, x, y, a);
  p.ink(cr(S([[0, r * 0.8], [r * 0.15, r * 1.5], [r * 0.05, r * 2.2]]), false), 2.2);
  p.shape(S(p.jit([[-r, 0], [-r * 0.72, r * 0.45], [-r * 0.28, r * 0.82], [r * 0.28, r * 0.82], [r * 0.72, r * 0.45], [r, 0], [0, r * 0.32]], 0.3)), C.sage, 1.4);
  p.shape(p.ell(x, y, r, r * 0.42, a, 16, 0.03), '#c3cf9e', 1.4);
  for (const [hx, hy] of [[0, 0], [-0.5, -0.12], [0.5, -0.1], [-0.55, 0.16], [0.52, 0.18], [-0.15, 0.24], [0.2, -0.22], [-0.25, -0.25], [0.28, 0.08]]) {
    const q = place([[hx * r, hy * r]], x, y, a)[0];
    p.shape(p.ell(q[0], q[1], r * 0.1, r * 0.055, a, 8, 0.05), hx > 0.3 || hy > 0.2 ? C.ivory : '#8c7a4c', 0.9);
  }
  for (let i = -2; i <= 2; i++) p.ink(cr(S([[i * r * 0.34, r * 0.4 * (1 - Math.abs(i) * 0.15)], [i * r * 0.15, r * 0.8]]), false), 0.7);
}
function lotusLeaf(p, x, y, rx = 50, ry = 22, a = 0) {
  const pts = []; const n = 24;
  for (let i = 0; i < n; i++) { const t = (i / n) * 6.28; const k = 1 + Math.sin(t * 7) * 0.03 + p.j(0.02); pts.push([Math.cos(t) * rx * k, Math.sin(t) * ry * k]); }
  p.shape(place(pts, x, y, a), C.green, 1.5);
  for (let i = 0; i < 12; i++) { const t = (i / 12) * 6.28 + 0.2; p.ink(cr(place([[0, 0], [Math.cos(t) * rx * 0.5, Math.sin(t) * ry * 0.5 + p.j(0.5)], [Math.cos(t) * rx * 0.88, Math.sin(t) * ry * 0.88]], x, y, a), false), 0.7); }
  p.shape(p.ell(x, y, 2.4, 1.5, a, 8, 0.05), C.leafDark, 0.9);
}
function mortar(p, x, y, s = 1) {
  const rx = 26 * s, ry = 7 * s, h = 26 * s;
  p.shape(place(p.jit([[-rx * 0.55, h - 1], [rx * 0.55, h - 1], [rx * 0.62, h + 5 * s], [-rx * 0.62, h + 5 * s]], 0.2), x, y), C.stoneDk, 1.3);
  vessel(p, x, y, rx, ry, [[-rx, 0], [-rx * 0.97, h * 0.4], [-rx * 0.8, h * 0.8], [-rx * 0.55, h]], C.stone, { inner: '#6f675b' });
  p.shape(place(p.jit([[2, -2], [8, -1], [33, -36], [36, -42], [31, -45], [26, -40]], 0.3), x, y, 0, s), '#a77b53', 1.4);
  const fr = Array.from({ length: 9 }, (_, i) => { const t = PI - (i / 8) * PI; return [Math.cos(t) * rx, Math.sin(t) * ry]; });
  p.ink(cr(place(fr, x, y), false), 1.3);
  for (let i = 0; i < 4; i++) p.ink(cr(place([[-rx * 0.9 + i * 4 * s, h * 0.2 + i * 3 * s], [-rx * 0.7 + i * 4 * s, h * 0.35 + i * 3 * s]], x, y), false), 0.5);
}
function tray(p, x, y, rx = 70, ry = 22) {
  p.shape(p.ell(x, y, rx, ry, 0, 26, 0.01), '#d7c08f', 1.6);
  p.ink(cr(p.ell(x, y, rx * 0.93, ry * 0.88, 0, 22, 0.01), true), 1);
  for (let k = 1; k <= 4; k++) p.ink(cr(p.ell(x, y, rx * (0.93 - k * 0.17), ry * (0.88 - k * 0.16), 0, 18, 0.015), true), 0.5, 0.7);
}
function paperSheet(p, x, y, w, h, a = 0, color = C.paperT) {
  p.poly(place([[-w / 2 + h * 0.3, -h / 2], [w / 2 - h * 0.3, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], x, y, a), color, 1.2);
  const c = place([[w / 2 - 12, h / 2], [w / 2, h / 2 - 7], [w / 2 - 10, h / 2 - 6]], x, y, a);
  p.tint(lineD(c) + 'Z', C.paperT);
  p.ink(lineD([c[0], c[2], c[1]]), 0.9);
}
function scoop(p, x, y, a = 0, s = 1) {
  p.ink(cr(place([[10, 0], [26, -1], [44, -2.5]], x, y, a, s), false), 3.2 * s);
  p.shape(p.ell(x, y, 12 * s, 8 * s, a, 14, 0.03), '#a77b53', 1.3);
  p.ink(cr(p.ell(x, y, 9.5 * s, 6 * s, a, 12, 0.03), true), 0.8);
}
function handScale(p, o = {}) {
  const fx = o.fx || 104, by = o.by || 56, L = o.left || 74, Rr = o.right || 250;
  // dây treo + vòng đồng
  p.line([[fx, 0], [fx + 0.6, by - 6]], 1.1);
  p.shape(p.ell(fx, by - 3.5, 3.2, 3.2, 0, 10, 0.04), '#c7a055', 1);
  // dây đĩa cân
  const px = L, py = o.panY || 128;
  for (const dx of [-34, 0, 34]) p.line([[L + 1, by + 2], [px + dx, py + (dx === 0 ? 4 : 0)]], 0.8);
  // đòn cân gỗ
  rootStick(p, L - 6, by, Rr - L + 6, 5, 0, '#a77b53');
  for (let x = fx + 10; x < Rr - 6; x += 7) p.ink(lineD([[x, by - 2.2], [x, by - (((x - fx) / 7) % 2 ? 0.6 : 0)]]), 0.5);
  for (const x of [fx + 24, fx + 52, fx + 80, fx + 108]) p.dot(x, by - 0.2, 0.8);
  // quả cân
  const wx = o.wx || 214;
  p.line([[wx, by + 2], [wx + 0.4, by + 30]], 0.9);
  p.shape(place(p.jit([[-5, 0], [5, 0], [8, 10], [7, 18], [0, 21], [-7, 18], [-8, 10]], 0.2), wx, by + 30), '#95702e', 1.3);
  // đĩa cân + dược liệu
  const rx = 36, ry = 8;
  const under = Array.from({ length: 11 }, (_, i) => { const t = PI - (i / 10) * PI; return [Math.cos(t) * rx, Math.sin(t) * ry + Math.sin(t) * 9]; });
  p.shape(place(p.jit(under, 0.25), px, py), '#c7a055', 1.4);
  p.shape(p.ell(px, py, rx, ry, 0, 18, 0.01), '#e2c37e', 1.3);
  if (o.pan) o.pan(px, py);
}
export { handScale, goji, jujubeSeed, lotusSeed, longan, redDate, barley, heap, angelicaSlice, yamSlice, hawSlice, leaf, lobedLeaf, sprig, rosebud, chrysanthemum, vessel, cup, bowl, dish, steam, teapot, herbPot, stove, cylinder, balmJar, box, packet, pouch, glassJar, ginger, gingerSlice, peel, bark, barkBroken, rootStick, ginseng, codonopsis, lotusPod, lotusLeaf, mortar, tray, paperSheet, scoop };
