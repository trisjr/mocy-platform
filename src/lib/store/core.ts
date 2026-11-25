/**
 * Store demo lưu ở localStorage, đồng bộ giữa các tab qua sự kiện `storage`.
 * Action là hàm thường, gọi trong event handler của client component.
 * Đọc state trong component bằng các hook ở `./hooks`.
 */
import { seedAppointments, seedOrders } from "@/data";
import type {
  Appointment,
  AppointmentStatus,
  CartItem,
  ConsultRequest,
  ConsultRequestStatus,
  Coupon,
  Order,
  OrderStatus,
  PaymentMethod,
  ShippingInfo,
} from "@/types";
import { ORDER_STATUS_FLOW, TRANSFER_PREFIX } from "../constants";
import { calcCartTotals, findCoupon, getCouponError } from "../pricing";
import { getBookedSlots } from "../schedule";
import { generateCode, generateId } from "../utils";

export interface StoreState {
  cart: CartItem[];
  /** Mã ưu đãi đang áp cho giỏ hàng. */
  couponCode: string | null;
  orders: Order[];
  appointments: Appointment[];
  consultRequests: ConsultRequest[];
}

interface PersistedState extends StoreState {
  version: number;
  /** Id bản ghi seed đã từng được gộp vào, để không thêm lại sau khi bị xóa. */
  seededIds: string[];
}

/** Mã lỗi nghiệp vụ, dùng để rẽ nhánh xử lý thay vì so chuỗi message. */
export type StoreErrorCode = "MISSING_CUSTOMER" | "EMPTY_CART" | "SLOT_TAKEN" | "STORAGE_FULL";

/** Lỗi nghiệp vụ: `code` để xử lý theo loại lỗi, `message` tiếng Việt hiển thị thẳng cho người dùng. */
export class StoreError extends Error {
  readonly code: StoreErrorCode;

  constructor(code: StoreErrorCode, message: string) {
    super(message);
    this.name = "StoreError";
    this.code = code;
  }
}

export const STORAGE_KEY = "mocy-demo";
const VERSION = 1;
const MAX_QUANTITY = 99;

export const EMPTY_STATE: StoreState = {
  cart: [],
  couponCode: null,
  orders: [],
  appointments: [],
  consultRequests: [],
};

let state: StoreState = EMPTY_STATE;
let seededIds: string[] = [];
let loaded = false;
/** Chuỗi localStorage mà state trong bộ nhớ đang phản ánh; khác chuỗi hiện tại nghĩa là tab khác vừa ghi. */
let lastRaw: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parsePersisted(raw: string | null): PersistedState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedState;
    return parsed?.version === VERSION ? parsed : null;
  } catch {
    return null;
  }
}

function writeStorage(next: StoreState, nextSeededIds: string[]) {
  const persisted: PersistedState = { ...next, version: VERSION, seededIds: nextSeededIds };
  const raw = JSON.stringify(persisted);
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
    lastRaw = raw;
  } catch {
    throw new StoreError(
      "STORAGE_FULL",
      "Không lưu được dữ liệu vì bộ nhớ trình duyệt đã đầy. Vui lòng bỏ bớt ảnh hoặc bấm “Reset dữ liệu demo”.",
    );
  }
}

