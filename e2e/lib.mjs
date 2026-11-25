// Tiện ích dùng chung cho các script e2e. Cấu hình qua biến môi trường:
//   BASE_URL     mặc định http://localhost:3000
//   CHROME_PATH  mặc định Chrome trên macOS
//   OUT_DIR      mặc định e2e/.output
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const here = path.dirname(fileURLToPath(import.meta.url));

export const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
export const CHROME_PATH =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export const OUT_DIR = path.resolve(process.env.OUT_DIR || path.join(here, ".output"));

export const B = BASE_URL;
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launchBrowser() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  return puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    protocolTimeout: 30000,
    args: [
      "--no-sandbox",
      // Nhiều tab chạy song song: không cho tab nền bị giảm tốc.
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
    ],
  });
}

/**
 * Mỗi script export hàm run(browser) trả về mảng { id, name, pass, detail }.
 * Chạy riêng một script: node e2e/<tên>.mjs
 */
export function makeRecorder(group) {
  const results = [];
  const rec = (name, pass, detail = "") => {
    results.push({ group, name, pass: !!pass, detail: typeof detail === "string" ? detail : JSON.stringify(detail) });
    console.log((pass ? "PASS" : "FAIL") + " [" + group + "] " + name + (pass ? "" : " | " + (typeof detail === "string" ? detail : JSON.stringify(detail))));
  };
  return { rec, results };
}

export async function runStandalone(metaUrl, run) {
  if (process.argv[1] !== fileURLToPath(metaUrl)) return;
  const browser = await launchBrowser();
  let results = [];
  try {
    results = await run(browser);
  } finally {
    await browser.close();
  }
  console.log("\n" + formatTable(results));
  process.exit(results.some((r) => !r.pass) ? 1 : 0);
}

export function formatTable(results) {
  const rows = results.map((r) => [r.pass ? "PASS" : "FAIL", r.group, r.name]);
  const w = [4, 5, 4];
  rows.forEach((r) => r.forEach((c, i) => (w[i] = Math.max(w[i], [...c].length))));
  const line = (r) => r.map((c, i) => c + " ".repeat(w[i] - [...c].length)).join("  ");
  const out = [line(["KQ", "NHÓM", "KIỂM TRA"]), line(w.map((n) => "-".repeat(n)))];
  rows.forEach((r) => out.push(line(r)));
  const fail = results.filter((r) => !r.pass).length;
  out.push("", results.length - fail + " PASS, " + fail + " FAIL");
  return out.join("\n");
}

/** Mở context ẩn danh mới: localStorage riêng, nhiều tab trong cùng context thì dùng chung. */
export async function newContext(browser) {
  return browser.createBrowserContext();
}

export function wire(page, tag, errs) {
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type())) errs.push(tag + " console." + m.type() + ": " + m.text().slice(0, 300) + " @" + page.url());
  });
  page.on("pageerror", (e) => errs.push(tag + " pageerror: " + e.message + " @" + page.url()));
  page.on("requestfailed", (r) => errs.push(tag + " requestfailed " + r.url()));
  page.on("response", (r) => {
    if (r.status() >= 400) errs.push(tag + " http" + r.status() + " " + r.url());
  });
}

export async function newPage(ctx, tag, errs = [], { width = 1280, height = 800 } = {}) {
  const p = await ctx.newPage();
  await p.setViewport({ width, height, isMobile: width < 500, hasTouch: width < 500 });
  wire(p, tag, errs);
  return p;
}

export const txt = (p) => p.evaluate(() => document.body.innerText);

export async function shot(p, name, { fullPage = true } = {}) {
  const file = path.join(OUT_DIR, name + ".png");
  await p.screenshot({ path: file, fullPage });
  return file;
}

export async function waitText(p, re, ms = 6000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (re.test(await txt(p))) return true;
    await sleep(150);
  }
  return false;
}

/** Bấm phần tử đang hiện đầu tiên (hoặc thứ nth) có innerText/aria-label khớp re. */
export async function clickText(p, sel, re, nth = 0) {
  const hs = await p.$$(sel);
  const ok = [];
  for (const h of hs) {
    const t = await h.evaluate((e) => (e.getClientRects().length ? (e.innerText || "") + " " + (e.getAttribute("aria-label") || "") : null));
    if (t !== null && re.test(t)) ok.push(h);
  }
  if (!ok[nth]) throw new Error("không thấy " + sel + " " + re);
  await ok[nth].evaluate((e) => e.scrollIntoView({ block: "center" }));
  await ok[nth].click();
  return ok.length;
}

