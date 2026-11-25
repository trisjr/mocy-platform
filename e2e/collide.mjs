// Trùng giờ: tab C đang ở bước 5, tab B đặt đúng khung giờ đó. Tab C phải tự quay về bước chọn giờ, báo trùng, giữ thông tin đã nhập.
import {
  B, makeRecorder, newContext, newPage, runStandalone, shot, sleep, txt, waitText, clickText,
  stepTitle, radio, nextStep, walkBooking, onConfirmPage, lsState, alerts,
} from "./lib.mjs";

export async function run(browser) {
  const { rec, results } = makeRecorder("collide");
  const ctx = await newContext(browser);
  const errs = [];
  const A = await newPage(ctx, "A", errs); // admin
  const T = await newPage(ctx, "B", errs); // khách đặt trước
  try {
    await A.goto(B + "/admin/lich-hen", { waitUntil: "networkidle0" });
    await A.evaluate(() => { window.__noReload = 1; });

    const C = await newPage(ctx, "C", errs); // khách đặt sau, bị trùng
    const ci = await walkBooking(C, { doc: 0, dateIdx: 1, timeIdx: 1, name: "Người C", phone: "0911000005", stopBefore: true });
    rec("Tab C tới được bước 5", (await stepTitle(C)) === "Thông tin của bạn", ci);

    const bi = await walkBooking(T, { doc: 0, dateIdx: 1, timeIdx: 1, name: "Người B", phone: "0911000006" });
    const bOk = await onConfirmPage(T);
    rec("Tab B đặt đúng khung giờ của C", bOk && bi.date === ci.date && bi.time === ci.time && bi.doctor === ci.doctor, { b: bi.date + " " + bi.time, c: ci.date + " " + ci.time });

    await C.bringToFront();
    await sleep(900);
    const title = await stepTitle(C);
    const t = await txt(C);
    const nextDisabled = await C.evaluate(() => [...document.querySelectorAll("button")].find((b) => /^\s*Tiếp tục/.test(b.innerText))?.disabled);
    rec("Tab C tự quay về bước chọn giờ và báo trùng", title === "Chọn ngày và giờ khám" && t.includes("Khung giờ này vừa có người đặt"), { title, alert: await alerts(C) });
    rec("Tab C không cho tiếp tục khi chưa đổi giờ", nextDisabled === true, { nextDisabled });
    await shot(C, "collide-c-khung-gio-bi-chiem");

    await radio(C, "Giờ khám", 0);
    rec("Chọn giờ khác thì thông báo trùng biến mất", !(await txt(C)).includes("vừa có người đặt"));
    await nextStep(C);
    const fields = await C.evaluate(() => [...document.querySelectorAll("input[name=name],input[name=phone]")].map((i) => i.value).join(","));
    rec("Thông tin đã nhập được giữ lại", fields === "Người C,0911000005", fields);
    await clickText(C, "button[type=submit]", /Xác nhận đặt lịch/);
    rec("Tab C đặt lại thành công ở giờ khác", await onConfirmPage(C, 6000), C.url());

    const st = await lsState(C);
    const seen = {};
    st.appointments.filter((a) => a.status !== "cancelled").forEach((a) => {
      const k = a.doctorId + "|" + a.date + "|" + a.time;
      seen[k] = (seen[k] || 0) + 1;
    });
    const dupes = Object.entries(seen).filter(([, v]) => v > 1);
    rec("Không có lịch trùng (lương y, ngày, giờ) trong localStorage", dupes.length === 0, dupes);

    await A.bringToFront();
    const live = await waitText(A, /Người C/, 5000);
    rec("Admin thấy lịch của B và C tức thời, không reload", live && (await txt(A)).includes("Người B") && (await A.evaluate(() => !!window.__noReload)));
  } catch (e) {
    rec("Kịch bản chạy hết không lỗi", false, e.message);
    for (const p of await ctx.pages()) await shot(p, "collide-fail-" + (await ctx.pages()).indexOf(p)).catch(() => {});
  }
  const real = errs.filter((e) => !/favicon/.test(e));
  rec("Không lỗi console hay request >= 400", real.length === 0, real.slice(0, 5));
  await ctx.close();
  return results;
}

await runStandalone(import.meta.url, run);
