import { Container } from "@/components/layout";

// Trang tạm, storefront-dev sẽ thay bằng trang chủ thật.
export default function HomePage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl">Đông y Mộc Y</h1>
      <p className="mt-4 text-ink-muted">Trang chủ đang được xây dựng.</p>
    </Container>
  );
}
