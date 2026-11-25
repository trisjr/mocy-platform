import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface PriceTagProps {
  /** Không có giá (sản phẩm cần tư vấn) thì hiện "Giá theo tư vấn". */
  price?: number | null;
  compareAtPrice?: number;
  /** VD "Từ" khi hiển thị giá thấp nhất. */
  prefix?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = { sm: "text-lg", md: "text-xl", lg: "text-3xl" };

export function PriceTag({ price, compareAtPrice, prefix, size = "md", className }: PriceTagProps) {
  if (price === undefined || price === null) {
    return <span className={cn("font-semibold text-wood-700", className)}>Giá theo tư vấn</span>;
  }
  const showCompare = compareAtPrice !== undefined && compareAtPrice > price;
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}>
      {prefix && <span className="text-base text-ink-muted">{prefix}</span>}
      <span className={cn("font-bold text-bronze-700", SIZE[size])}>{formatPrice(price)}</span>
      {showCompare && (
        <span className="text-base text-ink-muted line-through">
          <span className="sr-only">Giá gốc </span>
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </span>
  );
}
