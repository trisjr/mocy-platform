import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui";
import type { Tone } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TONE_DOT: Record<Tone, string> = {
  herb: "bg-herb-600",
  wood: "bg-wood-500",
  bronze: "bg-bronze-400",
  neutral: "bg-line-strong",
  danger: "bg-danger",
  info: "bg-info",
};

/** Trạng thái dạng chấm màu + chữ, tự xuống dòng được (gọn hơn Badge trong cột bảng hẹp). */
export function StatusTag({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className="inline-flex items-start gap-2 font-semibold leading-snug">
      <span className={cn("mt-2 size-3 shrink-0 rounded-full", TONE_DOT[tone])} aria-hidden="true" />
      {label}
    </span>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-ink-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function LoadingBlock({ text = "Đang tải dữ liệu..." }: { text?: string }) {
  return (
    <Card className="py-10 text-center text-ink-muted" role="status">
      {text}
    </Card>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <Card className="py-10 text-center">
      <p className="text-lg font-semibold text-wood-800">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-md text-ink-muted">{hint}</p>}
    </Card>
  );
}

export function StatCard({
  label,
  value,
  caption,
  icon,
  href,
  attention,
}: {
  label: string;
  value: string;
  caption: string;
  icon: ReactNode;
  href?: string;
  /** Làm nổi thẻ khi có việc cần xử lý. */
  attention?: boolean;
}) {
  const body = (
    <Card
      interactive={Boolean(href)}
      className={cn("h-full", attention && "border-bronze-400 bg-bronze-50")}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-ink-muted">{label}</p>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-herb-100 text-herb-800" aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mt-2 font-heading text-3xl font-bold break-words text-wood-800">{value}</p>
      <p className="mt-1 text-ink-muted">{caption}</p>
    </Card>
  );
  return href ? (
    <Link href={href} className="block rounded-card">
      {body}
    </Link>
  ) : (
    body
  );
}

export function ChartCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card padding="lg">
      <h2 className="text-xl">{title}</h2>
      {description && <p className="mt-1 mb-5 text-ink-muted">{description}</p>}
      {!description && <div className="mb-5" />}
      {children}
    </Card>
  );
}

export interface FilterOption<V extends string> {
  value: V;
  label: string;
  count: number;
}

/** Hàng nút lọc theo trạng thái, có đếm số bản ghi. */
export function FilterBar<V extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: FilterOption<V>[];
  value: V;
  onChange: (value: V) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="mb-4 flex flex-wrap gap-2">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-4 font-semibold transition-colors",
              selected
                ? "border-herb-700 bg-herb-700 text-white"
                : "border-line-strong bg-surface text-ink hover:bg-herb-50",
            )}
          >
            {o.label}
            <span
              className={cn(
                "min-w-6 rounded-full px-2 text-sm",
                selected ? "bg-white text-herb-800" : "bg-paper-200 text-ink",
              )}
            >
              {o.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
