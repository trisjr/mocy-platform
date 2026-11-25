import { ButtonLink } from "@/components/ui";
import { getDoctorById } from "@/lib/catalog";
import type { ArticleBlock } from "@/types";
import { SafeImage } from "@/components/ui";
import { SuggestedProducts } from "./SuggestedProducts";

function BookingCtaBlock({ text, doctorId }: { text?: string; doctorId?: string }) {
  const doctor = doctorId ? getDoctorById(doctorId) : undefined;
  const href = doctor ? `/dat-lich?doctor=${doctor.slug}` : "/dat-lich";
  return (
    <aside className="label-frame paper-fiber my-8 bg-surface px-5 py-6 sm:px-7">
      <p className="font-heading text-2xl leading-snug font-bold text-ink">
        {text ?? "Bạn muốn được lương y tư vấn riêng theo thể trạng?"}
      </p>
      {doctor && (
        <p className="mt-1 text-ink-muted">
          Lương y gợi ý: {doctor.name}
        </p>
      )}
      <ButtonLink href={href} size="lg" className="mt-4 w-full sm:w-auto">
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
              <h2 key={i} className="mt-10 mb-3 text-3xl leading-snug">
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
              <ul key={i} className="mt-4 flex flex-col gap-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span aria-hidden="true" className="mt-3 size-2 shrink-0 rotate-45 bg-bronze-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-8 border-l-4 border-bronze-500 py-1 pl-5 font-heading text-2xl leading-snug text-wood-800 italic"
              >
                {block.text}
              </blockquote>
            );
          case "image":
            return (
              <figure key={i} className="my-6">
                <span className="label-frame relative block aspect-[16/10] w-full overflow-hidden bg-surface">
                  <SafeImage src={block.src} alt={block.alt} className="absolute inset-0 size-full" />
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
