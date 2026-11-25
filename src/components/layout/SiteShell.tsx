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
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      {footer}
      <MobileNav />
    </>
  );
}
