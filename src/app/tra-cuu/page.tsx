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
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header>
          <h1 className="text-4xl sm:text-5xl">Tra cứu đơn hàng &amp; lịch hẹn</h1>
          <p className="mt-3 text-lg text-ink-muted">
            Nhập mã in trên phiếu xác nhận (đơn hàng, lịch hẹn, yêu cầu tư vấn) hoặc số điện thoại đã dùng khi đặt.
          </p>
        </header>
        <Suspense fallback={<p className="text-lg text-ink-muted">Đang tải…</p>}>
          <LookupView />
        </Suspense>
      </div>
    </Container>
  );
}
