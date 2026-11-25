# Nội dung P1 cho bản Demo — Kế hoạch triển khai

> **Cho agent thực thi:** dùng superpowers:subagent-driven-development hoặc superpowers:executing-plans, làm lần lượt từng task. Các bước dùng checkbox (`- [ ]`).

**Mục tiêu:** Bổ sung 4 nhóm nội dung P1 trong `demo-content-gap-analysis.md`: quy trình khám 4 bước, minh bạch chi phí, FAQ Đông y, trang `/gioi-thieu`.

**Kiến trúc:** Nội dung tĩnh nằm ở `src/data/` (theo mẫu `testimonials.ts`), kiểu nằm ở `src/types/index.ts`. Chỉ khối chi phí được tách thành component dùng chung (`FeeNotice`), vì nó xuất hiện trên 3 trang. Quy trình và FAQ là section viết thẳng trong `src/app/page.tsx`, giống các section đang có. `/gioi-thieu` là server component tĩnh, chạy được khi static export.

**Công nghệ:** Next 16.4.6 (App Router), React 19.3, Tailwind 4.3, lucide-react. Kiểm thử bằng e2e puppeteer-core có sẵn trong `e2e/`.

**Spec:** `demo-content-gap-analysis.md` (mục 3, nhóm P1, và checklist mục 5 bước 1–3)

---

## Quyết định cần anh duyệt

Em đã chọn sẵn phương án đề xuất (**★**). Anh đổi mục nào thì em sửa plan trước khi làm.

1. **Đưa `/gioi-thieu` vào menu**
   - **★ A.** Thêm "Về Mộc Y" vào `NAV_ITEMS`, có cờ `desktopOnly`: chỉ hiện ở header desktop, nav đáy trên điện thoại giữ 5 ô như cũ. Trên điện thoại vào trang qua Footer và link ở khối Quy trình trên Trang chủ.
   - B. Thay mục "Kiến thức" ở nav đáy bằng "Về Mộc Y".
   - C. Chỉ thêm vào Footer.
   - Lý do: nav đáy đang cố định `grid-cols-5` (4 mục + Giỏ hàng). Thêm một mục thì vỡ lưới.
   - **`/luong-y` trong menu** (§3.4 ghi menu chưa có): **★ không thêm**. Header desktop đã chật (6 mục thì logo bị bóp ở 768–1024). `/luong-y` vẫn vào được từ Trang chủ, Footer, khối CTA và khối giấy phép của `/gioi-thieu`. Nếu anh muốn thêm, làm tương tự "Về Mộc Y" (`desktopOnly`) và chấp nhận ẩn dưới `lg`.
2. **Mức phí.** `requirement.md` §5.3 vẫn còn câu hỏi mở "tư vấn online miễn phí hay đặt cọc", nên các giá trị dưới đây đều là **số liệu mẫu**, gom ở một file (`src/data/service-fees.ts`), có dòng chú thích "mẫu" giống `LEGAL_INFO`:
   - Tư vấn trực tuyến: **Miễn phí**.
   - Khám tại phòng khám: **Miễn phí khi bốc thuốc**, khám không bốc thuốc **100.000đ/lượt**.
   - Sắc thuốc sẵn: **20.000đ/thang**.
3. **Đặt khối chi phí ở `/luong-y`.** §3.2 của spec liệt kê 3 trang, checklist bước 2 chỉ có 2 trang.
   - **★ Có.** Đặt trên cả `/dat-lich`, `/tu-van`, `/luong-y`.
   - Không.
4. **Hình ảnh trang `/gioi-thieu`**
   - **★ Chủ yếu là chữ, có một hình minh họa** dùng lại `/images/hero/can-thuoc.svg`, chú thích "Hình minh họa". Ảnh thật chờ khách cung cấp (§5.5).
   - Vẽ thêm SVG phòng khám bằng `scripts/art/gen.mjs`. Phương án này tốn thêm khoảng nửa ngày.
