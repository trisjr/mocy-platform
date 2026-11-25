import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface SummaryTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}

/** Bảng tạm tính / giảm giá / phí giao / tổng cộng dùng cho giỏ, checkout, màn thành công. */
export function OrderSummary({
  totals,
  couponCode,
  className,
}: {
  totals: SummaryTotals;
  couponCode?: string | null;
  className?: string;
}) {
  return (
    <dl className={cn("flex flex-col gap-2", className)}>
      <div className="flex justify-between gap-4">
        <dt>Tạm tính</dt>
        <dd className="font-semibold tabular-nums">{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between gap-4 text-herb-700">
          <dt>Giảm giá{couponCode ? ` (${couponCode})` : ""}</dt>
          <dd className="font-semibold">−{formatPrice(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <dt>Phí giao hàng</dt>
        <dd className="font-semibold">{totals.shippingFee > 0 ? formatPrice(totals.shippingFee) : "Miễn phí"}</dd>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-4 border-t-[3px] border-double border-line-strong pt-3">
        <dt className="text-lg font-semibold">Tổng cộng</dt>
        <dd className="text-2xl font-bold tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}
