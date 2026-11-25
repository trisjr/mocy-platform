import type {
  AppointmentStatus,
  ConsultMode,
  ConsultRequestStatus,
  LegalLabel,
  OnlineChannel,
  OrderStatus,
  PaymentMethod,
  ProductCategory,
  SaleType,
} from "@/types";

/** Tông màu dùng cho Badge và nhãn trạng thái. */
export type Tone = "herb" | "wood" | "bronze" | "neutral" | "danger" | "info";

export const SITE = {
  name: "Đông y Mộc Y",
  shortName: "Mộc Y",
  tagline: "Dược liệu sạch, bốc thuốc theo thể trạng",
  hotline: "0901 234 567",
  hotlineHref: "tel:0901234567",
  zalo: "0901 234 567",
  email: "lienhe@mocy.vn",
  address: "Số 18 phố Lãn Ông, phường Hoàn Kiếm, Hà Nội",
  openingHours: "7:30 – 20:00, Thứ 2 đến Chủ nhật",
} as const;

/** Thông tin pháp lý mẫu hiển thị ở footer (bản demo). */
export const LEGAL_INFO = {
  clinicLicense: "Giấy phép hoạt động phòng chẩn trị YHCT số 0125/HNO-GPHĐ do Sở Y tế Hà Nội cấp (mẫu)",
  practitionerLicense: "Người chịu trách nhiệm chuyên môn: Lương y Nguyễn Văn An, CCHN số 004512/HNO-CCHN (mẫu)",
  businessLicense: "GCN đăng ký doanh nghiệp số 0109876543 do Sở KH&ĐT Hà Nội cấp (mẫu)",
  productNotice: "Số công bố của từng sản phẩm được ghi tại trang chi tiết sản phẩm.",
} as const;

/** Tài khoản nhận chuyển khoản cho VietQR giả lập. */
export const BANK_INFO = {
  bankName: "Vietcombank",
  accountNumber: "0011 0045 67890",
  accountName: "CONG TY TNHH DONG Y MOC Y",
} as const;

/** Tiền tố nội dung chuyển khoản: "MOCY <mã đơn>". */
export const TRANSFER_PREFIX = "MOCY";

export const SHIPPING_FEE = 30000;
export const FREE_SHIPPING_THRESHOLD = 500000;

export const SUPPLEMENT_DISCLAIMER =
  "Thực phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.";
export const GENERAL_DISCLAIMER =
  "Thông tin trên website chỉ mang tính tham khảo. Hiệu quả có thể khác nhau tùy cơ địa. Vui lòng tham khảo ý kiến lương y, bác sĩ trước khi sử dụng.";

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  "raw-herb": "Dược liệu thô",
  finished: "Thành phẩm & Trà thảo mộc",
  combo: "Combo liệu trình",
};

export const SALE_TYPE_LABELS: Record<SaleType, string> = {
  retail: "Có sẵn",
  consult: "Cần tư vấn",
};

export const LEGAL_LABEL_META: Record<LegalLabel, { label: string; short: string; tone: Tone }> = {
  "traditional-medicine": { label: "Thuốc Đông y", short: "Thuốc", tone: "wood" },
  "herbal-material": { label: "Dược liệu", short: "Dược liệu", tone: "herb" },
  supplement: { label: "Thực phẩm bảo vệ sức khỏe", short: "TPBVSK", tone: "bronze" },
};

export const CONSULT_MODE_LABELS: Record<ConsultMode, string> = {
  online: "Tư vấn trực tuyến",
  clinic: "Khám tại phòng khám",
};

export const ONLINE_CHANNEL_LABELS: Record<OnlineChannel, string> = {
  zalo: "Gọi qua Zalo",
  video: "Gọi video",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  "bank-transfer": "Chuyển khoản qua mã VietQR",
};

/** Thứ tự trạng thái đơn hàng. */
export const ORDER_STATUS_FLOW: OrderStatus[] = ["pending", "preparing", "shipping", "completed"];

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: Tone }> = {
  pending: { label: "Chờ xác nhận", tone: "bronze" },
  preparing: { label: "Đang bốc thuốc / đóng gói", tone: "info" },
  shipping: { label: "Đang giao", tone: "wood" },
  completed: { label: "Hoàn thành", tone: "herb" },
};

export const APPOINTMENT_STATUS_META: Record<AppointmentStatus, { label: string; tone: Tone }> = {
  pending: { label: "Chờ xác nhận", tone: "bronze" },
  confirmed: { label: "Đã xác nhận", tone: "herb" },
  completed: { label: "Đã khám", tone: "neutral" },
  cancelled: { label: "Đã hủy", tone: "danger" },
};

export const CONSULT_STATUS_META: Record<ConsultRequestStatus, { label: string; tone: Tone }> = {
  new: { label: "Mới", tone: "bronze" },
  contacted: { label: "Đã liên hệ", tone: "info" },
  quoted: { label: "Đã báo giá", tone: "wood" },
  closed: { label: "Đã xong", tone: "herb" },
};

/** Index theo Date.getDay(): 0 = Chủ nhật. */
export const WEEKDAY_LABELS = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