5. **"Chỉ đường" và bản đồ** (có trong checklist bước 3): **★ để sang P2 (§3.6)**, không làm trong plan này. Trang `/gioi-thieu` chỉ ghi địa chỉ, giờ mở cửa và hotline.
6. **Câu trả lời FAQ là copy mẫu:** các con số (thuốc sắc dùng trong 7 ngày, liệu trình 2–4 tuần, tái khám sau 7–10 ngày, báo đổi lịch trước 2 tiếng, giá thang) đều cần khách xác nhận. **★ Giữ các con số, ghi rõ là mẫu trong buổi demo.** Riêng câu về thuốc Tây đã bỏ khoảng cách giờ uống cụ thể, vì đó là hướng dẫn dùng thuốc.
7. **Chữ "vô trùng" ở bước 3 của quy trình:** **★ đổi thành "hút chân không"** để tránh hứa quá mức, đồng thời khớp với câu trả lời FAQ.

---

## Thay đổi khi thực hiện

- **Task 5:** không thêm "Về Mộc Y" vào `NAV_ITEMS`. Khi đo thực tế, logo header bị cắt ở 768px (102/125px) và từ 1280px trở lên (85/125px); thiếu khoảng 115px ở 1280. Phương án dự phòng `hidden lg:block` không xử lý được mốc ≥1280. Link `/gioi-thieu` chỉ đặt ở Footer và khối Quy trình trên Trang chủ.
- **Task 3:** `FeeNotice` có thêm prop `faqLink` (mặc định `true`). Trong `BookingFlow` và `ConsultForm` tắt link để khách không rời form và mất thông tin đang nhập; chỉ `/luong-y` có link tới `/#cau-hoi`.
- Task 1 và 2 gộp chung một commit vì cùng sửa `page.tsx`.

## Ràng buộc chung

- `AGENTS.md`: trước khi viết code, đọc hướng dẫn trong `node_modules/next/dist/docs/` về **metadata** và **static export** (tìm bằng `grep -ril "output: 'export'\|generateMetadata" node_modules/next/dist/docs | head`). Chú ý các thông báo deprecated.
- Phải build được cả 2 chế độ: `npm run build` và `PAGES_BASE_PATH=/mocy-platform npm run build` (GitHub Pages). Không dùng tính năng chỉ có ở server (route handler, `headers()`, ISR).
- Link nội bộ dùng `next/link`. Ảnh dùng `SafeImage` (tự thêm `NEXT_PUBLIC_BASE_PATH`), không dùng `<img>` trần.
- Không thêm dependency.
- Copy 100% tiếng Việt. Không dùng các chữ bị `e2e/shots.mjs` bắt: "Home", "Contact", "Read more", "Learn more", "Products"… Viết "Câu hỏi thường gặp", không viết "FAQ".
- Xưng hô theo trang chứa nội dung: Trang chủ và `/gioi-thieu` dùng "anh/chị"; `BookingFlow` và `ConsultForm` dùng "bạn". `FeeNotice` dùng trên cả hai loại trang nên viết không có đại từ.
- Tuân thủ quảng cáo y tế: không hứa "chữa khỏi" hay "hết bệnh", không viết ra số liệu hiệu quả. Số liệu chưa được khách xác nhận phải ghi "(mẫu)".
- FAQ không được hứa tính năng chưa có: tự đổi hoặc hủy lịch trên web, trang `/chinh-sach`, tùy chọn sắc sẵn trong form đặt lịch. Những việc đó hướng khách gọi hotline hoặc nhắn Zalo.
- Giữ phong cách sẵn có: `label-frame`, `paper-fiber`, viền `border-dashed border-line-strong/60`, `Seal`. Khối nội dung không dùng icon (theo comment "in như dòng chữ trên nhãn, không icon" ở Trang chủ). Vùng bấm tối thiểu `min-h-12`.
- Dùng hằng số có sẵn, không gõ lại chuỗi: `SITE`, `LEGAL_INFO`, `FREE_SHIPPING_THRESHOLD` + `formatPrice`, `doctors[].licenseNumber`.
- Commit: `<type>(<scope>): <summary>`, một dòng, không có body, không có trailer.
- Trước Task 1, tạo nhánh: `git switch -c feat/demo-p1-content`.

## Cách kiểm chứng

Repo không có unit test. Mỗi task được kiểm bằng:

1. Viết kiểm tra cho phần mới vào suite e2e `e2e/content.mjs` (Task 1 tạo suite này), cùng lúc với code. Không cần chạy để thấy FAIL trước.
2. Chạy `npm run lint` và `npx tsc --noEmit`.
3. Dừng server `next start` cũ ở cổng 3100 (nếu còn chạy), chạy `npm run build && npx next start -p 3100` (để chạy nền), rồi `BASE_URL=http://localhost:3100 node e2e/content.mjs`. Kết quả đạt: mọi dòng đều `PASS`, exit code 0.

