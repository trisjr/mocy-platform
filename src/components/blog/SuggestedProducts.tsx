import Link from "next/link";
import { LegalBadge, PriceTag } from "@/components/ui";
import { getMinPrice, getProductById } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/ui";

export interface SuggestedProductsProps {
  productIds: string[];
  title?: string;
  className?: string;
}

/** Khối sản phẩm gợi ý trong và cuối bài viết. Id không tìm thấy thì bỏ qua. */
export function SuggestedProducts({ productIds, title = "Sản phẩm gợi ý", className }: SuggestedProductsProps) {
  const items = productIds.map((id) => getProductById(id)).filter((p) => p !== undefined);
  if (items.length === 0) return null;
  return (
    <section
      aria-label={title}
      className={cn("paper-fiber border-y-2 border-double border-line-strong/70 bg-surface/80 px-4 py-5 sm:px-6", className)}
    >
      <h3 className="text-2xl">{title}</h3>
      <ul className="mt-3 grid divide-y divide-dashed divide-line-strong/60 sm:grid-cols-2 sm:gap-x-6 sm:divide-y-0">
        {items.map((p) => (
          <li key={p.id}>
            <Link
              href={`/san-pham/${p.slug}`}
              className="group flex h-full items-center gap-3 py-3"
            >
              <span className="label-frame relative size-20 shrink-0 overflow-hidden bg-surface">
                <SafeImage src={p.images[0]} alt="" className="absolute inset-0 size-full" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
                <span className="font-heading text-lg leading-snug font-bold text-ink group-hover:underline">{p.name}</span>
                <LegalBadge label={p.legalLabel} short />
                {p.saleType === "consult" ? (
                  <span className="font-semibold text-wood-700">Giá theo tư vấn</span>
                ) : (
                  <PriceTag price={getMinPrice(p)} prefix="Từ" size="sm" />
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
