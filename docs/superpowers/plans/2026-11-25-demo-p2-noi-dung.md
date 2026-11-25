# Nội dung P2 cho bản Demo — Kế hoạch triển khai

> **Cho agent thực thi:** dùng superpowers:subagent-driven-development hoặc superpowers:executing-plans, làm lần lượt từng task. Các bước dùng checkbox (`- [ ]`).

**Mục tiêu:** Bổ sung 3 hạng mục P2 trong `demo-content-gap-analysis.md`: trang tra cứu `/tra-cuu` (§3.5), nút liên hệ nổi + chỉ đường (§3.6), trang `/chinh-sach` (§3.7).

**Kiến trúc:** `/tra-cuu` là client component đọc store có sẵn (`useOrders`, `useAppointments`, `useConsultRequests`), lọc bằng hàm thuần trong `src/lib/lookup.ts` và `useMemo`. Store không đổi, nên khi Admin đổi trạng thái thì trang tự cập nhật qua sự kiện `storage`. `/chinh-sach` là server component tĩnh. Nút nổi là một client component nhỏ gắn vào `SiteShell` (không hiện ở `/admin`). Chỉ đường là link Google Maps, không nhúng iframe.

**Công nghệ:** Next 16.4.6 (App Router), React 19.3, Tailwind 4.3, lucide-react. Kiểm thử bằng e2e puppeteer-core trong `e2e/`.

**Spec:** `demo-content-gap-analysis.md` (mục 3, nhóm P2, và checklist mục 5 bước 4–5). Plan P1 `docs/superpowers/plans/2026-11-25-demo-p1-noi-dung.md` để tham khảo phong cách và các quyết định đã chốt.

---

## Quyết định cần anh duyệt

Em đã chọn sẵn phương án đề xuất (**★**). Anh đổi mục nào thì em sửa plan trước khi làm.

1. **Loại mã tra cứu được**
   - **★ A.** Đơn hàng (`DH…`), lịch hẹn (`LH…`) **và yêu cầu tư vấn cắt thang (`TV…`)**. Phiếu `/tu-van` cũng phát mã `TV…` cho khách; nếu nhập mã đó mà báo "Không tìm thấy" thì giữa buổi demo trông như lỗi. Thêm `TV` chỉ tốn một nhánh lọc.
   - B. Chỉ `DH` và `LH` như spec. Gặp mã `TV…` thì hiện thông báo riêng: "Yêu cầu tư vấn được lương y gọi lại trực tiếp, vui lòng gọi hotline".
2. **Tra bằng số điện thoại có lộ thông tin không?** Trang `/chinh-sach#bao-mat` của chính plan này cam kết giữ kín triệu chứng và địa chỉ. Ai biết số điện thoại cũng nhập được, nên:
   - **★ Tra bằng SĐT chỉ ra danh sách gọn**: loại, mã, ngày, trạng thái. Bấm vào một dòng mới mở chi tiết (`?ma=…`).
   - **Chi tiết chỉ hiện**: trạng thái (kèm mốc thời gian), lương y, giờ hẹn, hình thức, sản phẩm và tổng tiền. Tên khách viết tắt (VD "Tạ Q. Vinh"), SĐT che giữa (`0973 *** 821`). **Không** hiện địa chỉ, triệu chứng hay ảnh đơn thuốc.
   - Giai đoạn 2: xác thực OTP khi tra bằng SĐT. Em ghi điều này vào §4 của spec.
3. **Số điện thoại có nằm trên URL không:** **★ Không.** URL chỉ mang mã (`/tra-cuu?ma=DH2611S21`, cùng kiểu `?ma=` như các trang xác nhận). Tra bằng SĐT chỉ giữ trong state, không ghi vào lịch sử trình duyệt.
4. **Link Zalo:** `SITE.zalo` đang là số mẫu `0901 234 567`, và `https://zalo.me/0901234567` sẽ mở tài khoản Zalo thật của ai đó đang dùng số này.
   - **★ Vẫn dùng `zalo.me/<số>` lấy từ `SITE.zalo`**, và thêm mục "Thay số Zalo thật của phòng khám vào `SITE.zalo`" vào việc cần làm trước buổi demo (Task 5).
   - Nếu chưa có số thật: nút Zalo tạm trỏ `tel:` như hotline.
