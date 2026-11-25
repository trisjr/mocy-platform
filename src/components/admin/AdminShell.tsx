"use client";

import { CalendarCheck, LayoutDashboard, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SITE } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ResetDemoButton } from "./ResetDemoButton";

const NAV = [
  { href: "/admin", label: "Tổng quan", Icon: LayoutDashboard },
  { href: "/admin/don-hang", label: "Đơn hàng", Icon: ShoppingBag },
  { href: "/admin/lich-hen", label: "Lịch hẹn", Icon: CalendarCheck },
] as const;

/** Số việc đang chờ xử lý ở từng mục, cập nhật tức thời theo store. */
function usePendingCounts(): Record<string, number> {
  const orders = useStore((s) => s.orders.filter((o) => o.status === "pending").length);
  const appointments = useStore((s) => s.appointments.filter((a) => a.status === "pending").length);
  const consults = useStore((s) => s.consultRequests.filter((c) => c.status === "new").length);
  return { "/admin": 0, "/admin/don-hang": orders, "/admin/lich-hen": appointments + consults };
}

function NavLinks({ variant }: { variant: "sidebar" | "tabs" }) {
  const pathname = usePathname();
  const counts = usePendingCounts();
  return (
    <nav aria-label="Menu quản trị" className={variant === "sidebar" ? "flex flex-col gap-1" : "grid grid-cols-3 gap-1"}>
      {NAV.map(({ href, label, Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        const count = counts[href];
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex min-h-12 items-center rounded-xl font-semibold transition-colors",
              variant === "sidebar" ? "gap-3 px-4" : "flex-col justify-center gap-0.5 px-1 py-1.5 text-center text-base",
              active
                ? "bg-herb-700 text-white"
                : variant === "sidebar"
                  ? "text-herb-100 hover:bg-herb-800"
                  : "text-ink hover:bg-herb-50",
            )}
          >
            <Icon aria-hidden="true" className="size-5 shrink-0" />
            <span>{label}</span>
            {count > 0 && (
              <span
                className={cn(
                  "min-w-6 rounded-full bg-bronze-300 px-2 text-center text-sm font-bold text-wood-900",
                  variant === "sidebar" ? "ml-auto" : "absolute top-1 right-1",
                )}
                aria-label={`${count} việc chờ xử lý`}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/** Khung trang Admin: thanh bên (desktop) hoặc thanh trên + tab (điện thoại). Không dùng header/footer storefront. */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 bg-background lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="hidden flex-col gap-6 bg-herb-900 p-5 text-white lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div>
          <p className="font-heading text-xl font-bold">{SITE.shortName} Admin</p>
          <p className="text-herb-200">Bản demo quản trị mini</p>
        </div>
        <NavLinks variant="sidebar" />
        <div className="mt-auto space-y-3">
          <ResetDemoButton />
          <Link
            href="/"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-herb-200 px-4 font-semibold text-herb-100 hover:bg-herb-800"
          >
            <Store aria-hidden="true" className="size-5" />
            Xem cửa hàng
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-surface p-3 shadow-card lg:hidden">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="font-heading text-lg font-bold text-wood-800">{SITE.shortName} Admin</p>
            <Link href="/" className="flex min-h-12 items-center gap-2 rounded-xl px-3 font-semibold text-herb-700 hover:bg-herb-50">
              <Store aria-hidden="true" className="size-5" />
              Cửa hàng
            </Link>
          </div>
          <NavLinks variant="tabs" />
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
          <div className="mt-10 max-w-sm lg:hidden">
            <ResetDemoButton />
          </div>
        </main>
      </div>
    </div>
  );
}