/** Đọc localStorage và gộp bản ghi seed chưa từng có. Ghi lại nếu có seed mới. */
function loadFromStorage() {
  const raw = readRaw();
  lastRaw = raw;
  const persisted = parsePersisted(raw);
  const base: StoreState = persisted
    ? {
        cart: persisted.cart ?? [],
        couponCode: persisted.couponCode ?? null,
        orders: persisted.orders ?? [],
        appointments: persisted.appointments ?? [],
        consultRequests: persisted.consultRequests ?? [],
      }
    : EMPTY_STATE;
  const seeded = new Set(persisted?.seededIds ?? []);
  const newOrders = seedOrders.filter((o) => !seeded.has(o.id) && !base.orders.some((x) => x.id === o.id));
  const newAppointments = seedAppointments.filter(
    (a) => !seeded.has(a.id) && !base.appointments.some((x) => x.id === a.id),
  );
  [...newOrders, ...newAppointments].forEach((r) => seeded.add(r.id));

  state = {
    ...base,
    orders: [...base.orders, ...newOrders],
    appointments: [...base.appointments, ...newAppointments],
  };
  seededIds = [...seeded];
  if (!persisted || newOrders.length > 0 || newAppointments.length > 0) {
    try {
      writeStorage(state, seededIds);
    } catch {
      // Vẫn dùng state trong bộ nhớ nếu không ghi được.
    }
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  loadFromStorage();
  window.addEventListener("storage", (event) => {
    // key = null khi tab khác gọi localStorage.clear().
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    if (syncFromStorage()) emit();
  });
}

/** Nạp lại từ localStorage nếu tab khác đã ghi kể từ lần đọc/ghi cuối. Trả về true nếu state đổi. */
function syncFromStorage(): boolean {
  if (readRaw() === lastRaw) return false;
  loadFromStorage();
  return true;
}

/**
 * State mới nhất để action đọc rồi ghi: luôn đọc lại localStorage trước, không tin bản trong bộ nhớ
 * (sự kiện storage có thể đến muộn), để không ghi đè dữ liệu tab khác vừa lưu.
 */
function fresh(): StoreState {
  ensureLoaded();
  if (syncFromStorage()) emit();
  return state;
}

/** State hiện tại (tham chiếu ổn định cho tới lần thay đổi kế tiếp). */
export function getState(): StoreState {
  ensureLoaded();
  return state;
}

/** State dùng khi render phía server và lúc hydrate: luôn rỗng. */
export function getServerState(): StoreState {
  return EMPTY_STATE;
}

export function subscribe(listener: () => void): () => void {
  ensureLoaded();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Ghi localStorage trước, thành công mới cập nhật bộ nhớ và báo listener. Ném StoreError nếu ghi lỗi. */
function commit(next: StoreState) {
  writeStorage(next, seededIds);
  state = next;
  emit();
}

function nowIso() {
  return new Date().toISOString();
}

function requireCustomer(customer: { name: string; phone: string }) {
  const name = customer.name.trim();
  const phone = customer.phone.trim();
  if (!name || !phone) throw new StoreError("MISSING_CUSTOMER", "Vui lòng nhập Họ tên và Số điện thoại.");
  return { name, phone };
}

// ---------- Giỏ hàng ----------

/** Thêm vào giỏ; nếu đã có cùng sản phẩm + định lượng thì cộng dồn số lượng. */
export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  const s = fresh();
  const existing = s.cart.find((i) => i.productId === item.productId && i.variantId === item.variantId);
  const cart = existing
    ? s.cart.map((i) =>
        i === existing ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + quantity) } : i,
      )
    : [...s.cart, { ...item, quantity: Math.min(MAX_QUANTITY, quantity) }];
  commit({ ...s, cart });
}

/** Đặt số lượng; quantity <= 0 thì xóa dòng. */
export function setCartItemQuantity(productId: string, variantId: string, quantity: number) {
  const s = fresh();
  if (quantity <= 0) return removeFromCart(productId, variantId);
  const cart = s.cart.map((i) =>
    i.productId === productId && i.variantId === variantId
      ? { ...i, quantity: Math.min(MAX_QUANTITY, Math.floor(quantity)) }
      : i,
  );
  commit({ ...s, cart });
}

export function removeFromCart(productId: string, variantId: string) {
  const s = fresh();
  commit({ ...s, cart: s.cart.filter((i) => !(i.productId === productId && i.variantId === variantId)) });
}

export function clearCart() {
  commit({ ...fresh(), cart: [], couponCode: null });
}

export type ApplyCouponResult = { ok: true; coupon: Coupon } | { ok: false; error: string };

/** Áp mã ưu đãi (mã nằm trong `coupons` của `@/data`). Không ném lỗi, trả về kết quả. */
export function applyCoupon(code: string): ApplyCouponResult {
  const s = fresh();
  const coupon = findCoupon(code);
  if (!coupon) return { ok: false, error: "Mã ưu đãi không đúng hoặc đã hết hạn." };
  const error = getCouponError(coupon, calcCartTotals(s.cart).subtotal);
  if (error) return { ok: false, error };
  commit({ ...s, couponCode: coupon.code });
  return { ok: true, coupon };
}

export function removeCoupon() {
  commit({ ...fresh(), couponCode: null });
}

// ---------- Đơn hàng ----------

export interface PlaceOrderInput {
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
}