5. **Nút nổi trên điện thoại**
   - **★ Ẩn dưới `lg` (1024px).** Trên điện thoại, header đã có nút gọi và nav đáy đã chiếm đáy màn hình. Ở 768px, khung form `max-w-3xl` sát mép phải nên nút nổi sẽ che nút "Tiếp tục". Từ 1024px trở lên, lề hai bên đủ rộng (≥128px).
   - Hiện một nút Zalo nhỏ phía trên nav đáy, ẩn ở `/dat-lich`, `/tu-van`, `/thanh-toan`, `/gio-hang`.
6. **Chỉ đường:** **★ Link "Chỉ đường" mở Google Maps** (`https://www.google.com/maps/search/?api=1&query=<địa chỉ>`), mở tab mới, đặt ở 3 nơi:
   - Footer (cột Liên hệ);
   - `/gioi-thieu#khong-gian`;
   - phiếu xác nhận lịch hẹn khi hình thức là "Khám tại phòng khám".

   Không nhúng iframe bản đồ, vì request bên thứ ba làm e2e (bắt lỗi console/request) chập chờn, và demo offline sẽ hiện khung trắng.
7. **Footer**
   - **★** Thêm một dòng "Tra cứu đơn hàng & lịch hẹn" vào `LINKS` (ngay sau "Giỏ hàng").
   - **★** Thêm một hàng "Chính sách giao hàng · Đổi trả · Bảo mật thông tin" (3 link neo) vào dải pháp lý cuối Footer, thay vì 3 dòng trong `LINKS` (cột đã có 8 dòng, trên điện thoại sẽ quá dài).
   - `NAV_ITEMS` giữ nguyên (lý do giống P1: logo bị cắt).
8. **Số liệu chính sách là mẫu**, có ghi "(mẫu)" và cần phòng khám xác nhận:
   - báo lỗi hàng trong **48 giờ** kể từ khi nhận;
   - giao nội thành Hà Nội **trong ngày**, đi tỉnh **2–4 ngày**;
   - hoàn tiền trong **3 ngày làm việc**.

   Phí ship lấy từ `SHIPPING_FEE` và `FREE_SHIPPING_THRESHOLD`, không gõ tay.

---

## Ràng buộc chung

- `AGENTS.md`: trước khi viết code, đọc hướng dẫn trong `node_modules/next/dist/docs/` về **useSearchParams/Suspense**, **metadata** và **static export**. Chú ý các thông báo deprecated.
- Phải build được cả 2 chế độ: `npm run build` và `PAGES_BASE_PATH=/mocy-platform npm run build`. Không dùng route handler, `headers()` hay ISR.
- **Không sửa store** (`src/lib/store/*`) và không sửa type giao dịch. Lọc bằng `useMemo` trên kết quả của `useOrders()` / `useAppointments()` / `useConsultRequests()`. Không `filter` hay `map` trong selector của `useStore`, vì sẽ render lặp vô hạn.
- Component dùng `useSearchParams()` phải nằm trong `<Suspense>`. UI đọc store chỉ render khi `useHydrated()` là true; trước đó hiện "Đang tải…".
- Link nội bộ dùng `next/link`. Link ngoài (Zalo, Maps) dùng `<a target="_blank" rel="noopener noreferrer">`. Không thêm dependency.
- Copy 100% tiếng Việt. Không dùng các chữ bị `e2e/shots.mjs` bắt: Home, Cart, Search, Contact, Loading, Submit, Products… (VD viết "Tra cứu", không viết "Search"; viết "Nhắn Zalo", không viết "Chat").
- Xưng "anh/chị" trên `/tra-cuu` và `/chinh-sach`. Nút nổi không dùng đại từ.
- Nội dung chính sách phải **khớp với những gì P1 đã ghi**, không chép nguyên chữ của §3.7:
  - Dược liệu: túi zip kèm gói hút ẩm.
  - Thuốc sắc sẵn: túi hút chân không, đóng thùng xốp, bảo quản ngăn mát, dùng trong 7 ngày.
  - Không dùng chữ "vô trùng".
  - Đổi lịch hoặc hủy lịch: gọi hoặc nhắn Zalo hotline trước giờ hẹn 2 tiếng.
