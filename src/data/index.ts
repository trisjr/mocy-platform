/**
 * Dữ liệu mẫu tĩnh. mock-data-writer sẽ điền nội dung.
 * Giữ nguyên tên export và type; store và các trang import trực tiếp từ đây.
 * Ngày của seedOrders / seedAppointments nên tính tương đối từ hôm nay bằng
 * `isoFromNow` / `dateKeyFromNow` trong `@/lib/date`, để biểu đồ Admin luôn có số liệu mới.
 * Id của bản ghi seed phải cố định (VD "seed-order-01") để store gộp đúng.
 */
import type {
  Appointment,
  Article,
  Coupon,
  Doctor,
  Order,
  Product,
  SymptomGroup,
  Testimonial,
} from "@/types";

export const products: Product[] = [];
export const doctors: Doctor[] = [];
export const articles: Article[] = [];
export const symptomGroups: SymptomGroup[] = [];
export const testimonials: Testimonial[] = [];
export const coupons: Coupon[] = [];
export const seedOrders: Order[] = [];
export const seedAppointments: Appointment[] = [];
