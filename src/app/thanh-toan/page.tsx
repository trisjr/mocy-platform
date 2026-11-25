import type { Metadata } from "next";
import { Container } from "@/components/layout";
import { CheckoutForm } from "@/components/store/CheckoutForm";

export const metadata: Metadata = { title: "Thanh toán" };

export default function CheckoutPage() {
  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-4xl md:text-5xl">Đặt hàng</h1>
      <CheckoutForm />
    </Container>
  );
}