- Tuân thủ quảng cáo y tế: không hứa "chữa khỏi". Số liệu chưa được khách xác nhận phải ghi "(mẫu)".
- Dùng hằng số có sẵn: `SITE`, `ORDER_STATUS_FLOW`, `ORDER_STATUS_META`, `APPOINTMENT_STATUS_META`, `CONSULT_STATUS_META`, `CONSULT_MODE_LABELS`, `formatPrice`, `formatDateTime`, `formatDateKey`, `normalizeText`, `isValidPhone`.
- Giữ phong cách sẵn có: `label-frame`, `paper-fiber`, viền `border-dashed border-line-strong/60`, `Badge` theo `tone`. Vùng bấm tối thiểu `min-h-12`.
- Commit: `<type>(<scope>): <summary>`, một dòng, không có body, không có trailer.
- Trước Task 1, tạo nhánh: `git switch -c feat/demo-p2-content`.

## Cách kiểm chứng

Repo không có unit test. Mỗi task được kiểm bằng:

1. Viết kiểm tra e2e cho phần mới, cùng lúc với code.
2. Chạy `npm run lint` và `npx tsc --noEmit`.
3. Dừng server `next start` cũ ở cổng 3100 (nếu còn chạy), chạy `npm run build && npx next start -p 3100` (để chạy nền), rồi chạy suite liên quan với `BASE_URL=http://localhost:3100`. Kết quả đạt: mọi dòng đều `PASS`, exit code 0.

Dữ liệu seed dùng trong kiểm tra (mã cố định trong `src/data/seed.ts`):

| Khách | SĐT | Đơn | Lịch hẹn |
|---|---|---|---|
| Tạ Quang Vinh | `0973219821` | `DH2611S21` (Chờ xác nhận) | `LH2611S15` (Đã xác nhận, hôm nay) |
| Phạm Thị Lan | `0912345601` | `DH2611S01` (Hoàn thành) | `LH2611S02` (Đã khám) |

## Điểm cần soát kỹ (không có task nào tự kiểm hết)

1. **Đồng bộ tức thời:** Admin đổi trạng thái ở tab khác, `/tra-cuu` cập nhật mà không reload (`window.__noReload` vẫn còn). Kiểm ở Task 1.
2. **Bản ghi biến mất khi đang xem:** Admin bấm "Reset dữ liệu demo" trong lúc `/tra-cuu?ma=<đơn vừa tạo>` đang mở. Trang chuyển sang "Không tìm thấy", không crash, không lỗi console. Kiểm ở Task 1.
3. **Nhiều kiểu nhập:** SĐT có khoảng trắng hoặc dấu chấm (`0973 219 821`, `0973.219.821`), mã chữ thường (`dh2611s21`), có khoảng trắng đầu/cuối. Kiểm ở Task 1.
4. **Nút nổi che nút chính:** ở 1024 và 1280, cuộn xuống cuối `/dat-lich` và `/thanh-toan` (có hàng trong giỏ). `elementFromPoint` tại tâm nút "Tiếp tục" / "Đặt hàng" phải trả về chính nút đó. Chạy lại **toàn bộ** e2e vì các suite cũ click theo tọa độ. Kiểm ở Task 4.
5. **Static export và 390px:** `out/tra-cuu/index.html`, `out/chinh-sach/index.html` có được tạo; hai trang không tràn ngang ở 390. Kiểm ở Task 3 (thêm vào `PAGES`) và Task 5.

---

### Task 1: Hàm tra cứu và trang `/tra-cuu`

**Files:**
- Create: `src/lib/lookup.ts`
- Create: `src/components/lookup/LookupView.tsx` (client: form, danh sách và chi tiết)
- Create: `src/app/tra-cuu/page.tsx` (server: `metadata`, `<Suspense>` bọc `LookupView`)
- Create: `e2e/lookup.mjs`
- Modify: `e2e/run.mjs`: thêm `"lookup"` vào `SUITES` ngay sau `"scenario"`
- Modify: `e2e/README.md`: thêm dòng `lookup.mjs`

