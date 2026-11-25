import Link from "next/link";
import { Seal } from "@/components/ui";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Dấu son "MỘC Y" + tên hiệu thuốc. `inverted`: đặt trên nền gỗ tối (header, footer).
 * `compact`: khi hàng header quá hẹp so với cỡ chữ (người dùng đặt chữ to trong trình duyệt) thì ẩn dòng phụ.
 * Cần một phần tử cha có class `@container`.
 */
export function Logo({ className, inverted, compact }: { className?: string; inverted?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className={cn("flex min-h-12 items-center gap-3", className)} aria-label={`${SITE.name} – Trang chủ`}>
      <Seal className={cn("size-11 -rotate-3", compact && "@max-[19rem]:size-9")} />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-heading text-2xl font-extrabold whitespace-nowrap",
            inverted ? "text-paper-50" : "text-ink",
            compact && "@max-[19rem]:text-xl",
          )}
        >
          {SITE.shortName}
        </span>
        <span className={cn("text-label", inverted ? "text-bronze-300" : "text-ink-muted", compact && "@max-[19rem]:hidden")}>
          Đông y gia truyền
        </span>
      </span>
    </Link>
  );
}
