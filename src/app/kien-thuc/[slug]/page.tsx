import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard, ArticleContent, ArticleMeta, SuggestedProducts } from "@/components/blog";
import { Container } from "@/components/layout";
import { ButtonLink, DisclaimerBox, SafeImage, Seal } from "@/components/ui";
import { articles } from "@/data";
import { getArticleBySlug, getDoctorById, getProductById } from "@/lib/catalog";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Không tìm thấy bài viết" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const reviewer = article.reviewedByDoctorId ? getDoctorById(article.reviewedByDoctorId) : undefined;
  const shownProductIds = [
    ...article.content.flatMap((b) => (b.type === "products" ? b.productIds : [])),
    ...article.relatedProductIds,
  ];
  const hasSupplement = shownProductIds.some((id) => getProductById(id)?.legalLabel === "supplement");
  const others = articles.filter((a) => a.id !== article.id).slice(0, 3);
  const bookingHref = reviewer ? `/dat-lich?doctor=${reviewer.slug}` : "/dat-lich";

  return (
    <Container className="py-6 sm:py-10">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/kien-thuc"
          className="inline-flex min-h-12 items-center font-semibold text-herb-700 underline decoration-2 underline-offset-4"
        >
          Tất cả bài viết
        </Link>

        <header className="mt-2 border-b-2 border-double border-line-strong/70 pb-6">
          <h1 className="text-4xl leading-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-4 font-heading text-xl leading-relaxed text-ink-muted italic sm:text-2xl">{article.excerpt}</p>
          <p className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-x-3">
            <span className="font-semibold">{article.author}</span>
            <ArticleMeta article={article} className="text-base sm:border-l sm:border-line-strong sm:pl-3" />
          </p>
          {reviewer && (
            <p className="mt-3 border-l-4 border-herb-700 bg-herb-50 px-4 py-2 text-herb-900">
              Kiểm duyệt chuyên môn:{" "}
              <Link href={bookingHref} className="inline-flex min-h-12 items-center font-semibold underline">
                {reviewer.name}
              </Link>
            </p>
          )}
        </header>

        <div className="label-frame relative mt-8 aspect-[16/9] w-full overflow-hidden bg-surface">
          <SafeImage src={article.coverImage} alt="" className="absolute inset-0 size-full" loading="eager" />
        </div>

        <div className="mt-6">
          <ArticleContent blocks={article.content} />
        </div>

        {article.relatedProductIds.length > 0 && (
          <SuggestedProducts productIds={article.relatedProductIds} title="Sản phẩm liên quan đến bài viết" className="mt-10" />
        )}

        {hasSupplement && <DisclaimerBox variant="supplement" className="mt-6" />}
        <DisclaimerBox variant="general" className="mt-4" />

        <section className="label-frame paper-fiber relative mt-12 bg-surface px-5 pt-8 pb-6 shadow-card sm:px-8 sm:py-8">
          <Seal className="absolute -top-6 right-5 size-16 rotate-6" />
          <h2 className="text-3xl">Cần lương y tư vấn riêng cho bạn?</h2>
          <p className="mt-2 text-lg">
            Mỗi người một thể trạng. Đặt lịch để được thăm khám và tư vấn phù hợp, qua Zalo, video hoặc tại phòng khám.
          </p>
          <ButtonLink href={bookingHref} size="lg" className="mt-5 w-full sm:w-auto">
            Đặt lịch tư vấn
          </ButtonLink>
        </section>
      </article>

      {others.length > 0 && (
        <section className="mt-16 border-t-2 border-double border-line-strong/70 pt-8">
          <h2 className="text-3xl">Bài viết khác</h2>
          <ul className="mt-4 divide-y divide-line-strong/50 sm:mt-6 sm:grid sm:grid-cols-3 sm:gap-8 sm:divide-y-0">
            {others.map((a) => (
              <li key={a.id} className="py-4 sm:py-0">
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