**Interfaces:**
- Produces (`src/lib/lookup.ts`, hàm thuần, không import store):

  ```ts
  export type LookupKind = "order" | "appointment" | "consult";
  export type LookupQuery =
    | { type: "code"; code: string }     // đã trim, bỏ khoảng trắng, viết hoa
    | { type: "phone"; phone: string };  // chỉ còn chữ số
  export function parseLookupInput(input: string): LookupQuery | { error: string };
  export function codeKind(code: string): LookupKind | null; // "DH" | "LH" | "TV" theo tiền tố
  export interface LookupMatches { orders: Order[]; appointments: Appointment[]; consults: ConsultRequest[] }
  export function findMatches(q: LookupQuery, data: LookupMatches): LookupMatches;
  export function maskPhone(phone: string): string;   // "0973219821" -> "0973 *** 821"
  export function shortName(name: string): string;    // "Tạ Quang Vinh" -> "Tạ Q. Vinh"; 1–2 từ giữ nguyên
  ```

- Route `/tra-cuu`, nhận `?ma=<mã>`. Task 2 link tới route này.

**Quy tắc `parseLookupInput`** (thứ tự kiểm):
1. Bỏ khoảng trắng và dấu chấm. Nếu rỗng thì trả lỗi "Vui lòng nhập mã đơn, mã lịch hẹn hoặc số điện thoại."
2. Nếu khớp `/^(DH|LH|TV)[0-9A-Z]{4,}$/i` thì trả `{ type: "code", code: <viết hoa> }`.
3. Nếu `isValidPhone` thì trả `{ type: "phone", phone }`.
4. Còn lại thì trả lỗi "Mã gồm DH, LH hoặc TV và các ký tự in trên phiếu (VD DH2611S21), hoặc số điện thoại 10 chữ số."

`findMatches` so mã chính xác với `code`. So SĐT bằng cách bỏ mọi ký tự không phải số ở **cả hai phía** (store chỉ `trim` SĐT khách nhập).

**Giao diện `LookupView`:**
- `h1` là "Tra cứu đơn hàng & lịch hẹn". Bên dưới là một ô `Input` (label "Mã đơn, mã lịch hẹn hoặc số điện thoại", `inputMode="text"`) và nút "Tra cứu". Form có `noValidate`; lỗi hiện qua prop `error`.
- **Gửi mã:** `router.replace('/tra-cuu?ma=' + code)`. Kết quả đọc từ `?ma=`, nên reload hoặc mở link từ phiếu vẫn ra kết quả.
- **Gửi SĐT:** giữ trong state, xóa `?ma=` khỏi URL. Hiện danh sách `<ul>` mới nhất trước; mỗi dòng có loại ("Đơn hàng" / "Lịch hẹn" / "Yêu cầu tư vấn"), mã, ngày và `Badge` trạng thái. Mỗi dòng là `<Link href="/tra-cuu?ma=…">`. **Không hiện tên, địa chỉ hay triệu chứng trong danh sách.**
- **Chi tiết đơn** (`section#ket-qua`):
  - mã, `Badge` trạng thái;
  - dòng tiến độ 4 bước theo `ORDER_STATUS_FLOW` dạng `<ol>`: mỗi `<li>` có nhãn `ORDER_STATUS_META`, thời điểm lấy từ `statusHistory` (`formatDateTime`), và `aria-current="step"` cho bước hiện tại;
  - danh sách sản phẩm × số lượng, tổng tiền, phương thức thanh toán;
  - người nhận `shortName` + `maskPhone`.
- **Chi tiết lịch hẹn:** mã, `Badge`, `time` + `formatDateKey(date)`, tên lương y, hình thức (`CONSULT_MODE_LABELS`), "Cập nhật lúc {formatDateTime(updatedAt)}". Trạng thái `cancelled` thì thêm dòng gọi hotline để đặt lại.
- **Chi tiết yêu cầu tư vấn:** mã, `Badge` (`CONSULT_STATUS_META`), bài thuốc quan tâm (`productName` hoặc "Tư vấn chung"), ngày gửi.
- **Không tìm thấy** (đã hydrate): "Không tìm thấy {mã/số} trên thiết bị này." kèm link `tel:` hotline.
- **Chưa hydrate:** "Đang tải…".
- Cuối trang: một dòng nhỏ "Trạng thái tự cập nhật khi nhà thuốc xử lý, không cần tải lại trang."

