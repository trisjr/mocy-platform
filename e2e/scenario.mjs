// Kịch bản demo 2 tab: khách mua hàng -> admin thấy ngay -> cắt thang có ảnh -> đặt lịch -> admin thấy ngay.
import {
  B, makeRecorder, newContext, newPage, runStandalone, shot, sleep, txt, waitText, clickText, clickNav,
  lsState, filterCount, makeTestPng, walkBooking, onConfirmPage, BOOKING_TITLES,
} from "./lib.mjs";

export async function run(browser) {
  const { rec, results } = makeRecorder("scenario");
  const ctx = await newContext(browser);
  const errs = [];
  const A = await newPage(ctx, "A", errs); // tab admin
  const T = await newPage(ctx, "B", errs); // tab khách
  let orderCode, consultCode, apptCode;
  try {
    // ---- Tab A: mở admin đơn hàng, đánh dấu để biết không bị reload
    await A.goto(B + "/admin/don-hang", { waitUntil: "networkidle0" });
    await A.evaluate(() => { window.__noReload = 1; });
    const allBefore = await filterCount(A, "Tất cả");
    rec("Admin đơn hàng có bộ lọc và số đơn mẫu", !!allBefore, allBefore || "");

    // ---- Tab B: mua hàng
    await T.goto(B + "/san-pham", { waitUntil: "networkidle0" });
    await clickText(T, "button", /Mất ngủ/);
    await sleep(600);
    let t = await txt(T);
    const m = t.match(/Tìm thấy (\d+) sản phẩm cho nhóm “([^”]+)”/);
    rec("Lọc sản phẩm theo nhóm Mất ngủ", !!m && /Mất ngủ/.test(m[2]) && /Táo nhân sao/.test(t), m ? m[0] : "không thấy dòng kết quả lọc");
    await shot(T, "scenario-b1-loc-mat-ngu");

    await Promise.all([
      T.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
      clickNav(T, 'a[href="/san-pham/tao-nhan-sao"]'),
    ]);
    await sleep(500);
    await clickText(T, "[role=radio]", /500g/);
    rec("Chọn gói 500g, giá cập nhật", /560\.000/.test(await txt(T)), T.url());
    await clickText(T, "button", /Thêm vào giỏ/);
    await sleep(400);
    rec("Thêm vào giỏ có thông báo", /Đã thêm/.test(await txt(T)));

    await T.goto(B + "/gio-hang", { waitUntil: "networkidle0" });
    t = await txt(T);
    rec("Giỏ hàng có Táo nhân sao 500g", /Táo nhân sao/.test(t) && /500g/.test(t));
    await T.type("#ma-uu-dai", "DONGY10");
    await clickText(T, "button", /^Áp dụng/);
    await sleep(500);
    t = await txt(T);
    rec("Áp mã DONGY10", /DONGY10/.test(t) && !(await T.$("#ma-uu-dai-loi")), t.split("\n").filter((l) => /DONGY|Giảm|Tạm tính|Tổng/.test(l)).join(" | "));
    await shot(T, "scenario-b2-gio-hang");

    await Promise.all([
      T.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
      clickNav(T, 'a[href="/thanh-toan"]'),
    ]);
    await T.type("#ho-ten", "Nguyễn Thị Kiểm Thử");
    await T.type("#so-dien-thoai", "0912345678");
    await clickText(T, "[role=radio]", /Chuyển khoản/);
    await clickText(T, "button[type=submit]", /Đặt hàng/);
    await T.waitForFunction(() => location.pathname.includes("thanh-cong"), { timeout: 8000 });
    await sleep(800);
    t = await txt(T);
    orderCode = new URL(T.url()).searchParams.get("ma");
    const qr = await T.evaluate(() => [...document.querySelectorAll("svg")].some((s) => s.getBoundingClientRect().width > 150));
    rec("Chuyển khoản: có mã đơn, mã QR, nội dung chuyển khoản", !!orderCode && /Đặt hàng thành công/.test(t) && qr && /Nội dung chuyển khoản/.test(t), { orderCode, qr });
    await shot(T, "scenario-b3-dat-hang-thanh-cong");

    // ---- Tab A thấy đơn mới, không reload
    await A.bringToFront();
    const seen = await waitText(A, new RegExp(orderCode || "ZZZZ"), 6000);
    rec("Admin thấy đơn mới ngay, không reload", seen && (await A.evaluate(() => !!window.__noReload)), { orderCode, filterBefore: allBefore, filterAfter: await filterCount(A, "Tất cả") });
    await shot(A, "scenario-a1-don-hang-moi");
    await clickText(A, "button", new RegExp("Đơn " + orderCode + ": chuyển sang"));
    await sleep(500);
    const row = await A.evaluate((code) => {
      const el = [...document.querySelectorAll("tr,li")].find((e) => e.innerText.includes(code) && e.innerText.length < 800);
      return el ? el.innerText.replace(/\s+/g, " ") : null;
    }, orderCode);
    rec("Admin chuyển trạng thái đơn một bước", !!row && /Đang bốc thuốc/.test(row) && !/Chờ xác nhận/.test(row.replace(/Xác nhận, bốc thuốc/, "")), row || "");
    await shot(A, "scenario-a2-don-hang-doi-trang-thai");

    // ---- Cắt thang có ảnh
    await T.bringToFront();
    await T.goto(B + "/san-pham/bai-thuoc-an-than", { waitUntil: "networkidle0" });
    await Promise.all([
      T.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}),
      clickText(T, "a", /Đăng ký tư vấn cắt thang/),
    ]);
    await sleep(500);
    const sel = await T.evaluate(() => {
      const s = document.querySelector("select");
      return s ? s.options[s.selectedIndex]?.text : null;
    });
    await T.type("textarea[name=symptoms]", "Mất ngủ kéo dài, hay tỉnh giấc lúc 3 giờ sáng, đang uống thuốc huyết áp.");
    await (await T.$("input[type=file]")).uploadFile(makeTestPng());
    const prev = await T.waitForSelector('img[alt="Ảnh đơn thuốc cũ đã chọn"]', { timeout: 8000 }).catch(() => null);
    await sleep(600);
    const pv = prev ? await prev.evaluate((i) => ({ nw: i.naturalWidth, w: Math.round(i.getBoundingClientRect().width) })) : null;
    rec("Form cắt thang: chọn sẵn bài thuốc và hiện ảnh xem trước", !!pv && pv.nw > 0 && /an thần/i.test(sel || ""), { selected: sel, preview: pv });
    await shot(T, "scenario-b4-cat-thang-xem-truoc");
    await T.type("input[name=name]", "Trần Văn Cắt Thang");
    await T.type("input[name=phone]", "0987654321");
    await clickText(T, "button[type=submit]", /Gửi|Đăng ký/);
    await waitText(T, /Đã gửi yêu cầu tư vấn/, 6000);
    t = await txt(T);
    consultCode = t.match(/\b(TV[A-Z0-9]+)\b/)?.[1] || t.match(/Mã yêu cầu của bạn\s*\n?\s*([A-Z0-9]+)/)?.[1];
    rec("Gửi form cắt thang: có mã yêu cầu", /Đã gửi yêu cầu tư vấn/.test(t) && !!consultCode, consultCode || t.slice(0, 200));
    await shot(T, "scenario-b5-cat-thang-da-gui");

    // ---- Đặt lịch
    const info = await walkBooking(T, { doc: 0, dateIdx: 1, timeIdx: 0 });
    await onConfirmPage(T);
    await sleep(700);
    t = await txt(T);
    apptCode = new URL(T.url()).searchParams.get("ma");
    rec("Đặt lịch online đủ 5 bước", JSON.stringify(info.titles) === JSON.stringify(BOOKING_TITLES) && !!apptCode, { titles: info.titles, code: apptCode });
    rec("Trang xác nhận lịch có mã và hướng dẫn chuẩn bị", !!apptCode && /chuẩn bị/i.test(t) && t.includes(apptCode));
    await shot(T, "scenario-b6-xac-nhan-lich");

    // ---- Admin thấy lịch hẹn và yêu cầu cắt thang (điều hướng client-side, không reload)
    await A.bringToFront();
    await clickText(A, 'nav[aria-label="Menu quản trị"] a', /Lịch hẹn/);
    await A.waitForFunction(() => location.pathname === "/admin/lich-hen", { timeout: 6000 });
    const seenAppt = await waitText(A, new RegExp(apptCode || "ZZZZ"), 6000);
    rec("Admin thấy lịch hẹn mới, không reload", seenAppt && (await A.evaluate(() => !!window.__noReload)), { apptCode });
    await shot(A, "scenario-a3-lich-hen-moi");

    await clickText(A, "[role=tab]", /Yêu cầu cắt thang/);
    const seenC = await waitText(A, new RegExp(consultCode || "ZZZZ"), 4000);
    await A.evaluate(() => {
      const b = [...document.querySelectorAll("[role=tabpanel] button[aria-expanded]")].find((x) => x.getClientRects().length);
      b?.click();
    });
    await sleep(600);
    const img = await A.evaluate(() => {
      const i = [...document.querySelectorAll("[role=tabpanel] img")].find((x) => x.getClientRects().length);
      return i ? { alt: i.alt, nw: i.naturalWidth } : null;
    });
    rec("Admin thấy yêu cầu cắt thang mới kèm ảnh đơn thuốc", seenC && !!img && img.nw > 0, { consultCode, image: img });
    await shot(A, "scenario-a4-cat-thang-chi-tiet");

    const st = await lsState(A);
    rec("localStorage có đủ đơn, lịch hẹn, yêu cầu vừa tạo", !!st && st.orders.includes(orderCode) && st.appointments.some((a) => a.code === apptCode) && st.consults.includes(consultCode));
  } catch (e) {
    rec("Kịch bản chạy hết không lỗi", false, e.message);
    await shot(T, "scenario-fail-b").catch(() => {});
    await shot(A, "scenario-fail-a").catch(() => {});
  }
  const real = errs.filter((e) => !/favicon/.test(e));
  rec("Không lỗi console hay request >= 400", real.length === 0, real.slice(0, 5));
  await ctx.close();
  return results;
}

await runStandalone(import.meta.url, run);
