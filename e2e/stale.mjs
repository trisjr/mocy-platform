// Tab cũ (không nhận được sự kiện storage) không được ghi đè dữ liệu mà tab khác vừa lưu.
import {
  B, makeRecorder, newContext, newPage, runStandalone, shot, sleep, clickText,
  walkBooking, onConfirmPage, lsState, alerts,
} from "./lib.mjs";

// Chặn sự kiện storage để giả lập tab cũ. Bật bằng window.__blockStorage = true.
function gate() {
  const orig = window.addEventListener;
  window.addEventListener = function (type, fn, opts) {
    if (type === "storage") {
      const f = fn;
      fn = function (e) {
        if (window.__blockStorage) return;
        return f.call(this, e);
      };
    }
    return orig.call(this, type, fn, opts);
  };
}
const block = (p) => p.evaluate(() => { window.__blockStorage = true; });

export async function run(browser) {
  const { rec, results } = makeRecorder("stale");
  const ctx = await newContext(browser);
  const errs = [];
  const mkGated = async (tag) => {
    const p = await newPage(ctx, tag, errs);
    await p.evaluateOnNewDocument(gate);
    return p;
  };
  const T = await newPage(ctx, "B", errs);
  try {
    // S1: tab cũ đặt đúng giờ vừa bị tab khác đặt -> bị chặn, lịch của B còn
    const D = await mkGated("D");
    const d = await walkBooking(D, { doc: 0, dateIdx: 1, timeIdx: 2, name: "Người D", phone: "0911000007", stopBefore: true });
    await block(D);
    const b = await walkBooking(T, { doc: 0, dateIdx: 1, timeIdx: 2, name: "Người B", phone: "0911000002" });
    await onConfirmPage(T);
    await D.bringToFront();
    await clickText(D, "button[type=submit]", /Xác nhận đặt lịch/);
    await sleep(1200);
    let ls = (await lsState(T)).appointments;
    const bRec = ls.filter((a) => a.name === "Người B").length;
    const dRec = ls.filter((a) => a.name === "Người D").length;
    rec("Tab cũ đặt trùng giờ: bị chặn, lịch của B còn nguyên", d.date === b.date && d.time === b.time && bRec === 1 && dRec === 0 && /Khung giờ/.test(await alerts(D)) && !D.url().includes("xac-nhan"), { slot: d.date + " " + d.time, bRec, dRec, alert: await alerts(D) });
    await shot(D, "stale-s1-tab-cu-bi-chan");

    // S2: tab cũ đặt giờ khác -> cả hai lịch đều còn
    const D2 = await mkGated("D2");
    const d2 = await walkBooking(D2, { doc: 0, dateIdx: 1, timeIdx: 0, name: "Người D2", phone: "0911000009", stopBefore: true });
    await block(D2);
    const b2 = await walkBooking(T, { doc: 0, dateIdx: 1, timeIdx: 1, name: "Người B2", phone: "0911000010" });
    await onConfirmPage(T);
    await D2.bringToFront();
    await clickText(D2, "button[type=submit]", /Xác nhận đặt lịch/);
    const ok2 = await onConfirmPage(D2);
    ls = (await lsState(T)).appointments;
    rec("Tab cũ đặt giờ khác: cả hai lịch đều còn", ok2 && d2.time !== b2.time && ls.some((a) => a.name === "Người B2") && ls.some((a) => a.name === "Người D2"), { d2: d2.time, b2: b2.time });

    // S3: admin tab cũ đổi trạng thái sau khi tab khác vừa đặt lịch -> lịch mới không bị mất
    const A = await mkGated("A");
    await A.goto(B + "/admin/lich-hen", { waitUntil: "networkidle0" });
    await block(A);
    const before = (await lsState(A)).appointments.length;
    await walkBooking(T, { doc: 0, dateIdx: 1, timeIdx: 0, name: "Người B3", phone: "0911000011" });
    await onConfirmPage(T);
    await A.bringToFront();
    await clickText(A, "button", /Xác nhận lịch/);
    await sleep(800);
    ls = (await lsState(A)).appointments;
    const shown = await A.evaluate(() => document.body.innerText.includes("Người B3"));
    rec("Admin tab cũ đổi trạng thái: lịch mới của B3 vẫn còn và hiện ra", ls.some((a) => a.name === "Người B3") && ls.length === before + 1 && shown, { before, after: ls.length, shown });
    await shot(A, "stale-s3-admin-tab-cu");
  } catch (e) {
    rec("Kịch bản chạy hết không lỗi", false, e.message);
  }
  const real = errs.filter((e) => !/favicon/.test(e));
  rec("Không lỗi console hay request >= 400", real.length === 0, real.slice(0, 5));
  await ctx.close();
  return results;
}

await runStandalone(import.meta.url, run);
