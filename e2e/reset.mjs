// Nút "Reset dữ liệu demo" trong Admin xóa đơn, lịch hẹn, yêu cầu cắt thang vừa tạo và trả về dữ liệu mẫu.
import {
  B, makeRecorder, newContext, newPage, runStandalone, shot, sleep, txt, waitText, clickText,
  walkBooking, onConfirmPage, lsState, filterCount,
} from "./lib.mjs";

export async function run(browser) {
  const { rec, results } = makeRecorder("reset");
  const ctx = await newContext(browser);
  const errs = [];
  const A = await newPage(ctx, "A", errs);
  const T = await newPage(ctx, "B", errs);
  try {
    await A.goto(B + "/admin", { waitUntil: "networkidle0" });
    await sleep(500);
    const base = await lsState(A);
    const baseCounts = base ? { o: base.orders.length, a: base.appointments.length, c: base.consults.length } : null;
    rec("Có dữ liệu mẫu ban đầu", !!base && baseCounts.o > 0 && baseCounts.a > 0, baseCounts);

    // Tạo một lịch hẹn và một yêu cầu cắt thang ở tab khách
    await walkBooking(T, { doc: 0, dateIdx: 1, timeIdx: 3, name: "Khách Reset", phone: "0955000111" });
    await onConfirmPage(T);
    const apptCode = new URL(T.url()).searchParams.get("ma");
    await T.goto(B + "/tu-van?san-pham=bai-thuoc-an-than", { waitUntil: "networkidle0" });
    await T.type("textarea[name=symptoms]", "Thử reset dữ liệu.");
    await T.type("input[name=name]", "Khách Reset");
    await T.type("input[name=phone]", "0955000111");
    await clickText(T, "button[type=submit]", /Gửi|Đăng ký/);
    await waitText(T, /Đã gửi yêu cầu tư vấn/, 6000);
    const consultCode = (await txt(T)).match(/\b(TV[A-Z0-9]+)\b/)?.[1];
    await A.bringToFront();
    await sleep(600);
    const pre = await lsState(A);
    rec("Dữ liệu tạo mới đã vào localStorage", !!apptCode && !!consultCode && pre.appointments.some((a) => a.code === apptCode) && pre.consults.includes(consultCode), { apptCode, consultCode });

    await clickText(A, "button", /Reset dữ liệu demo/);
    await sleep(400);
    await shot(A, "reset-hop-thoai-xac-nhan");
    await clickText(A, "button", /Reset ngay/);
    await sleep(900);

    await clickText(A, 'nav[aria-label="Menu quản trị"] a', /Lịch hẹn/);
    await A.waitForFunction(() => location.pathname === "/admin/lich-hen");
    await sleep(500);
    const apptText = await txt(A);
    const apptAll = await filterCount(A, "Tất cả");
    await clickText(A, "[role=tab]", /Yêu cầu cắt thang/);
    await sleep(400);
    const consultText = await txt(A);
    const post = await lsState(A);
    const postCounts = { o: post.orders.length, a: post.appointments.length, c: post.consults.length };
    rec("Reset xóa lịch hẹn và yêu cầu cắt thang vừa tạo", !apptText.includes(apptCode) && !consultText.includes(consultCode), { apptGone: !apptText.includes(apptCode), consultGone: !consultText.includes(consultCode) });
    rec("Reset trả số lượng về bằng dữ liệu mẫu ban đầu", JSON.stringify(postCounts) === JSON.stringify(baseCounts), { base: baseCounts, post: postCounts, apptFilter: apptAll });
    await shot(A, "reset-sau-khi-reset");
  } catch (e) {
    rec("Kịch bản chạy hết không lỗi", false, e.message);
    await shot(A, "reset-fail").catch(() => {});
  }
  const real = errs.filter((e) => !/favicon/.test(e));
  rec("Không lỗi console hay request >= 400", real.length === 0, real.slice(0, 5));
  await ctx.close();
  return results;
}

await runStandalone(import.meta.url, run);
