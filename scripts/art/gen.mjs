/**
 * Vẽ bộ minh họa SVG của Mộc Y: sản phẩm, nhóm triệu chứng, bài viết, lương y, ảnh hero và giỏ trống.
 *
 * Chạy từ thư mục gốc của repo:
 *   node scripts/art/gen.mjs public/images            vẽ lại toàn bộ
 *   node scripts/art/gen.mjs public/images tao-nhan   chỉ vẽ ảnh có khóa chứa "tao-nhan" (nhiều khóa cách nhau bằng dấu phẩy)
 *
 * Ảnh ghi vào <thư mục>/<nhóm>/<tên>.svg. Mỗi ảnh có seed riêng nên chạy lại vẫn ra đúng ảnh cũ.
 */
import fs from 'fs';
import path from 'path';
import { C, Pic, render, cr, lineD } from './lib.mjs';
import * as P from './prims.mjs';
const VB = { states: { w: 600, h: 400, W: 360, H: 240 }, hero: { w: 1200, h: 1000, W: 288, H: 240 }, products: { w: 800, h: 800, W: 240, H: 240 }, doctors: { w: 400, h: 400, W: 240, H: 240 }, symptoms: { w: 800, h: 500, W: 384, H: 240 }, articles: { w: 1200, h: 630, W: 457.14, H: 240 } };

function portrait(p, o) {
  p.flat(lineD(p.jit([[60, 28], [218, 24], [222, 206], [56, 210]], 1)) + 'Z', o.bg, 0.9);
  const coat = [[14, 240], [24, 198], [52, 179], [93, 167], [147, 167], [188, 179], [216, 198], [226, 240]];
  p.shape(p.jit(coat, 0.6), o.coat, 1.7);
  if (o.collar === 'lab') {
    p.shape(p.jit([[104, 167], [136, 167], [120, 205]], 0.3), o.shirt, 1.2);
    p.shape(p.jit([[93, 167], [106, 166], [121, 207], [112, 240], [96, 240], [104, 214]], 0.4), o.coat, 1.5);
    p.shape(p.jit([[147, 167], [134, 166], [119, 207], [128, 240], [144, 240], [136, 214]], 0.4), o.coat, 1.5);
    p.line([[60, 222], [78, 223]], 1); // túi áo
    p.shape(p.jit([[160, 214], [184, 213], [185, 232], [161, 233]], 0.3), o.coat, 1.1);
  } else if (o.collar === 'mandarin') {
    p.shape(p.jit([[100, 159], [140, 159], [143, 177], [120, 181], [97, 177]], 0.3), o.coat, 1.4);
    p.line([[120, 181], [132, 205], [158, 240]], 1.2);
    for (const [bx, by] of [[127, 195], [140, 214], [152, 232]]) p.dot(bx, by, 1.4);
  } else {
    p.shape(p.jit([[103, 167], [137, 167], [130, 190], [120, 196], [110, 190]], 0.3), o.shirt, 1.2);
    p.shape(p.jit([[93, 167], [107, 166], [118, 196], [106, 240], [92, 240], [99, 205]], 0.4), o.coat, 1.5);
    p.shape(p.jit([[147, 167], [133, 166], [122, 196], [134, 240], [148, 240], [141, 205]], 0.4), o.coat, 1.5);
  }
  p.shape(p.jit([[104, 134], [136, 134], [138, 170], [120, 178], [102, 170]], 0.3), C.skinDk, 1.4);
  if (o.bun) p.shape(p.ell(120, 56, 17, 12, 0, 14, 0.03), C.hair, 1.4);
  p.shape(p.ell(87, 106, 6, 10, 0.12, 10, 0.05), C.skin, 1.3);
  p.shape(p.ell(153, 106, 6, 10, -0.12, 10, 0.05), C.skin, 1.3);
  p.shape(p.ell(120, 100, 33, 41, 0, 22, 0.012), C.skin, 1.6);
  o.hair(p);
  // nét mặt
  p.line([[101, 91], [107, 88.5], [113, 90]], o.browW || 1.4);
  p.line([[127, 90], [133, 88.5], [139, 91]], o.browW || 1.4);
  p.line([[101.5, 101], [107, 98.5], [112.5, 101]], 1.4);
  p.line([[127.5, 101], [133, 98.5], [138.5, 101]], 1.4);
  p.dot(107, 102.2, 1.7); p.dot(133, 102.2, 1.7);
  p.line([[121, 103], [119, 114], [123, 116]], 1.2);
  p.line([[109, 124], [120, 129.5], [131, 124]], 1.5);
  p.flat(cr(p.ell(104, 115, 7, 4, 0, 10, 0.05), true), C.blush, 0.35);
  p.flat(cr(p.ell(136, 115, 7, 4, 0, 10, 0.05), true), C.blush, 0.35);
  if (o.lines) { p.line([[104, 119], [106, 125]], 0.7, 0.7); p.line([[136, 119], [134, 125]], 0.7, 0.7); p.line([[94, 99], [91, 102]], 0.6, 0.7); p.line([[146, 99], [149, 102]], 0.6, 0.7); }
  if (o.glasses) {
    p.ink(cr(p.jit([[96, 96], [115, 96], [115.5, 107], [97, 107.5]], 0.15), true), 1.2);
    p.ink(cr(p.jit([[125, 96], [144, 96], [143.5, 107.5], [125.5, 107]], 0.15), true), 1.2);
    p.line([[115, 99], [120, 97.5], [125, 99]], 1.1);
    p.line([[96, 99], [88, 101]], 1); p.line([[144, 99], [152, 101]], 1);
  }
}
const hairWhite = (p) => {
  const outer = [[87, 104], [86, 84], [94, 68], [108, 59], [122, 57], [138, 61], [150, 72], [154, 88], [153, 104]];
  const inner = [[148, 92], [146, 80], [136, 72], [122, 70], [106, 72], [96, 80], [92, 92]];
  p.shape(p.jit([...outer, ...inner], 0.4), C.hairW, 1.4);
  p.line([[104, 64], [114, 62], [124, 63]], 0.7, 0.8); p.line([[128, 64], [140, 68]], 0.7, 0.8);
};
const hairBun = (p) => {
  const outer = [[86, 112], [84, 86], [92, 68], [106, 58], [122, 55], [140, 59], [152, 70], [157, 88], [156, 112]];
  const inner = [[151, 108], [150, 90], [144, 78], [128, 73], [112, 76], [100, 84], [92, 100], [91, 112]];
  p.shape(p.jit([...outer, ...inner], 0.35), C.hair, 1.4);
  p.line([[112, 64], [132, 62], [146, 70]], 0.7, 0.5);
};
const hairShort = (p) => {
  const outer = [[87, 100], [87, 80], [96, 64], [112, 56], [128, 55], [144, 61], [153, 74], [155, 90], [154, 100]];
  const inner = [[149, 92], [147, 80], [138, 73], [124, 71], [108, 73], [97, 80], [92, 94]];
  p.shape(p.jit([...outer, ...inner], 0.35), C.hair, 1.4);
  p.line([[112, 58], [106, 72]], 0.8, 0.5);
};