## Điểm cần soát kỹ (không có task nào tự kiểm hết)

1. **Header desktop ở 768px và 1024px** sau khi thêm "Về Mộc Y": không tràn ngang, link nav không đè lên nút giỏ hàng. Kiểm ở Task 5.
2. **FAQ dùng bàn phím:** Tab tới `<summary>`, Enter mở hoặc đóng, có focus ring thấy rõ. Kiểm ở Task 2.
3. **Luồng đặt lịch không bị ảnh hưởng:** `FeeNotice` không thêm `button` hay `[role=radio]`, vì e2e `scenario`, `collide`, `stale` chọn phần tử theo text và theo role. Chạy lại toàn bộ e2e ở Task 3.
4. **Static export:** `out/gioi-thieu/index.html` có được tạo, ảnh minh họa có đúng tiền tố `/mocy-platform`. Kiểm ở Task 6.
5. **Điện thoại 390px:** bảng chi phí 3 dòng (tên, giá, ghi chú) và khối giấy phép (chuỗi dài, có số hiệu) không tràn. `shots.mjs` kiểm, Task 4 thêm `/gioi-thieu` vào `PAGES`.

---

### Task 1: Khối "Quy trình khám & bốc thuốc" trên Trang chủ và suite e2e `content`

**Files:**
- Create: `src/data/care-steps.ts`
- Create: `e2e/content.mjs`
- Modify: `src/types/index.ts`: thêm `CareStep`
- Modify: `src/data/index.ts`: export `careSteps`
- Modify: `src/app/page.tsx`: thêm section ngay sau dải "Cam kết", trước "Tra cứu theo nhu cầu"
- Modify: `e2e/run.mjs`: thêm `"content"` vào `SUITES`, đặt sau `"shots"`
- Modify: `e2e/README.md`: thêm dòng `content.mjs` vào bảng script

**Interfaces:**
- Produces: `export interface CareStep { title: string; text: string }`, `export const careSteps: CareStep[]`. File `e2e/content.mjs` export `run(browser)` theo mẫu của `e2e/shots.mjs` (`makeRecorder("content")`, `newContext`, `newPage(ctx, tag, errs, viewport)`, `runStandalone`). Task 2–5 thêm kiểm tra vào file này.

- [ ] **Bước 1: Tạo `e2e/content.mjs` với kiểm tra đầu tiên**
  Ở viewport 1280, mở `/` và assert:
  - `#quy-trinh-title` có text "Quy trình khám & bốc thuốc".
  - `#quy-trinh ol > li` có đúng 4 phần tử, text lần lượt chứa "Đặt lịch / Gửi triệu chứng", "Lương y Tứ chẩn", "Gia giảm & Bào chế", "Giao tận nhà & Theo dõi".
  - Thêm `"content"` vào `SUITES` và một dòng vào README.
- [ ] **Bước 2: Thêm `CareStep` vào `src/types/index.ts`. Tạo `src/data/care-steps.ts` với copy chính xác sau:**

  | # | title | text |
  |---|---|---|
  | 1 | Đặt lịch / Gửi triệu chứng | Chọn khung giờ tư vấn trực tuyến (Zalo, video) hoặc khám tại phòng khám; có thể gửi kèm đơn thuốc cũ. |
  | 2 | Lương y Tứ chẩn | Bắt mạch, thăm khám tại phòng khám; hoặc quan sát sắc mặt, lưỡi và hỏi kỹ bệnh sử khi tư vấn trực tuyến. |
  | 3 | Gia giảm & Bào chế | Bốc thang theo đúng thể trạng; đóng gói chống ẩm hoặc sắc sẵn thành túi hút chân không. |
  | 4 | Giao tận nhà & Theo dõi | Giao hàng toàn quốc kèm hướng dẫn sắc, uống; nhắc lịch tái khám theo liệu trình. |

