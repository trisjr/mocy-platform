// Nội dung P1 của bản demo: quy trình 4 bước, câu hỏi thường gặp, khối chi phí, trang /gioi-thieu, điều hướng.
import { B, makeRecorder, newContext, newPage, runStandalone, sleep } from "./lib.mjs";

export async function run(browser) {
  const { rec, results } = makeRecorder("content");
  const ctx = await newContext(browser);
  const errs = [];
  const p = await newPage(ctx, "d", errs, { width: 1280, height: 800 });
  try {
    // ---- Trang chủ: quy trình 4 bước
    await p.goto(B + "/", { waitUntil: "networkidle0" });
    const steps = await p.evaluate(() => ({
      title: document.querySelector("#quy-trinh-title")?.innerText,
      items: [...document.querySelectorAll("#quy-trinh ol > li")].map((li) => li.innerText),
    }));
    const want = ["Đặt lịch / Gửi triệu chứng", "Lương y Tứ chẩn", "Gia giảm & Bào chế", "Giao tận nhà & Theo dõi"];
    rec(
      "Trang chủ có quy trình 4 bước đúng thứ tự",
      steps.title === "Quy trình khám & bốc thuốc" && steps.items.length === 4 && want.every((w, i) => steps.items[i]?.includes(w)),
      steps,
    );

    // ---- Trang chủ: câu hỏi thường gặp
    const faq = await p.evaluate(() => {
      const ds = [...document.querySelectorAll("#cau-hoi details")];
      return { n: ds.length, open: ds.filter((d) => d.open).length };
    });
    rec("Có 6 câu hỏi thường gặp, đều đang đóng", faq.n === 6 && faq.open === 0, faq);
    const sums = await p.$$("#cau-hoi summary");
    await sums[0].evaluate((e) => e.scrollIntoView({ block: "center" }));
    await sums[0].click();
    await sleep(150);
    const first = await p.evaluate(() => {
      const d = document.querySelector("#cau-hoi details");
      const a = d.querySelector("p");
      return { open: d.open, visible: a.getClientRects().length > 0, text: a.innerText };
    });
    rec("Bấm câu hỏi đầu thì mở ra câu trả lời", first.open && first.visible && /video/.test(first.text), first);
    await sums[1].focus();
    await p.keyboard.press("Enter");
    await sleep(150);
    const second = await p.evaluate(() => document.querySelectorAll("#cau-hoi details")[1].open);
    rec("Nhấn Enter trên câu hỏi thứ hai thì mở", second);

    rec("Không lỗi console hay request >= 400", errs.length === 0, errs.slice(0, 5));
  } finally {
    await ctx.close();
  }
  return results;
}

await runStandalone(import.meta.url, run);
