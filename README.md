# Mộc Y: Demo website Đông y

Bản demo Giai đoạn 1 cho nền tảng bán sản phẩm Đông y và đặt lịch tư vấn lương y. Spec đầy đủ ở [requirement.md](requirement.md).

Demo chạy hoàn toàn ở frontend, không có backend. Dữ liệu lưu trong `localStorage` (key `mocy-demo`) và đồng bộ giữa các tab. Nhờ vậy đơn hàng, lịch hẹn hay yêu cầu tư vấn tạo ở trang khách sẽ hiện ngay trong Admin.

## Chạy

```bash
npm install
npm run dev                    # phát triển, http://localhost:3000
npm run build && npm start     # dùng cho buổi demo
```

## Các trang

| Đường dẫn | Nội dung |
|---|---|
| `/` | Trang chủ |
| `/san-pham`, `/san-pham/[slug]` | Danh sách, bộ lọc và chi tiết sản phẩm |
| `/gio-hang`, `/thanh-toan` | Giỏ hàng, checkout COD hoặc VietQR giả lập |
| `/dat-lich` | Đặt lịch lương y (5 bước) |
| `/luong-y` | Giới thiệu đội ngũ lương y |
| `/tu-van?san-pham=<slug>` | Đăng ký tư vấn cắt thang |
| `/kien-thuc` | Blog kiến thức Đông y |
| `/admin`, `/admin/don-hang`, `/admin/lich-hen` | Mini Admin |

## Trước buổi demo

1. Bấm **Reset dữ liệu demo** trong Admin để ngày của đơn hàng và lịch hẹn mẫu tính lại theo hôm nay.
2. Thay thông tin thương hiệu, hotline, tài khoản ngân hàng và giấy phép trong `src/lib/constants.ts`. Hiện đều là dữ liệu mẫu.
3. Kịch bản trình diễn 4 bước nằm ở mục 6 của `requirement.md`. Mở trang khách và `/admin` ở hai tab riêng.

## Cấu trúc

- `src/app`: các route
- `src/components/{ui,layout,store,booking,blog,admin}`: component
- `src/lib`: store, helper, hằng số. API store mô tả ở [src/lib/README.md](src/lib/README.md)
- `src/types`: types dùng chung
- `src/data`, `public/images`: dữ liệu và ảnh mẫu
- `e2e/`: script kiểm thử bằng trình duyệt
