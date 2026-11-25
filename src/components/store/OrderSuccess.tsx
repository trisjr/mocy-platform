"use client";

import { Copy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Badge, Button, ButtonLink, Slip } from "@/components/ui";
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
      <div className="label-frame paper-fiber flex flex-col items-center gap-4 bg-surface px-6 py-10 text-center shadow-card">
        <h1 className="text-3xl md:text-4xl">Không tìm thấy đơn hàng</h1>
        <p className="text-ink-muted">
          {code ? `Không có đơn mã ${code} trên thiết bị này.` : "Đường dẫn thiếu mã đơn hàng."} Anh/chị gọi hotline{" "}
          <a href={SITE.hotlineHref} className="font-semibold text-herb-700 underline">
            {SITE.hotline}
          </a>{" "}
          để được hỗ trợ.
        </p>
        <ButtonLink href="/san-pham">Xem sản phẩm</ButtonLink>
      </div>
    );
  }

  const status = ORDER_STATUS_META[order.status];
  const isTransfer = order.paymentMethod === "bank-transfer";

  return (
    <div className="flex flex-col gap-8">
      {/* Phiếu đặt hàng: cuống phiếu có mã đơn và dấu son, thân phiếu là hướng dẫn thanh toán */}
      <Slip
        title="Đặt hàng thành công"
        lead={<>Cảm ơn {order.shipping.name}! Mã đơn hàng của anh/chị là</>}
        code={order.code}
        meta={
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Badge tone={status.tone}>{status.label}</Badge>
            <span className="text-ink-muted">Đặt lúc {formatDateTime(order.createdAt)}</span>
          </div>
        }
      >
        {isTransfer ? (
          <section aria-labelledby="vietqr-title" className="flex flex-col gap-5 px-5 py-7 sm:px-10">
            <h2 id="vietqr-title" className="text-2xl md:text-3xl">
              Chuyển khoản qua VietQR
            </h2>
            <div className="grid gap-6 md:grid-cols-[16rem_1fr] md:items-start">
              <div className="mx-auto w-full max-w-64">
                <div className="border-2 border-ink bg-white p-3">
                  <FakeVietQR content={order.transferContent} className="w-full" />
                </div>
                <p className="mt-2 text-center text-label text-ink-muted">Mã QR minh họa cho bản demo</p>
              </div>
              <dl className="flex flex-col gap-3">
                <Row label="Ngân hàng" value={BANK_INFO.bankName} />
                <Row label="Số tài khoản" value={BANK_INFO.accountNumber} copy={BANK_INFO.accountNumber.replace(/\s/g, "")} />
                <Row label="Chủ tài khoản" value={BANK_INFO.accountName} />
                <Row label="Số tiền" value={formatPrice(order.total)} copy={String(order.total)} highlight />
                <Row label="Nội dung chuyển khoản" value={order.transferContent} copy={order.transferContent} highlight />
              </dl>
            </div>
            <p className="border-l-4 border-info bg-info-soft px-4 py-3 text-info">
              Vui lòng ghi đúng nội dung <strong>{order.transferContent}</strong> để nhà thuốc đối chiếu đơn nhanh. Đơn
              sẽ được bốc thuốc, đóng gói ngay sau khi nhận tiền.
            </p>
          </section>
        ) : (
          <p className="px-5 py-7 text-center text-lg sm:px-10">
            Nhà thuốc sẽ gọi số <strong>{formatPhone(order.shipping.phone)}</strong> để xác nhận đơn. Anh/chị chuẩn bị{" "}
            <strong className="tabular-nums">{formatPrice(order.total)}</strong> khi nhận hàng.
          </p>
        )}
      </Slip>

      <section
        aria-labelledby="chi-tiet-don"
        className="paper-fiber flex flex-col gap-4 border-y-2 border-double border-line-strong/70 bg-surface/80 px-5 py-6 sm:px-8"
      >
        <h2 id="chi-tiet-don" className="text-2xl md:text-3xl">
          Chi tiết đơn hàng
        </h2>
        <ul className="flex flex-col gap-3 border-b border-dashed border-line-strong/60 pb-4">
          {order.items.map((item) => (
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
        <OrderSummary totals={order} couponCode={order.couponCode} />
        <dl className="grid gap-2 border-t border-dashed border-line-strong/60 pt-4 sm:grid-cols-[10rem_1fr]">
          <dt className="text-ink-muted">Người nhận</dt>
          <dd className="flex flex-wrap gap-x-2 font-semibold">
            <span>{order.shipping.name}</span>
            <span className="border-l border-line-strong pl-2">{formatPhone(order.shipping.phone)}</span>
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
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href={`/tra-cuu?ma=${order.code}`} variant="outline" size="lg">
          Theo dõi đơn hàng
        </ButtonLink>
        <ButtonLink href="/san-pham" variant="outline" size="lg">
          Tiếp tục mua sắm
        </ButtonLink>
        <ButtonLink href="/" variant="ghost" size="lg">
          Về trang chủ
        </ButtonLink>
      </div>
    </div>
  );
}

function Row({ label, value, copy, highlight }: { label: string; value: string; copy?: string; highlight?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-dashed border-line-strong/60 pb-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="flex items-center gap-2">
        <span className={highlight ? "text-lg font-bold tabular-nums" : "font-semibold"}>{value}</span>
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
