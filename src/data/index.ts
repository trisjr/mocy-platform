/**
 * Dữ liệu mẫu tĩnh. Giữ nguyên tên export và type; store và các trang import trực tiếp từ đây.
 * Ngày của seedOrders / seedAppointments tính tương đối từ hôm nay bằng
 * `isoFromNow` / `dateKeyFromNow` trong `@/lib/date`.
 * Id của bản ghi seed cố định (VD "seed-order-01") để store gộp đúng.
 */
export { products } from "./products";
export { doctors } from "./doctors";
export { symptomGroups } from "./symptom-groups";
export { articles } from "./articles";
export { testimonials } from "./testimonials";
export { coupons } from "./coupons";
export { seedOrders, seedAppointments } from "./seed";
export { careSteps } from "./care-steps";
export { faqs } from "./faqs";
export { serviceFees, SERVICE_FEE_NOTE } from "./service-fees";
