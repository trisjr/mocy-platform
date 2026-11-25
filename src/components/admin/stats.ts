import { ORDER_STATUS_FLOW } from "@/lib/constants";
import { parseDateKey, toDateKey } from "@/lib/date";
import type { Appointment, ConsultRequest, Order, OrderStatus } from "@/types";

export interface DayPoint {
  key: string;
  label: string;
  sublabel: string;
  value: number;
  active?: boolean;
}

function addDays(key: string, n: number): string {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + n);
  return toDateKey(d);
}

function dayPoint(key: string, today: string): DayPoint {
  const d = parseDateKey(key);
  const w = d.getDay();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return { key, label: w === 0 ? "CN" : `T${w + 1}`, sublabel: `${dd}/${mm}`, value: 0, active: key === today };
}

export interface AdminStats {
  revenueTotal: number;
  revenueCompleted: number;
  orderCount: number;
  newOrders: number;
  todayAppointments: number;
  pendingAppointments: number;
  newConsults: number;
  revenueByDay: DayPoint[];
  appointmentsByDay: DayPoint[];
  statusCounts: { status: OrderStatus; value: number }[];
  topProducts: { name: string; quantity: number }[];
}

/** Tính số liệu tổng quan từ dữ liệu store (đã gồm seed). `today` là "YYYY-MM-DD" giờ địa phương. */
export function computeStats(
  orders: Order[],
  appointments: Appointment[],
  consults: ConsultRequest[],
  today: string,
): AdminStats {
  const revenueByDay = Array.from({ length: 7 }, (_, i) => dayPoint(addDays(today, i - 6), today));
  const appointmentsByDay = Array.from({ length: 7 }, (_, i) => dayPoint(addDays(today, i), today));
  const revenueIndex = new Map(revenueByDay.map((p) => [p.key, p]));
  const appointmentIndex = new Map(appointmentsByDay.map((p) => [p.key, p]));

  let revenueTotal = 0;
  let revenueCompleted = 0;
  const statusMap = new Map<OrderStatus, number>(ORDER_STATUS_FLOW.map((s) => [s, 0]));
  const productMap = new Map<string, { name: string; quantity: number }>();

  for (const o of orders) {
    revenueTotal += o.total;
    if (o.status === "completed") revenueCompleted += o.total;
    statusMap.set(o.status, (statusMap.get(o.status) ?? 0) + 1);
    const point = revenueIndex.get(toDateKey(new Date(o.createdAt)));
    if (point) point.value += o.total;
    for (const item of o.items) {
      const cur = productMap.get(item.productId) ?? { name: item.productName, quantity: 0 };
      cur.quantity += item.quantity;
      productMap.set(item.productId, cur);
    }
  }

  let todayAppointments = 0;
  let pendingAppointments = 0;
  for (const a of appointments) {
    if (a.status === "cancelled") continue;
    if (a.date === today) todayAppointments += 1;
    if (a.status === "pending") pendingAppointments += 1;
    const point = appointmentIndex.get(a.date);
    if (point) point.value += 1;
  }

  return {
    revenueTotal,
    revenueCompleted,
    orderCount: orders.length,
    newOrders: statusMap.get("pending") ?? 0,
    todayAppointments,
    pendingAppointments,
    newConsults: consults.filter((c) => c.status === "new").length,
    revenueByDay,
    appointmentsByDay,
    statusCounts: ORDER_STATUS_FLOW.map((status) => ({ status, value: statusMap.get(status) ?? 0 })),
    topProducts: [...productMap.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5),
  };
}

/** 1250000 -> "1,3tr"; 450000 -> "450k". Dùng cho nhãn cột biểu đồ. */
export function formatCompactPrice(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(".0", "").replace(".", ",")}tr`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(value);
}
