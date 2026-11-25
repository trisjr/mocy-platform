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
  const [lead, ...rest] = list;
  return (
    <Container className="py-8 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl">Kiến thức Đông y</h1>
        <p className="mt-3 text-lg text-ink-muted">
          Những bài viết dễ hiểu về dưỡng sinh, dược liệu và cách chăm sóc sức khỏe, có lương y kiểm duyệt chuyên môn.
        </p>
      </header>

      {!lead ? (
        <div className="label-frame paper-fiber mt-8 flex flex-col items-center gap-3 bg-surface px-6 py-10 text-center shadow-card">
          <p className="font-heading text-2xl font-bold">Bài viết đang được cập nhật.</p>
          <p className="text-ink-muted">Trong lúc chờ, bạn có thể đặt lịch để được lương y tư vấn trực tiếp.</p>
          <ButtonLink href="/dat-lich" size="lg">
            Đặt lịch tư vấn
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="mt-8 border-y-2 border-double border-line-strong/70 py-6 md:py-8">
            <ArticleCard article={lead} variant="feature" priority />
          </div>
          {rest.length > 0 && (
            <ul className="divide-y divide-line-strong/50 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-8 sm:divide-y-0">
              {rest.map((article, i) => (
                <li key={article.id} className="py-4 sm:py-0">
                  <ArticleCard article={article} priority={i < 2} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <DisclaimerBox variant="general" className="mt-10" />
    </Container>
  );
}
