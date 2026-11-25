# src/lib: store, hàm tiện ích, quy ước

## Thư mục

| Đường dẫn | Nội dung | Chủ sở hữu |
|---|---|---|
| `src/types/index.ts` | Toàn bộ types (Product, Doctor, Article, Order...) | foundation |
| `src/data/index.ts` | Dữ liệu mẫu tĩnh: `products, doctors, articles, symptomGroups, testimonials, coupons, seedOrders, seedAppointments` | mock-data-writer |
| `src/lib/store` | Store localStorage + hook React | foundation |
| `src/lib/*.ts` | constants, format, date, pricing, schedule, catalog, image, utils | foundation |
| `src/components/ui` | UI kit, import từ `@/components/ui` | foundation |
| `src/components/layout` | Header, Footer, MobileNav, Container, SiteShell | foundation |

Cần đổi type, store hay component dùng chung thì nhắn lead, không tự sửa.

## Store (`@/lib/store`)

State: `{ cart, couponCode, orders, appointments, consultRequests }`, lưu ở localStorage key `mocy-demo`.
Tab khác ghi dữ liệu thì tab này tự cập nhật (sự kiện `storage`), không cần reload. Mọi action ghi đều đọc lại localStorage ngay trước khi kiểm tra và ghi, nên tab đang giữ state cũ cũng không ghi đè dữ liệu tab khác vừa lưu.
Lần đầu mở trang, `seedOrders` và `seedAppointments` được gộp vào store theo id.

### Hook (chỉ dùng trong client component)

| Hook | Trả về |
|---|---|
| `useCart()` | `{ items, coupon, totals }`; `totals = { itemCount, subtotal, discount, shippingFee, total, couponError? }` |
| `useCartCount()` | tổng số lượng trong giỏ |
| `useOrders()` / `useOrder(idOrCode)` | đơn hàng, mới nhất trước / một đơn |
| `useAppointments()` / `useAppointment(idOrCode)` | lịch hẹn |
| `useConsultRequests()` / `useConsultRequest(idOrCode)` | yêu cầu tư vấn cắt thang |
| `useStore(selector)` | đọc tùy ý; selector chỉ trả giá trị có sẵn trong state hoặc số/chuỗi, **không** filter/map trong selector (lặp vô hạn), xử lý tiếp bằng `useMemo` |
| `useHydrated()` | `false` lúc render server/hydrate. Trang xác nhận đơn/lịch hẹn: chưa hydrate thì hiện "Đang tải", hydrate rồi mà không thấy mới báo "Không tìm thấy" |

### Action (gọi trong event handler)

- Giỏ: `addToCart(item, quantity?)` (item là CartItem không có quantity, cộng dồn nếu trùng productId + variantId), `setCartItemQuantity(productId, variantId, qty)` (qty ≤ 0 là xóa), `removeFromCart`, `clearCart`, `applyCoupon(code)` → `{ ok: true, coupon } | { ok: false, error }`, `removeCoupon`.
- Đơn: `placeOrder({ shipping, paymentMethod })` → `Order` (lấy giỏ + mã ưu đãi hiện tại, tự tính tiền, sinh `code` dạng `DH2611A3F` và `transferContent` dạng `MOCY DH2611A3F`, xóa giỏ). `updateOrderStatus(id, status)`, `advanceOrderStatus(id)`, `removeOrder(id)`.
- Lịch hẹn: `createAppointment(input)` → `Appointment` (mã `LH...`, ném lỗi nếu khung giờ đã có người đặt), `updateAppointmentStatus`, `removeAppointment`.
- Tư vấn: `createConsultRequest(input)` → `ConsultRequest` (mã `TV...`), `updateConsultRequestStatus`, `removeConsultRequest`.
- Demo: `resetDemoData()` xóa hết và nạp lại seed, mọi tab cùng cập nhật.

Action có thể ném `StoreError`: `message` tiếng Việt hiện thẳng cho người dùng, `code` để rẽ nhánh xử lý (không so chuỗi message): `MISSING_CUSTOMER` (thiếu Họ tên/SĐT), `EMPTY_CART`, `SLOT_TAKEN` (khung giờ vừa có người đặt), `STORAGE_FULL` (localStorage đầy).

```tsx
try {
  const order = placeOrder({ shipping: { name, phone, address }, paymentMethod: "bank-transfer" });
  router.push(`/thanh-toan/thanh-cong?ma=${order.code}`);
} catch (e) {
  setError(e instanceof StoreError ? e.message : "Có lỗi xảy ra, vui lòng thử lại.");
}
```

## Hàm tiện ích

