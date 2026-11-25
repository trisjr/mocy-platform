"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button } from "@/components/ui";
import { CONSULT_STATUS_META } from "@/lib/constants";
import { formatDateTime, formatPhone } from "@/lib/format";
import { updateConsultRequestStatus, useConsultRequests } from "@/lib/store";
import type { ConsultRequest, ConsultRequestStatus } from "@/types";
import { DataList, type Column, type RowTone } from "./DataList";
import { EmptyState, FilterBar, StatusTag } from "./parts";
import { useFreshIds } from "./useFreshIds";

type Filter = "all" | ConsultRequestStatus;

const FLOW: ConsultRequestStatus[] = ["new", "contacted", "quoted", "closed"];

const ADVANCE_LABEL: Record<ConsultRequestStatus, string | null> = {
  new: "Đã liên hệ khách",
  contacted: "Đã báo giá",
  quoted: "Hoàn tất",
  closed: null,
};

export function ConsultList() {
  const requests = useConsultRequests();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const freshIds = useFreshIds(
    requests.map((r) => r.id),
    true,
  );

  const options = useMemo(
    () => [
      { value: "all" as Filter, label: "Tất cả", count: requests.length },
      ...FLOW.map((s) => ({
        value: s as Filter,
        label: CONSULT_STATUS_META[s].label,
        count: requests.filter((r) => r.status === s).length,
      })),
    ],
    [requests],
  );
  const rows = useMemo(() => (filter === "all" ? requests : requests.filter((r) => r.status === filter)), [requests, filter]);

  const columns: Column<ConsultRequest>[] = [
    {
      key: "customer",
      header: "Khách hàng",
      className: "md:min-w-52",
      render: (r) => (
        <div className="break-words">
          <p className="flex flex-wrap items-center gap-2 font-semibold">
            {r.customer.name}
            {r.status === "new" && <Badge tone="bronze">{freshIds.has(r.id) ? "Vừa gửi" : "Mới"}</Badge>}
          </p>
          <a href={`tel:${r.customer.phone.replace(/\D/g, "")}`} className="whitespace-nowrap text-herb-700 underline">
            {formatPhone(r.customer.phone)}
          </a>
          <p className="text-sm text-ink-muted">
            {r.code} · gửi lúc {formatDateTime(r.createdAt)}
          </p>
        </div>
      ),
    },
    {
      key: "product",
      header: "Sản phẩm cần cắt thang",
      render: (r) => <p className="break-words font-semibold">{r.productName ?? "Tư vấn chung"}</p>,
    },
    {
      key: "symptoms",
      header: "Triệu chứng",
      render: (r) => <p className="line-clamp-2 break-words text-ink-muted">{r.symptoms}</p>,
    },
    {
      key: "status",
      header: "Trạng thái",
      className: "md:w-36",
      render: (r) => <StatusTag tone={CONSULT_STATUS_META[r.status].tone} label={CONSULT_STATUS_META[r.status].label} />,
    },
    {
      key: "actions",
      header: "Thao tác",
      hideLabel: true,
      render: (r) => {
        const label = ADVANCE_LABEL[r.status];
        const next = FLOW[FLOW.indexOf(r.status) + 1];
        const open = expanded === r.id;
        return (
          <div className="flex flex-wrap items-center gap-2">
            {label && next ? (
              <Button
                variant="primary"
                onClick={() => updateConsultRequestStatus(r.id, next)}
                aria-label={`Yêu cầu ${r.code}: chuyển sang ${CONSULT_STATUS_META[next].label}`}
              >
                {label}
              </Button>
            ) : null}
            <Button
              variant="ghost"
              aria-expanded={open}
              onClick={() => setExpanded(open ? null : r.id)}
              icon={open ? <ChevronUp aria-hidden="true" className="size-5" /> : <ChevronDown aria-hidden="true" className="size-5" />}
            >
              {open ? "Thu gọn" : "Xem chi tiết"}
            </Button>
          </div>
        );
      },
    },
  ];

  const rowTone = (r: ConsultRequest): RowTone | undefined =>
    r.status === "new" ? (freshIds.has(r.id) ? "fresh" : "new") : undefined;

  return (
    <>
      <FilterBar label="Lọc yêu cầu tư vấn" options={options} value={filter} onChange={setFilter} />
      <DataList
        caption="Danh sách yêu cầu tư vấn cắt thang"
        rows={rows}
        getKey={(r) => r.id}
        columns={columns}
        rowTone={rowTone}
        expandedKey={expanded}
        renderDetail={(r) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="break-words">
              <h3 className="mb-1 text-lg">Triệu chứng khách mô tả</h3>
              <p className="whitespace-pre-line">{r.symptoms}</p>
            </div>
            <div>
              <h3 className="mb-1 text-lg">Ảnh đơn thuốc cũ</h3>
              {r.prescriptionImage ? (
                // Ảnh data URL đã nén ở storefront, chỉ để xem trước nên không dùng next/image.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.prescriptionImage}
                  alt={`Ảnh đơn thuốc cũ của ${r.customer.name}`}
                  className="max-h-72 w-auto max-w-full rounded-xl border border-line"
                />
              ) : (
                <p className="text-ink-muted">Khách không gửi ảnh.</p>
              )}
            </div>
          </div>
        )}
        empty={
          <EmptyState
            title={requests.length === 0 ? "Chưa có yêu cầu cắt thang nào" : "Không có yêu cầu ở trạng thái này"}
            hint={
              requests.length === 0
                ? "Khi khách gửi form tư vấn cắt thang ở tab cửa hàng, yêu cầu sẽ hiện ở đây ngay."
                : "Chọn trạng thái khác để xem các yêu cầu còn lại."
            }
          />
        }
      />
    </>
  );
}
