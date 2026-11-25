import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout";
import { LookupView } from "@/components/lookup/LookupView";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng & lịch hẹn",
  description: "Nhập mã đơn, mã lịch hẹn hoặc số điện thoại để xem trạng thái xử lý tại Mộc Y.",
};

export default function LookupPage() {
  return (
    <Container className="py-8 sm:py-12">
      <Suspense fallback={<p className="text-lg text-ink-muted">Đang tải…</p>}>
        <LookupView />
      </Suspense>
    </Container>
  );
}