- [ ] **Bước 1: Tạo `e2e/lookup.mjs`** theo mẫu `scenario.mjs` (2 tab trong cùng một `newContext`; T là tab khách, A là tab admin). Các kiểm tra:
  - T mở `/tra-cuu`, nhập `dh2611s21 ` (chữ thường, có khoảng trắng cuối) rồi bấm "Tra cứu":
    - URL chứa `?ma=DH2611S21`;
    - `#ket-qua` có "Chờ xác nhận" và `li[aria-current="step"]` đầu tiên;
    - text không chứa "Trần Hưng Đạo" (địa chỉ) và có "0973 *** 821".
  - **Đồng bộ:** đặt `window.__noReload = 1` ở T. A mở `/admin/don-hang` và bấm nút có `aria-label^="Đơn DH2611S21: chuyển sang"`. Trong 3 giây, T hiện "Đang bốc thuốc / đóng gói" và `__noReload === 1`.
  - Nhập `0973.219.821` thì danh sách có đúng 1 đơn `DH2611S21` và 1 lịch hẹn `LH2611S15`; text danh sách không chứa "Tạ Quang Vinh". Bấm dòng `LH2611S15` thì thấy "Đã xác nhận" và nhãn `CONSULT_MODE_LABELS` đúng với `mode` của lịch hẹn đó trong localStorage (seed có thể đổi hình thức theo ngày trong tuần).
  - Nhập `0973 219 821` thì ra cùng kết quả.
  - Nhập `abc` thì thấy lỗi định dạng. Nhập `DH0101ZZZ` thì thấy "Không tìm thấy".
  - **Bản ghi biến mất:** ở T, ghi vào `localStorage["mocy-demo"]` một đơn chép từ `DH2611S21` với `id`/`code` là `"e2e-lookup"`/`"DH0000E2E"`, rồi mở `/tra-cuu?ma=DH0000E2E` và thấy kết quả. A bấm "Reset dữ liệu demo" → "Reset ngay". T chuyển sang "Không tìm thấy" mà không reload.
  - Không lỗi console hay request ≥ 400 ở cả 2 tab.
- [ ] **Bước 2: Viết `src/lib/lookup.ts`** theo Interfaces và quy tắc ở trên.
- [ ] **Bước 3: Viết `LookupView` và `src/app/tra-cuu/page.tsx`.**
  - `metadata.title`: "Tra cứu đơn hàng & lịch hẹn".
  - `metadata.description`: "Nhập mã đơn, mã lịch hẹn hoặc số điện thoại để xem trạng thái xử lý tại Mộc Y."
- [ ] **Bước 4: Chạy lint, tsc, build và `node e2e/lookup.mjs`.** Kết quả mong đợi: PASS.
- [ ] **Bước 5: Commit**: `feat(lookup): add /tra-cuu order and appointment status page`

### Task 2: Lối vào `/tra-cuu`

**Files:**
- Modify: `src/components/store/OrderSuccess.tsx`: thêm `ButtonLink` outline "Theo dõi đơn hàng" → `/tra-cuu?ma=${order.code}`, đặt đầu nhóm nút cuối trang.
- Modify: `src/components/booking/BookingConfirmation.tsx`: thêm `ButtonLink` outline "Theo dõi lịch hẹn" → `/tra-cuu?ma=${appointment.code}`, đặt vào nhóm nút cuối trang, sau "Về trang chủ".
- Modify: `src/components/booking/ConsultForm.tsx` (chỉ nhánh `done`): thêm `ButtonLink` outline "Theo dõi yêu cầu" → `/tra-cuu?ma=${done.code}` (chỉ làm nếu anh chọn ★ ở quyết định 1).
- Modify: `src/components/layout/Footer.tsx`: chèn `{ href: "/tra-cuu", label: "Tra cứu đơn hàng & lịch hẹn" }` vào `LINKS` ngay sau "Giỏ hàng".
- Modify: `e2e/lookup.mjs`

**Interfaces:**
- Consumes: route `/tra-cuu?ma=` từ Task 1.

