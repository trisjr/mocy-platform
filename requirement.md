# TÀI LIỆU ĐẶC TẢ YÊU CẦU HỆ THỐNG (SRS)
## Nền tảng Website Thương mại Điện tử & Đặt lịch Tư vấn Đông y

* **Phiên bản:** 1.0 (Giai đoạn Demo chốt dự án & Định hướng triển khai thực tế)
* **Mục tiêu dự án:** Xây dựng hệ thống website bán sản phẩm Đông y, dược liệu, thuốc thành phẩm kết hợp đặt lịch khám/tư vấn trực tuyến và tại phòng khám.
* **Chiến lược triển khai:** Chia làm 2 giai đoạn rõ rệt:
  * **Giai đoạn 1 (Bản Demo):** Hoàn thiện giao diện chuẩn nhận diện ngành Đông y và các luồng tương tác cốt lõi (mua hàng, đặt lịch, quản trị nhanh) nhằm thuyết phục khách hàng ký kết hợp đồng.
  * **Giai đoạn 2 (Hệ thống thực tế):** Xây dựng kiến trúc Backend hoàn chỉnh, tích hợp thanh toán/vận chuyển thực tế, phân quyền quản trị và vận hành chính thức sau khi chốt dự án.

---

## 1. Phân tách Phạm vi: Bản Demo vs. Hệ thống Thực tế

Bảng dưới đây làm rõ ranh giới tính năng để tối ưu thời gian dựng Demo nhưng vẫn đảm bảo khách hàng hình dung trọn vẹn giá trị của sản phẩm cuối cùng.

| Phân hệ (Module) | Giai đoạn 1: Bản Demo (Mục tiêu chốt dự án) | Giai đoạn 2: Hệ thống thực tế (Sau khi ký HĐ) |
| :--- | :--- | :--- |
| **Giao diện & Thương hiệu (UI/UX)** | Hoàn thiện 100% giao diện các trang trọng điểm (Trang chủ, Danh mục, Chi tiết SP, Đặt lịch, Giỏ hàng). Tone màu đặc trưng Đông y (xanh thảo mộc, nâu gỗ trầm, vàng đồng, nền kem/giấy dó). | Chuẩn hóa hiển thị đa thiết bị, tối ưu tốc độ tải trang (Core Web Vitals), tối ưu SEO On-page, Schema chuẩn y tế/thương mại. |
| **Bán sản phẩm & Dược liệu** | Danh mục chia theo loại hình (Dược liệu thô, Thuốc thành phẩm/Trà thảo mộc, Combo liệu trình) và **bộ lọc theo triệu chứng/nhóm bệnh**. Hỗ trợ chọn định lượng cơ bản (100g, 500g, 1kg). | Quản lý biến thể phức tạp, tồn kho theo lô và hạn sử dụng (FEFO), thiết lập mã giảm giá, chương trình khuyến mãi, combo động. |
| **Đặt lịch khám & Tư vấn** | Luồng đặt lịch mượt mà: Chọn chuyên khoa/triệu chứng $\rightarrow$ Chọn Lương y/Bác sĩ $\rightarrow$ Chọn hình thức (Online / Tại phòng khám) $\rightarrow$ Chọn ngày giờ $\rightarrow$ Màn hình xác nhận lịch hẹn. | Đồng bộ lịch làm việc thực tế của từng bác sĩ, cơ chế khóa khung giờ (tránh trùng lịch), tự động gửi thông báo nhắc lịch qua Zalo ZNS / SMS / Email. |
| **Giỏ hàng & Đặt hàng Online** | Thêm/sửa/xóa giỏ hàng, nhập thông tin giao nhận, tự động tính tổng tiền, hỗ trợ chọn COD hoặc **hiển thị mã VietQR giả lập** $\rightarrow$ Tạo mã đơn hàng thành công. | Tích hợp cổng thanh toán thực (VNPay, MoMo, VietQR tự động đối soát gạch nợ), tích hợp API vận chuyển (GHN, GHTK, Viettel Post) tự động tính cước và tạo vận đơn. |
| **Quản trị (Admin Dashboard)** | **Dashboard tương tác (Mini Admin):** Hiển thị biểu đồ thống kê mẫu + Danh sách Đơn hàng & Lịch hẹn **cập nhật tức thời** ngay khi thực hiện thao tác đặt ở giao diện khách hàng. | Hệ thống phân quyền chi tiết (Chủ phòng khám, Lương y, Dược sĩ bốc thuốc, CSKH), quản lý hồ sơ bệnh nhân, xuất báo cáo doanh thu/công nợ. |
| **Kiến thức Đông y (Blog)** | 3–5 bài viết mẫu hoàn chỉnh hình ảnh, có khối gợi ý sản phẩm liên quan và nút đặt lịch tư vấn đính kèm ngay trong nội dung bài. | Hệ thống quản trị nội dung (CMS) đầy đủ chuẩn SEO, gắn thẻ tác giả/chuyên gia kiểm duyệt chuyên môn. |

