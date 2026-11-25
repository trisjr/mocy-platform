import { Leaf } from "lucide-react";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn("flex min-h-12 items-center gap-2.5", className)} aria-label={`${SITE.name} – Trang chủ`}>
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full",
          inverted ? "bg-bronze-300 text-wood-900" : "bg-herb-700 text-bronze-100",
        )}
      >
        <Leaf aria-hidden="true" className="size-6" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={cn("font-heading text-xl font-bold", inverted ? "text-paper-50" : "text-wood-800")}>
          {SITE.shortName}
        </span>
        <span className={cn("text-sm", inverted ? "text-wood-100" : "text-ink-muted")}>Đông y gia truyền</span>
      </span>
    </Link>
  );
}
