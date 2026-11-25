"use client";

import { useState } from "react";
import { todayKey } from "@/lib/date";
import { useHydrated, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AppointmentsList } from "./AppointmentsList";
import { ConsultList } from "./ConsultList";
import { LoadingBlock, PageHeader } from "./parts";

type Tab = "appointments" | "consults";

export function AppointmentsPanel() {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("appointments");
  const pendingAppointments = useStore((s) => s.appointments.filter((a) => a.status === "pending").length);
  const newConsults = useStore((s) => s.consultRequests.filter((c) => c.status === "new").length);

  const tabs: { value: Tab; label: string; short: string; count: number }[] = [
    { value: "appointments", label: "Lịch hẹn lương y", short: "Lịch hẹn", count: pendingAppointments },
    { value: "consults", label: "Yêu cầu cắt thang", short: "Cắt thang", count: newConsults },
  ];

  return (
    <>
      <PageHeader
        title="Lịch hẹn và tư vấn"
        description="Xem nhanh triệu chứng, xác nhận lịch khám và theo dõi yêu cầu tư vấn cắt thang. Số trên tab là việc đang chờ xử lý."
      />
      <div role="tablist" aria-label="Chọn danh sách" className="mb-5 grid grid-cols-2 gap-1 border-b-2 border-line sm:flex">
        {tabs.map((t) => {
          const selected = tab === t.value;
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              id={`tab-${t.value}`}
              aria-selected={selected}
              aria-controls="admin-tabpanel"
              onClick={() => setTab(t.value)}
              className={cn(
                "-mb-0.5 inline-flex min-h-12 items-center justify-center gap-2 border-b-4 px-2 font-semibold whitespace-nowrap sm:px-5",
                selected ? "border-herb-700 text-herb-800" : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
              {t.count > 0 && (
                <span className="min-w-6 rounded-full bg-bronze-300 px-2 text-center text-sm font-bold text-wood-900">{t.count}</span>
              )}
            </button>
          );
        })}
      </div>
      <div id="admin-tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {!hydrated ? (
          <LoadingBlock />
        ) : tab === "appointments" ? (
          <AppointmentsList today={todayKey()} />
        ) : (
          <ConsultList />
        )}
      </div>
    </>
  );
}