/** Tạo đơn từ giỏ hàng hiện tại (kèm mã ưu đãi), sau đó làm trống giỏ. Trả về đơn vừa tạo. */
export function placeOrder(input: PlaceOrderInput): Order {
  const s = fresh();
  if (s.cart.length === 0) throw new StoreError("EMPTY_CART", "Giỏ hàng đang trống.");
  const customer = requireCustomer(input.shipping);
  const coupon = s.couponCode ? findCoupon(s.couponCode) : undefined;
  const totals = calcCartTotals(s.cart, coupon);
  const now = nowIso();
  const code = generateCode("DH");
  const order: Order = {
    id: generateId(),
    code,
    createdAt: now,
    updatedAt: now,
    status: "pending",
    statusHistory: [{ status: "pending", at: now }],
    items: s.cart,
    shipping: {
      ...customer,
      address: input.shipping.address?.trim() || undefined,
      note: input.shipping.note?.trim() || undefined,
    },
    paymentMethod: input.paymentMethod,
    transferContent: `${TRANSFER_PREFIX} ${code}`,
    couponCode: coupon && totals.discount > 0 ? coupon.code : undefined,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shippingFee: totals.shippingFee,
    total: totals.total,
  };
  commit({ ...s, orders: [order, ...s.orders], cart: [], couponCode: null });
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const s = fresh();
  const now = nowIso();
  commit({
    ...s,
    orders: s.orders.map((o) =>
      o.id === id && o.status !== status
        ? { ...o, status, updatedAt: now, statusHistory: [...o.statusHistory, { status, at: now }] }
        : o,
    ),
  });
}

/** Chuyển đơn sang trạng thái kế tiếp trong ORDER_STATUS_FLOW. Trả về trạng thái mới, hoặc undefined nếu đã hoàn thành. */
export function advanceOrderStatus(id: string): OrderStatus | undefined {
  const order = fresh().orders.find((o) => o.id === id);
  if (!order) return undefined;
  const next = ORDER_STATUS_FLOW[ORDER_STATUS_FLOW.indexOf(order.status) + 1];
  if (next) updateOrderStatus(id, next);
  return next;
}

export function removeOrder(id: string) {
  const s = fresh();
  commit({ ...s, orders: s.orders.filter((o) => o.id !== id) });
}

// ---------- Lịch hẹn ----------

export type NewAppointmentInput = Pick<
  Appointment,
  "symptomGroupId" | "mode" | "onlineChannel" | "doctorId" | "date" | "time" | "customer" | "symptoms"
>;

/** Tạo lịch hẹn trạng thái "pending". Ném StoreError nếu khung giờ đã có người đặt. */
export function createAppointment(input: NewAppointmentInput): Appointment {
  const s = fresh();
  const customer = requireCustomer(input.customer);
  if (getBookedSlots(input.doctorId, input.date, s.appointments).includes(input.time)) {
    throw new StoreError("SLOT_TAKEN", "Khung giờ này vừa có người đặt. Vui lòng chọn giờ khác.");
  }
  const now = nowIso();
  const appointment: Appointment = {
    ...input,
    onlineChannel: input.mode === "online" ? input.onlineChannel : undefined,
    symptoms: input.symptoms?.trim() || undefined,
    customer,
    id: generateId(),
    code: generateCode("LH"),
    createdAt: now,
    updatedAt: now,
    status: "pending",
  };
  commit({ ...s, appointments: [appointment, ...s.appointments] });
  return appointment;
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const s = fresh();
  const now = nowIso();
  commit({
    ...s,
    appointments: s.appointments.map((a) => (a.id === id ? { ...a, status, updatedAt: now } : a)),
  });
}

export function removeAppointment(id: string) {
  const s = fresh();
  commit({ ...s, appointments: s.appointments.filter((a) => a.id !== id) });
}

// ---------- Yêu cầu tư vấn cắt thang ----------

export type NewConsultRequestInput = Pick<
  ConsultRequest,
  "productId" | "productName" | "symptoms" | "prescriptionImage" | "customer"
>;

/** Tạo yêu cầu tư vấn trạng thái "new". Ảnh phải nén trước bằng `compressImage` (`@/lib/image`). */
export function createConsultRequest(input: NewConsultRequestInput): ConsultRequest {
  const s = fresh();
  const customer = requireCustomer(input.customer);
  const now = nowIso();
  const request: ConsultRequest = {
    ...input,
    symptoms: input.symptoms.trim(),
    customer,
    id: generateId(),
    code: generateCode("TV"),
    createdAt: now,
    updatedAt: now,
    status: "new",
  };
  commit({ ...s, consultRequests: [request, ...s.consultRequests] });
  return request;
}

export function updateConsultRequestStatus(id: string, status: ConsultRequestStatus) {
  const s = fresh();
  const now = nowIso();
  commit({
    ...s,
    consultRequests: s.consultRequests.map((r) => (r.id === id ? { ...r, status, updatedAt: now } : r)),
  });
}

export function removeConsultRequest(id: string) {
  const s = fresh();
  commit({ ...s, consultRequests: s.consultRequests.filter((r) => r.id !== id) });
}

// ---------- Demo ----------

/** Xóa toàn bộ dữ liệu demo và nạp lại seed (ngày seed tính lại theo hôm nay). Mọi tab cùng cập nhật. */
export function resetDemoData() {
  ensureLoaded();
  window.localStorage.removeItem(STORAGE_KEY);
  loadFromStorage();
  emit();
}
