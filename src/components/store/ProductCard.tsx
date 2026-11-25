import Link from "next/link";
import { Badge, buttonClasses, LegalBadge, PriceTag } from "@/components/ui";
import { getMinPrice } from "@/lib/catalog";
import { SALE_TYPE_LABELS } from "@/lib/constants";
import type { Product } from "@/types";
import { SafeImage } from "@/components/ui";

/** Thẻ sản phẩm: cả thẻ là link sang trang chi tiết. */
export function ProductCard({ product }: { product: Product }) {
  const isConsult = product.saleType === "consult";
  const minPrice = getMinPrice(product);
  const single = product.variants.length === 1 ? product.variants[0] : undefined;
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-shadow hover:border-line-strong hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-200">
        <SafeImage src={product.images[0]} alt={product.name} className="size-full" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <LegalBadge label={product.legalLabel} short />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <Badge tone={isConsult ? "wood" : "herb"}>{SALE_TYPE_LABELS[product.saleType]}</Badge>
        </div>
        <h3 className="text-lg group-hover:text-herb-700">{product.name}</h3>
        <p className="line-clamp-2 text-ink-muted">{product.shortDescription}</p>
        <div className="mt-auto pt-1">
          <PriceTag
            price={minPrice}
            compareAtPrice={single?.compareAtPrice}
            prefix={product.variants.length > 1 ? "Từ" : undefined}
            size="sm"
          />
        </div>
        <span className={buttonClasses({ variant: isConsult ? "secondary" : "outline", fullWidth: true })}>
          {isConsult ? "Xem & nhận tư vấn" : "Xem & chọn định lượng"}
        </span>
      </div>
    </Link>
  );
}
