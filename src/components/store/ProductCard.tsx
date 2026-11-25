import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClasses, LegalBadge, PriceTag, SafeImage } from "@/components/ui";
import { getMinPrice } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Một ô trên tờ nhãn sản phẩm: ảnh trong khung hai nét, nhãn pháp lý dạng con dấu, tên, giá.
 * Cả ô là link sang trang chi tiết. Đặt trong <ProductSheet> để có đường cắt giữa các ô.
 */
export function ProductCard({ product }: { product: Product }) {
  const isConsult = product.saleType === "consult";
  const minPrice = getMinPrice(product);
  const single = product.variants.length === 1 ? product.variants[0] : undefined;
  return (
    <Link href={`/san-pham/${product.slug}`} className="group flex h-full flex-col gap-2 p-3 sm:p-4">
      <div className="label-frame relative aspect-square overflow-hidden bg-surface">
        {/* Tên sản phẩm đã có trong link nên ảnh để alt rỗng, trình đọc màn hình không đọc lặp. */}
        <SafeImage src={product.images[0]} alt="" className="absolute inset-0 size-full" />
      </div>
      <div className="mt-1">
        <LegalBadge label={product.legalLabel} short />
      </div>
      <h3 className="text-lg leading-snug group-hover:text-herb-700 group-hover:underline sm:text-xl">{product.name}</h3>
      <p className="line-clamp-2 text-ink-muted max-sm:hidden">{product.shortDescription}</p>
      <div className="mt-auto pt-1">
        <PriceTag
          price={minPrice}
          compareAtPrice={single?.compareAtPrice}
          prefix={product.variants.length > 1 ? "Từ" : undefined}
          size="sm"
        />
      </div>
      <span
        className={cn(
          buttonClasses({ variant: isConsult ? "secondary" : "outline", fullWidth: true }),
          "px-3 text-center",
        )}
      >
        {isConsult ? "Xem & nhận tư vấn" : "Xem & chọn định lượng"}
      </span>
    </Link>
  );
}

/**
 * Tờ nhãn in: nền giấy, đường cắt nét đứt giữa các ô, dấu cắt ở góc.
 * Ô cuối mỗi hàng/cột tự mất viền nhờ lề âm + overflow-hidden, nên dùng được với mọi số cột.
 */
export function ProductSheet({
  className,
  columns = 4,
  children,
}: {
  className?: string;
  /** Số cột trên màn lớn. */
  columns?: 3 | 4;
  children: ReactNode;
}) {
  return (
    <div className={cn("@container crop-marks paper-fiber bg-surface shadow-card", className)}>
      <div className="overflow-hidden">
        {/* Hai cột trên điện thoại; khi người dùng đặt chữ rất to (tờ nhãn hẹp hơn 19rem) thì về một cột. */}
        <ul
          className={cn(
            "-mr-px -mb-px grid grid-cols-1 @min-[19rem]:grid-cols-2 [&>li]:border-r [&>li]:border-b [&>li]:border-dashed [&>li]:border-line-strong/60",
            columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
          )}
        >
          {children}
        </ul>
      </div>
    </div>
  );
}
