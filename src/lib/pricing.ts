import { coupons } from "@/data";
import type { CartItem, Coupon } from "@/types";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "./constants";
import { formatPrice } from "./format";

export interface CartTotals {
  /** Tổng số lượng sản phẩm. */
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  /** Mã đã áp nhưng chưa đủ điều kiện (VD tạm tính chưa đạt mức tối thiểu). */
  couponError?: string;
}

export function findCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase();
  return coupons.find((c) => c.code.toUpperCase() === normalized);
}

/** Lý do mã không áp được với tạm tính hiện tại, hoặc undefined nếu hợp lệ. */
export function getCouponError(coupon: Coupon, subtotal: number): string | undefined {
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return `Mã ${coupon.code} áp dụng cho đơn từ ${formatPrice(coupon.minSubtotal)}.`;
  }
  return undefined;
}

export function calcDiscount(coupon: Coupon, subtotal: number): number {
  if (getCouponError(coupon, subtotal)) return 0;
  const raw = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
  const capped = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  return Math.min(Math.round(capped), subtotal);
}

export function calcShippingFee(subtotal: number): number {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_FEE;
}

/** Tính tiền giỏ hàng. Phí ship tính trên tạm tính trước giảm giá. */
export function calcCartTotals(items: CartItem[], coupon?: Coupon | null): CartTotals {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const discount = coupon ? calcDiscount(coupon, subtotal) : 0;
  const shippingFee = calcShippingFee(subtotal);
  return {
    itemCount,
    subtotal,
    discount,
    shippingFee,
    total: subtotal - discount + shippingFee,
    couponError: coupon ? getCouponError(coupon, subtotal) : undefined,
  };
}
