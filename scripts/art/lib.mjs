function mulberry32(a){return function(){a|=0;a=(a+0x6d2b79f5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
const f = (n) => Math.round(n * 10) / 10;
const C = {
  ink:'#2b211a', red:'#cf5b3e', deepRed:'#a8432f', green:'#7f9b6a', sage:'#a9b98f', leafDark:'#5f7d55',
  ochre:'#d9b46c', ochreLt:'#e8c777', tan:'#c9a27a', kraft:'#c7a272', paperT:'#e6d3a8', paperLt:'#efe0bd',
  brown:'#9c6b45', bark:'#8f7458', clay:'#b8693f', clayDk:'#9c5533', ivory:'#efe2c2', pink:'#dc8c84', pinkDk:'#c96f69',
  amber:'#c99545', celadon:'#bccab3', celadonLt:'#d9e1d0', stone:'#b9b0a0', stoneDk:'#8e8576', liquid:'#5d3a22',
  orange:'#d9853f', orangeLt:'#efc08a', skin:'#e9c3a0', skinDk:'#d9a984', hair:'#3a2c24', hairW:'#dcd6c8',
  coatW:'#f4efe3', coatG:'#5c7a5e', coatB:'#8a5a3c', blush:'#e0907a', shadow:'#cdbf9f', hi:'#fbf7ec', rose:'#e3a59d',
};
const rot = (p, a) => [p[0]*Math.cos(a) - p[1]*Math.sin(a), p[0]*Math.sin(a) + p[1]*Math.cos(a)];
const place = (pts, x, y, a = 0, s = 1) => pts.map((p) => { const r = rot([p[0]*s, p[1]*s], a); return [x + r[0], y + r[1]]; });
function cr(pts, closed) {
  const n = pts.length; if (n < 2) return '';
  const P = (i) => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]);
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += 'C' + f(c1[0]) + ' ' + f(c1[1]) + ' ' + f(c2[0]) + ' ' + f(c2[1]) + ' ' + f(p2[0]) + ' ' + f(p2[1]);
  }
  return closed ? d + 'Z' : d;
}
const lineD = (pts) => 'M' + pts.map((p) => f(p[0]) + ' ' + f(p[1])).join('L');
class Pic {
  constructor(seed, W, H) { this.R = mulberry32(seed); this.W = W; this.H = H; this.L = []; }
  j(a) { return (this.R() - 0.5) * 2 * a; }
  rnd(a, b) { return a + this.R() * (b - a); }
  tint(d, c, op) { this.L.push({ t: 'tint', d, c, op }); }
  flat(d, c, op) { this.L.push({ t: 'flat', d, c, op }); }
  ink(d, w = 1.6, op) { this.L.push({ t: 'ink', d, w, op }); }
  dot(x, y, r = 0.7) { this.L.push({ t: 'flat', d: 'M' + f(x - r) + ' ' + f(y) + 'a' + r + ' ' + r + ' 0 1 0 ' + f(2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + f(-2 * r) + ' 0', c: C.ink }); }
  hi(d, w = 1.3) { this.L.push({ t: 'hi', d, w }); }
  // điểm elip có rung, local rồi đặt vào (cx,cy) xoay a
  ell(cx, cy, rx, ry, a = 0, n = 14, wob = 0.05) {
    const pts = []; const ph = this.R() * Math.PI * 2;
    for (let i = 0; i < n; i++) { const t = ph + (i / n) * Math.PI * 2; const k = 1 + this.j(wob); pts.push([Math.cos(t) * rx * k, Math.sin(t) * ry * k]); }
    return place(pts, cx, cy, a);
  }
  jit(pts, a) { return pts.map((p) => [p[0] + this.j(a), p[1] + this.j(a)]); }
  // viền mực khép kín, có đuôi chồng nét như vẽ tay
  outline(pts, w = 1.6) {
    const n = pts.length; const s = Math.floor(this.R() * n);
    const r = pts.slice(s).concat(pts.slice(0, s)); const a = r[0], b = r[1];
    const tail = [a[0] + (b[0] - a[0]) * 0.45 + this.j(0.6), a[1] + (b[1] - a[1]) * 0.45 + this.j(0.6)];
    this.ink(cr([...r, [a[0] + this.j(0.4), a[1] + this.j(0.4)], tail], false), w);
  }
  shape(pts, color, w = 1.6) { if (color) this.tint(cr(pts, true), color); this.outline(pts, w); }
  // đa giác cạnh thẳng (hộp, giấy, nhãn): rung nhẹ ở đỉnh, nét khép có đuôi
  poly(pts, color, w = 1.5) {
    const q = this.jit(pts, 0.35);
    if (color) this.tint(lineD(q) + 'Z', color);
    const a = q[0], b = q[1];
    this.ink(lineD([...q, [a[0] + this.j(0.3), a[1] + this.j(0.3)], [a[0] + (b[0] - a[0]) * 0.2, a[1] + (b[1] - a[1]) * 0.2 + this.j(0.4)]]), w);
  }
  line(pts, w = 1.2, op) { this.ink(cr(this.jit(pts, 0.35), false), w, op); }
  shadow(cx, cy, rx, ry) { this.flat(cr(this.ell(cx, cy, rx, ry, 0, 12, 0.04), true), C.shadow, 0.45); }
}
function render(p, VB) {
  const s = VB.h / p.H; const tx = (VB.w - p.W * s) / 2;
  let body = '';
  for (const L of p.L) {
    const op = L.op ? ' opacity="' + L.op + '"' : '';
    if (L.t === 'tint') body += '<path d="' + L.d + '" fill="' + L.c + '" stroke="none" transform="translate(2 1.6)"' + op + '/>';
    else if (L.t === 'flat') body += '<path d="' + L.d + '" fill="' + L.c + '" stroke="none"' + op + '/>';
    else if (L.t === 'ink') body += '<path d="' + L.d + '" stroke-width="' + L.w + '"' + op + '/>';
    else if (L.t === 'hi') body += '<path d="' + L.d + '" stroke="' + C.hi + '" stroke-width="' + L.w + '"/>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + VB.w + ' ' + VB.h + '"><g transform="translate(' + f(tx) + ' 0) scale(' + s.toFixed(4) + ')" fill="none" stroke="' + C.ink + '" stroke-linecap="round" stroke-linejoin="round">' + body + '</g></svg>\n';
}
export { mulberry32, f, C, rot, place, cr, lineD, Pic, render };
