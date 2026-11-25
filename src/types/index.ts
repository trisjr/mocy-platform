/**
 * Types dùng chung cho demo Đông y.
 * Quy ước: giá tiền là số nguyên VND; ngày giờ lưu chuỗi ISO 8601
 * (riêng ngày hẹn là "YYYY-MM-DD", giờ hẹn là "HH:mm").
 * Mã enum viết bằng tiếng Anh, nhãn tiếng Việt nằm ở `src/lib/constants.ts`.
 */

// ---------- Danh mục & sản phẩm ----------

/** Loại hình sản phẩm (danh mục chính). */
export type ProductCategory = "raw-herb" | "finished" | "combo";

/** Luồng bán: thương mại (có giá, thêm giỏ) hoặc cần tư vấn (không giá, đăng ký cắt thang). */
export type SaleType = "retail" | "consult";

/** Nhãn pháp lý: Thuốc Đông y / Dược liệu / Thực phẩm bảo vệ sức khỏe. */
export type LegalLabel = "traditional-medicine" | "herbal-material" | "supplement";

/** Biến thể định lượng kèm giá, VD "Gói 500g" hoặc "Liệu trình 15 ngày". */
export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  /** Giá gốc trước giảm, để gạch ngang. */
  compareAtPrice?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Mô tả ngắn 1–2 câu cho thẻ sản phẩm. */
  shortDescription: string;
  category: ProductCategory;
  saleType: SaleType;
  legalLabel: LegalLabel;
  /** Id các nhóm bệnh (SymptomGroup.id). */
  symptomGroupIds: string[];
  /** Đường dẫn ảnh trong `public`, ảnh đầu là ảnh đại diện. */
  images: string[];
  /** Nguồn gốc / vùng trồng. */
  origin: string;
  /** Thành phần. */
  ingredients: string;
  /** Công dụng. */
  uses: string;
  /** Hướng dẫn sắc / sử dụng. */
  usage: string;
  /** Đối tượng chống chỉ định / lưu ý. */
  contraindications: string;
  /** Rỗng với sản phẩm saleType = "consult". */
  variants: ProductVariant[];
  /** Số công bố / số đăng ký mẫu. */
  registrationNumber?: string;
  featured?: boolean;
  /** Từ khóa phụ cho tìm kiếm (công dụng, tên gọi khác). */
  keywords?: string[];
}

export interface SymptomGroup {
  id: string;
  slug: string;
  /** VD "Mất ngủ", "Xương khớp". */
  name: string;
  description: string;
  /** Ảnh minh họa trong `public` (tùy chọn). */
  image?: string;
}

// ---------- Lương y ----------

/** Hình thức khám: trực tuyến hoặc tại phòng khám. */
export type ConsultMode = "online" | "clinic";

/** Kênh khi khám trực tuyến. */
export type OnlineChannel = "zalo" | "video";

export interface DoctorSchedule {
  /** Ngày làm việc trong tuần: 0 = Chủ nhật, 1 = Thứ 2 ... 6 = Thứ 7. */
  weekdays: number[];
  /** Khung giờ bắt đầu trong ngày, "HH:mm", tăng dần. */
  slots: string[];
}

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  /** Học hàm / danh xưng, VD "Lương y", "Bác sĩ YHCT". */
  title: string;
  avatar: string;
  /** Chuyên môn hiển thị, VD ["Xương khớp", "Thần kinh"]. */
  specialties: string[];
  /** Nhóm bệnh lương y nhận khám (lọc ở bước chọn lương y). */
  symptomGroupIds: string[];
  experienceYears: number;
  /** Số chứng chỉ hành nghề mẫu. */
  licenseNumber: string;
  bio: string;
  consultModes: ConsultMode[];
  schedule: DoctorSchedule;
}

// ---------- Bài viết ----------

