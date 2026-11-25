import type { Metadata } from "next";
import { Container } from "@/components/layout";
import { CartView } from "@/components/store/CartView";

export const metadata: Metadata = { title: "Giỏ hàng" };

export default function CartPage() {
  return (
    <Container className="py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl">Giỏ hàng</h1>
      <CartView />
    </Container>
  );
}
