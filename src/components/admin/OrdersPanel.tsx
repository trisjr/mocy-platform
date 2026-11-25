"use client";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button } from "@/components/ui";
import { ORDER_STATUS_FLOW, ORDER_STATUS_META, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { formatDateTime, formatPhone, formatPrice } from "@/lib/format";
import { advanceOrderStatus, useHydrated, useOrders } from "@/lib/store";
import type { Order, OrderStatus } from "@/types";
import { DataList, type Column, type RowTone } from "./DataList";
import { EmptyState, FilterBar, LoadingBlock, PageHeader, StatusTag } from "./parts";
import { useFreshIds } from "./useFreshIds";

type Filter = "all" | OrderStatus;

/** Nhãn nút chuyển sang bước kế tiếp, theo trạng thái hiện tại. */
const ADVANCE_LABEL: Record<OrderStatus, string | null> = {
  pending: "Xác nhận, bốc thuốc",
  preparing: "Chuyển giao hàng",
  shipping: "Hoàn thành đơn",
  completed: null,
};

function nextStatus(status: OrderStatus): OrderStatus | undefined {
  return ORDER_STATUS_FLOW[ORDER_STATUS_FLOW.indexOf(status) + 1];
}

function itemsSummary(order: Order): string {
  const qty = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const first = order.items[0]?.productName ?? "";
  const rest = order.items.length - 1;
  return `${qty} sản phẩm: ${first}${rest > 0 ? ` và ${rest} loại khác` : ""}`;
}

export function OrdersPanel() {
  const hydrated = useHydrated();
  const orders = useOrders();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const freshIds = useFreshIds(
    orders.map((o) => o.id),
    hydrated,
  );

  const options = useMemo(
    () => [
      { value: "all" as Filter, label: "Tất cả", count: orders.length },
      ...ORDER_STATUS_FLOW.map((s) => ({
        value: s as Filter,
        label: ORDER_STATUS_META[s].label,
        count: orders.filter((o) => o.status === s).length,
      })),
    ],
    [orders],
  );
  const rows = useMemo(() => (filter === "all" ? orders : orders.filter((o) => o.status === filter)), [orders, filter]);

  const columns: Column<Order>[] = [
    {
      key: "code",
      header: "Mã đơn",
      className: "min-w-36",
      render: (o) => (
        <div>
          <p className="flex flex-wrap items-center gap-2 font-semibold">
            {o.code}
            {o.status === "pending" && <Badge tone="bronze">{freshIds.has(o.id) ? "Vừa đặt" : "Mới"}</Badge>}
          </p>
          <p className="text-sm text-ink-muted">{formatDateTime(o.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Khách hàng",
      className: "md:min-w-52",
      render: (o) => (
        <div className="break-words">
          <p className="font-semibold">{o.shipping.name}</p>
          <a href={`tel:${o.shipping.phone.replace(/\D/g, "")}`} className="whitespace-nowrap text-herb-700 underline">
            {formatPhone(o.shipping.phone)}
          </a>
        </div>
      ),
    },
    {
      key: "total",
      header: "Đơn hàng",
      render: (o) => (
        <div className="break-words">
          <p className="font-semibold">{formatPrice(o.total)}</p>
          <p className="text-sm text-ink-muted">{itemsSummary(o)}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      className: "md:w-44",
      render: (o) => <StatusTag tone={ORDER_STATUS_META[o.status].tone} label={ORDER_STATUS_META[o.status].label} />,
    },
    {
      key: "actions",
      header: "Thao tác",
      hideLabel: true,
      render: (o) => {
        const label = ADVANCE_LABEL[o.status];
        const next = nextStatus(o.status);
        const open = expanded === o.id;
        return (
          <div className="flex flex-wrap items-center gap-2">
            {label && next ? (
              <Button
                variant="primary"
                onClick={() => advanceOrderStatus(o.id)}
                aria-label={`Đơn ${o.code}: chuyển sang ${ORDER_STATUS_META[next].label}`}
              >
                {label}
              </Button>
            ) : (
              <span className="inline-flex min-h-12 items-center gap-1 font-semibold text-herb-800">
                <Check aria-hidden="true" className="size-5" />
                Đã xong
              </span>
            )}
            <Button
              variant="ghost"
              aria-expanded={open}
              onClick={() => setExpanded(open ? null : o.id)}
              icon={open ? <ChevronUp aria-hidden="true" className="size-5" /> : <ChevronDown aria-hidden="true" className="size-5" />}
            >
              {open ? "Thu gọn" : "Chi tiết"}
            </Button>
          </div>
        );
      },
    },
  ];

  const rowTone = (o: Order): RowTone | undefined =>
    o.status === "pending" ? (freshIds.has(o.id) ? "fresh" : "new") : undefined;

  return (
    <>
      <PageHeader
        title="Đơn hàng"
        description="Đơn mới nhất nằm trên cùng, đơn chờ xác nhận được tô nổi. Bấm nút để chuyển sang bước tiếp theo."
      />
      {!hydrated ? (
        <LoadingBlock />
      ) : (
        <>
          <FilterBar label="Lọc đơn theo trạng thái" options={options} value={filter} onChange={setFilter} />
          <DataList
            caption="Danh sách đơn hàng"
            rows={rows}
            getKey={(o) => o.id}
            columns={columns}
            rowTone={rowTone}
            expandedKey={expanded}
            renderDetail={(o) => <OrderDetails order={o} />}
            empty={
              <EmptyState
                title={orders.length === 0 ? "Chưa có đơn hàng nào" : "Không có đơn ở trạng thái này"}
                hint={
                  orders.length === 0
                    ? "Khi khách đặt hàng ở tab cửa hàng, đơn sẽ hiện ở đây ngay, không cần tải lại."
                    : "Chọn trạng thái khác để xem các đơn còn lại."
                }
              />
            }
          />
        </>
      )}
    </>
  );
}

function OrderDetails({ order }: { order: Order }) {
  const history = order.statusHistory ?? [];
  return (
    <div className="grid gap-5 text-base sm:grid-cols-2">
      <div>
        <h3 className="mb-2 text-lg">Sản phẩm</h3>
        <ul className="space-y-1">
          {order.items.map((i) => (
            <li key={`${i.productId}-${i.variantId}`} className="flex justify-between gap-3">
              <span className="min-w-0 break-words">
                {i.productName} <span className="text-ink-muted">({i.variantLabel}) × {i.quantity}</span>
              </span>
              <span className="shrink-0">{formatPrice(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-line pt-3">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Tạm tính</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-ink-muted">Giảm giá{order.couponCode ? ` (${order.couponCode})` : ""}</dt>
              <dd>-{formatPrice(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-ink-muted">Phí giao hàng</dt>
            <dd>{order.shippingFee === 0 ? "Miễn phí" : formatPrice(order.shippingFee)}</dd>
          </div>
          <div className="flex justify-between font-bold">
            <dt>Tổng cộng</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>
      <div className="space-y-4">
        <div className="break-words">
          <h3 className="mb-1 text-lg">Giao tới</h3>
          <p>{order.shipping.address || "Chưa có địa chỉ"}</p>
          {order.shipping.note && <p className="text-ink-muted">Ghi chú: {order.shipping.note}</p>}
        </div>
        <div>
          <h3 className="mb-1 text-lg">Thanh toán</h3>
          <p>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
          {order.paymentMethod === "bank-transfer" && (
            <p className="text-ink-muted">Nội dung chuyển khoản: {order.transferContent}</p>
          )}
        </div>
        {history.length > 0 && (
          <div>
            <h3 className="mb-1 text-lg">Lịch sử trạng thái</h3>
            <ul className="space-y-1">
              {history.map((h, i) => (
                <li key={`${h.status}-${i}`} className="text-ink-muted">
                  <span className="font-semibold text-ink">{ORDER_STATUS_META[h.status].label}</span> · {formatDateTime(h.at)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
