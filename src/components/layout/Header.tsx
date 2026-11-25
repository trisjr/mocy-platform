"use client";

import { CalendarCheck, Clock, MapPin, Phone, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui";
import { SITE } from "@/lib/constants";
import { useCartCount } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { isActivePath, NAV_ITEMS } from "./nav-items";

export function CartIconLink({ className }: { className?: string }) {
  const count = useCartCount();
  return (
    <Link
      href="/gio-hang"
      aria-label={count > 0 ? `Giỏ hàng, ${count} sản phẩm` : "Giỏ hàng"}
      className={cn(
        "relative flex size-12 items-center justify-center rounded-full text-wood-800 hover:bg-paper-200",
        className,
      )}
    >
      <ShoppingCart aria-hidden="true" className="size-6" />
      {count > 0 && (
        <span className="absolute top-0.5 right-0.5 flex min-w-6 items-center justify-center rounded-full bg-danger px-1 text-xs leading-6 font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="hidden bg-herb-800 text-sm text-herb-50 md:block">
        <Container className="flex h-9 items-center justify-between gap-6">
          <span className="flex min-w-0 items-center gap-2">
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">{SITE.address}</span>
          </span>
          <span className="flex shrink-0 items-center gap-5 whitespace-nowrap">
            <span className="hidden items-center gap-2 lg:flex">
              <Clock aria-hidden="true" className="size-4" />
              {SITE.openingHours}
            </span>
            <a href={SITE.hotlineHref} className="flex items-center gap-2 font-semibold hover:underline">
              <Phone aria-hidden="true" className="size-4" />
              Hotline {SITE.hotline}
            </a>
          </span>
        </Container>
      </div>
      <Container className="flex h-16 items-center justify-between gap-3 md:h-20">
        <Logo className="shrink-0" />
        <nav aria-label="Điều hướng chính" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center rounded-lg px-3 text-base font-semibold whitespace-nowrap transition-colors xl:px-4 xl:text-lg",
                      active ? "bg-herb-50 text-herb-800" : "text-wood-800 hover:bg-paper-200",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex shrink-0 items-center gap-1 md:gap-2">
          <a
            href={SITE.hotlineHref}
            aria-label={`Gọi hotline ${SITE.hotline}`}
            className="flex size-12 items-center justify-center rounded-full bg-herb-50 text-herb-800 md:hidden"
          >
            <Phone aria-hidden="true" className="size-6" />
          </a>
          <CartIconLink />
          <ButtonLink
            href="/dat-lich"
            variant="accent"
            icon={<CalendarCheck aria-hidden="true" className="size-5" />}
            className="hidden lg:inline-flex"
          >
            Đặt lịch tư vấn
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