- [ ] **Bước 3: Thêm section vào `src/app/page.tsx`.**
  - Thẻ ngoài: `<section id="quy-trinh" aria-labelledby="quy-trinh-title" className="scroll-mt-28 py-10 md:py-16">`.
  - Dùng `SectionHead` có sẵn: `id="quy-trinh"`, `title="Quy trình khám & bốc thuốc"`, `intro="Từ lúc đặt lịch đến khi thuốc về tận nhà, lương y theo sát từng bước."`. Chưa truyền `more`, Task 5 sẽ thêm.
  - Danh sách là `<ol>` lưới `sm:grid-cols-2 lg:grid-cols-4`. Mỗi `<li>` có số thứ tự lớn kiểu `font-heading` màu `text-bronze-600` (`aria-hidden`), `<h3>` là title, `<p>` là text. Ngăn cách các bước bằng nét đứt như dải "Cam kết", không dùng icon.
- [ ] **Bước 4: Chạy lint, tsc, build và `node e2e/content.mjs`.** Kết quả mong đợi: PASS.
- [ ] **Bước 5: Commit**: `git add src/types/index.ts src/data/care-steps.ts src/data/index.ts src/app/page.tsx e2e/content.mjs e2e/run.mjs e2e/README.md && git commit -m "feat(home): add 4-step care process section"`

### Task 2: Khối "Câu hỏi thường gặp" trên Trang chủ

**Files:**
- Create: `src/data/faqs.ts`
- Modify: `src/types/index.ts`: thêm `Faq`
- Modify: `src/data/index.ts`: export `faqs`
- Modify: `src/app/page.tsx`: thêm section sau "Kiến thức Đông y", trước khối "Chưa biết nên dùng gì?"
- Modify: `e2e/content.mjs`

**Interfaces:**
- Produces: `export interface Faq { id: string; question: string; answer: string }` và `export const faqs: Faq[]`. Section có `id="cau-hoi"`. Task 3 (`FeeNotice`) link tới `/#cau-hoi`.

- [ ] **Bước 1: Thêm kiểm tra vào `e2e/content.mjs`** (trang `/`, viewport 1280):
  - `#cau-hoi details` có đúng 6 phần tử, không cái nào có thuộc tính `open`.
  - Click `summary` đầu tiên thì `details[0].open === true` và đoạn trả lời đang hiển thị chứa "video".
  - Focus `summary` thứ hai rồi nhấn `Enter` thì `details[1].open === true`.
- [ ] **Bước 2: Thêm `Faq` vào types. Tạo `src/data/faqs.ts`** (import `SITE`, `FREE_SHIPPING_THRESHOLD` và `formatPrice`). Copy chính xác:
  1. `tu-van-online`: *Tư vấn online không bắt mạch trực tiếp thì lương y chẩn đoán thế nào?*
     Qua cuộc gọi video, lương y quan sát sắc mặt, lưỡi, hỏi kỹ triệu chứng, giấc ngủ, ăn uống, bệnh sử và xem kết quả xét nghiệm hoặc đơn thuốc cũ nếu anh/chị có. Trường hợp cần bắt mạch để phân biệt thể bệnh, lương y sẽ hẹn anh/chị khám trực tiếp trước khi bốc thuốc.
  2. `sac-san`: *Nhà thuốc có hỗ trợ sắc thuốc sẵn đóng túi không?*
     Có. Thuốc được sắc bằng nồi sắc kín, đóng túi hút chân không, mỗi túi một lần uống. Thuốc sắc sẵn bảo quản ngăn mát tủ lạnh và dùng trong 7 ngày. Anh/chị báo khi lương y tư vấn, hoặc gọi/nhắn Zalo ${SITE.hotline}. Phí sắc ghi ở khối Chi phí trên trang Đặt lịch.
  3. `bao-quan`: *Thuốc thang và dược liệu giao đi tỉnh có bị ẩm mốc không, bảo quản ra sao?*
     Dược liệu được sấy lại trước khi đóng túi zip kèm gói hút ẩm; thuốc sắc sẵn đóng thùng xốp. Khi nhận, anh/chị để thuốc thang nơi khô ráo, tránh nắng, còn thuốc sắc sẵn cho ngay vào ngăn mát. Nếu hàng bị ẩm mốc hoặc hư hỏng khi nhận, anh/chị chụp ảnh và gọi ${SITE.hotline} để được đổi. Miễn phí giao hàng cho đơn từ ${formatPrice(FREE_SHIPPING_THRESHOLD)}.
  4. `thuoc-tay`: *Đang uống thuốc Tây có dùng kèm thuốc Đông y được không?*
     Nhiều trường hợp dùng kèm được, nhưng cần báo cho lương y mọi thuốc đang dùng để được hướng dẫn thời điểm uống cách xa nhau. Người đang điều trị bệnh mạn tính (huyết áp, tiểu đường, tim mạch…) không tự ý ngưng thuốc Tây, và nên hỏi bác sĩ điều trị trước khi kết hợp.
  5. `lieu-trinh`: *Một liệu trình thường kéo dài bao lâu và chi phí khoảng bao nhiêu?*
     Tùy thể bệnh và cơ địa, một liệu trình thường từ 2 đến 4 tuần, tái khám sau mỗi 7–10 ngày để gia giảm. Giá thang thuốc được báo trước khi bốc, thường khoảng 120.000–250.000đ/thang (mẫu); anh/chị đồng ý thì nhà thuốc mới bốc.
  6. `doi-lich`: *Muốn đổi giờ hoặc hủy lịch hẹn đã đặt thì làm thế nào?*
     Anh/chị gọi hoặc nhắn Zalo ${SITE.hotline}, đọc mã lịch hẹn in trên phiếu xác nhận, trước giờ hẹn ít nhất 2 tiếng. Nhân viên sẽ đổi sang khung giờ còn trống hoặc hủy lịch giúp anh/chị.
