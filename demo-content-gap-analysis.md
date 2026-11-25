---
title: "Phân tích nội dung còn thiếu cho bản Demo Mộc Y (So sánh website Đông y tương tự)"
author: trisjr
date: 2026-11-25
scope: "Giai đoạn 1 — Bản Demo chốt dự án"
---

# Phân tích Nội dung Còn thiếu cho Bản Demo — Đông y Mộc Y

Tài liệu đối chiếu cấu trúc hiện tại của **Mộc Y** (`requirement.md` và mã nguồn Storefront hiện có) với các website phòng khám Đông y & bán lẻ dược liệu tiêu biểu tại Việt Nam nhằm xác định các nội dung còn thiếu **chỉ trong phạm vi bản Demo**.

> [!NOTE]
> **Các website tham chiếu (Benchmark):**
> - **Mô hình Phòng khám YHCT + Bài thuốc gia truyền:** Đỗ Minh Đường (`nhathuocdominhduong.com`), Trung tâm Thuốc Dân Tộc (`thuocdantoc.vn`), Nhất Nam Y Viện (`nhatnamyvien.com`).
> - **Mô hình Kết hợp Phòng khám + Cửa hàng Dược liệu Online:** Y Tâm Đường (`ytamduong.vn`), Thảo dược Thaphaco (`thaphaco.com.vn`).

---

## 1. Đánh giá nhanh hiện trạng Mộc Y

Mộc Y đã hoàn thiện tốt các phân hệ cốt lõi theo `requirement.md`:
- **Phân tách luồng bán hàng đặc thù Đông y:** Sản phẩm bán trực tiếp (giá niêm yết, chọn định lượng) vs. Bài thuốc thang cần tư vấn cắt thang (`/san-pham`, `/tu-van`).
- **Trải nghiệm đặt lịch & hồ sơ chuyên môn:** Đặt lịch 5 bước (`/dat-lich`), phiếu xác nhận kèm lời dặn chuẩn bị khám online/trực tiếp (`/dat-lich/xac-nhan`), hồ sơ lương y có CCHN (`/luong-y`).
- **Tuân thủ pháp lý hiển thị:** Nhãn phân loại (`Thuốc Đông y`, `Dược liệu`, `TPBVSK`), số công bố sản phẩm, khuyến cáo miễn trừ trách nhiệm, thông tin giấy phép ở Footer.
- **Demo sống (Interactive Prototype):** Giỏ hàng, VietQR giả lập, đồng bộ đơn hàng & lịch hẹn tức thời với `/admin` qua `localStorage`.

---

## 2. Bảng đối chiếu khoảng trống nội dung (Content Gap)

| Hạng mục nội dung | Website Đông y thực tế | Hiện trạng Mộc Y | Ưu tiên cho Demo |
| :--- | :--- | :--- | :---: |
| **Quy trình khám – bốc thuốc – giao thuốc** | Khối 4 bước trực quan ngay Trang chủ / Đặt lịch | Chưa có (mới có lời dặn sau khi đặt ở `/dat-lich/xac-nhan`) | **Cao (P1)** |
| **Minh bạch phí khám & dịch vụ sắc sẵn** | Ghi rõ phí tư vấn/khám, tùy chọn sắc thuốc đóng túi sẵn | Chưa đề cập ở `/dat-lich`, `/tu-van` hay `/luong-y` | **Cao (P1)** |
| **Câu hỏi thường gặp (FAQ) Đông y** | Giải đáp cách sắc, bảo quản, uống chung thuốc Tây, giao tỉnh | Chưa có | **Cao (P1)** |
| **Giới thiệu nhà thuốc & Vùng trồng dược liệu** | Trang riêng kể lịch sử, chuẩn dược liệu, cơ sở vật chất, giấy phép | Mới có 4 dòng cam kết & text pháp lý nhỏ ở Footer | **Cao (P1)** |
| **Tra cứu đơn hàng & lịch hẹn** | Nhập mã đơn/lịch hẹn hoặc SĐT để xem tiến độ xử lý | Chưa có (dù đã có sẵn data đồng bộ `localStorage`) | **Trung bình (P2)** |
| **Nút nổi Zalo / Hotline & Bản đồ chỉ đường** | Floating CTA Zalo/Gọi nhanh + vị trí phòng khám | Có hotline ở Header/Footer, chưa có nút nổi & chỉ đường | **Trung bình (P2)** |
| **Chính sách (Giao hàng, Đổi trả, Bảo mật)** | Link Footer về đóng gói chống ẩm, đổi trả ẩm mốc, bảo mật bệnh án | Chưa có | **Trung bình (P2)** |
| **Đánh giá khách hàng trong Chi tiết SP** | Review khách đã mua gắn theo từng sản phẩm | Mới có `testimonials` ở Trang chủ & `/luong-y` | **Thấp (P3)** |

