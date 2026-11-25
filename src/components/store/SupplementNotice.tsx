import { DisclaimerBox } from "@/components/ui";
import { SUPPLEMENT_DISCLAIMER } from "@/lib/constants";
import type { Product } from "@/types";

/**
 * Dòng khuyến cáo bắt buộc (requirement.md §2.4) cho nơi liệt kê sản phẩm có thực phẩm bảo vệ sức khỏe.
 * Không có TPBVSK trong danh sách thì không hiện gì.
 */
export function SupplementNotice({
  products,
  className,
}: {
  products: Pick<Product, "name" | "legalLabel">[];
  className?: string;
}) {
  const names = [...new Set(products.filter((p) => p.legalLabel === "supplement").map((p) => p.name))];
  if (names.length === 0) return null;
  return (
    <DisclaimerBox className={className}>
      <span className="font-normal">{names.join(", ")} là thực phẩm bảo vệ sức khỏe. </span>
      {SUPPLEMENT_DISCLAIMER}
    </DisclaimerBox>
  );
}