/** Khối nội dung bài viết; cho phép chèn sản phẩm gợi ý và nút đặt lịch giữa bài. */
export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "products"; productIds: string[]; title?: string }
  | { type: "booking-cta"; text?: string; doctorId?: string };

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  /** Tên tác giả hiển thị. */
  author: string;
  /** Lương y kiểm duyệt chuyên môn (Doctor.id). */
  reviewedByDoctorId?: string;
  /** Ngày đăng ISO. */
  publishedAt: string;
  readingMinutes: number;
  symptomGroupIds: string[];
  content: ArticleBlock[];
  /** Sản phẩm gợi ý cuối bài. */
  relatedProductIds: string[];
}

// ---------- Nội dung trang chủ & khuyến mãi ----------

export interface Testimonial {
  id: string;
  name: string;
  age?: number;
  location: string;
  content: string;
  /** 1–5 sao. */
  rating: number;
  productId?: string;
  doctorId?: string;
  avatar?: string;
}

export interface Coupon {
  code: string;
  description: string;
  type: "percent" | "fixed";
  /** Phần trăm (0–100) hoặc số tiền VND. */
  value: number;
  /** Tạm tính tối thiểu để áp mã. */
  minSubtotal?: number;
  /** Mức giảm tối đa (cho mã phần trăm). */
  maxDiscount?: number;
}

// ---------- Dữ liệu giao dịch (lưu trong store) ----------

/** Thông tin khách: chỉ Họ tên + SĐT là bắt buộc. */
export interface CustomerInfo {
  name: string;
  phone: string;
}

/** Dòng giỏ hàng, lưu snapshot tên và giá tại thời điểm thêm. Khóa: productId + variantId. */
export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  unitPrice: number;
  image: string;
  quantity: number;
}

export type OrderItem = CartItem;

/** Chờ xác nhận → Đang bốc thuốc/đóng gói → Đang giao → Hoàn thành. */
export type OrderStatus = "pending" | "preparing" | "shipping" | "completed";

export type PaymentMethod = "cod" | "bank-transfer";

export interface ShippingInfo extends CustomerInfo {
  address?: string;
  note?: string;
}

export interface OrderStatusChange {
  status: OrderStatus;
  at: string;
}

export interface Order {
  id: string;
  /** Mã đơn hiển thị, VD "DH2611A3F". */
  code: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  statusHistory: OrderStatusChange[];
  items: OrderItem[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  /** Nội dung chuyển khoản tự sinh theo mã đơn (VietQR giả lập). */
  transferContent: string;
  couponCode?: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  /** Mã lịch hẹn hiển thị, VD "LH2611B7C". */
  code: string;
  createdAt: string;
  updatedAt: string;
  status: AppointmentStatus;
  symptomGroupId: string;
  mode: ConsultMode;
  /** Chỉ có khi mode = "online". */
  onlineChannel?: OnlineChannel;
  doctorId: string;
  /** "YYYY-MM-DD" theo giờ địa phương. */
  date: string;
  /** "HH:mm", một trong Doctor.schedule.slots. */
  time: string;
  customer: CustomerInfo;
  /** Mô tả triệu chứng (tùy chọn). */
  symptoms?: string;
}

export type ConsultRequestStatus = "new" | "contacted" | "quoted" | "closed";

/** Yêu cầu tư vấn cắt thang cho sản phẩm cần tư vấn. */
export interface ConsultRequest {
  id: string;
  /** Mã yêu cầu hiển thị, VD "TV2611C9D". */
  code: string;
  createdAt: string;
  updatedAt: string;
  status: ConsultRequestStatus;
  productId?: string;
  /** Snapshot tên sản phẩm. */
  productName?: string;
  symptoms: string;
  /** Ảnh đơn cũ dạng data URL đã nén nhỏ, chỉ để xem trước. */
  prescriptionImage?: string;
  customer: CustomerInfo;
}

/** Một bước trong quy trình khám – bốc thuốc – giao thuốc. */
export interface CareStep {
  title: string;
  text: string;
}

/** Một dòng trong bảng chi phí khám & dịch vụ. */
export interface ServiceFee {
  id: string;
  name: string;
  /** Chuỗi hiển thị, VD "Miễn phí" hoặc "20.000đ/thang". */
  price: string;
  note?: string;
}

/** Câu hỏi thường gặp. */
export interface Faq {
  id: string;
  question: string;
  answer: string;
}
