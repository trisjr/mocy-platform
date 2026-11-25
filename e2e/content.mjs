// Nội dung P1 của bản demo: quy trình 4 bước, câu hỏi thường gặp, khối chi phí, trang /gioi-thieu, điều hướng.
import { B, makeRecorder, newContext, newPage, nextStep, radio, runStandalone, sleep } from "./lib.mjs";

// Kiểm khối chi phí trên trang đang mở.
function feeInfo(p) {
  return p.evaluate(() => {
    const a = document.querySelector('aside[aria-labelledby="chi-phi-title"]');
    if (!a) return null;
    return {
      text: a.innerText,
      faqLink: !!a.querySelector('a[href="/#cau-hoi"]'),
      controls: a.querySelectorAll("button,[role=radio]").length,
    };
  });
}
const feeOk = (f) =>
  !!f && ["Tư vấn trực tuyến", "Miễn phí", "Sắc thuốc sẵn", "(mẫu)"].every((s) => f.text.includes(s)) && f.faqLink && f.controls === 0;

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

    // ---- Khối chi phí
    for (const u of ["/dat-lich", "/tu-van", "/luong-y"]) {
      await p.goto(B + u, { waitUntil: "networkidle0" });
      const f = await feeInfo(p);
      rec("Khối chi phí trên " + u, feeOk(f), f || "không có aside#chi-phi");
    }
    await p.goto(B + "/dat-lich", { waitUntil: "networkidle0" });
    await radio(p, "Nhóm triệu chứng", 1);
    await nextStep(p);
    rec("Khối chi phí vẫn còn ở bước 2 của /dat-lich", feeOk(await feeInfo(p)));

    // ---- Trang /gioi-thieu
    await p.goto(B + "/gioi-thieu", { waitUntil: "networkidle0" });
    const about = await p.evaluate(() => ({
      h1: document.querySelector("h1")?.innerText,
      ids: ["cau-chuyen", "duoc-lieu", "khong-gian", "giay-phep"].filter((id) => document.getElementById(id)),
      legal: document.getElementById("giay-phep")?.innerText || "",
      docLinks: document.querySelectorAll('#giay-phep a[href^="/luong-y#"]').length,
      booking: !!document.querySelector('main a[href="/dat-lich"], #giay-phep ~ section a[href="/dat-lich"]'),
    }));
    rec("/gioi-thieu có h1 và đủ 4 mục", about.h1 === "Về Mộc Y" && about.ids.length === 4, { h1: about.h1, ids: about.ids });
    rec(
      "/gioi-thieu có giấy phép và CCHN 3 lương y",
      ["0125/HNO-GPHĐ", "004512/HNO-CCHN", "0109876543"].every((s) => about.legal.includes(s)) && about.docLinks === 3,
      { docLinks: about.docLinks },
    );
    rec("/gioi-thieu có nút đặt lịch", about.booking);

    // ---- Điều hướng tới /gioi-thieu
    await p.goto(B + "/", { waitUntil: "networkidle0" });
    const navD = await p.evaluate(() => ({
      footer: !!document.querySelector('footer a[href="/gioi-thieu"]'),
      home: !!document.querySelector('#quy-trinh a[href="/gioi-thieu"]'),
    }));
    rec("Có link /gioi-thieu ở footer và khối quy trình", navD.footer && navD.home, navD);

    rec("Không lỗi console hay request >= 400", errs.length === 0, errs.slice(0, 5));

    // Nav đáy điện thoại giữ 5 ô, không có /gioi-thieu.
    const m = await newPage(ctx, "m", errs, { width: 390, height: 844 });
    await m.goto(B + "/", { waitUntil: "networkidle0" });
    const mob = await m.evaluate(() => [...document.querySelectorAll('nav[aria-label="Điều hướng nhanh"] a')].map((a) => a.getAttribute("href")));
    rec("390px: nav đáy có 5 ô, không có /gioi-thieu", mob.length === 5 && !mob.includes("/gioi-thieu"), mob);

    // Header ở các mốc chật (giữ nguyên số mục nav): không tràn, logo không bị cắt, link nav không xuống dòng.
    for (const w of [768, 1024, 1280]) {
      await p.setViewport({ width: w, height: 800 });
      await sleep(300);
      const h = await p.evaluate(() => {
        const logo = document.querySelector('header a[aria-label$="Trang chủ"]');
        const links = [...document.querySelectorAll('nav[aria-label="Điều hướng chính"] a')];
        return {
          sw: document.documentElement.scrollWidth,
          iw: innerWidth,
          logo: logo ? [logo.scrollWidth, logo.clientWidth] : null,
          tall: links.filter((a) => a.getBoundingClientRect().height > 56).map((a) => a.innerText),
        };
      });
      rec(w + "px: header vừa, logo không bị cắt", h.sw <= h.iw && h.logo && h.logo[0] <= h.logo[1] && h.tall.length === 0, h);
    }
  } finally {
    await ctx.close();
  }
  return results;
}

await runStandalone(import.meta.url, run);
