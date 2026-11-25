import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RowTone = "new" | "fresh";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Trên điện thoại (dạng thẻ): ẩn nhãn cột, dùng cho cột thao tác. */
  hideLabel?: boolean;
  className?: string;
}

const ROW_BG: Record<RowTone, string> = { new: "bg-bronze-50", fresh: "bg-bronze-100" };
const ROW_BAR: Record<RowTone, string> = { new: "border-bronze-400", fresh: "border-bronze-600" };

interface DataListProps<T> {
  caption: string;
  rows: T[];
  getKey: (row: T) => string;
  columns: Column<T>[];
  /** Highlight dòng (đơn mới, lịch chờ xác nhận...). */
  rowTone?: (row: T) => RowTone | undefined;
  expandedKey?: string | null;
  renderDetail?: (row: T) => ReactNode;
  empty: ReactNode;
}

/** Bảng trên màn hình rộng (md+), thẻ xếp dọc có nhãn trên điện thoại. Cùng một bộ cột. */
export function DataList<T>({ caption, rows, getKey, columns, rowTone, expandedKey, renderDetail, empty }: DataListProps<T>) {
  if (rows.length === 0) return <>{empty}</>;
  return (
    <>
      <div className="hidden overflow-hidden rounded-card border border-line bg-surface shadow-card md:block">
        <table className="w-full text-left">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-paper-200 text-wood-800">
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn("px-4 py-3 text-sm font-semibold", c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => {
              const key = getKey(row);
              const tone = rowTone?.(row);
              const open = Boolean(renderDetail) && expandedKey === key;
              return (
                <Fragment key={key}>
                  <tr className={cn("align-top", tone && ROW_BG[tone])}>
                    {columns.map((c, i) => (
                      <td
                        key={c.key}
                        className={cn(
                          "px-4 py-4",
                          i === 0 && "border-l-4",
                          i === 0 && (tone ? ROW_BAR[tone] : "border-transparent"),
                          c.className,
                        )}
                      >
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                  {open && renderDetail && (
                    <tr className="bg-paper-50">
                      <td colSpan={columns.length} className="border-l-4 border-transparent px-4 py-4">
                        {renderDetail(row)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => {
          const key = getKey(row);
          const tone = rowTone?.(row);
          const open = Boolean(renderDetail) && expandedKey === key;
          return (
            <li
              key={key}
              className={cn(
                "min-w-0 rounded-card border border-line border-l-4 bg-surface p-4 shadow-card",
                tone ? cn(ROW_BG[tone], ROW_BAR[tone]) : "border-l-line",
              )}
            >
              <div className="space-y-3">
                {columns.map((c) =>
                  c.hideLabel ? (
                    <div key={c.key}>{c.render(row)}</div>
                  ) : (
                    <div key={c.key}>
                      <p className="text-sm font-semibold text-ink-muted">{c.header}</p>
                      <div className="break-words">{c.render(row)}</div>
                    </div>
                  ),
                )}
              </div>
              {open && renderDetail && <div className="mt-4 border-t border-line pt-4">{renderDetail(row)}</div>}
            </li>
          );
        })}
      </ul>
    </>
  );
}
