import Link from "next/link";
import { LegalBadge, PriceTag } from "@/components/ui";
import { getMinPrice, getProductById } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { SafeImage } from "./SafeImage";

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
    <section aria-label={title} className={cn("rounded-card border border-herb-200 bg-herb-50 p-4 sm:p-6", className)}>
      <h3 className="text-xl text-herb-900">{title}</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((p) => (
          <li key={p.id}>
            <Link
              href={`/san-pham/${p.slug}`}
              className="flex h-full items-center gap-3 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-herb-500"
            >
              <span className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-paper-100">
                <SafeImage src={p.images[0]} alt={p.name} sizes="80px" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
                <span className="font-semibold text-ink">{p.name}</span>
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
