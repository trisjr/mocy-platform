"use client";

import { Phone, ShoppingCart } from "lucide-react";
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
        "relative flex size-12 items-center justify-center rounded-md text-paper-50 hover:bg-wood-700",
        className,
      )}
    >
      <ShoppingCart aria-hidden="true" className="size-6" />
      {count > 0 && (
        <span className="absolute top-0.5 right-0.5 flex min-w-6 items-center justify-center rounded-full bg-bronze-300 px-1 text-xs leading-6 font-bold text-wood-900 ring-2 ring-wood-800">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

/** Biển hiệu gỗ trầm + dải hồi văn đồng. Trên điện thoại chỉ còn logo, gọi điện, giỏ hàng (nav ở đáy màn hình). */
export function Header() {
  const pathname = usePathname();
  return (
    <header className="on-dark sticky top-0 z-40 bg-wood-800 text-paper-50">
      <Container className="flex h-16 items-center justify-between gap-3 md:h-20">
        <Logo className="shrink-0" inverted />
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
                      "relative flex min-h-12 items-center px-3 text-base font-semibold whitespace-nowrap transition-colors xl:px-4 xl:text-lg",
                      active
                        ? "text-bronze-300 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:bg-bronze-300 xl:after:inset-x-4"
                        : "text-paper-100 hover:text-bronze-200",
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
            className="flex size-12 items-center justify-center rounded-md text-paper-50 hover:bg-wood-700 md:hidden"
          >
            <Phone aria-hidden="true" className="size-6" />
          </a>
          <a
            href={SITE.hotlineHref}
            className="hidden min-h-12 items-center px-2 font-semibold whitespace-nowrap text-paper-100 hover:text-bronze-200 xl:flex"
          >
            Hotline {SITE.hotline}
          </a>
          <CartIconLink />
          <ButtonLink href="/dat-lich" variant="accent" className="hidden lg:inline-flex">
            Đặt lịch tư vấn
          </ButtonLink>
        </div>
      </Container>
      <div aria-hidden="true" className="fret border-t border-wood-700" />
    </header>
  );
}
