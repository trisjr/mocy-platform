// Trang /tra-cuu: tra bằng mã hoặc số điện thoại, đồng bộ tức thời khi admin đổi trạng thái (2 tab).
import { B, clickText, makeRecorder, newContext, newPage, runStandalone, sleep, waitText } from "./lib.mjs";

const result = (p) => p.evaluate(() => document.querySelector("#ket-qua")?.innerText || "");

async function search(p, value) {
  await p.$eval("input[name=q]", (e) => {
    e.focus();
    e.select();
  });
  await p.keyboard.press("Backspace");
  await p.type("input[name=q]", value);
  await clickText(p, "button[type=submit]", /^\s*Tra cứu/);
  await sleep(400);
}

export async function run(browser) {
  const { rec, results } = makeRecorder("lookup");
  const ctx = await newContext(browser);
  const errs = [];
  const T = await newPage(ctx, "T", errs); // tab khách
  const A = await newPage(ctx, "A", errs); // tab admin
  try {
    await A.goto(B + "/admin/don-hang", { waitUntil: "networkidle0" });
    await T.bringToFront();
    await T.goto(B + "/tra-cuu", { waitUntil: "networkidle0" });

    // ---- Tra bằng mã chữ thường, có khoảng trắng cuối
    await search(T, "dh2611s21 ");
    await waitText(T, /Chờ xác nhận/, 4000);
    const r1 = await T.evaluate(() => ({
      url: location.search,
      text: document.querySelector("#ket-qua")?.innerText || "",
      step: [...document.querySelectorAll("#ket-qua ol > li")].findIndex((li) => li.getAttribute("aria-current") === "step"),
    }));
    rec("Mã chữ thường + khoảng trắng: ra đơn DH2611S21", r1.url.includes("ma=DH2611S21") && /Chờ xác nhận/.test(r1.text) && r1.step === 0, r1);
    rec("Chi tiết đơn che SĐT, không lộ địa chỉ", r1.text.includes("0973 *** 821") && !r1.text.includes("Trần Hưng Đạo") && !r1.text.includes("Tạ Quang Vinh"), r1.text.slice(0, 300));

    // ---- Đồng bộ: admin đổi trạng thái, tab khách tự cập nhật
    await T.evaluate(() => { window.__noReload = 1; });
    await A.bringToFront();
    await clickText(A, "button", /Đơn DH2611S21: chuyển sang/);
    await T.bringToFront();
    const synced = await T.waitForFunction(
      () => document.querySelector('#ket-qua li[aria-current="step"]')?.innerText.includes("Đang bốc thuốc / đóng gói"),
      { timeout: 3000 },
    ).then(() => true).catch(() => false);
    rec("Admin đổi trạng thái, /tra-cuu cập nhật không reload", synced && (await T.evaluate(() => window.__noReload === 1)), await result(T));

    // ---- Tra bằng SĐT có dấu chấm / khoảng trắng
    for (const phone of ["0973.219.821", "0973 219 821"]) {
      await T.goto(B + "/tra-cuu", { waitUntil: "networkidle0" }); // trang mới, không còn kết quả lượt trước
      await search(T, phone);
      const list = await T.evaluate(() => ({
        url: location.search,
        codes: [...document.querySelectorAll('#ket-qua a[href^="/tra-cuu?ma="]')].map((a) => a.innerText.match(/(DH|LH|TV)\w+/)?.[0]),
        text: document.querySelector("#ket-qua")?.innerText || "",
      }));
      rec("SĐT " + phone + ": 1 đơn + 1 lịch hẹn, không lộ tên, không ghi SĐT lên URL",
        list.codes.length === 2 && list.codes.includes("DH2611S21") && list.codes.includes("LH2611S15") && !list.text.includes("Tạ Quang Vinh") && !list.url.includes("0973"),
        list);
    }
    await clickText(T, '#ket-qua a[href="/tra-cuu?ma=LH2611S15"]', /LH2611S15/);
    await T.waitForFunction(() => location.search.includes("ma=LH2611S15") && !!document.querySelector("#ket-qua dl"), { timeout: 4000 }).catch(() => {});
    const appt = await T.evaluate(() => {
      const a = JSON.parse(localStorage.getItem("mocy-demo")).appointments.find((x) => x.code === "LH2611S15");
      return { mode: a.mode, text: document.querySelector("#ket-qua")?.innerText || "" };
    });
    const modeLabel = appt.mode === "online" ? "Tư vấn trực tuyến" : "Khám tại phòng khám";
    rec("Bấm dòng lịch hẹn: Đã xác nhận + đúng hình thức", /Đã xác nhận/.test(appt.text) && appt.text.includes(modeLabel), appt);

    // ---- Lỗi định dạng và không tìm thấy
    await search(T, "abc");
    rec("Nhập 'abc' báo lỗi định dạng", /DH, LH hoặc TV/.test(await T.evaluate(() => document.body.innerText)));
    await search(T, "DH0101ZZZ");
    rec("Mã không có báo Không tìm thấy", /Không tìm thấy/.test(await result(T)));

    // ---- Bản ghi biến mất khi đang xem (admin reset dữ liệu demo)
    await T.evaluate(() => {
      const s = JSON.parse(localStorage.getItem("mocy-demo"));
      const o = s.orders.find((x) => x.code === "DH2611S21");
      s.orders.unshift({ ...o, id: "e2e-lookup", code: "DH0000E2E" });
      localStorage.setItem("mocy-demo", JSON.stringify(s));
    });
    await T.goto(B + "/tra-cuu?ma=DH0000E2E", { waitUntil: "networkidle0" });
    await sleep(400);
    const before = await result(T);
    await T.evaluate(() => { window.__noReload = 1; });
    await A.bringToFront();
    await clickText(A, "button", /Reset dữ liệu demo/);
    await sleep(300);
    await clickText(A, "button", /Reset ngay/);
    await T.bringToFront();
    const gone = await T.waitForFunction(() => /Không tìm thấy/.test(document.querySelector("#ket-qua")?.innerText || ""), { timeout: 3000 })
      .then(() => true).catch(() => false);
    rec("Reset dữ liệu khi đang xem: chuyển sang Không tìm thấy, không reload",
      /DH0000E2E/.test(before) && gone && (await T.evaluate(() => window.__noReload === 1)), { before: before.slice(0, 80) });

    // ---- Lối vào /tra-cuu
    await T.goto(B + "/dat-lich/xac-nhan?ma=LH2611S15", { waitUntil: "networkidle0" });
    await sleep(400);
    const entry = await T.evaluate(() => ({
      footer: !!document.querySelector('footer a[href="/tra-cuu"]'),
      appt: !!document.querySelector('a[href="/tra-cuu?ma=LH2611S15"]'),
    }));
    rec("Footer và phiếu lịch hẹn có link /tra-cuu", entry.footer && entry.appt, entry);
    await T.goto(B + "/thanh-toan/thanh-cong?ma=DH2611S01", { waitUntil: "networkidle0" });
    await sleep(400);
    await clickText(T, 'a[href="/tra-cuu?ma=DH2611S01"]', /Theo dõi đơn hàng/);
    const fromOrder = await T.waitForFunction(() => location.pathname.startsWith("/tra-cuu") && /Hoàn thành/.test(document.querySelector("#ket-qua")?.innerText || ""), { timeout: 4000 })
      .then(() => true).catch(() => false);
    rec("Phiếu đơn hàng → Theo dõi đơn hàng → /tra-cuu thấy Hoàn thành", fromOrder);

    rec("Không lỗi console hay request >= 400", errs.length === 0, errs.slice(0, 5));
  } finally {
    await ctx.close();
  }
  return results;
}

await runStandalone(import.meta.url, run);
