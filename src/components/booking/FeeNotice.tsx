import Link from "next/link";
import { SERVICE_FEE_NOTE, serviceFees } from "@/data";
import { cn } from "@/lib/utils";

/**
 * Bảng chi phí khám & dịch vụ sắc thuốc. Thuần trình bày, dùng được trong cả client lẫn server component.
 * `faqLink`: tắt khi đặt trong form nhiều bước, để khách không rời trang và mất thông tin đang nhập.
 */
export function FeeNotice({ className, faqLink = true }: { className?: string; faqLink?: boolean }) {
  return (
    <aside
      aria-labelledby="chi-phi-title"
      className={cn("paper-fiber border border-line bg-surface px-5 py-6 shadow-card sm:px-8", className)}
    >
      <h2 id="chi-phi-title" className="text-2xl md:text-3xl">
        Chi phí khám & dịch vụ
      </h2>
      <dl className="mt-4 grid border-t border-dashed border-line-strong/60 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {serviceFees.map((f) => (
          <div key={f.id} className="contents">
            <dt className="pt-3 font-semibold md:border-b md:border-dashed md:border-line-strong/60 md:pb-3">{f.name}</dt>
            <dd className="border-b border-dashed border-line-strong/60 pb-3 md:pt-3">
              <span className="block font-semibold text-herb-700">{f.price}</span>
              {f.note && <span className="block text-ink-muted">{f.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-label text-ink-muted">{SERVICE_FEE_NOTE}</p>
      {faqLink && (
        <Link
          href="/#cau-hoi"
          className="mt-1 inline-flex min-h-12 items-center font-semibold text-herb-700 underline decoration-2 underline-offset-4"
        >
          Xem câu hỏi thường gặp
        </Link>
      )}
    </aside>
  );
}
