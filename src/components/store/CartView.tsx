"use client";

import { Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink, Input } from "@/components/ui";
import { coupons } from "@/data";
import { getProductById } from "@/lib/catalog";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import {
  applyCoupon,
  removeCoupon,
  removeFromCart,
  setCartItemQuantity,
  StoreError,
  useCart,
  useHydrated,
} from "@/lib/store";
import { EmptyCart } from "./EmptyCart";
import { OrderSummary } from "./OrderSummary";
import { QuantityInput } from "./QuantityInput";
import { SupplementNotice } from "./SupplementNotice";
import { SafeImage } from "@/components/ui";

export function CartView() {
  const hydrated = useHydrated();
  const { items, coupon, totals } = useCart();
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  function run(action: () => void) {
    setActionError(null);
    try {
      action();
    } catch (e) {
      setActionError(e instanceof StoreError ? e.message : "Có lỗi xảy ra, vui lòng thử lại.");
    }
  }

  if (!hydrated) {
    return <p className="mt-6 text-lg text-ink-muted">Đang tải giỏ hàng…</p>;
  }

  if (items.length === 0) {
    return <EmptyCart message="Anh/chị chọn dược liệu, trà thảo mộc hoặc combo liệu trình để thêm vào giỏ." />;
  }

  const remainingForFreeShip = FREE_SHIPPING_THRESHOLD - totals.subtotal;
  const cartProducts = items.map((i) => getProductById(i.productId)).filter((p) => p !== undefined);

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-start">
      <div className="flex flex-col gap-4">
        {/* Các dòng hàng in trên một tờ phiếu, ngăn bằng nét đứt */}
        <ul className="paper-fiber divide-y divide-dashed divide-line-strong/60 border-y-2 border-double border-line-strong/70 bg-surface/80 px-4">
          {items.map((item) => {
            const slug = getProductById(item.productId)?.slug;
            return (
              <li key={item.productId + item.variantId}>
                <div className="flex gap-4 py-4">
                  <div className="label-frame relative size-24 shrink-0 overflow-hidden bg-surface sm:size-28">
                    <SafeImage src={item.image} alt="" className="absolute inset-0 size-full" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {slug ? (
                          <Link href={`/san-pham/${slug}`} className="font-heading text-xl font-bold hover:underline">
                            {item.productName}
                          </Link>
                        ) : (
                          <p className="font-heading text-xl font-bold">{item.productName}</p>
                        )}
                        <p className="text-ink-muted">{item.variantLabel}</p>
                        <p className="text-label text-ink-muted tabular-nums">{formatPrice(item.unitPrice)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => run(() => removeFromCart(item.productId, item.variantId))}
                        aria-label={`Xóa ${item.productName} (${item.variantLabel}) khỏi giỏ`}
                        className="-mt-1 -mr-1 flex size-12 shrink-0 items-center justify-center rounded-md text-danger hover:bg-danger-soft"
                      >
                        <Trash2 aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <QuantityInput
                        value={item.quantity}
                        onChange={(n) => run(() => setCartItemQuantity(item.productId, item.variantId, n))}
                        label={`${item.productName} (${item.variantLabel})`}
                      />
                      <p className="text-lg font-bold tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <SupplementNotice products={cartProducts} />
        {actionError && (
          <p role="alert" className="border-l-4 border-danger bg-danger-soft px-4 py-3 text-danger">
            {actionError}
          </p>
        )}
        <Link
          href="/san-pham"
          className="min-h-12 self-start content-center font-semibold text-herb-700 underline decoration-2 underline-offset-4"
        >
          Tiếp tục chọn sản phẩm
        </Link>
      </div>

      <div className="label-frame paper-fiber flex flex-col gap-5 bg-surface px-5 py-6 shadow-card sm:px-7">
        <h2 className="text-2xl md:text-3xl">Tóm tắt đơn hàng</h2>

        {coupon ? (
          <div className="flex items-start justify-between gap-3 border-l-4 border-herb-700 bg-herb-50 py-3 pr-2 pl-4">
            <div>
              <p className="font-semibold text-herb-800">Đã áp mã {coupon.code}</p>
              <p className="text-ink-muted">{coupon.description}</p>
              {totals.couponError && (
                <p role="alert" className="mt-1 font-medium text-danger">
                  {totals.couponError}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => run(removeCoupon)}
              aria-label={`Bỏ mã ${coupon.code}`}
              className="-mt-2 flex size-12 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-paper-200"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!code.trim()) {
                setCouponError("Vui lòng nhập mã ưu đãi.");
                return;
              }
              try {
                const result = applyCoupon(code);
                if (result.ok) {
                  setCode("");
                  setCouponError(null);
                } else setCouponError(result.error);
              } catch (err) {
                setCouponError(err instanceof StoreError ? err.message : "Có lỗi xảy ra, vui lòng thử lại.");
              }
            }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-end gap-2">
              <Input
                label="Mã ưu đãi"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setCouponError(null);
                }}
                placeholder="Nhập mã"
                autoCapitalize="characters"
                id="ma-uu-dai"
                aria-invalid={couponError ? true : undefined}
                aria-describedby={couponError ? "ma-uu-dai-loi" : undefined}
                className="aria-invalid:border-danger"
                wrapperClassName="flex-1"
              />
              <Button type="submit" variant="secondary">
                Áp dụng
              </Button>
            </div>
            {couponError && (
              <p id="ma-uu-dai-loi" role="alert" className="text-sm font-medium text-danger">
                {couponError}
              </p>
            )}
            {coupons.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-ink-muted">Mã dùng thử:</span>
                {coupons.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    title={c.description}
                    className="min-h-12 rounded-[3px] border-2 border-dashed border-herb-700 bg-paper-50 px-4 font-semibold tracking-wide text-herb-800 hover:bg-herb-50"
                    onClick={() => {
                      setCode(c.code);
                      setCouponError(null);
                    }}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            )}
          </form>
        )}

        <OrderSummary totals={totals} couponCode={totals.discount > 0 ? coupon?.code : null} />

        {remainingForFreeShip > 0 && (
          <p className="border-l-4 border-info bg-info-soft px-4 py-3 text-info">
            Mua thêm {formatPrice(remainingForFreeShip)} để được miễn phí giao hàng.
          </p>
        )}

        <ButtonLink href="/thanh-toan" size="lg" fullWidth>
          Tiến hành đặt hàng
        </ButtonLink>
      </div>
    </div>
  );
}
