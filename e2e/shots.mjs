// Chụp các trang chính ở 390 và 1280, kiểm overflow, ảnh lỗi, ảnh méo/tràn, chữ Lorem hoặc tiếng Anh, lỗi console.
import { B, OUT_DIR, makeRecorder, newContext, newPage, runStandalone, shot, sleep, radio, nextStep } from "./lib.mjs";

const PAGES = [
  ["home", "/"],
  ["san-pham", "/san-pham"],
  ["sp-detail", "/san-pham/tao-nhan-sao"],
  ["sp-consult", "/san-pham/bai-thuoc-an-than"],
  ["gio-hang", "/gio-hang"],
  ["dat-lich", "/dat-lich"],
  ["luong-y", "/luong-y"],
  ["kien-thuc", "/kien-thuc"],
  ["kt-detail", "/kien-thuc/giu-ty-vi-khoe-moi-ngay"],
  ["tu-van", "/tu-van?san-pham=bai-thuoc-an-than"],
  ["admin", "/admin"],
  ["admin-don-hang", "/admin/don-hang"],
  ["admin-lich-hen", "/admin/lich-hen"],
];

// Chạy trong trang: gom các vấn đề bố cục và nội dung.
function inspect() {
  const vis = (e) => e.getClientRects().length > 0;
  const bad = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src);
  const wide = [...document.querySelectorAll("body *")]
    .filter((e) => {
      const r = e.getBoundingClientRect();
      return r.right > innerWidth + 1 && r.width > 0 && getComputedStyle(e).position !== "fixed" && !e.closest("[class*=overflow-x-auto]");
    })
    .slice(0, 5)
    .map((e) => e.tagName + "." + String(e.className).slice(0, 60));
  // Ảnh méo (object-fit: fill mà tỷ lệ lệch) hoặc không phủ khung khi dùng absolute inset-0.
  const imgIssues = [];
  for (const i of document.images) {
    if (!vis(i) || i.naturalWidth === 0) continue;
    const r = i.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const fit = getComputedStyle(i).objectFit;
    const tag = i.getAttribute("src").slice(-40);
    if (fit === "fill" && Math.abs(r.width / r.height - i.naturalWidth / i.naturalHeight) / (i.naturalWidth / i.naturalHeight) > 0.02) imgIssues.push("méo " + tag);
    if (/\babsolute\b/.test(i.className) && /\binset-0\b/.test(i.className)) {
      const pr = i.parentElement.getBoundingClientRect();
      if (Math.abs(pr.width - r.width) > 1.5 || Math.abs(pr.height - r.height) > 1.5) imgIssues.push("không phủ khung " + tag);
      if (!/cover|contain/.test(fit)) imgIssues.push("thiếu object-fit " + tag);
    }
    if (r.right > innerWidth + 1) imgIssues.push("tràn ngang " + tag);
  }
  const text = document.body.innerText;
  const sus = text.match(/lorem|ipsum|\b(Add to cart|Submit|Loading|Read more|Learn more|Home|Cart|Search|Products|Contact|Sign in|Login|Checkout|Buy now)\b/gi) || [];
  return {
    sw: document.documentElement.scrollWidth,
    iw: innerWidth,
    bad,
    wide,
    imgIssues,
    sus,
    h1: document.querySelector("h1")?.innerText || null,
    imgs: [...document.images].filter(vis).length,
  };
}

export async function run(browser) {
  const { rec, results } = makeRecorder("shots");
  for (const [vw, vh, tag] of [[390, 844, "m"], [1280, 800, "d"]]) {
    const ctx = await newContext(browser);
    const errs = [];
    const p = await newPage(ctx, tag, errs, { width: vw, height: vh });
    const infos = [];
    for (const [n, u] of PAGES) {
      await p.goto(B + u, { waitUntil: "networkidle0" });
      await sleep(500);
      // Cuộn để kích hoạt ảnh lazy.
      await p.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await sleep(300);
      const info = await p.evaluate(inspect);
      await shot(p, tag + "-" + n);
      infos.push({ n, ...info });
    }
    // Bước chọn lương y của /dat-lich (ảnh avatar).
    await p.goto(B + "/dat-lich", { waitUntil: "networkidle0" });
    await radio(p, "Nhóm triệu chứng", 1);
    await nextStep(p);
    await radio(p, "Hình thức tư vấn", 0);
    await nextStep(p);
    await sleep(500);
    const docInfo = await p.evaluate(inspect);
    await shot(p, tag + "-dat-lich-luong-y");
    infos.push({ n: "dat-lich-luong-y", ...docInfo });

    const L = tag === "m" ? "390px" : "1280px";
    const list = (f) => infos.filter(f).map((i) => i.n);
    rec(L + ": không tràn ngang", infos.every((i) => i.sw <= i.iw), infos.filter((i) => i.sw > i.iw || i.wide.length).map((i) => ({ page: i.n, sw: i.sw, wide: i.wide })));
    rec(L + ": mọi trang có h1", infos.filter((i) => !i.n.startsWith("admin") && !i.n.startsWith("dat-lich-")).every((i) => i.h1), list((i) => !i.h1));
    rec(L + ": không có ảnh lỗi", infos.every((i) => i.bad.length === 0), infos.filter((i) => i.bad.length).map((i) => ({ page: i.n, bad: i.bad })));
    rec(L + ": ảnh phủ đúng khung, không méo, không tràn", infos.every((i) => i.imgIssues.length === 0), infos.filter((i) => i.imgIssues.length).map((i) => ({ page: i.n, issues: i.imgIssues })));
    rec(L + ": không có chữ Lorem hoặc tiếng Anh lạc", infos.every((i) => i.sus.length === 0), infos.filter((i) => i.sus.length).map((i) => ({ page: i.n, sus: i.sus })));
    const real = errs.filter((e) => !/favicon/.test(e));
    rec(L + ": không lỗi console hay request >= 400", real.length === 0, real.slice(0, 5));
    await ctx.close();
  }
  console.log("Ảnh chụp: " + OUT_DIR);
  return results;
}

await runStandalone(import.meta.url, run);