---

## 3. Chi tiết các nội dung cần bổ sung (Phạm vi Demo)

### Nhóm P1 — Nên bổ sung ngay (Tăng độ tin cậy & tính đặc thù ngành Đông y)

#### 3.1. Khối "Quy trình khám & bốc thuốc" (4 bước)
- **Vị trí đề xuất:** Trang chủ (`src/app/page.tsx`) và/hoặc đầu trang `/dat-lich`.
- **Nội dung mẫu:**
  1. **Đặt lịch / Gửi triệu chứng:** Chọn khung giờ online (Zalo/Video) hoặc tại phòng khám; có thể gửi kèm đơn thuốc cũ.
  2. **Lương y Tứ chẩn:** Thăm khám, bắt mạch (tại phòng khám) hoặc quan sát sắc mặt, lưỡi và hỏi bệnh sử chi tiết (online).
  3. **Gia giảm & Bào chế:** Bốc thang theo đúng thể trạng; hỗ trợ đóng gói chống ẩm hoặc sắc sẵn thành túi vô trùng.
  4. **Giao tận nhà & Theo dõi:** Giao hàng toàn quốc, kèm hướng dẫn sắc/uống và nhắc lịch tái khám theo liệu trình.
- **Giá trị khi demo:** Minh họa trực quan "luồng nghiệp vụ khép kín" giúp người lớn tuổi và chủ phòng khám dễ hình dung quy trình vận hành.

#### 3.2. Minh bạch Phí tư vấn & Dịch vụ sắc thuốc sẵn
- **Vị trí đề xuất:** 1 khối thông tin gọn trên `/dat-lich`, `/tu-van` và `/luong-y`.
- **Nội dung mẫu:**
  - **Tư vấn trực tuyến (Zalo / Video):** Miễn phí.
  - **Khám & bắt mạch tại phòng khám:** Miễn phí khi bốc thuốc (hoặc phí khám tham khảo).
  - **Hỗ trợ sắc thuốc sẵn đóng túi vô trùng:** Ghi rõ có hỗ trợ cho khách bận rộn, giao nội thành trong ngày / gửi tỉnh đóng thùng bảo quản.

#### 3.3. Khối Câu hỏi thường gặp (FAQ) đặc thù Đông y
- **Vị trí đề xuất:** Accordion gọn ở cuối Trang chủ hoặc trang `/dat-lich`.
- **5–6 câu hỏi trọng tâm nên có:**
  1. *Tư vấn online không bắt mạch trực tiếp thì lương y chẩn đoán thế nào?*
  2. *Nhà thuốc có hỗ trợ sắc thuốc sẵn đóng túi không?*
  3. *Thuốc thang và dược liệu giao đi tỉnh có bị ẩm mốc không, bảo quản ra sao?*
  4. *Đang uống thuốc Tây có dùng kèm thuốc Đông y được không?*
  5. *Một liệu trình thường kéo dài bao lâu và chi phí khoảng bao nhiêu?*
  6. *Muốn đổi giờ hoặc hủy lịch hẹn đã đặt thì làm thế nào?*

#### 3.4. Mục / Trang "Về Mộc Y" (Giới thiệu, Vùng trồng & Pháp lý)
- **Vị trí đề xuất:** Trang `/gioi-thieu` (hoặc mục nổi bật dẫn từ thanh menu chính `src/components/layout/nav-items.ts` — hiện menu mới có 4 mục và chưa hiển thị `/luong-y`).
- **Nội dung mẫu:**
  - Câu chuyện thương hiệu & triết lý *"Bốc thuốc theo thể trạng"*.
  - Tiêu chuẩn dược liệu sạch (nguồn gốc vùng trồng, sơ chế không diêm sinh/chất bảo quản).
  - Không gian phòng khám, tủ thuốc, khu sắc thuốc.
  - Khối **Giấy phép hoạt động phòng khám & Chứng chỉ hành nghề** trình bày trang trọng, dễ đọc (thay vì chỉ là dòng chữ nhỏ ở Footer).

---

### Nhóm P2 — Điểm cộng "ăn tiền" khi trình diễn Demo

#### 3.5. Trang Tra cứu đơn hàng & lịch hẹn (`/tra-cuu`)
- **Cách hoạt động (không cần Backend):** Đọc trực tiếp dữ liệu đơn hàng và lịch hẹn từ `localStorage` (`mocy-demo`). Khách nhập **Mã đơn / Mã lịch hẹn** hoặc **Số điện thoại** để xem trạng thái hiện tại.
- **Giá trị trong kịch bản Demo 4 bước:**
  > Khách đặt đơn $\rightarrow$ Admin đổi trạng thái từ *"Chờ xác nhận"* sang *"Đang bốc thuốc / đóng gói"* $\rightarrow$ Quay lại tab Khách mở `/tra-cuu` thấy trạng thái cập nhật tức thời.

