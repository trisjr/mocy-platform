import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  /** Hiệu ứng hover khi cả thẻ là link/nút. */
  interactive?: boolean;
}

const PADDING = { none: "", sm: "p-3", md: "p-4 sm:p-5", lg: "p-5 sm:p-8" };

/** Khối nền sáng, viền mảnh, bo góc. */
export function Card({ padding = "md", interactive, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface shadow-card",
        PADDING[padding],
        interactive && "transition-shadow hover:border-line-strong hover:shadow-lg",
        className,
      )}
      {...rest}
    />
  );
}
