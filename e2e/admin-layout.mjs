// Bố cục Admin ở 390, 1280, 1440: không tràn ngang, không lặp chữ "Lương y Lương y", số điện thoại, tab, nút và tên khách không bị xuống dòng.
import { B, makeRecorder, newContext, newPage, runStandalone, shot, sleep } from "./lib.mjs";

function inspect() {
  const vis = (e) => e.getClientRects().length > 0;
  // Số dòng chữ thực tế: gộp các hộp chữ chồng nhau theo chiều dọc (badge, icon cạnh chữ không tính là dòng mới).
  const lines = (el) => {
    const rg = document.createRange();
    rg.selectNodeContents(el);
    const rs = [...rg.getClientRects()].filter((r) => r.width > 0 && r.height > 0).sort((a, b) => a.top - b.top);
    let n = 0;
    let bottom = -Infinity;
    for (const r of rs) {
      const mid = (r.top + r.bottom) / 2;
      if (mid > bottom) n++;
      bottom = Math.max(bottom, r.bottom);
    }
    return n;
  };
  const txt = document.body.innerText;
  const phones = [...document.querySelectorAll('a[href^="tel:"]')].filter(vis);
  const tabs = [...document.querySelectorAll("[role=tab]")].filter(vis);
  // Nút thao tác ở trang lịch hẹn và trang đơn hàng.
  const btns = [...document.querySelectorAll("main button, [role=tabpanel] button, main a")]
    .filter(vis)
    .filter((b) => /Xem triệu chứng|Triệu chứng|Thu gọn|Chi tiết|Hủy lịch|Đã khám|Xác nhận|Đã liên hệ|Giao hàng|Hoàn thành|bốc thuốc/.test(b.innerText));
  // Cột 2 của bảng đơn hàng là tên khách.
  const names = location.pathname === "/admin/don-hang"
    ? [...document.querySelectorAll("tbody tr td:nth-child(2)")].filter(vis).map((td) => td.querySelector("p")).filter(Boolean)
    : [];
  const clean = (s) => s.replace(/\s+/g, " ").trim();
  return {
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    dup: txt.match(/(Lương y|Bác sĩ YHCT)\s+\1/g) || [],
    phoneWrap: phones.filter((a) => lines(a) > 1).map((a) => clean(a.innerText)),
    tabWrap: tabs.filter((t) => lines(t) > 1).map((t) => clean(t.innerText)),
    btnWrap: [...new Set(btns.filter((b) => lines(b) > 1).map((b) => clean(b.innerText)))],
    nameWrap: names.filter((n) => lines(n) > 1).map((n) => clean(n.innerText)),
    counts: { phones: phones.length, tabs: tabs.length, btns: btns.length, names: names.length },
  };
}

export async function run(browser) {
  const { rec, results } = makeRecorder("admin-layout");
  const ctx = await newContext(browser);
  const errs = [];
  for (const [w, h] of [[390, 844], [1280, 800], [1440, 900]]) {
    const p = await newPage(ctx, "w" + w, errs, { width: w, height: h });
    const per = {};
    for (const path of ["/admin", "/admin/don-hang", "/admin/lich-hen"]) {
      await p.goto(B + path, { waitUntil: "networkidle0" });
      await sleep(500);
      per[path] = await p.evaluate(inspect);
      await shot(p, "admin-" + w + path.replace(/\//g, "-"), { fullPage: false });
    }
    const all = Object.entries(per);
    const bad = (key) => all.filter(([, v]) => (Array.isArray(v[key]) ? v[key].length : 0) > 0).map(([k, v]) => ({ page: k, [key]: v[key] }));
    const L = w + "px: ";
    rec(L + "không tràn ngang", all.every(([, v]) => v.sw <= v.cw), all.filter(([, v]) => v.sw > v.cw).map(([k, v]) => ({ page: k, sw: v.sw, cw: v.cw })));
    rec(L + 'không lặp chữ "Lương y Lương y"', bad("dup").length === 0, bad("dup"));
    rec(L + "số điện thoại, tab, nút, tên khách không xuống dòng", ["phoneWrap", "tabWrap", "btnWrap", "nameWrap"].every((k) => bad(k).length === 0), ["phoneWrap", "tabWrap", "btnWrap", "nameWrap"].flatMap(bad));
    // Cần có phần tử để kiểm: tránh pass rỗng.
    rec(L + "có dữ liệu để kiểm (số điện thoại, nút ở trang lịch hẹn)", per["/admin/lich-hen"].counts.phones > 0 && per["/admin/lich-hen"].counts.btns > 0, per["/admin/lich-hen"].counts);
    await p.close();
  }
  const real = errs.filter((e) => !/favicon/.test(e));
  rec("Không lỗi console hay request >= 400", real.length === 0, real.slice(0, 5));
  await ctx.close();
  return results;
}

await runStandalone(import.meta.url, run);
