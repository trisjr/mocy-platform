"use client";

import { CheckCircle2, Copy, Home, Leaf, PhoneCall } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Badge, Button, ButtonLink, Card } from "@/components/ui";
import { BANK_INFO, ORDER_STATUS_META, PAYMENT_METHOD_LABELS, SITE } from "@/lib/constants";
import { formatDateTime, formatPhone, formatPrice } from "@/lib/format";
import { useHydrated, useOrder } from "@/lib/store";
import { FakeVietQR } from "./FakeVietQR";
import { OrderSummary } from "./OrderSummary";

export function OrderSuccess() {
  const code = useSearchParams().get("ma");
  const hydrated = useHydrated();
  const order = useOrder(code);

  if (!hydrated) {
    return <p className="text-lg text-ink-muted">Đang tải đơn hàng…</p>;
  }

  if (!order) {
    return (
      <Card padding="lg" className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl md:text-3xl">Không tìm thấy đơn hàng</h1>
        <p className="text-ink-muted">
          {code ? `Không có đơn mã ${code} trên thiết bị này.` : "Đường dẫn thiếu mã đơn hàng."} Anh/chị gọi hotline{" "}
          <a href={SITE.hotlineHref} className="font-semibold text-herb-700 underline">
            {SITE.hotline}
          </a>{" "}
          để được hỗ trợ.
        </p>
        <ButtonLink href="/san-pham" icon={<Leaf aria-hidden="true" className="size-5" />}>
          Xem sản phẩm
        </ButtonLink>
      </Card>
    );
  }

  const status = ORDER_STATUS_META[order.status];
  const isTransfer = order.paymentMethod === "bank-transfer";

  return (
    <div className="flex flex-col gap-6">
      <Card padding="lg" className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 aria-hidden="true" className="size-16 text-herb-600" />
        <h1 className="text-3xl md:text-4xl">Đặt hàng thành công</h1>
        <p className="text-lg">Cảm ơn {order.shipping.name}! Mã đơn hàng của anh/chị là</p>
        <p className="rounded-xl border-2 border-dashed border-herb-400 bg-herb-50 px-6 py-2 font-mono text-3xl font-bold tracking-wider text-herb-800">
          {order.code}
        </p>
        <Badge tone={status.tone}>{status.label}</Badge>
        <p className="text-ink-muted">Đặt lúc {formatDateTime(order.createdAt)}</p>
      </Card>

      {isTransfer ? (
        <Card padding="lg" className="flex flex-col gap-5">
          <h2 className="text-2xl">Chuyển khoản qua VietQR</h2>
          <div className="grid gap-6 md:grid-cols-[16rem_1fr] md:items-start">
            <div className="mx-auto w-full max-w-64">
              <div className="rounded-card border-2 border-herb-700 bg-white p-3">
                <FakeVietQR content={order.transferContent} className="w-full" />
              </div>
              <p className="mt-2 text-center text-sm text-ink-muted">Mã QR minh họa cho bản demo</p>
            </div>
            <dl className="flex flex-col gap-3">
              <Row label="Ngân hàng" value={BANK_INFO.bankName} />
              <Row label="Số tài khoản" value={BANK_INFO.accountNumber} copy={BANK_INFO.accountNumber.replace(/\s/g, "")} />
              <Row label="Chủ tài khoản" value={BANK_INFO.accountName} />
              <Row label="Số tiền" value={formatPrice(order.total)} copy={String(order.total)} highlight />
              <Row label="Nội dung chuyển khoản" value={order.transferContent} copy={order.transferContent} highlight />
            </dl>
          </div>
          <p className="rounded-xl bg-info-soft p-4 text-info">
            Vui lòng ghi đúng nội dung <strong>{order.transferContent}</strong> để nhà thuốc đối chiếu đơn nhanh. Đơn
            sẽ được bốc thuốc, đóng gói ngay sau khi nhận tiền.
          </p>
        </Card>
      ) : (
        <Card padding="lg" className="flex items-start gap-3">
          <PhoneCall aria-hidden="true" className="mt-1 size-6 shrink-0 text-herb-700" />
          <p className="text-lg">
            Nhà thuốc sẽ gọi số <strong>{formatPhone(order.shipping.phone)}</strong> để xác nhận đơn. Anh/chị chuẩn bị{" "}
            <strong className="text-bronze-700">{formatPrice(order.total)}</strong> khi nhận hàng.
          </p>
        </Card>
      )}

      <Card padding="lg" className="flex flex-col gap-4">
        <h2 className="text-2xl">Chi tiết đơn hàng</h2>
        <ul className="flex flex-col gap-3 border-b border-line pb-4">
          {order.items.map((item) => (
            <li key={item.productId + item.variantId} className="flex justify-between gap-3">
              <span>
                <span className="font-semibold">{item.productName}</span>
                <span className="block text-ink-muted">
                  {item.variantLabel} × {item.quantity}
                </span>
              </span>
              <span className="shrink-0 font-semibold">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <OrderSummary totals={order} couponCode={order.couponCode} />
        <dl className="grid gap-2 border-t border-line pt-4 sm:grid-cols-[10rem_1fr]">
          <dt className="text-ink-muted">Người nhận</dt>
          <dd className="font-semibold">
            {order.shipping.name} · {formatPhone(order.shipping.phone)}
          </dd>
          {order.shipping.address && (
            <>
              <dt className="text-ink-muted">Địa chỉ</dt>
              <dd>{order.shipping.address}</dd>
            </>
          )}
          {order.shipping.note && (
            <>
              <dt className="text-ink-muted">Ghi chú</dt>
              <dd>{order.shipping.note}</dd>
            </>
          )}
          <dt className="text-ink-muted">Thanh toán</dt>
          <dd>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</dd>
        </dl>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href="/san-pham" variant="outline" size="lg" icon={<Leaf aria-hidden="true" className="size-5" />}>
          Tiếp tục mua sắm
        </ButtonLink>
        <ButtonLink href="/" variant="ghost" size="lg" icon={<Home aria-hidden="true" className="size-5" />}>
          Về trang chủ
        </ButtonLink>
      </div>
    </div>
  );
}

function Row({ label, value, copy, highlight }: { label: string; value: string; copy?: string; highlight?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line pb-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="flex items-center gap-2">
        <span className={highlight ? "text-lg font-bold text-bronze-700" : "font-semibold"}>{value}</span>
        {copy && (
          <Button
            variant="ghost"
            className="px-3"
            aria-label={`Sao chép ${label.toLowerCase()}`}
            icon={<Copy aria-hidden="true" className="size-5" />}
            onClick={() => {
              navigator.clipboard
                ?.writeText(copy)
                .then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                })
                .catch(() => {});
            }}
          >
            <span aria-live="polite">{copied ? "Đã chép" : ""}</span>
          </Button>
        )}
      </dd>
    </div>
  );
}