---

## 2. Đặc thù Nghiệp vụ Ngành Đông y

Khác với website bán lẻ thông thường, hệ thống cần thể hiện sâu sắc các quy trình đặc thù của y học cổ truyền để tạo lợi thế cạnh tranh khi trình bày với khách hàng:

### 2.1. Phân loại luồng bán hàng (Bán trực tiếp vs. Bốc thuốc theo tư vấn)
* **Nhóm hàng thương mại (Bán trực tiếp):** Trà thảo mộc, cao xoa bóp, thực phẩm bảo vệ sức khỏe, dược liệu phổ thông (kỳ tử, táo đỏ, đông trùng hạ thảo...). Hiển thị giá niêm yết công khai, cho phép thêm vào giỏ và thanh toán ngay.
* **Nhóm thuốc thang / Bài thuốc gia giảm (Cần tư vấn):** Không cố định giá bán đại trà do liều lượng thay đổi theo thể trạng từng người. Trang chi tiết thay nút *"Mua ngay"* bằng nút **"Đăng ký tư vấn cắt thang"**, hỗ trợ khách hàng mô tả triệu chứng hoặc đính kèm hình ảnh đơn thuốc/kết quả khám cũ để lương y báo giá.

### 2.2. Luồng nghiệp vụ khép kín (Tư vấn $\rightarrow$ Kê đơn $\rightarrow$ Giao thuốc)
* Sau buổi tư vấn (online hoặc tại phòng khám), lương y có thể tạo một **liệu trình/đơn thuốc cá nhân hóa** gắn liền với thông tin khách hàng.
* Hệ thống gửi liên kết xác nhận đơn thuốc cho khách hàng kiểm tra thành phần, chi phí và xác nhận giao hàng tận nhà.

### 2.3. Quản lý liệu trình & Nhắc tái khám (Định hướng Giai đoạn 2)
* Điều trị Đông y thường kéo dài theo nhiều chu kỳ (7 ngày, 15 ngày, 30 ngày).
* Hệ thống lưu trữ lịch sử triệu chứng, lịch sử bốc thuốc để lương y theo dõi tiến triển, đồng thời tự động nhắc lịch tái khám hoặc nhắc mua tiếp liệu trình trước khi khách dùng hết thuốc.

### 2.4. Tuân thủ pháp lý hiển thị
* Phân tách rõ ràng nhãn hiển thị giữa **Thuốc Đông y**, **Dược liệu** và **Thực phẩm bảo vệ sức khỏe**.
* Thiết kế sẵn vị trí hiển thị Giấy phép hoạt động phòng khám, chứng chỉ hành nghề của lương y, số công bố sản phẩm và dòng khuyến cáo miễn trừ trách nhiệm (*"Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh"*) nhằm đảm bảo tuân thủ quy định quảng cáo và pháp luật y tế.

---

## 3. Phạm vi Màn hình & Chức năng cho Bản Demo (Giai đoạn 1)

### 3.1. Phân hệ Khách hàng (Storefront)
1. **Trang chủ (Homepage):**
   * Banner giới thiệu thương hiệu & cam kết chất lượng dược liệu, nút CTA kép (*"Đặt lịch tư vấn"* và *"Mua dược liệu"*).
   * Khối tra cứu nhanh theo **Nhu cầu / Nhóm bệnh** (Xương khớp, Mất ngủ, Tiêu hóa, Dưỡng nhan, Bồi bổ cơ thể...).
   * Danh sách sản phẩm nổi bật (phân tách rõ sản phẩm mua ngay & bài thuốc tư vấn).
   * Đội ngũ Lương y / Chuyên gia tiêu biểu.
   * Cảm nhận khách hàng & Tin tức kiến thức Đông y.
