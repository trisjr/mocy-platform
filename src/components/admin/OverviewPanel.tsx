"use client";

import { CalendarCheck, ClipboardList, Coins, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui";
import { ORDER_STATUS_META } from "@/lib/constants";
import { todayKey } from "@/lib/date";
import { formatDateTime, formatPrice } from "@/lib/format";
import { useAppointments, useConsultRequests, useHydrated, useOrders } from "@/lib/store";
import { BarChart, DonutChart, HorizontalBars } from "./charts";
import { ChartCard, EmptyState, LoadingBlock, PageHeader, StatCard } from "./parts";
import { computeStats, formatCompactPrice } from "./stats";

export function OverviewPanel() {
  const hydrated = useHydrated();
  const orders = useOrders();
  const appointments = useAppointments();
  const consults = useConsultRequests();

  const stats = useMemo(
    () => (hydrated ? computeStats(orders, appointments, consults, todayKey()) : null),
    [hydrated, orders, appointments, consults],
  );

  return (
    <>
      <PageHeader
        title="Tổng quan"
        description="Số liệu gồm dữ liệu mẫu và các đơn, lịch hẹn mới tạo từ tab cửa hàng. Tự cập nhật, không cần tải lại trang."
      />
      {!stats ? <LoadingBlock /> : <OverviewBody stats={stats} latest={orders.slice(0, 5)} />}
    </>
  );
}

function OverviewBody({ stats, latest }: { stats: ReturnType<typeof computeStats>; latest: ReturnType<typeof useOrders> }) {
  const totalOrders = stats.orderCount;
  const revenueTotal7 = stats.revenueByDay.reduce((sum, p) => sum + p.value, 0);
  const appointments7 = stats.appointmentsByDay.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Doanh thu dự kiến"
          value={formatPrice(stats.revenueTotal)}
          caption={`${totalOrders} đơn, đã hoàn thành ${formatPrice(stats.revenueCompleted)}`}
          icon={<Coins className="size-6" />}
        />
        <StatCard
          label="Đơn mới"
          value={String(stats.newOrders)}
          caption="Đang chờ xác nhận"
          icon={<ShoppingBag className="size-6" />}
          href="/admin/don-hang"
          attention={stats.newOrders > 0}
        />
        <StatCard
          label="Lịch hẹn hôm nay"
          value={String(stats.todayAppointments)}
          caption={`${stats.pendingAppointments} lịch chờ xác nhận`}
          icon={<CalendarCheck className="size-6" />}
          href="/admin/lich-hen"
          attention={stats.pendingAppointments > 0}
        />
        <StatCard
          label="Yêu cầu cắt thang mới"
          value={String(stats.newConsults)}
          caption="Khách đang chờ lương y liên hệ"
          icon={<ClipboardList className="size-6" />}
          href="/admin/lich-hen"
          attention={stats.newConsults > 0}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Doanh thu 7 ngày gần nhất" description={`Tổng ${formatPrice(revenueTotal7)}. Cột vàng là hôm nay.`}>
          <BarChart
            data={stats.revenueByDay}
            formatValue={formatCompactPrice}
            ariaLabel={`Biểu đồ cột doanh thu 7 ngày gần nhất, tổng ${formatPrice(revenueTotal7)}`}
          />
        </ChartCard>

        <ChartCard title="Lịch hẹn 7 ngày tới" description={`${appointments7} lịch (không tính lịch đã hủy). Cột vàng là hôm nay.`}>
          <BarChart
            data={stats.appointmentsByDay}
            formatValue={String}
            ariaLabel={`Biểu đồ cột số lịch hẹn 7 ngày tới, tổng ${appointments7} lịch`}
          />
        </ChartCard>

        <ChartCard title="Đơn hàng theo trạng thái">
          <DonutChart
            segments={stats.statusCounts.map((s) => ({ label: ORDER_STATUS_META[s.status].label, value: s.value }))}
            centerValue={String(totalOrders)}
            centerLabel="đơn"
          />
        </ChartCard>

        <ChartCard title="Sản phẩm bán chạy" description="Theo số lượng trong các đơn đã có.">
          {stats.topProducts.length === 0 ? (
            <p className="text-ink-muted">Chưa có đơn hàng nào.</p>
          ) : (
            <HorizontalBars items={stats.topProducts} unit="sp" />
          )}
        </ChartCard>
      </div>

      <section aria-labelledby="latest-orders">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="latest-orders" className="text-xl">
            Đơn mới nhất
          </h2>
          <Link href="/admin/don-hang" className="inline-flex min-h-12 items-center font-semibold text-herb-700 underline">
            Xem tất cả đơn
          </Link>
        </div>
        {latest.length === 0 ? (
          <EmptyState title="Chưa có đơn hàng" hint="Đơn khách đặt ở tab cửa hàng sẽ hiện ở đây ngay lập tức." />
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface shadow-card">
            {latest.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {o.code} <span className="font-normal text-ink-muted">· {o.shipping.name}</span>
                  </p>
                  <p className="text-sm text-ink-muted">{formatDateTime(o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{formatPrice(o.total)}</span>
                  <Badge tone={ORDER_STATUS_META[o.status].tone}>{ORDER_STATUS_META[o.status].label}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
