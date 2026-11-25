"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button } from "@/components/ui";
import { APPOINTMENT_STATUS_META, CONSULT_MODE_LABELS, ONLINE_CHANNEL_LABELS } from "@/lib/constants";
import { getDoctorById, getSymptomGroupById } from "@/lib/catalog";
import { formatDateKey, formatDateTime, formatPhone } from "@/lib/format";
import { updateAppointmentStatus, useAppointments } from "@/lib/store";
import type { Appointment, AppointmentStatus } from "@/types";
import { DataList, type Column, type RowTone } from "./DataList";
import { EmptyState, FilterBar, StatusTag } from "./parts";
import { useFreshIds } from "./useFreshIds";

type Filter = "all" | "today" | AppointmentStatus;

const STATUS_FILTERS: AppointmentStatus[] = ["pending", "confirmed", "completed", "cancelled"];

/** `today` là "YYYY-MM-DD" giờ địa phương, chỉ truyền vào khi đã hydrate. */
export function AppointmentsList({ today }: { today: string }) {
  const appointments = useAppointments();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const freshIds = useFreshIds(
    appointments.map((a) => a.id),
    true,
  );

  const options = useMemo(
    () => [
      { value: "all" as Filter, label: "Tất cả", count: appointments.length },
      {
        value: "today" as Filter,
        label: "Hôm nay",
        count: appointments.filter((a) => a.date === today && a.status !== "cancelled").length,
      },
      ...STATUS_FILTERS.map((s) => ({
        value: s as Filter,
        label: APPOINTMENT_STATUS_META[s].label,
        count: appointments.filter((a) => a.status === s).length,
      })),
    ],
    [appointments, today],
  );

  const rows = useMemo(() => {
    if (filter === "all") return appointments;
    if (filter === "today") return appointments.filter((a) => a.date === today && a.status !== "cancelled");
    return appointments.filter((a) => a.status === filter);
  }, [appointments, filter, today]);

  const columns: Column<Appointment>[] = [
    {
      key: "customer",
      header: "Khách hàng",
      className: "md:min-w-48",
      render: (a) => (
        <div className="break-words">
          <p className="flex flex-wrap items-center gap-2 font-semibold">
            {a.customer.name}
            {a.status === "pending" && <Badge tone="bronze">{freshIds.has(a.id) ? "Vừa đặt" : "Mới"}</Badge>}
          </p>
          <a href={`tel:${a.customer.phone.replace(/\D/g, "")}`} className="whitespace-nowrap text-herb-700 underline">
            {formatPhone(a.customer.phone)}
          </a>
          <p className="text-sm text-ink-muted">
            {a.code} · đặt lúc {formatDateTime(a.createdAt)}
          </p>
        </div>
      ),
    },
    {
      key: "schedule",
      header: "Lịch khám",
      className: "md:min-w-56",
      render: (a) => {
        const doctor = getDoctorById(a.doctorId);
        return (
          <div className="break-words">
            <p className="flex flex-wrap items-center gap-2 font-semibold">
              {a.time}, {formatDateKey(a.date)}
              {a.date === today && <Badge tone="info">Hôm nay</Badge>}
            </p>
            <p className="whitespace-nowrap">{doctor?.name ?? "Chưa rõ lương y"}</p>
            <p className="text-sm text-ink-muted">
              {CONSULT_MODE_LABELS[a.mode]}
              {a.mode === "online" && a.onlineChannel ? ` · ${ONLINE_CHANNEL_LABELS[a.onlineChannel]}` : ""}
            </p>
          </div>
        );
      },
    },
    {
      key: "symptoms",
      header: "Triệu chứng",
      className: "md:min-w-44",
      render: (a) => (
        <div className="break-words">
          <p className="font-semibold">{getSymptomGroupById(a.symptomGroupId)?.name ?? "Chưa chọn nhóm bệnh"}</p>
          <p className="line-clamp-2 text-ink-muted">{a.symptoms?.trim() || "Khách không mô tả thêm."}</p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Trạng thái / thao tác",
      hideLabel: true,
      className: "md:w-48",
      render: (a) => {
        const open = expanded === a.id;
        return (
          <div className="flex flex-col items-start gap-2 whitespace-nowrap md:items-stretch">
            <StatusTag tone={APPOINTMENT_STATUS_META[a.status].tone} label={APPOINTMENT_STATUS_META[a.status].label} />
            {a.status === "pending" && (
              <Button
                variant="primary"
                onClick={() => updateAppointmentStatus(a.id, "confirmed")}
                aria-label={`Xác nhận lịch hẹn ${a.code} của ${a.customer.name}`}
              >
                Xác nhận lịch
              </Button>
            )}
            {a.status === "confirmed" && (
              <Button variant="secondary" onClick={() => updateAppointmentStatus(a.id, "completed")} aria-label={`Đánh dấu ${a.code} đã khám`}>
                Đã khám xong
              </Button>
            )}
            {(a.status === "pending" || a.status === "confirmed") && (
              <Button
                variant="ghost"
                className="text-danger hover:bg-danger-soft"
                onClick={() => updateAppointmentStatus(a.id, "cancelled")}
                aria-label={`Hủy lịch hẹn ${a.code}`}
              >
                Hủy lịch
              </Button>
            )}
            <Button
              variant="ghost"
              aria-expanded={open}
              onClick={() => setExpanded(open ? null : a.id)}
              icon={open ? <ChevronUp aria-hidden="true" className="size-5" /> : <ChevronDown aria-hidden="true" className="size-5" />}
            >
              {open ? "Thu gọn" : "Triệu chứng"}
            </Button>
          </div>
        );
      },
    },
  ];

  const rowTone = (a: Appointment): RowTone | undefined =>
    a.status === "pending" ? (freshIds.has(a.id) ? "fresh" : "new") : undefined;

  return (
    <>
      <FilterBar label="Lọc lịch hẹn" options={options} value={filter} onChange={setFilter} />
      <DataList
        caption="Danh sách lịch hẹn"
        rows={rows}
        getKey={(a) => a.id}
        columns={columns}
        rowTone={rowTone}
        expandedKey={expanded}
        renderDetail={(a) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="break-words">
              <h3 className="mb-1 text-lg">Triệu chứng khách mô tả</h3>
              <p className="whitespace-pre-line">{a.symptoms?.trim() || "Khách không mô tả thêm."}</p>
            </div>
            <div>
              <h3 className="mb-1 text-lg">Nhóm bệnh quan tâm</h3>
              <p>{getSymptomGroupById(a.symptomGroupId)?.name ?? "Chưa chọn nhóm bệnh"}</p>
            </div>
          </div>
        )}
        empty={
          <EmptyState
            title={appointments.length === 0 ? "Chưa có lịch hẹn nào" : "Không có lịch hẹn phù hợp"}
            hint={
              appointments.length === 0
                ? "Lịch khách đặt ở tab cửa hàng sẽ hiện ở đây ngay, không cần tải lại."
                : "Chọn bộ lọc khác để xem các lịch còn lại."
            }
          />
        }
      />
    </>
  );
}
