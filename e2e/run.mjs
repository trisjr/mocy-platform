// Chạy toàn bộ e2e, in bảng PASS/FAIL, exit code khác 0 khi có FAIL.
// Chạy một script riêng: node e2e/shots.mjs
import { BASE_URL, CHROME_PATH, OUT_DIR, launchBrowser, formatTable } from "./lib.mjs";

const SUITES = ["shots", "scenario", "collide", "stale", "admin-layout", "reset"];

console.log("BASE_URL=" + BASE_URL + "\nCHROME_PATH=" + CHROME_PATH + "\nOUT_DIR=" + OUT_DIR + "\n");

const ping = await fetch(BASE_URL).then((r) => r.status).catch(() => null);
if (!ping) {
  console.error("Không kết nối được " + BASE_URL + ". Hãy chạy npm run build && npm start trước, hoặc đặt BASE_URL.");
  process.exit(2);
}

const browser = await launchBrowser();
const all = [];
for (const name of SUITES) {
  console.log("--- " + name);
  try {
    const { run } = await import("./" + name + ".mjs");
    all.push(...(await run(browser)));
  } catch (e) {
    all.push({ group: name, name: "Script chạy hết không lỗi", pass: false, detail: e.message });
    console.log("FAIL [" + name + "] " + e.message);
  }
}
await browser.close();

console.log("\n" + formatTable(all));
const failed = all.filter((r) => !r.pass);
if (failed.length) {
  console.log("\nChi tiết các mục FAIL:");
  for (const r of failed) console.log("- [" + r.group + "] " + r.name + (r.detail ? ": " + r.detail : ""));
}
console.log("\nẢnh chụp: " + OUT_DIR);
process.exit(failed.length ? 1 : 0);
