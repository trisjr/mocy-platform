"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

/**
 * Khung trang khách hàng: header + nội dung + footer + nav đáy (điện thoại).
 * Các route /admin không dùng khung này; admin tự dựng layout trong src/app/admin/layout.tsx.
 */
export function SiteShell({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <>{children}</>;
  return (
    <>
      <a
        href="#noi-dung"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-paper-50 focus:px-4 focus:py-3 focus:font-semibold focus:text-ink"
      >
        Bỏ qua, đến nội dung chính
      </a>
      <Header />
      <main id="noi-dung" className="paper-grain flex-1">
        {children}
      </main>
      {footer}
      <MobileNav />
    </>
  );
}
