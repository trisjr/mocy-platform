"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ChoiceCard, PriceTag } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import { addToCart, StoreError } from "@/lib/store";
import type { Product } from "@/types";
import { QuantityInput } from "./QuantityInput";

/** Chọn định lượng, số lượng, thêm giỏ / mua ngay (chỉ cho sản phẩm thương mại). */
export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  if (!variant) return null;

  function add(): boolean {
    setError(null);
    try {
      addToCart(
        {
          productId: product.id,
          variantId: variant.id,
          productName: product.name,
          variantLabel: variant.label,
          unitPrice: variant.price,
          image: product.images[0] ?? "",
        },
        quantity,
      );
      return true;
    } catch (e) {
      setError(e instanceof StoreError ? e.message : "Có lỗi xảy ra, vui lòng thử lại.");
      return false;
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <PriceTag price={variant.price * quantity} compareAtPrice={variant.compareAtPrice && variant.compareAtPrice * quantity} size="lg" />
        {quantity > 1 && (
          <p className="text-ink-muted">
            {quantity} × {formatPrice(variant.price)}
          </p>
        )}
      </div>

      {product.variants.length > 1 && (
        <div>
          <p id="dinh-luong-label" className="mb-2 font-semibold">
            Chọn định lượng
          </p>
          <div role="radiogroup" aria-labelledby="dinh-luong-label" className="grid gap-3 sm:grid-cols-2">
            {product.variants.map((v) => (
              <ChoiceCard
                key={v.id}
                selected={v.id === variant.id}
                onSelect={() => {
                  setVariantId(v.id);
                  setAdded(null);
                }}
                title={v.label}
                description={formatPrice(v.price)}
              />
            ))}
          </div>
        </div>
      )}
      {product.variants.length === 1 && (
        <p>
          <span className="font-semibold">Quy cách:</span> {variant.label}
        </p>
      )}

      <div className="flex items-center gap-4">
        <span className="font-semibold">Số lượng</span>
        <QuantityInput
          value={quantity}
          onChange={(n) => {
            setQuantity(n);
            setAdded(null);
          }}
          label={product.name}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            if (add()) setAdded(`${quantity} × ${product.name} (${variant.label})`);
          }}
        >
          Thêm vào giỏ
        </Button>
        <Button
          size="lg"
          onClick={() => {
            if (add()) router.push("/thanh-toan");
          }}
        >
          Mua ngay
        </Button>
      </div>

      <div aria-live="polite">
        {added && (
          <div className="flex flex-col gap-1 border-l-4 border-herb-700 bg-herb-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="text-herb-800">
              Đã thêm <strong>{added}</strong> vào giỏ hàng.
            </p>
            <Link href="/gio-hang" className="min-h-12 shrink-0 content-center font-semibold text-herb-700 underline">
              Xem giỏ hàng
            </Link>
          </div>
        )}
        {error && (
          <p role="alert" className="border-l-4 border-danger bg-danger-soft px-4 py-3 text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
