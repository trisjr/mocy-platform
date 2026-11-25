import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout";
import { OrderSuccess } from "@/components/store/OrderSuccess";

export const metadata: Metadata = { title: "Đặt hàng thành công" };

export default function OrderSuccessPage() {
  return (
    <Container className="py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
      <Suspense fallback={<p className="text-lg text-ink-muted">Đang tải đơn hàng…</p>}>
        <OrderSuccess />
      </Suspense>
      </div>
    </Container>
  );
}
