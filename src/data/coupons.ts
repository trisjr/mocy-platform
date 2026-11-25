import type { Coupon } from "@/types";

export const coupons: Coupon[] = [
  {
    code: "DONGY10",
    description: "Giảm 10% cho mọi đơn hàng, tối đa 150.000đ.",
    type: "percent",
    value: 10,
    maxDiscount: 150000,
  },
  {
    code: "KHACHMOI",
    description: "Giảm 30.000đ cho khách mua lần đầu, đơn từ 150.000đ.",
    type: "fixed",
    value: 30000,
    minSubtotal: 150000,
  },
  {
    code: "LIEUTRINH50",
    description: "Giảm 50.000đ cho đơn từ 500.000đ, phù hợp mua combo liệu trình.",
    type: "fixed",
    value: 50000,
    minSubtotal: 500000,
  },
];