- [ ] **Bước 3: Thêm section vào `src/app/page.tsx`.**
  - Thẻ ngoài: `<section id="cau-hoi" aria-labelledby="cau-hoi-title" className="scroll-mt-28 border-t border-line-strong/50 py-10 md:py-16">`, `<h2 id="cau-hoi-title">` là "Câu hỏi thường gặp".
  - Mỗi câu là một `<details>` / `<summary>` gốc (không dùng `"use client"`, không dùng `button`). Summary có `min-h-12`, chữ `text-lg font-semibold`, dấu +/− đổi theo trạng thái `open` (`list-none` cộng biến thể `group-open:`), `focus-visible:outline`.
  - Khung chứa `max-w-3xl`, các câu ngăn cách bằng nét đứt.
- [ ] **Bước 4: Chạy lint, tsc, build và suite `content`.** Kết quả mong đợi: PASS.
- [ ] **Bước 5: Commit**: `feat(home): add traditional medicine FAQ section`

### Task 3: Khối "Chi phí khám & dịch vụ" (`FeeNotice`) trên `/dat-lich`, `/tu-van`, `/luong-y`

**Files:**
- Create: `src/data/service-fees.ts`
- Create: `src/components/booking/FeeNotice.tsx`
- Modify: `src/types/index.ts`: thêm `ServiceFee`
- Modify: `src/data/index.ts`: export `serviceFees`, `SERVICE_FEE_NOTE`
- Modify: `src/components/booking/index.ts`: export `FeeNotice` (nếu file này đang re-export các component khác)
- Modify: `src/components/booking/BookingFlow.tsx:~411`: thêm `<FeeNotice className="mt-8" />` ngay sau thẻ `div` phiếu bước (`paper-fiber mt-6 border…`), bên trong khung `max-w-3xl`. Khối hiện ở cả 5 bước, không hiện ở `/dat-lich/xac-nhan`.
- Modify: `src/components/booking/ConsultForm.tsx:~247`: thêm `<FeeNotice className="mt-8" />` ngay sau `</form>` ở nhánh return chính. **Không** thêm vào nhánh `done` (phiếu Slip).
- Modify: `src/app/luong-y/page.tsx`: thêm `<FeeNotice className="mt-12 max-w-3xl" />` giữa danh sách lương y và section "Chưa biết nên chọn lương y nào?"
- Modify: `e2e/content.mjs`

**Interfaces:**
- Consumes: section `#cau-hoi` của Task 2.
- Produces:
  - `export interface ServiceFee { id: string; name: string; price: string; note?: string }`
  - `export const serviceFees: ServiceFee[]`
  - `export const SERVICE_FEE_NOTE: string`
  - `export function FeeNotice({ className }: { className?: string }): ReactNode`. Đây là component thuần trình bày, không có hook, import được từ cả client lẫn server component.