- [ ] **Bước 1: Thêm kiểm tra vào `e2e/lookup.mjs`:**
  - Footer có `a[href="/tra-cuu"]`.
  - Mở `/dat-lich/xac-nhan?ma=LH2611S15` thì có `a[href="/tra-cuu?ma=LH2611S15"]`.
  - Mở `/thanh-toan/thanh-cong?ma=DH2611S01` thì có `a[href="/tra-cuu?ma=DH2611S01"]`; bấm vào thì tới `/tra-cuu` và `#ket-qua` có "Hoàn thành".
- [ ] **Bước 2: Sửa 4 file như đã ghi ở mục Files.**
- [ ] **Bước 3: Chạy lint, tsc, build, rồi `BASE_URL=http://localhost:3100 npm run e2e` (toàn bộ, vì có sửa các trang xác nhận mà `scenario` đi qua).** Kết quả mong đợi: mọi suite PASS.
- [ ] **Bước 4: Commit**: `feat(lookup): link /tra-cuu from confirmations and footer`

### Task 3: Trang `/chinh-sach`

**Files:**
- Create: `src/app/chinh-sach/page.tsx`
- Modify: `src/components/layout/Footer.tsx`: thêm hàng 3 link neo vào dải "Thông tin pháp lý", ngay trên dòng `GENERAL_DISCLAIMER`
- Modify: `e2e/shots.mjs`: thêm `["tra-cuu", "/tra-cuu"]` và `["chinh-sach", "/chinh-sach"]` vào `PAGES`, ngay sau `"gioi-thieu"`
- Modify: `e2e/content.mjs`

**Interfaces:**
- Produces: route `/chinh-sach` với các anchor `#giao-hang`, `#doi-tra`, `#bao-mat`.

**Nội dung** (server component; `metadata.title` "Chính sách", `description` "Chính sách giao hàng, đóng gói, đổi trả và bảo mật thông tin khách hàng của nhà thuốc Đông y Mộc Y."). Trang gồm `h1` "Chính sách", mục lục 3 link neo, rồi 3 `<section id=… aria-labelledby=… className="scroll-mt-28">`, mỗi section có `h2` và `<ul>` các ý dưới đây. Copy chính xác:

1. **`#giao-hang` — "Giao hàng & đóng gói"**
   - Giao hàng toàn quốc. Phí giao ${formatPrice(SHIPPING_FEE)}/đơn, miễn phí cho đơn từ ${formatPrice(FREE_SHIPPING_THRESHOLD)}.
   - Nội thành Hà Nội nhận trong ngày, các tỉnh khác 2–4 ngày (mẫu).
   - Dược liệu và thuốc thang được sấy lại, đóng túi zip kèm gói hút ẩm.
   - Thuốc sắc sẵn đóng túi hút chân không, xếp trong thùng xốp chống va đập. Khi nhận, anh/chị cho ngay vào ngăn mát tủ lạnh và dùng trong 7 ngày.
   - Anh/chị được kiểm tra hàng trước khi thanh toán với đơn thanh toán khi nhận hàng (COD).
2. **`#doi-tra` — "Đổi trả & hoàn tiền"**
   - Nhà thuốc đổi mới hoặc hoàn tiền khi dược liệu bị ẩm mốc, hư hỏng do vận chuyển, hoặc giao sai, thiếu so với đơn.
   - Anh/chị báo trong 48 giờ kể từ khi nhận hàng (mẫu), kèm ảnh hoặc video lúc mở hàng, qua hotline/Zalo ${SITE.hotline}.
   - Tiền hoàn chuyển về tài khoản của anh/chị trong 3 ngày làm việc (mẫu) sau khi nhà thuốc xác nhận.
   - Thuốc thang đã bốc hoặc đã sắc theo thể trạng riêng không đổi trả vì lý do đổi ý, do không bán lại được cho người khác.
