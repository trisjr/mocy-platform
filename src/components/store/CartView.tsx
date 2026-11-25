"use client";

import { ArrowRight, Leaf, ShoppingCart, Tag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink, Card, Input } from "@/components/ui";
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
import { OrderSummary } from "./OrderSummary";
import { QuantityInput } from "./QuantityInput";
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
    return (
      <Card padding="lg" className="mt-6 flex flex-col items-center gap-4 text-center">
        <ShoppingCart aria-hidden="true" className="size-14 text-herb-400" />
        <p className="text-xl font-semibold">Giỏ hàng đang trống</p>
        <p className="text-ink-muted">Anh/chị chọn dược liệu, trà thảo mộc hoặc combo liệu trình để thêm vào giỏ.</p>
        <ButtonLink href="/san-pham" size="lg" icon={<Leaf aria-hidden="true" className="size-5" />}>
          Mua dược liệu
        </ButtonLink>
      </Card>
    );
  }

  const remainingForFreeShip = FREE_SHIPPING_THRESHOLD - totals.subtotal;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-start">
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-4">
          {items.map((item) => {
            const slug = getProductById(item.productId)?.slug;
            return (
              <li key={item.productId + item.variantId}>
                <Card className="flex gap-4">
                  <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-paper-200 sm:size-28">
                    <SafeImage src={item.image} alt={item.productName} className="size-full" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {slug ? (
                          <Link href={`/san-pham/${slug}`} className="text-lg font-semibold hover:underline">
                            {item.productName}
                          </Link>
                        ) : (
                          <p className="text-lg font-semibold">{item.productName}</p>
                        )}
                        <p className="text-ink-muted">
                          {item.variantLabel} · {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => run(() => removeFromCart(item.productId, item.variantId))}
                        aria-label={`Xóa ${item.productName} (${item.variantLabel}) khỏi giỏ`}
                        className="-mt-1 -mr-1 flex size-12 shrink-0 items-center justify-center rounded-full text-danger hover:bg-danger-soft"
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
                      <p className="text-lg font-bold text-bronze-700">{formatPrice(item.unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
        {actionError && (
          <p role="alert" className="rounded-xl bg-danger-soft p-4 text-danger">
            {actionError}
          </p>
        )}
        <Link href="/san-pham" className="min-h-12 content-center font-semibold text-herb-700 underline">
          ← Tiếp tục chọn sản phẩm
        </Link>
      </div>

      <Card padding="lg" className="flex flex-col gap-5">
        <h2 className="text-2xl">Tóm tắt đơn hàng</h2>

        {coupon ? (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-herb-200 bg-herb-50 p-4">
            <div>
              <p className="flex items-center gap-2 font-semibold text-herb-800">
                <Tag aria-hidden="true" className="size-5" />
                Đã áp mã {coupon.code}
              </p>
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
              className="-mt-2 -mr-2 flex size-12 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-paper-200"
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
                    className="min-h-12 rounded-full border-2 border-dashed border-herb-400 px-4 font-semibold text-herb-700 hover:bg-herb-50"
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
          <p className="rounded-xl bg-info-soft p-3 text-info">
            Mua thêm {formatPrice(remainingForFreeShip)} để được miễn phí giao hàng.
          </p>
        )}

        <ButtonLink href="/thanh-toan" size="lg" fullWidth icon={<ArrowRight aria-hidden="true" className="size-5" />}>
          Tiến hành đặt hàng
        </ButtonLink>
      </Card>
    </div>
  );
}