- [ ] **Bước 1: Thêm kiểm tra vào `e2e/content.mjs`**, chạy trên `/dat-lich`, `/tu-van`, `/luong-y`:
  - Có `aside[aria-labelledby="chi-phi-title"]`, text chứa "Tư vấn trực tuyến", "Miễn phí", "Sắc thuốc sẵn", "(mẫu)".
  - Trong aside có `a[href="/#cau-hoi"]`, và aside **không** chứa `button` hay `[role=radio]`.
  - Ở `/dat-lich`: chọn nhóm triệu chứng (`radio(p, "Nhóm triệu chứng", 1)`), sang bước kế (`nextStep(p)`), aside vẫn còn.
- [ ] **Bước 2: Tạo `src/data/service-fees.ts`** với giá trị chính xác:

  | id | name | price | note |
  |---|---|---|---|
  | `online` | Tư vấn trực tuyến (Zalo, video) | Miễn phí | Lương y hỏi bệnh, xem sắc mặt, lưỡi và báo giá thang thuốc trước khi bốc. |
  | `clinic` | Khám & bắt mạch tại phòng khám | Miễn phí khi bốc thuốc | Khám không bốc thuốc: 100.000đ/lượt. |
  | `decoction` | Sắc thuốc sẵn đóng túi | 20.000đ/thang | Túi hút chân không; giao nội thành Hà Nội trong ngày, gửi tỉnh đóng thùng xốp. |

  `SERVICE_FEE_NOTE = "Mức phí tham khảo (mẫu), sẽ cập nhật theo bảng giá thực tế của phòng khám."`
- [ ] **Bước 3: Viết `FeeNotice`.**
  - Thẻ ngoài: `<aside aria-labelledby="chi-phi-title">`, `<h2 id="chi-phi-title">` là "Chi phí khám & dịch vụ".
  - Bảng là `<dl>` theo mẫu `facts` của `/luong-y` (nét đứt, `md:grid-cols-[minmax(0,1fr)_auto]`). `dt` là tên dịch vụ. `dd` gồm giá in đậm `text-herb-700`, dưới đó là ghi chú `text-ink-muted`.
  - Cuối khối có `SERVICE_FEE_NOTE` (`text-label text-ink-muted`) và `<Link href="/#cau-hoi">` "Xem câu hỏi thường gặp" (`min-h-12`, gạch chân như các link khác).
  - Nền `paper-fiber bg-surface` có viền. Không có đại từ xưng hô.
- [ ] **Bước 4: Gắn vào 3 vị trí đã ghi ở mục Files.**
- [ ] **Bước 5: Chạy lint, tsc, build, rồi `BASE_URL=http://localhost:3100 npm run e2e` (toàn bộ, vì có sửa `BookingFlow` và `ConsultForm`).** Kết quả mong đợi: mọi suite PASS.
- [ ] **Bước 6: Commit**: `feat(booking): show consultation and decoction fees`

### Task 4: Trang `/gioi-thieu`

**Files:**
- Create: `src/app/gioi-thieu/page.tsx`
- Modify: `e2e/shots.mjs`: thêm `["gioi-thieu", "/gioi-thieu"]` vào `PAGES`, ngay sau `"luong-y"`
- Modify: `e2e/README.md`: thêm `/gioi-thieu` vào mô tả `shots.mjs`
- Modify: `e2e/content.mjs`

**Interfaces:**
- Consumes: `SITE`, `LEGAL_INFO` (`@/lib/constants`), `doctors` (`@/data`), `ButtonLink`, `DisclaimerBox`, `SafeImage`, `Seal` (`@/components/ui`), `Container`.
- Produces: route `/gioi-thieu` với các anchor `#cau-chuyen`, `#duoc-lieu`, `#khong-gian`, `#giay-phep`. Task 5 link tới route này.

- [ ] **Bước 1: Thêm kiểm tra vào `e2e/content.mjs`** (trang `/gioi-thieu`, viewport 1280):
  - `h1` là "Về Mộc Y".
  - Có đủ 4 phần tử `#cau-chuyen`, `#duoc-lieu`, `#khong-gian`, `#giay-phep`.
  - Text `#giay-phep` chứa "0125/HNO-GPHĐ", "004512/HNO-CCHN", "0109876543".
  - `#giay-phep a[href^="/luong-y#"]` có đúng 3 phần tử.
  - Có `a[href="/dat-lich"]`.
