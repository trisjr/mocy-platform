import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, TRANSFER_PREFIX } from "@/lib/constants";
import { dateKeyFromNow, isoFromNow } from "@/lib/date";
import type {
  Appointment,
  AppointmentStatus,
  ConsultMode,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from "@/types";
import { coupons } from "./coupons";
import { doctors } from "./doctors";
import { products } from "./products";

// ---------- Đơn hàng ----------

const STATUS_STEPS: OrderStatus[] = ["pending", "preparing", "shipping", "completed"];

function makeItem(productId: string, variantId: string, quantity: number): OrderItem {
  const product = products.find((p) => p.id === productId);
  const variant = product?.variants.find((v) => v.id === variantId);
  if (!product || !variant) throw new Error(`Seed sai sản phẩm: ${productId}/${variantId}`);
  return {
    productId,
    variantId,
    productName: product.name,
    variantLabel: variant.label,
    unitPrice: variant.price,
    image: product.images[0],
    quantity,
  };
}

interface OrderSeed {
  /** Số ngày trước hôm nay (0 = hôm nay). */
  daysAgo: number;
  time: string;
  name: string;
  phone: string;
  address: string;
  items: [productId: string, variantId: string, quantity: number][];
  payment: PaymentMethod;
  status: OrderStatus;
  coupon?: string;
}

const orderSeeds: OrderSeed[] = [
  { daysAgo: 13, time: "09:15", name: "Phạm Thị Lan", phone: "0912345601", address: "25 Trần Thái Tông, Cầu Giấy, Hà Nội", items: [["p-tra-ngu-ngon", "v-20", 2]], payment: "cod", status: "completed" },
  { daysAgo: 13, time: "15:40", name: "Nguyễn Văn Hải", phone: "0903456702", address: "112 Nguyễn Trãi, Thanh Xuân, Hà Nội", items: [["p-cao-xoa-bop-xuong-khop", "v-100g", 1]], payment: "bank-transfer", status: "completed" },
  { daysAgo: 12, time: "10:05", name: "Đỗ Minh Thu", phone: "0987654303", address: "48 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh", items: [["p-tra-duong-nhan", "v-30", 1], ["p-ky-tu-ninh-ha", "v-100g", 1]], payment: "bank-transfer", status: "completed" },
  { daysAgo: 11, time: "19:20", name: "Trần Quốc Bảo", phone: "0934567804", address: "9 Lạch Tray, Ngô Quyền, Hải Phòng", items: [["p-hoai-son-thai-lat", "v-500g", 1], ["p-hat-sen-kho", "v-500g", 1]], payment: "cod", status: "completed" },
  { daysAgo: 10, time: "08:50", name: "Lê Hoàng Nam", phone: "0978123405", address: "77 Nguyễn Văn Linh, Hải Châu, Đà Nẵng", items: [["p-combo-ngu-ngon", "v-15", 1]], payment: "bank-transfer", status: "completed", coupon: "KHACHMOI" },
  { daysAgo: 10, time: "14:30", name: "Vũ Thị Hương", phone: "0945678906", address: "31 Hàng Bài, Hoàn Kiếm, Hà Nội", items: [["p-ky-tu-ninh-ha", "v-500g", 1], ["p-duong-quy-thai-lat", "v-500g", 1]], payment: "cod", status: "completed", coupon: "DONGY10" },
  { daysAgo: 9, time: "11:10", name: "Hoàng Văn Phúc", phone: "0966789007", address: "56 Lê Lợi, TP. Vinh, Nghệ An", items: [["p-tao-nhan-sao", "v-500g", 1]], payment: "bank-transfer", status: "completed" },
  { daysAgo: 8, time: "16:45", name: "Bùi Thị Ngọc", phone: "0919876508", address: "14 Hai Bà Trưng, Ninh Kiều, Cần Thơ", items: [["p-combo-duong-nhan", "v-30", 1]], payment: "bank-transfer", status: "completed", coupon: "LIEUTRINH50" },
  { daysAgo: 7, time: "09:35", name: "Đặng Văn Khánh", phone: "0908123609", address: "203 Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh", items: [["p-combo-xuong-khop", "v-30", 1], ["p-cao-xoa-bop-xuong-khop", "v-50g", 1]], payment: "bank-transfer", status: "completed", coupon: "DONGY10" },
  { daysAgo: 7, time: "20:05", name: "Ngô Thị Thảo", phone: "0932456710", address: "6 Phan Chu Trinh, Hải Châu, Đà Nẵng", items: [["p-tra-tieu-thuc", "v-20", 2]], payment: "cod", status: "completed" },
  { daysAgo: 6, time: "10:25", name: "Lý Văn Sơn", phone: "0977345811", address: "88 Điện Biên Phủ, Ba Đình, Hà Nội", items: [["p-hat-sen-kho", "v-1kg", 1], ["p-hoai-son-thai-lat", "v-1kg", 1]], payment: "bank-transfer", status: "completed" },
  { daysAgo: 5, time: "13:15", name: "Trương Thị Mai", phone: "0988234912", address: "19 Nguyễn Huệ, TP. Huế, Thừa Thiên Huế", items: [["p-combo-ngu-ngon", "v-30", 1]], payment: "bank-transfer", status: "completed", coupon: "DONGY10" },
  { daysAgo: 5, time: "17:50", name: "Phan Văn Dũng", phone: "0915678013", address: "42 Quang Trung, Hà Đông, Hà Nội", items: [["p-tra-ngu-ngon", "v-40", 1], ["p-tao-nhan-sao", "v-100g", 1]], payment: "cod", status: "completed" },
  { daysAgo: 4, time: "08:40", name: "Nguyễn Thị Bích", phone: "0903987114", address: "27 Trần Phú, Nha Trang, Khánh Hòa", items: [["p-ky-tu-ninh-ha", "v-1kg", 1]], payment: "bank-transfer", status: "completed", coupon: "DONGY10" },
  { daysAgo: 4, time: "15:20", name: "Cao Minh Tuấn", phone: "0936543215", address: "310 Lê Văn Sỹ, Quận Phú Nhuận, TP. Hồ Chí Minh", items: [["p-cao-xoa-bop-xuong-khop", "v-50g", 2]], payment: "cod", status: "shipping" },
  { daysAgo: 3, time: "10:00", name: "Đinh Thị Hà", phone: "0947321016", address: "5 Ngô Quyền, Hoàn Kiếm, Hà Nội", items: [["p-tra-duong-nhan", "v-20", 1], ["p-duong-quy-thai-lat", "v-100g", 1]], payment: "bank-transfer", status: "shipping" },
  { daysAgo: 3, time: "18:30", name: "Mai Văn Thịnh", phone: "0969876517", address: "73 Hùng Vương, TP. Buôn Ma Thuột, Đắk Lắk", items: [["p-combo-xuong-khop", "v-15", 1]], payment: "cod", status: "shipping" },
  { daysAgo: 2, time: "09:20", name: "Võ Thị Kim", phone: "0911765418", address: "16 Lý Thường Kiệt, Hồng Bàng, Hải Phòng", items: [["p-hoai-son-thai-lat", "v-500g", 1], ["p-tra-tieu-thuc", "v-30", 1]], payment: "bank-transfer", status: "preparing" },
  { daysAgo: 2, time: "14:10", name: "Lương Văn Tâm", phone: "0902345619", address: "92 Nguyễn Du, Hai Bà Trưng, Hà Nội", items: [["p-combo-duong-nhan", "v-15", 1], ["p-tra-duong-nhan", "v-20", 1]], payment: "bank-transfer", status: "preparing", coupon: "DONGY10" },
  { daysAgo: 1, time: "11:45", name: "Hồ Thị Yến", phone: "0983456720", address: "58 Pasteur, Quận 1, TP. Hồ Chí Minh", items: [["p-combo-ngu-ngon", "v-15", 2]], payment: "bank-transfer", status: "preparing" },
  { daysAgo: 1, time: "19:00", name: "Tạ Quang Vinh", phone: "0973219821", address: "21 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội", items: [["p-ky-tu-ninh-ha", "v-500g", 1]], payment: "cod", status: "pending" },
  { daysAgo: 0, time: "07:30", name: "Dương Thị Oanh", phone: "0918765422", address: "135 Nguyễn Văn Cừ, Long Biên, Hà Nội", items: [["p-tra-ngu-ngon", "v-20", 1], ["p-hat-sen-kho", "v-100g", 1]], payment: "cod", status: "pending", coupon: "KHACHMOI" },
  { daysAgo: 0, time: "08:15", name: "Kiều Văn Lộc", phone: "0905432123", address: "40 Lê Duẩn, Hải Châu, Đà Nẵng", items: [["p-combo-xuong-khop", "v-30", 1]], payment: "bank-transfer", status: "pending" },
];

function buildOrder(seed: OrderSeed, index: number): Order {
  const n = String(index + 1).padStart(2, "0");
  const code = `DH2611S${n}`;
  const items = seed.items.map(([p, v, q]) => makeItem(p, v, q));
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const coupon = seed.coupon ? coupons.find((c) => c.code === seed.coupon) : undefined;
  let discount = 0;
  if (coupon && (!coupon.minSubtotal || subtotal >= coupon.minSubtotal)) {
    const raw = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
    discount = Math.min(Math.round(coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw), subtotal);
  }
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  const targetStep = STATUS_STEPS.indexOf(seed.status);
  const statusHistory = STATUS_STEPS.slice(0, targetStep + 1).map((status, step) => {
    // Mỗi bước muộn hơn bước trước khoảng 3 giờ, không vượt quá hôm nay.
    const [h, m] = seed.time.split(":").map(Number);
    const hour = Math.min(h + step * 3, 23);
    const at = isoFromNow(-seed.daysAgo, `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    return { status, at };
  });

  return {
    id: `seed-order-${n}`,
    code,
    createdAt: isoFromNow(-seed.daysAgo, seed.time),
    updatedAt: statusHistory[statusHistory.length - 1].at,
    status: seed.status,
    statusHistory,
    items,
    shipping: { name: seed.name, phone: seed.phone, address: seed.address },
    paymentMethod: seed.payment,
    transferContent: `${TRANSFER_PREFIX} ${code}`,
    couponCode: discount > 0 ? seed.coupon : undefined,
    subtotal,
    discount,
    shippingFee,
    total: subtotal - discount + shippingFee,
  };
}

export const seedOrders: Order[] = orderSeeds.map(buildOrder);

// ---------- Lịch hẹn ----------

interface AppointmentSeed {
  /** Âm là quá khứ, 0 là hôm nay, dương là sắp tới. */
  offset: number;
  /** Lương y ưu tiên (index trong doctors); nếu hôm đó nghỉ sẽ chọn người khác cùng nhóm bệnh. */
  doctor: number;
  slot: number;
  mode: ConsultMode;
  channel?: "zalo" | "video";
  group: string;
  status: AppointmentStatus;
  name: string;
  phone: string;
  symptoms?: string;
}

const appointmentSeeds: AppointmentSeed[] = [
  { offset: -13, doctor: 0, slot: 0, mode: "clinic", group: "sg-xuong-khop", status: "completed", name: "Nguyễn Văn Hải", phone: "0903456702", symptoms: "Đau mỏi gối hai bên, nặng hơn khi trời lạnh." },
  { offset: -12, doctor: 1, slot: 1, mode: "online", channel: "zalo", group: "sg-mat-ngu", status: "completed", name: "Phạm Thị Lan", phone: "0912345601", symptoms: "Khó vào giấc, hay tỉnh lúc 3 giờ sáng." },
  { offset: -11, doctor: 2, slot: 0, mode: "online", channel: "video", group: "sg-tieu-hoa", status: "completed", name: "Trần Quốc Bảo", phone: "0934567804", symptoms: "Ăn kém, đầy bụng sau bữa tối." },
  { offset: -10, doctor: 0, slot: 3, mode: "online", channel: "zalo", group: "sg-boi-bo", status: "completed", name: "Vũ Thị Hương", phone: "0945678906", symptoms: "Mệt mỏi sau khi ốm dậy." },
  { offset: -9, doctor: 1, slot: 2, mode: "clinic", group: "sg-duong-nhan", status: "completed", name: "Đỗ Minh Thu", phone: "0987654303" },
  { offset: -8, doctor: 2, slot: 2, mode: "online", channel: "zalo", group: "sg-tieu-hoa", status: "cancelled", name: "Lý Văn Sơn", phone: "0977345811", symptoms: "Hay đầy hơi." },
  { offset: -7, doctor: 0, slot: 1, mode: "clinic", group: "sg-xuong-khop", status: "completed", name: "Đặng Văn Khánh", phone: "0908123609", symptoms: "Cứng khớp buổi sáng, đi lại khó khăn lúc mới dậy." },
  { offset: -6, doctor: 1, slot: 4, mode: "online", channel: "video", group: "sg-mat-ngu", status: "completed", name: "Trương Thị Mai", phone: "0988234912", symptoms: "Ngủ chập chờn, hay lo nghĩ." },
  { offset: -5, doctor: 2, slot: 1, mode: "online", channel: "zalo", group: "sg-boi-bo", status: "completed", name: "Ngô Thị Thảo", phone: "0932456710" },
  { offset: -4, doctor: 0, slot: 5, mode: "clinic", group: "sg-xuong-khop", status: "completed", name: "Cao Minh Tuấn", phone: "0936543215", symptoms: "Đau lưng khi ngồi lâu." },
  { offset: -3, doctor: 1, slot: 0, mode: "online", channel: "zalo", group: "sg-mat-ngu", status: "completed", name: "Hồ Thị Yến", phone: "0983456720", symptoms: "Khó ngủ, làm việc căng thẳng." },
  { offset: -2, doctor: 2, slot: 3, mode: "online", channel: "video", group: "sg-tieu-hoa", status: "completed", name: "Võ Thị Kim", phone: "0911765418", symptoms: "Ăn không ngon miệng, người gầy." },
  { offset: -1, doctor: 0, slot: 2, mode: "clinic", group: "sg-xuong-khop", status: "completed", name: "Mai Văn Thịnh", phone: "0969876517", symptoms: "Mỏi vai gáy." },
  { offset: 0, doctor: 1, slot: 6, mode: "online", channel: "zalo", group: "sg-mat-ngu", status: "confirmed", name: "Dương Thị Oanh", phone: "0918765422", symptoms: "Ngủ không sâu giấc nhiều tuần nay." },
  { offset: 0, doctor: 0, slot: 8, mode: "clinic", group: "sg-xuong-khop", status: "confirmed", name: "Tạ Quang Vinh", phone: "0973219821" },
  { offset: 0, doctor: 2, slot: 2, mode: "online", channel: "video", group: "sg-tieu-hoa", status: "pending", name: "Lương Văn Tâm", phone: "0902345619", symptoms: "Hay đầy bụng sau khi ăn." },
  { offset: 1, doctor: 1, slot: 3, mode: "clinic", group: "sg-duong-nhan", status: "confirmed", name: "Kiều Thị Linh", phone: "0914567823" },
  { offset: 1, doctor: 0, slot: 4, mode: "online", channel: "zalo", group: "sg-boi-bo", status: "pending", name: "Đinh Thị Hà", phone: "0947321016", symptoms: "Mệt mỏi, ăn ngủ kém." },
  { offset: 2, doctor: 2, slot: 1, mode: "online", channel: "zalo", group: "sg-mat-ngu", status: "pending", name: "Phan Văn Dũng", phone: "0915678013" },
  { offset: 3, doctor: 0, slot: 0, mode: "clinic", group: "sg-xuong-khop", status: "pending", name: "Hoàng Văn Phúc", phone: "0966789007", symptoms: "Đau gối khi lên xuống cầu thang." },
];

/** Chọn lương y làm việc vào ngày đó, nhận hình thức khám đã chọn; ưu tiên người đã chỉ định. */
function pickDoctor(preferred: number, date: Date, mode: ConsultMode) {
  const weekday = date.getDay();
  const order = [preferred, ...doctors.map((_, i) => i).filter((i) => i !== preferred)];
  return (
    order.map((i) => doctors[i]).find((d) => d.schedule.weekdays.includes(weekday) && d.consultModes.includes(mode)) ??
    order.map((i) => doctors[i]).find((d) => d.schedule.weekdays.includes(weekday))
  );
}

function buildAppointments(): Appointment[] {
  const taken = new Set<string>();
  const result: Appointment[] = [];
  appointmentSeeds.forEach((seed, index) => {
    const date = dateKeyFromNow(seed.offset);
    const day = new Date();
    day.setDate(day.getDate() + seed.offset);
    const doctor = pickDoctor(seed.doctor, day, seed.mode);
    if (!doctor) return;
    const mode: ConsultMode = doctor.consultModes.includes(seed.mode) ? seed.mode : doctor.consultModes[0];
    // Tránh trùng khung giờ: nếu giờ đã có người đặt thì lấy giờ kế tiếp.
    let slotIndex = seed.slot % doctor.schedule.slots.length;
    while (taken.has(`${doctor.id}|${date}|${doctor.schedule.slots[slotIndex]}`)) {
      slotIndex = (slotIndex + 1) % doctor.schedule.slots.length;
    }
    const time = doctor.schedule.slots[slotIndex];
    taken.add(`${doctor.id}|${date}|${time}`);
    const n = String(index + 1).padStart(2, "0");
    const createdAt = isoFromNow(Math.min(seed.offset, 0) - 1, "16:00");
    const updatedAt = isoFromNow(Math.min(seed.offset, 0), "08:00");
    result.push({
      id: `seed-appointment-${n}`,
      code: `LH2611S${n}`,
      createdAt,
      updatedAt,
      status: seed.status,
      symptomGroupId: seed.group,
      mode,
      onlineChannel: mode === "online" ? (seed.channel ?? "zalo") : undefined,
      doctorId: doctor.id,
      date,
      time,
      customer: { name: seed.name, phone: seed.phone },
      symptoms: seed.symptoms,
    });
  });
  return result;
}

export const seedAppointments: Appointment[] = buildAppointments();
