import Link from "next/link";
import { Seal } from "@/components/ui";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Dấu son "MỘC Y" + tên hiệu thuốc. `inverted`: đặt trên nền gỗ tối (header, footer). */
export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn("flex min-h-12 items-center gap-3", className)} aria-label={`${SITE.name} – Trang chủ`}>
      <Seal className="size-11 -rotate-3" />
      <span className="flex flex-col leading-tight">
        <span className={cn("font-heading text-2xl font-extrabold", inverted ? "text-paper-50" : "text-ink")}>
          {SITE.shortName}
        </span>
        <span className={cn("text-label", inverted ? "text-bronze-300" : "text-ink-muted")}>Đông y gia truyền</span>
      </span>
    </Link>
  );
}