- `@/lib/constants`: `SITE`, `LEGAL_INFO`, `BANK_INFO`, nhãn tiếng Việt cho mọi enum (`PRODUCT_CATEGORY_LABELS`, `LEGAL_LABEL_META`, `ORDER_STATUS_META` có `label` + `tone`, `ORDER_STATUS_FLOW`, `APPOINTMENT_STATUS_META`, `CONSULT_STATUS_META`, `CONSULT_MODE_LABELS`, `ONLINE_CHANNEL_LABELS`, `PAYMENT_METHOD_LABELS`, `WEEKDAY_LABELS`), `SUPPLEMENT_DISCLAIMER`, phí ship.
- `@/lib/format`: `formatPrice(150000)` → "150.000đ", `formatDate`, `formatDateTime`, `formatDateKey("2026-11-26")` → "Thứ 5, 26/11/2026", `formatPhone`.
- `@/lib/date`: `toDateKey`, `parseDateKey`, `todayKey`, `dateKeyFromNow(n)`, `isoFromNow(n, "HH:mm")` (dùng cho seed).
- `@/lib/catalog`: `getProductBySlug/ById`, `getDoctorById/BySlug`, `getArticleBySlug`, `getSymptomGroupById/BySlug`, `getMinPrice`, `getVariant`.
- `@/lib/schedule`: `getUpcomingWorkingDates(doctor, days)`, `getAvailableSlots(doctor, date, appointments)` (bỏ giờ đã đặt và giờ đã qua).
- `@/lib/pricing`: `calcCartTotals`, `findCoupon`. Phí ship 30.000đ, miễn phí từ 500.000đ.
- `@/lib/image`: `compressImage(file)` → data URL JPEG nhỏ, dùng trước khi lưu ảnh đơn thuốc cũ.
- `@/lib/utils`: `cn(...)` (gộp class bằng tailwind-merge, class truyền sau thắng class mặc định), `normalizeText` (bỏ dấu để tìm kiếm), `isValidPhone`.

## UI kit (`@/components/ui`)

`Button`, `ButtonLink` (next/link dạng nút), `buttonClasses`; variant `primary | secondary | accent | outline | ghost | danger`, size `md` (48px) | `lg` (56px).
`Input`, `Textarea`, `Select` (có `label`, `hint`, `error`, `required`), `Card`, `Badge` (tone), `LegalBadge` (nhãn pháp lý), `PriceTag` (không có giá thì hiện "Giá theo tư vấn"), `DisclaimerBox` (`supplement` | `general`), `Stepper`, `Modal`, `ChoiceCard` (lựa chọn dạng thẻ, đặt trong `role="radiogroup"`).
Icon: `lucide-react`.

Layout (`@/components/layout`): `Container` dùng cho mọi trang. Header/Footer/MobileNav đã gắn ở root layout, trang không tự thêm.
Route `/admin` không có header/footer khách hàng; admin tự làm `src/app/admin/layout.tsx`.

## Design tokens (Tailwind)

- Màu: `herb-50..900` (xanh thảo mộc), `wood-50..900` (nâu gỗ), `bronze-50..800` (vàng đồng), `paper-50..300` (nền kem).
- Ngữ nghĩa: `bg-background`, `bg-surface`, `text-ink`, `text-ink-muted`, `border-line`, `border-line-strong`, `text-danger`/`bg-danger-soft`, `text-info`/`bg-info-soft`.
- Biểu đồ: `chart-1..5` (VD `fill-chart-1`, `bg-chart-2`).
- Chữ: `font-sans` (Be Vietnam Pro, mặc định), `font-heading` (Noto Serif, h1–h4 tự dùng). Cỡ chữ gốc 17px.
- Chữ màu vàng đồng trên nền sáng dùng `text-bronze-700` trở lên; `bronze-300/400` chỉ dùng làm nền hoặc viền.
- `rounded-card`, `shadow-card`.

## Quy tắc Next.js 16 của dự án

- Không bật `cacheComponents`. Trang là client component hoặc server component tĩnh, dữ liệu động đọc từ store.
- Component dùng `useSearchParams()` phải nằm trong `<Suspense>`, nếu không `npm run build` lỗi. Mẫu: `page.tsx` (server) render `<Suspense fallback={...}><ClientPart /></Suspense>`.
- Route động (`/san-pham/[slug]`, `/kien-thuc/[slug]`) đọc `@/data` và export `generateStaticParams`; `params` là Promise (`const { slug } = await params`), gặp slug lạ thì gọi `notFound()`.
- Không gọi `new Date()`, `Math.random()` hay đọc store khi render server; mã đơn/lịch hẹn chỉ sinh trong action.
- Ảnh tĩnh trong `public/images`, dùng `next/image` hoặc `<img>` với đường dẫn có thật.
- Client component cũng được prerender lúc build. UI phụ thuộc ngày hiện tại (`todayKey`, `getUpcomingWorkingDates`, `getAvailableSlots`, "lịch hẹn hôm nay") chỉ render khi `useHydrated()` là true.
- Form: đặt `noValidate` trên `<form>` và tự kiểm tra, hiện lỗi qua prop `error` (thông báo mặc định của trình duyệt có thể không phải tiếng Việt). Chỉ bắt buộc Họ tên + SĐT.
- VietQR giả lập: mã đơn chỉ có sau `placeOrder`, nên QR và nội dung chuyển khoản hiển thị sau khi đặt đơn (VD ở màn thành công).
- Seed được chép vào localStorage một lần, ngày tính tại lúc đó. Trước buổi demo bấm "Reset dữ liệu demo" ở Admin.
- Import `@/lib/store` từ server component chỉ dùng được hằng/type/`StoreError`; hook và action chỉ gọi trong client component.