2. **Trang Danh sách Sản phẩm & Dược liệu:**
   * Bộ lọc đa tiêu chí: Danh mục, Nhóm bệnh lý, Khoảng giá, Tình trạng (Có sẵn / Cần tư vấn).
   * Tìm kiếm nhanh theo tên dược liệu hoặc công dụng.
3. **Trang Chi tiết Sản phẩm:**
   * Thư viện hình ảnh, mô tả nguồn gốc/vùng trồng, thành phần, công dụng, hướng dẫn sắc/sử dụng, đối tượng chống chỉ định.
   * Chọn phân loại/định lượng (VD: Gói 100g / 500g / 1kg hoặc Liệu trình 15 ngày / 30 ngày) và tự động cập nhật giá.
   * Hành động linh hoạt: *"Thêm vào giỏ hàng"* / *"Mua ngay"* hoặc *"Nhận tư vấn lương y"*.
4. **Trang Đặt lịch Tư vấn & Khám bệnh:**
   * Form từng bước đơn giản: Chọn hình thức (Online qua Zalo/Video hoặc Tại phòng khám) $\rightarrow$ Chọn Lương y $\rightarrow$ Chọn ngày & khung giờ trống $\rightarrow$ Nhập thông tin (Họ tên, SĐT, Mô tả triệu chứng).
   * Trang xác nhận hiển thị mã lịch hẹn và hướng dẫn chuẩn bị trước khi khám.
5. **Giỏ hàng & Thanh toán (Checkout):**
   * Chỉnh sửa số lượng, xóa sản phẩm, áp mã ưu đãi mẫu.
   * Nhập thông tin giao hàng, chọn thanh toán COD hoặc Chuyển khoản (hiển thị mã VietQR giả lập kèm nội dung chuyển khoản tự động).
   * Màn hình đặt hàng thành công kèm mã đơn hàng.
6. **Trang Kiến thức Đông y (Blog):**
   * Danh sách bài viết và trang chi tiết bài viết có tích hợp sản phẩm gợi ý liên quan.

### 3.2. Phân hệ Quản trị nhanh (Demo Admin Dashboard)
* **Màn hình Tổng quan:** Các thẻ chỉ số (Doanh thu dự kiến, Đơn hàng mới, Lịch hẹn hôm nay) và biểu đồ trực quan.
* **Quản lý Đơn hàng:** Bảng danh sách đơn hàng hiển thị ngay đơn khách vừa đặt ở giao diện Storefront; cho phép bấm chuyển trạng thái (*Chờ xác nhận $\rightarrow$ Đang bốc thuốc/đóng gói $\rightarrow$ Đang giao $\rightarrow$ Hoàn thành*).
* **Quản lý Lịch hẹn tư vấn:** Bảng danh sách lịch hẹn cập nhật tức thời, xem nhanh triệu chứng khách mô tả và xác nhận lịch.

---

## 4. Yêu cầu Phi chức năng & Định hướng Dựng Demo

* **Thiết kế ưu tiên di động (Mobile-First) & Thân thiện người trung niên:** Tệp khách hàng Đông y chủ yếu truy cập từ điện thoại (qua Zalo/Facebook) và có tỷ lệ lớn là người trung niên/lớn tuổi. Giao diện cần cỡ chữ rõ ràng, độ tương phản cao, nút bấm lớn và tối giản các bước nhập liệu (chỉ bắt buộc Họ tên & SĐT).
* **Kiến trúc "Demo sống" (Interactive Prototype):**
  * Sử dụng công nghệ Frontend hiện đại (VD: React / Next.js + Tailwind CSS).
  * Lưu trữ dữ liệu tương tác tại trình duyệt (`localStorage` hoặc Mock API nhẹ) để đồng bộ thời gian thực giữa giao diện Khách hàng và giao diện Admin trong buổi trình diễn mà không tốn thời gian dựng hạ tầng Backend phức tạp.
* **Chất lượng dữ liệu mẫu (Mock Data):**
  * Chuẩn bị 100% dữ liệu thực tế bằng tiếng Việt (tuyệt đối không dùng chữ *Lorem Ipsum* hay ảnh lỗi).
  * Tối thiểu 10–15 sản phẩm đa dạng (VD: *Kỳ tử Ninh Hạ, Đương quy thái lát, Trà dưỡng nhan, Cao xoa bóp xương khớp, Bài thuốc an thần...*), 3 hồ sơ lương y có chuyên môn rõ ràng và 3–5 bài viết mẫu.

---