- [ ] **Bước 2: Viết trang.** Đây là server component, có `export const metadata`:
  - `title: "Về Mộc Y"`
  - `description: "Câu chuyện nhà thuốc Đông y Mộc Y phố Lãn Ông, tiêu chuẩn dược liệu sạch, không gian phòng khám, giấy phép hoạt động và chứng chỉ hành nghề."`

  Bố cục theo thứ tự:
  1. **Header:** `h1` "Về Mộc Y", một đoạn dẫn `text-lg text-ink-muted`.
  2. **`#cau-chuyen`** (h2 "Câu chuyện & triết lý"): 2 đoạn, mỗi đoạn tối đa khoảng 60 chữ, xưng "anh/chị". Ý chính: Mộc Y khởi đầu từ một tủ thuốc gia truyền trên phố Lãn Ông. Triết lý *"Bốc thuốc theo thể trạng"*: cùng một bệnh nhưng mỗi người một cơ địa, nên lương y bắt mạch, gia giảm từng thang. Không ghi năm thành lập, không viết số liệu khách hàng.
  3. **`#duoc-lieu`** (h2 "Tiêu chuẩn dược liệu"): khai báo hằng `STANDARDS` ngay trong file trang (giống `COMMITMENTS` ở Trang chủ). Có 4 mục, copy chính xác:
     - **Rõ vùng trồng:** Dược liệu trong nước lấy từ vùng trồng Lào Cai, Hòa Bình, Phú Thọ, Đồng Tháp; dược liệu nhập như kỷ tử Ninh Hạ, táo nhân Hà Bắc có hồ sơ kiểm nghiệm từng lô.
     - **Sơ chế sạch:** Không xông diêm sinh, không dùng chất bảo quản; thái lát, sao tẩm và sấy tại cơ sở ở Hà Nội.
     - **Kiểm tra trước khi bốc:** Lương y kiểm tra màu, mùi, độ khô của từng vị trước khi bốc thang.
     - **Bảo quản chống ẩm:** Kho khô thoáng; đóng túi zip kèm gói hút ẩm trước khi giao.

     Cuối mục có link "Xem dược liệu & sản phẩm" trỏ tới `/san-pham`.
  4. **`#khong-gian`** (h2 "Không gian phòng khám"):
     - Hình `<figure>` dùng `SafeImage src="/images/hero/can-thuoc.svg"` (`object-contain`, khung `label-frame`), `figcaption` "Hình minh họa".
     - Danh sách 3 mục:
       - **Phòng bắt mạch:** yên tĩnh, riêng tư khi hỏi bệnh.
       - **Tủ thuốc trăm ngăn:** mỗi vị một ngăn, ghi nhãn tên và ngày nhập.
       - **Khu sắc thuốc:** nồi sắc kín, đóng túi hút chân không.
     - Kèm `SITE.address`, `SITE.openingHours` và link `tel` `SITE.hotlineHref`.
  5. **`#giay-phep`** (h2 "Giấy phép & chứng chỉ hành nghề"):
     - Khung `label-frame paper-fiber bg-surface` có `Seal` ở góc.
     - `<ul>` gồm `LEGAL_INFO.clinicLicense`, `practitionerLicense`, `businessLicense`.
     - Tiếp theo là h3 "Chứng chỉ hành nghề của lương y" và danh sách `doctors.map`: `` <Link href={`/luong-y#${d.slug}`}>{d.name}</Link> `` rồi đến "CCHN số {d.licenseNumber}".
     - Cuối khung là `LEGAL_INFO.productNotice`.
     - Chuỗi dài cần có `break-words` để không tràn ở 390px.
  6. **Khối CTA** giống khối cuối `/luong-y`: `ButtonLink` tới `/dat-lich` ("Đặt lịch tư vấn") và outline tới `/luong-y` ("Xem hồ sơ lương y"). Cuối trang là `DisclaimerBox variant="general"`.
- [ ] **Bước 3: Chạy lint, tsc, build, suite `content` và `node e2e/shots.mjs`.** Kết quả mong đợi: PASS, `/gioi-thieu` không tràn ngang ở 390 và 1280, không lỗi ảnh hay console.
- [ ] **Bước 4: Commit**: `feat(about): add /gioi-thieu page with sourcing and licenses`

