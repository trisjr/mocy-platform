# E2E: kiểm thử bằng trình duyệt

Các script dùng `puppeteer-core` điều khiển Chrome có sẵn trên máy, chạy trên bản đã build. Mỗi script dùng một context ẩn danh riêng nên dữ liệu localStorage luôn bắt đầu từ dữ liệu mẫu.

## Chạy

```bash
npm run build
npm start                 # http://localhost:3000, hoặc: npx next start -p 3100
npm run e2e               # chạy tất cả, in bảng PASS/FAIL, exit code khác 0 khi có FAIL
```

Chạy riêng một script: `node e2e/shots.mjs` (tương tự cho các script khác).

## Biến môi trường

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `BASE_URL` | `http://localhost:3000` | Địa chỉ app đang chạy |
| `CHROME_PATH` | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` | Đường dẫn Chrome. Linux thường là `/usr/bin/google-chrome` |
| `OUT_DIR` | `e2e/.output` | Nơi lưu ảnh chụp (đã nằm trong `.gitignore`) |

Ví dụ: `BASE_URL=http://localhost:3100 npm run e2e`.

## Các script

| Script | Kiểm tra gì |
|---|---|
| `shots.mjs` | Chụp các trang chính ở 390 và 1280: trang khách, `/luong-y`, `/gioi-thieu`, `/kien-thuc`, bài viết, bước chọn lương y của `/dat-lich`, `/tu-van?san-pham=...`, Admin. Kiểm tràn ngang, thiếu h1, ảnh lỗi, ảnh méo hoặc không phủ khung (`absolute inset-0`), chữ Lorem hoặc tiếng Anh lạc, lỗi console và request >= 400 |
| `content.mjs` | Nội dung P1: quy trình 4 bước và câu hỏi thường gặp (mở bằng chuột và Enter) trên Trang chủ; khối chi phí trên `/dat-lich`, `/tu-van`, `/luong-y`; trang `/gioi-thieu` (giấy phép, CCHN) và link tới nó; header ở 768/1024/1280 không cắt logo; nav đáy giữ 5 ô |
| `scenario.mjs` | Kịch bản demo 2 tab: khách lọc, chọn gói, áp mã, thanh toán chuyển khoản; Admin thấy đơn ngay không reload và đổi trạng thái; form cắt thang có ảnh; đặt lịch 5 bước; Admin thấy lịch hẹn và yêu cầu cắt thang kèm ảnh |
| `collide.mjs` | Trùng giờ: tab đang ở bước 5 khi tab khác đặt đúng khung giờ đó. Tab này phải quay về bước chọn giờ, báo trùng, giữ thông tin, đặt lại được, không có lịch trùng |
| `stale.mjs` | Tab cũ (chặn sự kiện `storage`) không ghi đè dữ liệu tab khác vừa lưu: đặt trùng giờ bị chặn, đặt giờ khác thì giữ cả hai, Admin tab cũ đổi trạng thái không làm mất lịch mới |
| `admin-layout.mjs` | Bố cục Admin ở 390, 1280, 1440: không tràn ngang, không lặp chữ "Lương y Lương y", số điện thoại, tab, nút lịch hẹn và tên khách không xuống dòng |
| `reset.mjs` | Nút "Reset dữ liệu demo" xóa lịch hẹn, yêu cầu cắt thang vừa tạo và trả số lượng về dữ liệu mẫu |

Ảnh PNG dùng để thử upload được sinh lúc chạy vào `OUT_DIR/test.png`, không commit file nhị phân.

`lib.mjs` chứa cấu hình và các hàm dùng chung. `run.mjs` gom kết quả của tất cả script.