3. **`#bao-mat` — "Bảo mật thông tin"**
   - Nhà thuốc chỉ thu thập thông tin cần cho việc tư vấn và giao hàng: họ tên, số điện thoại, địa chỉ, triệu chứng và ảnh đơn thuốc anh/chị gửi.
   - Triệu chứng và đơn thuốc chỉ lương y và nhân viên phụ trách được xem.
   - Đơn vị vận chuyển chỉ nhận họ tên, số điện thoại và địa chỉ giao hàng.
   - Nhà thuốc không bán hay chia sẻ thông tin của anh/chị cho bên khác vì mục đích quảng cáo.
   - Anh/chị có thể yêu cầu xem, sửa hoặc xóa thông tin của mình qua hotline ${SITE.hotline}.

Cuối trang có `DisclaimerBox variant="general"` và dòng "Nội dung chính sách là bản mẫu cho bản demo, sẽ cập nhật theo quy định thực tế của nhà thuốc." (`text-label text-ink-muted`).

**Hàng link trong Footer:** `<nav aria-label="Chính sách">` chứa 3 `<Link>` tới `/chinh-sach#giao-hang`, `#doi-tra`, `#bao-mat`, nhãn lần lượt "Chính sách giao hàng", "Đổi trả", "Bảo mật thông tin". Mỗi link `min-h-12`, cùng kiểu chữ với dải pháp lý.

- [ ] **Bước 1: Thêm kiểm tra vào `e2e/content.mjs`** (viewport 1280):
  - `/chinh-sach` có `h1` "Chính sách" và đủ 3 id.
  - `#giao-hang` chứa "500.000đ" và "30.000đ".
  - `#doi-tra` chứa "48 giờ".
  - `#bao-mat` chứa "không bán".
  - Text trang không chứa "vô trùng".
  - Footer có đủ 3 `a[href^="/chinh-sach#"]`. Bấm link "Đổi trả" thì `#doi-tra` nằm trong viewport và không bị header sticky che (`getBoundingClientRect().top >= 64`).
- [ ] **Bước 2: Viết trang và sửa Footer.**
- [ ] **Bước 3: Chạy lint, tsc, build, suite `content` và `node e2e/shots.mjs`.** Kết quả mong đợi: PASS; `/tra-cuu` và `/chinh-sach` không tràn ngang ở 390 và 1280.
- [ ] **Bước 4: Commit**: `feat(policy): add /chinh-sach page with shipping, returns and privacy`

### Task 4: Nút liên hệ nổi và Chỉ đường

**Files:**
- Modify: `src/lib/constants.ts`: thêm vào `SITE`:
  - `zaloHref: "https://zalo.me/0901234567"`
  - `mapsHref: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(<địa chỉ>)`. Vì `SITE` là `as const`, khai báo `const ADDRESS` trước rồi dùng lại cho cả `address` lẫn `mapsHref`.
- Create: `src/components/layout/FloatingContact.tsx`
- Modify: `src/components/layout/SiteShell.tsx`: render `<FloatingContact />` sau `<MobileNav />` (nhánh admin không render)
- Modify: `src/components/layout/index.ts`: export `FloatingContact` nếu file đang re-export các component layout khác
- Modify: `src/components/layout/Footer.tsx`: thêm `<li>` "Chỉ đường đến phòng khám" (`SITE.mapsHref`) ngay sau dòng địa chỉ
- Modify: `src/app/gioi-thieu/page.tsx`: thêm link "Chỉ đường" trong `#khong-gian`, sau dòng địa chỉ
- Modify: `src/components/booking/BookingConfirmation.tsx`: khi `!isOnline`, thêm link "Chỉ đường đến phòng khám" vào khối "Chuẩn bị trước khi khám", ngay trên dòng đổi giờ/hủy lịch
- Modify: `e2e/content.mjs`

**Interfaces:**
- Produces: `SITE.zaloHref: string`, `SITE.mapsHref: string`, `export function FloatingContact(): ReactNode`.

**`FloatingContact`:**
- `<div className="fixed right-6 bottom-6 z-30 hidden flex-col gap-3 lg:flex">`. Dùng `z-30` để nằm dưới header (`z-40`) và dưới `Modal`.
- Gồm 2 nút tròn `size-14`, có `shadow-card`:
  1. **Zalo:** nền `herb-700`, `<a href={SITE.zaloHref} target="_blank" rel="noopener noreferrer" aria-label="Nhắn Zalo cho nhà thuốc">`, bên trong là chữ "Zalo" đậm, cỡ nhỏ (lucide không có logo Zalo; không nhúng logo thương hiệu).
  2. **Gọi:** nền `bronze-500`, `<a href={SITE.hotlineHref} aria-label={`Gọi hotline ${SITE.hotline}`}>`, icon `Phone`.
