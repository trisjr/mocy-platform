import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface PillOptionProps {
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

/** Nút chọn nhỏ dạng radio (ngày, giờ, kênh online). Đặt trong role="radiogroup". */
export function PillOption({ selected, onSelect, disabled, children, className }: PillOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex min-h-12 min-w-20 flex-col items-center justify-center rounded-xl border-2 px-3 py-1.5 font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:border-line disabled:bg-paper-100 disabled:text-ink-muted disabled:opacity-70",
        selected
          ? "border-herb-700 bg-herb-700 text-white"
          : "border-line-strong bg-surface text-ink hover:border-herb-500",
        className,
      )}
    >
      {children}
    </button>
  );
}