const ART = {
  // ---------------- HERO ----------------
  'hero/can-thuoc': [9001, (p) => {
    p.shadow(150, 222, 136, 12);
    P.packet(p, 192, 168, 60, 17, 28);
    P.packet(p, 200, 149, 48, 14, 22, { seal: false });
    P.handScale(p, { fx: 112, by: 50, left: 78, right: 262, wx: 228, panY: 118, pan: (x, y) => {
      P.heap(p, x, y - 1, 54, 10, 8, (a, b) => P.yamSlice(p, a, b, p.rnd(7, 8.5), p.rnd(-0.4, 0.4), 0.5));
    } });
    // ba thang thuốc chia trên giấy
    const sheet = (cx, cy, a) => P.paperSheet(p, cx, cy, 76, 24, a, C.paperLt);
    sheet(60, 206, -0.08); sheet(146, 214, 0.03); sheet(230, 206, 0.1);
    P.heap(p, 58, 207, 46, 12, 12, (a, b) => P.jujubeSeed(p, a, b, 9.5, p.rnd(0, 3)));
    P.angelicaSlice(p, 76, 210, 9, 0.4, 0.5);
    P.yamSlice(p, 128, 216, 10, 0.2, 0.55);
    P.heap(p, 152, 215, 44, 12, 6, (a, b) => P.redDate(p, a, b, 13, p.rnd(-0.6, 0.6)));
    P.heap(p, 228, 207, 46, 12, 16, (a, b) => P.goji(p, a, b, 10.5, p.rnd(-0.8, 0.8)));
    P.lotusSeed(p, 252, 212, 6, 0.2);
  }],
  // ---------------- TRẠNG THÁI ----------------
  'states/gio-trong': [9101, (p) => {
    p.shadow(180, 166, 136, 13);
    P.tray(p, 172, 144, 112, 36);
    P.scoop(p, 214, 130, -0.3, 1.25);
    P.paperSheet(p, 104, 176, 70, 22, -0.12, C.paperLt);
    p.line([[86, 172], [100, 166], [118, 170], [132, 166]], 0.9);
  }],
  // ---------------- SẢN PHẨM ----------------
  'products/ky-tu-ninh-ha': [101, (p) => {
    p.shadow(122, 186, 86, 12);
    P.sprig(p, 22, 170, 100, -0.2, 5, { leafLen: 24, leafWid: 4.4, stemW: 1.8 });
    P.dish(p, 120, 160, 80);
    P.heap(p, 120, 160, 122, 36, 36, (x, y) => P.goji(p, x, y, p.rnd(12, 15), p.rnd(-0.9, 0.9)));
    for (const [x, y, a] of [[58, 196, 0.4], [80, 203, -0.3], [168, 201, 0.9], [188, 192, -0.6]]) P.goji(p, x, y, 14, a);
  }],
  'products/tao-nhan-sao': [202, (p) => {
    p.shadow(118, 190, 90, 10);
    P.paperSheet(p, 112, 164, 136, 50, -0.06, C.paperLt);
    P.heap(p, 108, 162, 112, 30, 30, (x, y) => P.jujubeSeed(p, x, y, p.rnd(10, 13), p.rnd(0, 3.1)));
    P.scoop(p, 168, 128, -0.55, 1.15);
    for (const [x, y] of [[163, 125], [171, 129], [166, 133]]) P.jujubeSeed(p, x, y, 9, p.rnd(0, 3));
    for (const [x, y] of [[62, 200], [84, 205], [150, 204], [176, 198]]) P.jujubeSeed(p, x, y, 12, p.rnd(0, 3));
  }],
  'products/duong-quy-thai-lat': [303, (p) => {
    p.shadow(122, 192, 92, 12);
    P.rootStick(p, 36, 96, 120, 15, 0.32, '#b88a55');
    P.rootStick(p, 70, 88, 92, 9, 0.62, '#b88a55');
    for (const [x, y, r, t, a] of [[78, 140, 27, 0.62, 0.2], [124, 132, 29, 0.6, -0.1], [168, 146, 26, 0.64, 0.3], [98, 172, 28, 0.6, -0.2], [146, 180, 27, 0.62, 0.1]]) P.angelicaSlice(p, x, y, r, a, t);
  }],
  'products/hoai-son-thai-lat': [404, (p) => {
    P.tray(p, 120, 164, 100, 33);
    const s = [[86, 146, 19, 0.1], [126, 140, 20, -0.15], [164, 150, 18, 0.2], [70, 170, 18, -0.1], [108, 168, 20, 0.15], [150, 174, 19, -0.05], [128, 190, 17, 0.1]];
    for (const [x, y, r, a] of s) P.yamSlice(p, x, y, r, a, 0.58);
    P.yamSlice(p, 176, 120, 18, 1.1, 0.95);
  }],
  'products/hat-sen-kho': [505, (p) => {
    p.shadow(116, 194, 88, 11);
    P.lotusPod(p, 168, 92, 32, 0.18);
    P.bowl(p, 102, 150, 50, { color: '#e6dcc4', band: true });
    P.heap(p, 102, 152, 86, 24, 20, (x, y) => P.lotusSeed(p, x, y, p.rnd(6.5, 8), p.rnd(-0.5, 0.5)));
    for (const [x, y] of [[164, 196], [184, 190], [176, 206]]) P.lotusSeed(p, x, y, 7.5, p.rnd(-0.4, 0.4));
  }],
  'products/tra-duong-nhan': [606, (p) => {
    p.shadow(122, 194, 96, 12);
    P.box(p, 34, 164, 70, 90, 30, { front: C.rose, top: '#efc9c2', side: '#c98d85' }, { label: true, lid: true, labelLeaf: C.pinkDk });
    P.cup(p, 166, 148, 58, { tea: '#c7765c' });
    P.steam(p, 166, 136, 26, 3, 8);
    for (const [x, y, a] of [[104, 200, -0.5], [128, 206, 0.8], [196, 202, 1.9]]) P.rosebud(p, x, y, 0.95, a);
    for (const [x, y, a] of [[84, 206, 0.3], [150, 210, -0.4], [176, 198, 1.2], [214, 192, 0.2]]) P.goji(p, x, y, 13, a);
  }],
  'products/tra-ngu-ngon': [707, (p) => {
    p.shadow(122, 196, 98, 12);
    P.sprig(p, 150, 204, 66, -0.28, 3, { leafLen: 22, leafWid: 6.5 });
    P.teapot(p, 128, 174, 1.55);
    P.cup(p, 58, 170, 42, { tea: '#b88544' });
    for (const [x, y] of [[84, 200], [100, 207], [66, 207]]) P.lotusSeed(p, x, y, 7.5, p.rnd(-0.4, 0.4));
  }],
  'products/tra-tieu-thuc': [808, (p) => {
    p.shadow(122, 196, 98, 12);
    P.pouch(p, 124, 170, 66, 86);
    P.ginger(p, 62, 190, 1.1, -0.25);
    P.peel(p, 180, 188, 18, 0.35);
    P.hawSlice(p, 104, 206, 8.5);
    P.hawSlice(p, 146, 208, 8);
  }],
  'products/cao-xoa-bop-xuong-khop': [909, (p) => {
    p.shadow(124, 198, 96, 12);
    P.lobedLeaf(p, 30, 196, 44, 15, -0.25); P.lobedLeaf(p, 46, 210, 38, 13, 0.28);
    P.balmJar(p, 122, 186, 86, 56);
    P.barkBroken(p, 140, 204, 72, 13, -0.12);
  }],
  'products/combo-duong-nhan': [1010, (p) => {
    p.shadow(122, 196, 98, 12);
    P.box(p, 30, 154, 66, 72, 26, { front: C.rose, top: '#efc9c2', side: '#c98d85' }, { label: true, lid: true, labelLeaf: C.pinkDk });
    P.pouch(p, 170, 166, 52, 64, '#d58a6f', { top: '#c07359' });
    P.chrysanthemum(p, 96, 192, 11, 0.8);
    P.chrysanthemum(p, 124, 202, 10, 0.75);
    P.rosebud(p, 150, 204, 0.9, 1.4);
    P.rosebud(p, 70, 206, 0.85, -0.9);
    for (const [x, y, a] of [[176, 204, 0.3], [194, 196, -0.5], [206, 208, 1], [52, 192, 0.6]]) P.goji(p, x, y, 12.5, a);
  }],
  'products/combo-ngu-ngon': [1111, (p) => {
    p.shadow(122, 196, 98, 12);
    P.glassJar(p, 80, 178, 34, 70, () => P.heap(p, 80, 172, 58, 50, 22, (x, y) => P.lotusSeed(p, x, y, 6.5, p.rnd(-0.6, 0.6))));
    P.pouch(p, 168, 174, 58, 74, '#a9b98f', { top: '#8fa275' });
    P.heap(p, 124, 206, 50, 8, 8, (x, y) => P.jujubeSeed(p, x, y, 10.5, p.rnd(0, 3)));
  }],
  'products/combo-xuong-khop': [1212, (p) => {
    p.shadow(120, 196, 98, 12);
    P.packet(p, 24, 180, 78, 22, 34);
    P.packet(p, 36, 156, 62, 18, 28, { seal: false });
    P.balmJar(p, 178, 190, 60, 40, { lid: '#8a5a3c', lidTop: '#a77b53' });
    P.bark(p, 70, 210, 64, 12, -0.06);
  }],
  'products/bai-thuoc-an-than': [1313, (p) => {
    p.shadow(118, 194, 96, 12);
    P.herbPot(p, 104, 168, 1.6);
    P.steam(p, 158, 104, 26, 2, 7);
    P.bowl(p, 182, 166, 30, { fill: C.liquid });
    for (const [x, y] of [[60, 198], [80, 205], [124, 206]]) P.jujubeSeed(p, x, y, 12, p.rnd(0, 3));
    for (const [x, y] of [[150, 202], [170, 208], [196, 204]]) P.longan(p, x, y, 7.5);
  }],
  'products/bai-thuoc-kien-ty': [1414, (p) => {
    p.shadow(120, 196, 98, 12);
    P.packet(p, 22, 176, 72, 20, 32);
    P.packet(p, 104, 182, 72, 20, 32, { seal: false });
    P.packet(p, 62, 150, 68, 18, 30);
    P.yamSlice(p, 62, 206, 15, 0.1, 0.55);
    for (let i = 0; i < 9; i++) P.barley(p, 150 + p.rnd(0, 56), 198 + p.rnd(0, 14), p.rnd(0, 3));
  }],
  'products/bai-thuoc-xuong-khop': [1515, (p) => {
    p.shadow(122, 198, 98, 12);
    for (let i = 0; i < 4; i++) P.rootStick(p, 26 + i * 3, 176 + i * 6, 104, 7, -0.16 + i * 0.03, '#b28a63');
    P.bowl(p, 136, 136, 52, { fill: C.liquid, band: true });
    P.steam(p, 136, 124, 30, 3, 9);
    P.barkBroken(p, 132, 206, 80, 13, 0.04);
  }],
  // ---------------- NHÓM NHU CẦU ----------------
  'symptoms/xuong-khop': [2101, (p) => {
    p.shadow(192, 210, 150, 12);
    P.lobedLeaf(p, 272, 200, 46, 16, -0.3); P.lobedLeaf(p, 292, 214, 40, 14, 0.22); P.lobedLeaf(p, 262, 216, 34, 12, 0.6);
    P.mortar(p, 190, 170, 1.55);
    P.barkBroken(p, 44, 196, 96, 15, -0.18);
  }],
  'symptoms/mat-ngu': [2202, (p) => {
    P.lotusLeaf(p, 186, 168, 130, 42, 0.03);
    P.lotusPod(p, 142, 106, 28, -0.2);
    P.cup(p, 268, 148, 56, { tea: '#b88544' });
    for (const [x, y] of [[104, 186], [124, 194], [204, 196], [222, 188]]) P.lotusSeed(p, x, y, 8, p.rnd(-0.4, 0.4));
  }],
  'symptoms/tieu-hoa': [2303, (p) => {
    p.shadow(192, 206, 140, 12);
    P.dish(p, 192, 168, 104);
    P.ginger(p, 156, 156, 1.25, -0.15);
    P.peel(p, 236, 150, 20, 0.4);
    P.hawSlice(p, 206, 178, 9); P.hawSlice(p, 250, 176, 8.5); P.gingerSlice(p, 128, 180, 9);
    P.leaf(p, 288, 196, 44, 10, -0.3, C.green);
  }],
  'symptoms/duong-nhan': [2404, (p) => {
    p.shadow(192, 206, 140, 12);
    P.cup(p, 192, 150, 62, { tea: '#c7765c' });
    P.steam(p, 192, 138, 26, 3, 8);
    for (const [x, y, a] of [[110, 186, -0.6], [134, 196, 0.5], [262, 192, 1.7], [286, 182, 2.4]]) P.rosebud(p, x, y, 1.05, a);
    P.chrysanthemum(p, 84, 202, 13, 0.75); P.chrysanthemum(p, 306, 206, 12, 0.75);
    for (const [x, y, a] of [[160, 210, 0.2], [184, 214, -0.5], [222, 208, 1.1], [240, 214, 0.4]]) P.goji(p, x, y, 13, a);
  }],
  'symptoms/boi-bo': [2505, (p) => {
    p.shadow(192, 208, 150, 12);
    P.heap(p, 98, 196, 86, 22, 9, (x, y) => P.redDate(p, x, y, p.rnd(15, 18), p.rnd(-0.6, 0.6)));
    P.ginseng(p, 196, 150, 1.55, -0.95);
    for (let i = 0; i < 3; i++) P.codonopsis(p, 250 + i * 5, 196 + i * 5, 92, -0.08 + i * 0.03);
  }],
  // ---------------- BÀI VIẾT ----------------
  'articles/bi-quyet-ngu-ngon': [3101, (p) => {
    p.shadow(228, 210, 190, 13);
    P.dish(p, 86, 196, 50);
    P.heap(p, 86, 196, 70, 14, 10, (x, y) => P.lotusSeed(p, x, y, 6.5, p.rnd(-0.5, 0.5)));
    P.teapot(p, 230, 186, 1.75);
    P.cup(p, 128, 186, 46, { tea: '#b88544' }); P.steam(p, 128, 176, 22, 2, 7);
    P.cup(p, 334, 188, 46, { tea: '#b88544' });
    for (const [x, y] of [[372, 206], [390, 198], [298, 212]]) P.lotusSeed(p, x, y, 7.5, p.rnd(-0.4, 0.4));
  }],
  'articles/duong-nhan-tu-ben-trong': [3202, (p) => {
    p.shadow(228, 208, 190, 13);
    P.glassJar(p, 182, 190, 40, 84, () => P.heap(p, 182, 182, 70, 64, 11, (x, y) => P.rosebud(p, x, y + 8, 0.8, p.rnd(-0.6, 0.6))));
    P.cup(p, 286, 168, 58, { tea: '#c7765c' }); P.steam(p, 286, 156, 24, 3, 8);
    P.chrysanthemum(p, 104, 196, 13, 0.75);
    for (const [x, y, a] of [[134, 210, -0.6], [348, 204, 1.8]]) P.rosebud(p, x, y, 1, a);
    for (const [x, y, a] of [[238, 212, 0.2], [256, 206, -0.6], [378, 196, 0.9], [318, 214, 0.3]]) P.goji(p, x, y, 13, a);
  }],
  'articles/tieu-hoa-kien-ty': [3303, (p) => {
    p.shadow(228, 210, 190, 13);
    P.packet(p, 46, 186, 70, 20, 30);
    P.bowl(p, 230, 152, 54, { fill: '#9c6a3c', band: true });
    P.steam(p, 230, 140, 26, 3, 9);
    P.ginger(p, 150, 200, 1.05, -0.2);
    P.peel(p, 320, 196, 18, 0.35);
    P.yamSlice(p, 214, 214, 15, 0.1, 0.55); P.yamSlice(p, 252, 210, 14, -0.15, 0.55);
    P.hawSlice(p, 372, 206, 8.5);
  }],
  'articles/xuong-khop-mua-lanh': [3404, (p) => {
    p.shadow(228, 214, 190, 13);
    P.lobedLeaf(p, 330, 200, 46, 16, -0.25); P.lobedLeaf(p, 352, 214, 40, 14, 0.2); P.lobedLeaf(p, 372, 198, 36, 12, -0.6);
    P.stove(p, 230, 172, 1.45);
    P.herbPot(p, 230, 174, 1.15);
    P.steam(p, 266, 102, 30, 2, 8);
    P.barkBroken(p, 70, 206, 96, 14, -0.1);
  }],
  // ---------------- LƯƠNG Y ----------------
  'doctors/nguyen-van-an': [4101, (p) => portrait(p, { bg: '#e2c58e', coat: C.coatW, shirt: '#d4dfcc', collar: 'lab', hair: hairWhite, glasses: true, lines: true, browW: 1.6 })],
  'doctors/tran-thi-mai': [4202, (p) => portrait(p, { bg: '#e7c3ad', coat: C.coatG, collar: 'mandarin', hair: hairBun, bun: true })],
  'doctors/le-quang-hoa': [4303, (p) => portrait(p, { bg: '#c3cf9e', coat: C.coatB, shirt: C.coatW, collar: 'jacket', hair: hairShort })],
};

const OUT = process.argv[2];
const only = process.argv[3] ? process.argv[3].split(',') : null;
const written = [];
for (const [key, [seed, draw]] of Object.entries(ART)) {
  if (only && !only.some((o) => key.includes(o))) continue;
  const dir = key.split('/')[0]; const v = VB[dir];
  const p = new Pic(seed, v.W, v.H); draw(p);
  const svg = render(p, v);
  fs.mkdirSync(path.join(OUT, dir), { recursive: true });
  fs.writeFileSync(path.join(OUT, key + '.svg'), svg);
  written.push(key + ' ' + Math.round(svg.length / 1024) + 'KB');
}
console.log(written.join('\n'));