- Có `focus-visible:outline`. Không có animation rung hay lắc.

- [ ] **Bước 1: Thêm kiểm tra vào `e2e/content.mjs`:**
  - **1280, trang `/`:** có `a[href^="https://zalo.me/"][target="_blank"]` và `a[href^="tel:"][aria-label^="Gọi hotline"]` nằm trong phần tử `position: fixed`, cả hai đang hiển thị.
  - **390 và 768:** phần tử nút nổi không hiển thị (`getClientRects().length === 0`).
  - **`/admin`:** không có nút nổi.
  - **Không che nút chính, ở 1024 và 1280:**
    - `/dat-lich`: cuộn tới cuối trang, lấy tâm nút "Tiếp tục"; `document.elementFromPoint` tại tâm đó phải là nút hoặc con của nút.
    - `/thanh-toan`: dùng `addToCart` qua UI như `scenario`, hoặc ghi `cart` vào localStorage, rồi kiểm tương tự với nút đặt hàng.
  - **Chỉ đường:**
    - Footer có `a[href^="https://www.google.com/maps/"][target="_blank"]`.
    - `/gioi-thieu#khong-gian` có link đó.
    - mở phiếu xác nhận của một lịch hẹn `mode: "clinic"` (VD `LH2611S15`) thì có link đó.
    - Phiếu của một lịch hẹn `mode: "online"` (VD `LH2611S14`) **không** có link đó. Lấy mã theo `mode` đọc từ localStorage, không gõ cứng, vì seed có thể đổi lương y hoặc hình thức tùy ngày trong tuần.
- [ ] **Bước 2: Sửa các file như đã ghi ở mục Files.**
- [ ] **Bước 3: Chạy lint, tsc, build, rồi `BASE_URL=http://localhost:3100 npm run e2e`** (toàn bộ: nút nổi ở mọi trang có thể chặn click theo tọa độ trong `scenario`, `collide`, `stale`). Kết quả mong đợi: 0 FAIL.
  - Nếu một suite cũ FAIL vì click bị nút nổi chặn: **không sửa suite cũ**. Đổi vị trí hoặc kích thước nút nổi, rồi ghi lại vào báo cáo.
- [ ] **Bước 4: Commit**: `feat(contact): add floating Zalo/hotline buttons and map directions`

### Task 5: Kiểm chứng tổng và cập nhật spec

- [ ] **Bước 1: Chạy `npm run lint && npx tsc --noEmit && npm run build`.** Kết quả mong đợi: exit 0.
- [ ] **Bước 2: Chạy `PAGES_BASE_PATH=/mocy-platform npm run build`.** Sau đó:
  - `test -f out/tra-cuu/index.html && test -f out/chinh-sach/index.html` phải đúng.
  - `grep -c 'href="/mocy-platform/chinh-sach/#doi-tra"' out/index.html` phải ≥ 1 (link Footer có basePath và trailing slash).
- [ ] **Bước 3: Chạy `npm run build && npx next start -p 3100`, rồi `BASE_URL=http://localhost:3100 npm run e2e`.** Kết quả mong đợi: 0 FAIL.
- [ ] **Bước 4: Mở các ảnh `e2e/.output/{m,d}-tra-cuu.png`, `{m,d}-chinh-sach.png`, `d-home.png`** để soát:
  - trang tra cứu đọc được ở 390;
  - nút nổi không đè nội dung ở 1280.
- [ ] **Bước 5: Cập nhật `demo-content-gap-analysis.md`:**
  - tick bước 4–5 của checklist mục 5;
  - thêm vào mục 4 (Giai đoạn 2) dòng "Xác thực OTP khi tra cứu bằng số điện thoại";
  - thêm một ghi chú ngắn "Trước buổi demo: thay `SITE.zalo`/`zaloHref` bằng số Zalo thật của phòng khám."

  Commit: `docs(demo): mark P2 content items done`
