import type { ReactNode } from "react";

export interface SummaryRow {
  label: string;
  value: ReactNode;
}

/** Danh sách "nhãn: giá trị" cho tóm tắt lịch hẹn / yêu cầu. */
export function SummaryList({ rows }: { rows: SummaryRow[] }) {
  return (
    <dl className="divide-y divide-dashed divide-line-strong/60">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-4">
          <dt className="shrink-0 text-ink-muted sm:w-40">{row.label}</dt>
          <dd className="min-w-0 font-semibold break-words text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
