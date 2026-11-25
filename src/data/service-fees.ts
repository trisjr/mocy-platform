import type { ServiceFee } from "@/types";

/** Mức phí mẫu cho bản demo (requirement.md §5.3 còn chờ khách xác nhận). */
export const serviceFees: ServiceFee[] = [
  {
    id: "online",
    name: "Tư vấn trực tuyến (Zalo, video)",
    price: "Miễn phí",
    note: "Lương y hỏi bệnh, xem sắc mặt, lưỡi và báo giá thang thuốc trước khi bốc.",
  },
  {
    id: "clinic",
    name: "Khám & bắt mạch tại phòng khám",
    price: "Miễn phí khi bốc thuốc",
    note: "Khám không bốc thuốc: 100.000đ/lượt.",
  },
  {
    id: "decoction",
    name: "Sắc thuốc sẵn đóng túi",
    price: "20.000đ/thang",
    note: "Túi hút chân không; giao nội thành Hà Nội trong ngày, gửi tỉnh đóng thùng xốp.",
  },
];

export const SERVICE_FEE_NOTE = "Mức phí tham khảo (mẫu), sẽ cập nhật theo bảng giá thực tế của phòng khám.";
