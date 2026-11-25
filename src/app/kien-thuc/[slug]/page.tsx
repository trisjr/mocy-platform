import { CalendarCheck, ChevronLeft, Clock, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard, ArticleContent, SuggestedProducts } from "@/components/blog";
import { SafeImage } from "@/components/ui";
import { Container } from "@/components/layout";
import { ButtonLink, DisclaimerBox } from "@/components/ui";
import { articles } from "@/data";
import { getArticleBySlug, getDoctorById, getProductById } from "@/lib/catalog";
import { formatDate } from "@/lib/format";

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
        <Link href="/kien-thuc" className="inline-flex min-h-12 items-center gap-1 font-semibold text-herb-700">
          <ChevronLeft aria-hidden="true" className="size-5" />
          Tất cả bài viết
        </Link>

        <header className="mt-2">
          <h1 className="text-3xl leading-tight sm:text-4xl">{article.title}</h1>
          <p className="mt-4 text-lg text-ink-muted">{article.excerpt}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-muted">
            <span>{article.author}</span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="size-4" />
              {article.readingMinutes} phút đọc
            </span>
          </p>
          {reviewer && (
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-herb-50 p-3 text-herb-900">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              <span>
                Kiểm duyệt chuyên môn:{" "}
                <Link href={bookingHref} className="font-semibold underline">
                  {reviewer.name}
                </Link>
              </span>
            </p>
          )}
        </header>

        <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-card bg-paper-100">
          <SafeImage src={article.coverImage} alt={article.title} className="absolute inset-0 size-full" loading="eager" />
        </div>

        <div className="mt-6">
          <ArticleContent blocks={article.content} />
        </div>

        {article.relatedProductIds.length > 0 && (
          <SuggestedProducts productIds={article.relatedProductIds} title="Sản phẩm liên quan đến bài viết" className="mt-10" />
        )}

        {hasSupplement && <DisclaimerBox variant="supplement" className="mt-6" />}
        <DisclaimerBox variant="general" className="mt-4" />

        <section className="mt-10 rounded-card bg-herb-800 p-6 text-white sm:p-8">
          <h2 className="text-2xl text-white">Cần lương y tư vấn riêng cho bạn?</h2>
          <p className="mt-2 text-lg text-herb-50">
            Mỗi người một thể trạng. Đặt lịch để được thăm khám và tư vấn phù hợp, qua Zalo, video hoặc tại phòng khám.
          </p>
          <ButtonLink
            href={bookingHref}
            variant="accent"
            size="lg"
            icon={<CalendarCheck aria-hidden="true" className="size-5" />}
            className="mt-5"
          >
            Đặt lịch tư vấn
          </ButtonLink>
        </section>
      </article>

      {others.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl">Bài viết khác</h2>
          <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((a) => (
              <li key={a.id}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
