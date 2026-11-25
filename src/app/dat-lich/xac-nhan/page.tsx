import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { Container } from "@/components/layout";

export const metadata: Metadata = { title: "Xác nhận lịch hẹn" };

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16 text-center">
          <p className="text-lg text-ink-muted">Đang tải...</p>
        </Container>
      }
    >
      <BookingConfirmation />
    </Suspense>
  );
}