#### 3.6. Nút liên hệ nổi (Floating Zalo / Hotline) & Chỉ đường
- **Floating CTA:** Nút Gọi nhanh / Chat Zalo cố định góc phải màn hình (desktop; trên mobile thiết kế gọn hoặc ẩn để không che `MobileNav`).
- **Chỉ đường:** Thêm nút/khối dẫn bản đồ tới cơ sở phòng khám tại phần Liên hệ / Footer hoặc trang `/gioi-thieu`.

#### 3.7. Trang Chính sách gọn (`/chinh-sach`)
- Một trang duy nhất chia 3 mục neo (`#giao-hang`, `#doi-tra`, `#bao-mat`) gắn link vào Footer:
  - **Chính sách giao hàng & đóng gói:** Chống ẩm/hút chân không cho dược liệu; đóng thùng chống vỡ cho thuốc sắc túi; miễn phí ship từ `500.000đ`.
  - **Chính sách đổi trả:** Hỗ trợ đổi mới/hoàn tiền nếu dược liệu ẩm mốc, hư hỏng do vận chuyển hoặc sai đơn.
  - **Bảo mật thông tin bệnh án:** Cam kết giữ kín thông tin cá nhân, triệu chứng và đơn thuốc của khách hàng.

---

### Nhóm P3 — Tùy chọn bổ sung nhẹ
- **Đánh giá sản phẩm (Reviews):** Hiển thị 2–3 nhận xét mẫu ngay trong trang chi tiết sản phẩm (`/san-pham/[slug]`) thay vì chỉ hiển thị chung ở Trang chủ.

---

## 4. Nội dung KHÔNG nên làm trong phạm vi Demo (Để dành Giai đoạn 2)

Để giữ bản Demo tinh gọn và đúng mục tiêu chốt dự án, không nên đầu tư vào các phần sau:
- **Từ điển tra cứu hàng trăm vị thuốc / cây thuốc:** Khối lượng nội dung lớn, phục vụ SEO dài hạn.
- **Tài khoản thành viên / Đăng nhập / Hồ sơ bệnh án điện tử:** Cần Backend & phân quyền bảo mật thật.
- **Xác thực OTP khi tra cứu bằng số điện thoại:** Bản demo cho tra bằng SĐT không cần xác thực (chỉ hiện danh sách gọn).
- **Live Chat real-time / Tích hợp Zalo OA ZNS / API vận chuyển thật:** Thuộc phạm vi Giai đoạn 2 theo `requirement.md`.
- **Diễn đàn Hỏi – Đáp cộng đồng (Q&A Forum) hoặc thư viện Video nặng:** Không làm tăng hiệu quả trong buổi demo 4 bước.

---

## 5. Checklist triển khai đề xuất (Theo thứ tự ưu tiên)

- [x] **Bước 1:** Bổ sung khối **Quy trình khám & bốc thuốc (4 bước)** và **FAQ (5–6 câu)** lên Trang chủ.
- [x] **Bước 2:** Thêm bảng **Minh bạch phí khám & dịch vụ sắc thuốc sẵn** vào `/dat-lich` và `/tu-van`.
- [x] **Bước 3:** Tạo trang `/gioi-thieu` (câu chuyện, vùng trồng, pháp lý, chỉ đường) và rà soát lại `NAV_ITEMS` (bổ sung link phù hợp). *Ghi chú: "chỉ đường" chuyển sang P2; `NAV_ITEMS` giữ nguyên vì thêm mục làm logo header bị cắt ở 768px và ≥1280px, link `/gioi-thieu` đặt ở Footer và khối Quy trình trên Trang chủ.*
- [x] **Bước 4:** Tạo trang `/tra-cuu` đọc từ `localStorage` để nâng cấp kịch bản trình diễn đồng bộ Khách $\leftrightarrow$ Admin. *Ghi chú: tra được cả mã `TV…`; tra bằng SĐT chỉ ra danh sách gọn, chi tiết che SĐT và không hiện địa chỉ/triệu chứng.*
- [x] **Bước 5:** Tạo trang `/chinh-sach` (3 mục neo) gắn vào Footer và bổ sung nút nổi Zalo/Hotline. *Ghi chú: nút nổi chỉ hiện từ 1024px; "Chỉ đường" là link Google Maps ở Footer, `/gioi-thieu` và phiếu lịch hẹn tại phòng khám.*

> [!IMPORTANT]
> **Trước buổi demo:** thay `SITE.zalo` / `SITE.zaloHref` (`src/lib/constants.ts`) bằng số Zalo thật của phòng khám; số hiện tại là số mẫu và sẽ mở tài khoản Zalo của người khác.
