import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout";
import { ProductCatalog } from "@/components/store/ProductCatalog";

export const metadata: Metadata = {
  title: "Sản phẩm & Dược liệu",
  description: "Dược liệu thô, trà thảo mộc, thuốc Đông y thành phẩm và combo liệu trình, lọc theo nhóm bệnh.",
};

export default function ProductsPage() {
  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-4xl md:text-5xl">Sản phẩm & Dược liệu</h1>
      <p className="mt-3 max-w-3xl text-lg text-ink-muted">
        Sản phẩm <strong className="text-ink">có sẵn</strong> mua ngay với giá niêm yết. Bài thuốc{" "}
        <strong className="text-ink">cần tư vấn</strong> được lương y gia giảm theo thể trạng từng người.
      </p>
      <Suspense fallback={<p className="mt-6 text-ink-muted">Đang tải danh sách sản phẩm…</p>}>
        <ProductCatalog />
      </Suspense>
    </Container>
  );
}