## 5. Checklist Khảo sát Khách hàng (Chốt phạm vi trước khi làm Demo)

Sử dụng bộ câu hỏi dưới đây để làm rõ kỳ vọng của khách hàng, tránh xây dựng lệch trọng tâm:

### 5.1. Mô hình kinh doanh cốt lõi
- [ ] Trọng tâm chính của khách là **Phòng khám/Phòng chẩn trị** (ưu tiên đặt lịch khám & bốc thuốc theo đơn) hay **Thương hiệu bán lẻ dược liệu/sản phẩm đóng gói** (ưu tiên e-commerce)?
- [ ] Hệ thống có bao nhiêu chi nhánh/cơ sở? Có bao nhiêu lương y/bác sĩ tham gia tư vấn?

### 5.2. Sản phẩm & Chính sách giá
- [ ] Số lượng sản phẩm (SKU) dự kiến đưa lên web là bao nhiêu?
- [ ] Dược liệu bán theo quy cách đóng gói sẵn hay cho phép khách tự chọn định lượng (lạng, nửa ký, ký)?
- [ ] Có danh mục sản phẩm/bài thuốc nào cần ẩn giá và yêu cầu liên hệ tư vấn trước khi mua không?

### 5.3. Quy trình tư vấn & Chăm sóc khách hàng
- [ ] Tư vấn trực tuyến là miễn phí hay thu phí đặt cọc trước?
- [ ] Kênh tư vấn thực tế sau khi đặt lịch là gì (Gọi điện thoại, Nhắn tin/Video call qua Zalo OA, hay tích hợp phòng họp ngay trên web)?

### 5.4. Thanh toán, Vận chuyển & Tích hợp hệ thống sẵn có
- [ ] Tỷ lệ đơn hàng dự kiến thanh toán COD so với chuyển khoản trước?
- [ ] Khách hàng hiện có đang dùng phần mềm bán hàng tại quầy (như KiotViet, Sapo, Nhanh.vn...) và cần đồng bộ tồn kho ở giai đoạn triển khai thật không?
- [ ] Có nhu cầu gửi tin nhắn xác nhận đơn hàng/nhắc lịch khám tự động qua Zalo OA (ZNS) không?

### 5.5. Tư liệu & Trọng tâm buổi Demo
- [ ] Khách hàng đã có sẵn Logo, bộ nhận diện thương hiệu và hình ảnh thật của phòng khám/sản phẩm chưa?
- [ ] Trong buổi Demo, khách hàng muốn xem sâu phần nào nhất: **Trải nghiệm người mua trên điện thoại**, **Tính năng đặt lịch**, hay **Màn hình quản trị đơn hàng/lịch hẹn**?

---

## 6. Kịch bản Trình diễn Demo (Gợi ý luồng chốt dự án)

Để tạo ấn tượng tối đa trong buổi gặp mặt khách hàng, đề xuất trình bày theo kịch bản 4 bước liên mạch:

1. **Bước 1 – Ấn tượng thương hiệu (Mobile & Desktop):** Mở trang chủ để khách thấy ngay màu sắc, phong thái uy tín đặc trưng của ngành Đông y và cách bố trí dễ đọc cho người lớn tuổi.
2. **Bước 2 – Trải nghiệm mua hàng & Dược liệu:** Demo lọc sản phẩm theo triệu chứng (VD: *Mất ngủ*), chọn định lượng dược liệu (500g), thêm vào giỏ và thanh toán tạo mã VietQR thành công. Đồng thời chỉ ra sự khác biệt ở một bài thuốc cần bấm *"Đăng ký tư vấn cắt thang"*.
3. **Bước 3 – Trải nghiệm đặt lịch lương y:** Thực hiện đặt 1 lịch hẹn tư vấn online với một lương y cụ thể, nhập triệu chứng mẫu và nhận màn hình xác nhận lịch hẹn.
4. **Bước 4 – Chốt điểm ăn tiền (Chuyển sang tab Admin):** Mở ngay màn hình Quản trị, chỉ cho khách thấy **đơn hàng và lịch hẹn vừa tạo ở Bước 2 & 3 đã xuất hiện tức thời**, sau đó thao tác đổi trạng thái đơn hàng. Kết thúc bằng việc trình bày lộ trình mở rộng sang Giai đoạn 2 (tích hợp thanh toán tự động, vận chuyển, Zalo ZNS, hồ sơ bệnh án).