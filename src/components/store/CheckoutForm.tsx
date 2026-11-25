"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, ButtonLink, ChoiceCard, Input, Textarea } from "@/components/ui";
import { getProductById } from "@/lib/catalog";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { placeOrder, StoreError, useCart, useHydrated } from "@/lib/store";
import { isValidPhone } from "@/lib/utils";
import type { PaymentMethod } from "@/types";
import { EmptyCart } from "./EmptyCart";
import { OrderSummary } from "./OrderSummary";
import { SupplementNotice } from "./SupplementNotice";

const PAYMENT_OPTIONS: { value: PaymentMethod; description: string }[] = [
  { value: "cod", description: "Trả tiền mặt cho nhân viên giao hàng." },
  { value: "bank-transfer", description: "Mã QR và nội dung chuyển khoản hiện ngay sau khi đặt đơn." },
];

interface Errors {
  name?: string;
  phone?: string;
  form?: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { items, coupon, totals } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [errors, setErrors] = useState<Errors>({});
  // placeOrder làm trống giỏ ngay: giữ cờ này để không hiện "giỏ trống" trong lúc chuyển trang.
  const [placed, setPlaced] = useState(false);

  if (!hydrated) {
    return <p className="mt-6 text-lg text-ink-muted">Đang tải giỏ hàng…</p>;
  }

  if (placed) {
    return <p className="mt-6 text-lg text-ink-muted">Đang tạo đơn hàng…</p>;
  }

  if (items.length === 0) {
    return <EmptyCart message="Anh/chị thêm sản phẩm vào giỏ trước khi đặt hàng." />;
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "Vui lòng nhập họ tên.";
    if (!phone.trim()) next.phone = "Vui lòng nhập số điện thoại.";
    else if (!isValidPhone(phone)) next.phone = "Số điện thoại gồm 10 số, bắt đầu bằng số 0.";
    setErrors(next);
    if (next.name || next.phone) {
      document.getElementById(next.name ? "ho-ten" : "so-dien-thoai")?.focus();
      return;
    }
    try {
      const order = placeOrder({ shipping: { name, phone, address, note }, paymentMethod: payment });
      setPlaced(true);
      router.push(`/thanh-toan/thanh-cong?ma=${order.code}`);
    } catch (err) {
      setErrors({ form: err instanceof StoreError ? err.message : "Có lỗi xảy ra, vui lòng thử lại." });
    }
  }

  return (
    <form noValidate onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-start">
      {/* Phiếu đặt hàng: hai phần ngăn bằng nét đứt */}
      <div className="paper-fiber border border-line bg-surface shadow-card">
        <section className="flex flex-col gap-4 px-5 py-6 sm:px-7">
          <h2 className="text-2xl md:text-3xl">Thông tin nhận hàng</h2>
          <p className="text-ink-muted">Chỉ cần Họ tên và Số điện thoại, nhà thuốc sẽ gọi xác nhận trước khi giao.</p>
          <Input
            id="ho-ten"
            label="Họ và tên"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            id="so-dien-thoai"
            label="Số điện thoại"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="VD: 0912 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
          <Input
            label="Địa chỉ nhận hàng"
            autoComplete="street-address"
            hint="Có thể bỏ trống, nhân viên sẽ hỏi lại khi gọi xác nhận."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Textarea
            label="Ghi chú"
            rows={3}
            placeholder="VD: giao giờ hành chính, gọi trước khi giao"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </section>

        <section className="flex flex-col gap-4 border-t-2 border-dashed border-line-strong/60 px-5 py-6 sm:px-7">
          <h2 id="thanh-toan-label" className="text-2xl md:text-3xl">
            Phương thức thanh toán
          </h2>
          <div role="radiogroup" aria-labelledby="thanh-toan-label" className="flex flex-col gap-3">
            {PAYMENT_OPTIONS.map((o) => (
              <ChoiceCard
                key={o.value}
                selected={payment === o.value}
                onSelect={() => setPayment(o.value)}
                title={PAYMENT_METHOD_LABELS[o.value]}
                description={o.description}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="label-frame paper-fiber flex flex-col gap-5 bg-surface px-5 py-6 shadow-card sm:px-7">
        <h2 className="text-2xl md:text-3xl">Đơn hàng ({totals.itemCount} sản phẩm)</h2>
        <ul className="flex flex-col gap-3 border-b border-dashed border-line-strong/60 pb-4">
          {items.map((item) => (
            <li key={item.productId + item.variantId} className="flex justify-between gap-3">
              <span>
                <span className="font-semibold">{item.productName}</span>
                <span className="block text-ink-muted">
                  {item.variantLabel} × {item.quantity}
                </span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <OrderSummary totals={totals} couponCode={totals.discount > 0 ? coupon?.code : null} />
        <SupplementNotice products={items.map((i) => getProductById(i.productId)).filter((p) => p !== undefined)} />
        {errors.form && (
          <p role="alert" className="border-l-4 border-danger bg-danger-soft px-4 py-3 text-danger">
            {errors.form}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth>
          Đặt hàng · {formatPrice(totals.total)}
        </Button>
        <ButtonLink href="/gio-hang" variant="ghost" fullWidth>
          Quay lại giỏ hàng
        </ButtonLink>
      </div>
    </form>
  );
}
