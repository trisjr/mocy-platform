import { CheckCircle2, Circle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChoiceCardProps {
  selected: boolean;
  onSelect: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** Icon hoặc ảnh nhỏ bên trái. */
  media?: ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * Lựa chọn dạng thẻ lớn (hình thức khám, lương y, phương thức thanh toán...).
 * Đặt các thẻ trong phần tử role="radiogroup" có aria-label.
 */
export function ChoiceCard({ selected, onSelect, title, description, media, disabled, className }: ChoiceCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex min-h-14 w-full items-center gap-3 rounded-xl border-2 bg-surface p-4 text-left transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        selected ? "border-herb-700 bg-herb-50" : "border-line-strong hover:border-herb-400",
        className,
      )}
    >
      {media && <span className="shrink-0">{media}</span>}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold text-ink">{title}</span>
        {description && <span className="text-ink-muted">{description}</span>}
      </span>
      {selected ? (
        <CheckCircle2 aria-hidden="true" className="size-6 shrink-0 text-herb-700" />
      ) : (
        <Circle aria-hidden="true" className="size-6 shrink-0 text-line-strong" />
      )}
    </button>
  );
}
