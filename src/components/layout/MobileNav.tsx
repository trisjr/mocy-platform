"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartCount } from "@/lib/store";
import { cn } from "@/lib/utils";
import { isActivePath, NAV_ITEMS } from "./nav-items";

/** Thanh điều hướng cố định đáy màn hình, chỉ hiện trên điện thoại (< md). Nền gỗ, viền đồng như biển hiệu. */
export function MobileNav() {
  const pathname = usePathname();
  const count = useCartCount();
  const items = [...NAV_ITEMS, { href: "/gio-hang", label: "Giỏ hàng", icon: ShoppingCart }];
  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="on-dark fixed inset-x-0 bottom-0 z-40 border-t-2 border-bronze-500 bg-wood-800 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-h-16 flex-col items-center justify-center gap-0.5 text-sm",
                  active ? "font-semibold text-bronze-300" : "font-medium text-wood-100",
                )}
              >
                {active && <span aria-hidden="true" className="absolute -top-0.5 h-1 w-10 bg-bronze-300" />}
                <span className="relative">
                  <Icon aria-hidden="true" className="size-6" />
                  {href === "/gio-hang" && count > 0 && (
                    <span className="absolute -top-2 -right-3 flex min-w-5 items-center justify-center rounded-full bg-bronze-300 px-1 text-xs leading-5 font-bold text-wood-900 ring-2 ring-wood-800">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
