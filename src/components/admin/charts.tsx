import { cn } from "@/lib/utils";
import type { DayPoint } from "./stats";

/** Màu cột / lát theo token chart-1..5. Viết nguyên chuỗi để Tailwind quét được. */
const BAR_CLASSES = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"];
const STROKE_CLASSES = ["stroke-chart-1", "stroke-chart-2", "stroke-chart-3", "stroke-chart-4", "stroke-chart-5"];

export interface BarChartProps {
  data: DayPoint[];
  formatValue: (value: number) => string;
  /** Mô tả cho trình đọc màn hình. */
  ariaLabel: string;
}

/** Biểu đồ cột bằng CSS: cột thường màu chart-1, cột "hôm nay" màu chart-2. */
export function BarChart({ data, formatValue, ariaLabel }: BarChartProps) {
  const max = Math.max(0, ...data.map((p) => p.value));
  return (
    <div role="img" aria-label={ariaLabel} className="flex items-end gap-1.5 sm:gap-3">
      {data.map((p) => {
        const ratio = max > 0 ? p.value / max : 0;
        return (
          <div key={p.key} className="flex min-w-0 flex-1 flex-col items-center">
            <div className="flex h-44 w-full flex-col items-center justify-end gap-1">
              <span className="text-sm font-semibold text-ink">{p.value > 0 ? formatValue(p.value) : "–"}</span>
              <div
                className={cn("w-full max-w-12 rounded-t-md", p.active ? BAR_CLASSES[1] : BAR_CLASSES[0])}
                style={{ height: `calc(${ratio} * (100% - 1.75rem))`, minHeight: p.value > 0 ? 4 : 2 }}
              />
            </div>
            <div className="mt-2 w-full border-t border-line pt-1 text-center">
              <p className={cn("text-sm", p.active ? "font-bold text-ink" : "font-semibold text-ink-muted")}>{p.label}</p>
              <p className="text-xs text-ink-muted">{p.sublabel}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export interface DonutSegment {
  label: string;
  value: number;
}

/** Biểu đồ vòng (SVG) kèm chú thích có số liệu; màu theo thứ tự chart-1..5. */
export function DonutChart({
  segments,
  centerValue,
  centerLabel,
}: {
  segments: DonutSegment[];
  centerValue: string;
  centerLabel: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let offset = 25;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
      <div className="relative size-40 shrink-0">
        <svg viewBox="0 0 42 42" className="size-full" role="img" aria-label={`${centerLabel}: ${centerValue}`}>
          <circle cx="21" cy="21" r="15.915" fill="none" strokeWidth="6" className="stroke-paper-200" />
          {total > 0 &&
            segments.map((s, i) => {
              if (s.value === 0) return null;
              const pct = (s.value / total) * 100;
              const circle = (
                <circle
                  key={s.label}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="none"
                  strokeWidth="6"
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeDashoffset={offset}
                  className={STROKE_CLASSES[i % STROKE_CLASSES.length]}
                />
              );
              offset -= pct;
              return circle;
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-heading text-3xl font-bold text-wood-800">{centerValue}</span>
          <span className="text-sm text-ink-muted">{centerLabel}</span>
        </div>
      </div>
      <ul className="w-full space-y-2">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3">
            <span className={cn("size-4 shrink-0 rounded-sm", BAR_CLASSES[i % BAR_CLASSES.length])} aria-hidden="true" />
            <span className="min-w-0 flex-1 text-base">{s.label}</span>
            <span className="font-semibold">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Danh sách thanh ngang (sản phẩm bán chạy). */
export function HorizontalBars({ items, unit }: { items: { name: string; quantity: number }[]; unit: string }) {
  const max = Math.max(1, ...items.map((i) => i.quantity));
  return (
    <ol className="space-y-4">
      {items.map((item, i) => (
        <li key={item.name}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 flex-1 truncate text-base font-medium" title={item.name}>
              {i + 1}. {item.name}
            </span>
            <span className="shrink-0 text-base font-semibold">
              {item.quantity} {unit}
            </span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-paper-200">
            <div className="h-full rounded-full bg-chart-3" style={{ width: `${(item.quantity / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ol>
  );
}
