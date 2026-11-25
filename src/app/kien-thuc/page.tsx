import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { ArticleCard } from "@/components/blog";
import { Container } from "@/components/layout";
import { ButtonLink, DisclaimerBox } from "@/components/ui";
import { articles } from "@/data";

export const metadata: Metadata = {
  title: "Kiến thức Đông y",
  description: "Bài viết dễ hiểu về dưỡng sinh, dược liệu và cách chăm sóc sức khỏe theo y học cổ truyền.",
};

export default function KnowledgePage() {
  const list = [...articles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return (
    <Container className="py-8 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl">Kiến thức Đông y</h1>
        <p className="mt-3 text-lg text-ink-muted">
          Những bài viết dễ hiểu về dưỡng sinh, dược liệu và cách chăm sóc sức khỏe, có lương y kiểm duyệt chuyên môn.
        </p>
      </header>

      {list.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-card border border-line bg-surface p-8 text-center">
          <BookOpen aria-hidden="true" className="size-10 text-herb-700" />
          <p className="text-lg font-semibold">Bài viết đang được cập nhật.</p>
          <p className="text-ink-muted">Trong lúc chờ, bạn có thể đặt lịch để được lương y tư vấn trực tiếp.</p>
          <ButtonLink href="/dat-lich" size="lg">
            Đặt lịch tư vấn
          </ButtonLink>
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((article, i) => (
            <li key={article.id}>
              <ArticleCard article={article} priority={i < 3} />
            </li>
          ))}
        </ul>
      )}

      <DisclaimerBox variant="general" className="mt-10" />
    </Container>
  );
}
