import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Đặt lịch lương y",
  description: "Đặt lịch tư vấn trực tuyến hoặc khám tại phòng khám với lương y, chỉ cần họ tên và số điện thoại.",
};

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16 text-center">
          <p className="text-lg text-ink-muted">Đang tải...</p>
        </Container>
      }
    >
      <BookingFlow />
    </Suspense>
  );
}
