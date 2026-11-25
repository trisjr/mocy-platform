import { CalendarCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { getDoctorById } from "@/lib/catalog";
import type { ArticleBlock } from "@/types";
import { SafeImage } from "./SafeImage";
import { SuggestedProducts } from "./SuggestedProducts";

function BookingCtaBlock({ text, doctorId }: { text?: string; doctorId?: string }) {
  const doctor = doctorId ? getDoctorById(doctorId) : undefined;
  const href = doctor ? `/dat-lich?doctor=${doctor.slug}` : "/dat-lich";
  return (
    <aside className="my-8 rounded-card border border-bronze-300 bg-bronze-50 p-5 sm:p-6">
      <p className="font-heading text-xl font-semibold text-wood-900">
        {text ?? "Bạn muốn được lương y tư vấn riêng theo thể trạng?"}
      </p>
      {doctor && (
        <p className="mt-1 text-ink-muted">
          Lương y gợi ý: {doctor.name}
        </p>
      )}
      <ButtonLink href={href} size="lg" icon={<CalendarCheck aria-hidden="true" className="size-5" />} className="mt-4">
        Đặt lịch tư vấn
      </ButtonLink>
    </aside>
  );
}

/** Hiển thị nội dung bài viết theo từng khối (ArticleBlock). */
export function ArticleContent({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="text-lg leading-8 text-ink">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="mt-10 mb-3 text-2xl leading-snug text-herb-900">
                {block.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="mt-4">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="mt-4 list-disc space-y-2 pl-6 marker:text-herb-600">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-6 rounded-r-xl border-l-4 border-bronze-400 bg-bronze-50 px-5 py-4 font-heading text-xl italic text-wood-900"
              >
                {block.text}
              </blockquote>
            );
          case "image":
            return (
              <figure key={i} className="my-6">
                <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-card bg-paper-100">
                  <SafeImage src={block.src} alt={block.alt} sizes="(min-width: 768px) 768px, 100vw" />
                </span>
                {block.caption && (
                  <figcaption className="mt-2 text-center text-base text-ink-muted">{block.caption}</figcaption>
                )}
              </figure>
            );
          case "products":
            return <SuggestedProducts key={i} productIds={block.productIds} title={block.title} className="my-8" />;
          case "booking-cta":
            return <BookingCtaBlock key={i} text={block.text} doctorId={block.doctorId} />;
        }
      })}
    </div>
  );
}