/** Click qua DOM cho link/nút cần điều hướng client-side. */
export async function clickNav(p, sel) {
  await p.evaluate((sel) => {
    const a = [...document.querySelectorAll(sel)].find((x) => x.getClientRects().length);
    if (!a) throw new Error("không thấy " + sel);
    a.click();
  }, sel);
  await sleep(300);
}

/** Đọc state demo trong localStorage (key mocy-demo). */
export function lsState(p) {
  return p.evaluate(() => {
    const raw = localStorage.getItem("mocy-demo");
    if (!raw) return null;
    const j = JSON.parse(raw);
    return {
      orders: (j.orders || []).map((o) => o.code),
      appointments: (j.appointments || []).map((a) => ({ code: a.code, name: a.customer?.name, doctorId: a.doctorId, date: a.date, time: a.time, status: a.status })),
      consults: (j.consultRequests || []).map((c) => c.code),
    };
  });
}

export function filterCount(p, label) {
  return p.evaluate((label) => {
    const b = [...document.querySelectorAll("button[aria-pressed]")].find((x) => x.innerText.trim().startsWith(label));
    return b ? b.innerText.replace(/\s+/g, " ") : null;
  }, label);
}

export const alerts = (p) =>
  p.evaluate(() => [...document.querySelectorAll("[role=alert]")].map((e) => e.innerText).join(" / "));

// ---------- Đặt lịch 5 bước ----------
export const BOOKING_TITLES = [
  "Bạn đang gặp vấn đề gì?",
  "Bạn muốn tư vấn bằng cách nào?",
  "Chọn lương y",
  "Chọn ngày và giờ khám",
  "Thông tin của bạn",
];
export const stepTitle = (p) => p.evaluate(() => document.querySelector("#step-title")?.innerText || null);

export async function radio(p, label, nth) {
  const hs = await p.$$('[role=radiogroup][aria-label="' + label + '"] [role=radio]:not([disabled])');
  if (!hs[nth]) throw new Error("không có radio " + label + " #" + nth + " (có " + hs.length + ")");
  const t = await hs[nth].evaluate((e) => e.innerText.replace(/\s+/g, " ").trim());
  await hs[nth].evaluate((e) => e.scrollIntoView({ block: "center" }));
  await hs[nth].click();
  await sleep(150);
  return t;
}

export async function nextStep(p) {
  await clickText(p, "button", /^\s*Tiếp tục/);
  await sleep(250);
}

/** Đi từ /dat-lich tới bước 5 (và gửi nếu không stopBefore). */
export async function walkBooking(p, { doc = 0, dateIdx = 1, timeIdx = 0, name = "Lê Thị Đặt Lịch", phone = "0901112233", symptoms = "Ngủ không sâu giấc, hay mơ.", stopBefore = false } = {}) {
  await p.bringToFront();
  await p.goto(B + "/dat-lich", { waitUntil: "networkidle0" });
  await sleep(400);
  const out = { titles: [await stepTitle(p)] };
  out.group = await radio(p, "Nhóm triệu chứng", 1);
  await nextStep(p);
  out.titles.push(await stepTitle(p));
  out.mode = await radio(p, "Hình thức tư vấn", 0);
  await nextStep(p);
  out.titles.push(await stepTitle(p));
  out.doctor = await radio(p, "Lương y", doc);
  await nextStep(p);
  out.titles.push(await stepTitle(p));
  out.date = await radio(p, "Ngày khám", dateIdx);
  out.time = await radio(p, "Giờ khám", timeIdx);
  await nextStep(p);
  out.titles.push(await stepTitle(p));
  await p.type("input[name=name]", name);
  await p.type("input[name=phone]", phone);
  const ta = await p.$("textarea");
  if (ta) await ta.type(symptoms);
  if (!stopBefore) await clickText(p, "button[type=submit]", /Xác nhận đặt lịch/);
  return out;
}

export const onConfirmPage = (p, ms = 8000) =>
  p.waitForFunction(() => location.pathname.includes("xac-nhan"), { timeout: ms }).then(() => true).catch(() => false);

// ---------- Ảnh PNG test, sinh lúc chạy ----------
export function makeTestPng() {
  const W = 64, H = 64;
  const raw = Buffer.alloc((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) {
    raw[y * (W * 3 + 1)] = 0;
    for (let x = 0; x < W; x++) {
      const o = y * (W * 3 + 1) + 1 + x * 3;
      raw[o] = x * 4;
      raw[o + 1] = y * 4;
      raw[o + 2] = 180;
    }
  }
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  const crc = (buf) => {
    let r = 0xffffffff;
    for (const b of buf) r = table[(r ^ b) & 255] ^ (r >>> 8);
    return (r ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const c = Buffer.alloc(4);
    c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const file = path.join(OUT_DIR, "test.png");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    file,
    Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]),
  );
  return file;
}
