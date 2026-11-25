import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Seal } from "./Seal";

export interface SlipProps {
  /** Tiêu đề trang (h1), VD "Đặt hàng thành công". */
  title: ReactNode;
  /** Dòng dẫn trước mã. */
  lead?: ReactNode;
  /** Mã đơn / lịch hẹn / yêu cầu, in to giữa hai nét đôi. */
  code: string;
  /** Dòng dưới mã: trạng thái, thời gian... */
  meta?: ReactNode;
  /** Thân phiếu, nằm dưới đường xé. */
  children?: ReactNode;
  className?: string;
}

/**
 * Phiếu xác nhận (đơn hàng, lịch hẹn, yêu cầu tư vấn): cuống phiếu có mã và dấu son "MỘC Y",
 * đường xé nét đứt, thân phiếu bên dưới.
 */
export function Slip({ title, lead, code, meta, children, className }: SlipProps) {
  return (
    <article className={cn("paper-fiber relative bg-surface shadow-card", className)}>
      <Seal className="absolute -top-5 right-3 size-16 rotate-[8deg] sm:-top-6 sm:right-8 sm:size-24" />
      <header className="flex flex-col items-center gap-3 px-5 pt-16 pb-8 text-center sm:px-24 sm:pt-10">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        {lead && <p className="text-lg">{lead}</p>}
        <p className="border-y-[3px] border-double border-line-strong px-6 py-2 text-3xl font-bold tracking-[0.12em] tabular-nums md:text-4xl">
          {code}
        </p>
        {meta}
      </header>
      {children && (
        <>
          <div aria-hidden="true" className="ticket-tear" />
          {children}
        </>
      )}
    </article>
  );
}
