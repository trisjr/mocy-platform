import type { Metadata } from "next";
import { Suspense } from "react";
import { ConsultForm } from "@/components/booking/ConsultForm";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Đăng ký tư vấn cắt thang",
  description: "Mô tả triệu chứng, gửi kèm đơn thuốc cũ để lương y tư vấn và báo giá bài thuốc phù hợp.",
};

export default function ConsultPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16 text-center">
          <p className="text-lg text-ink-muted">Đang tải...</p>
        </Container>
      }
    >
      <ConsultForm />
    </Suspense>
  );
}
