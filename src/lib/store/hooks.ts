"use client";

import { useMemo, useSyncExternalStore } from "react";
import { calcCartTotals, findCoupon } from "../pricing";
import { getServerState, getState, subscribe, type StoreState } from "./core";

/**
 * Đọc một phần state. Selector phải trả về giá trị có sẵn trong state hoặc giá trị nguyên thủy
 * (VD `s => s.orders`, `s => s.cart.length`). Không tạo mảng/object mới trong selector
 * (filter, map, {...}) vì sẽ render lặp vô hạn; hãy xử lý tiếp bằng useMemo.
 * Lúc render server và hydrate, state rỗng; xem `useHydrated`.
 */
export function useStore<T>(selector: (state: StoreState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(getServerState()),
  );
}

const noopSubscribe = () => () => {};

/** false khi render server / hydrate, true khi đã đọc được localStorage. Dùng để phân biệt "đang tải" với "không tìm thấy". */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Giỏ hàng kèm mã ưu đãi và tiền đã tính. */
export function useCart() {
  const items = useStore((s) => s.cart);
  const couponCode = useStore((s) => s.couponCode);
  const coupon = useMemo(() => (couponCode ? findCoupon(couponCode) ?? null : null), [couponCode]);
  const totals = useMemo(() => calcCartTotals(items, coupon), [items, coupon]);
  return { items, coupon, totals };
}

/** Tổng số lượng trong giỏ (cho icon giỏ hàng). */
export function useCartCount(): number {
  return useStore((s) => s.cart.reduce((sum, i) => sum + i.quantity, 0));
}

function byNewest<T extends { createdAt: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
}

/** Đơn hàng, mới nhất trước. */
export function useOrders() {
  const orders = useStore((s) => s.orders);
  return useMemo(() => byNewest(orders), [orders]);
}

/** Tìm đơn theo id hoặc mã đơn. */
export function useOrder(idOrCode: string | null | undefined) {
  return useStore((s) => s.orders.find((o) => o.id === idOrCode || o.code === idOrCode));
}

/** Lịch hẹn, mới tạo nhất trước. */
export function useAppointments() {
  const appointments = useStore((s) => s.appointments);
  return useMemo(() => byNewest(appointments), [appointments]);
}

/** Tìm lịch hẹn theo id hoặc mã lịch hẹn. */
export function useAppointment(idOrCode: string | null | undefined) {
  return useStore((s) => s.appointments.find((a) => a.id === idOrCode || a.code === idOrCode));
}

/** Yêu cầu tư vấn cắt thang, mới nhất trước. */
export function useConsultRequests() {
  const requests = useStore((s) => s.consultRequests);
  return useMemo(() => byNewest(requests), [requests]);
}

/** Tìm yêu cầu tư vấn theo id hoặc mã. */
export function useConsultRequest(idOrCode: string | null | undefined) {
  return useStore((s) => s.consultRequests.find((r) => r.id === idOrCode || r.code === idOrCode));
}