### Task 5: Điều hướng tới `/gioi-thieu`

**Files:**
- Modify: `src/components/layout/nav-items.ts`: thêm `desktopOnly?: boolean` vào `NavItem`, chèn `{ href: "/gioi-thieu", label: "Về Mộc Y", icon: Landmark, desktopOnly: true }` ngay sau "Trang chủ"
- Modify: `src/components/layout/MobileNav.tsx`: `[...NAV_ITEMS.filter((i) => !i.desktopOnly), …giỏ hàng]`
- Modify: `src/components/layout/Footer.tsx`: chèn `{ href: "/gioi-thieu", label: "Về Mộc Y" }` lên đầu `LINKS`
- Modify: `src/app/page.tsx`: truyền `more={{ href: "/gioi-thieu", label: "Về Mộc Y & tiêu chuẩn dược liệu" }}` vào `SectionHead` của khối Quy trình
- Modify: `e2e/content.mjs`

**Interfaces:**
- Consumes: route `/gioi-thieu` từ Task 4.
- Produces: `NavItem.desktopOnly?: boolean`.

- [ ] **Bước 1: Thêm kiểm tra vào `e2e/content.mjs`:**
  - **1280:** `nav[aria-label="Điều hướng chính"] a[href="/gioi-thieu"]` tồn tại. Footer có `a[href="/gioi-thieu"]`. Ở `/` thì `#quy-trinh a[href="/gioi-thieu"]` tồn tại.
  - **390:** `nav[aria-label="Điều hướng nhanh"] a` có đúng 5 phần tử, không có cái nào trỏ `/gioi-thieu`.
  - **768, 1024 và 1280** (1024 có thêm nút CTA, 1280 có thêm chữ hotline nên đây là các mốc chật): `document.documentElement.scrollWidth <= innerWidth`. Logo không bị bóp: `header a[aria-label$="Trang chủ"]` có `scrollWidth <= clientWidth`. Lý do: logo là `min-w-0 shrink`, còn nav là `whitespace-nowrap`, nên khi thiếu chỗ thì logo bị cắt trước chứ nav không tràn. Mỗi link nav cao không quá 56px.
- [ ] **Bước 2: Sửa 4 file như đã ghi ở mục Files.** Header không cần sửa vì đã map toàn bộ `NAV_ITEMS`.
- [ ] **Bước 3: Chạy lint, tsc, build và suite `content`.**
  - Nếu kiểm tra logo hoặc tràn FAIL ở mốc nào: trong `Header.tsx` thêm class `hidden lg:block` cho `<li>` của item có `desktopOnly`, rồi sửa kiểm tra 1280 cho khớp. Ghi lại thay đổi này vào báo cáo.
  - Kết quả mong đợi: PASS.
- [ ] **Bước 4: Commit**: `feat(nav): link /gioi-thieu from header, footer and home`

### Task 6: Kiểm chứng tổng

- [ ] **Bước 1: Chạy `npm run lint && npx tsc --noEmit && npm run build`.** Kết quả mong đợi: exit 0.
- [ ] **Bước 2: Chạy `PAGES_BASE_PATH=/mocy-platform npm run build`.** Sau đó:
  - `test -f out/gioi-thieu/index.html` phải đúng.
  - `grep -c "/mocy-platform/images/hero/can-thuoc.svg" out/gioi-thieu/index.html` phải ≥ 1 (SafeImage được prerender, `NEXT_PUBLIC_BASE_PATH` đã inline lúc build).
- [ ] **Bước 3: Chạy `npm run build && npx next start -p 3100`, rồi `BASE_URL=http://localhost:3100 npm run e2e`.** Kết quả mong đợi: 0 FAIL.
- [ ] **Bước 4: Mở các ảnh `e2e/.output/{m,d}-home.png`, `{m,d}-gioi-thieu.png`, `{m,d}-dat-lich.png`** để soát thứ tự thị giác: khối mới không lấn hero, FAQ và bảng phí đọc được ở 390px.
- [ ] **Bước 5: Tick các bước 1–3 trong checklist mục 5 của `demo-content-gap-analysis.md`**, ghi chú rằng "chỉ đường" đã chuyển sang P2. Commit: `docs(demo): mark P1 content items done`
