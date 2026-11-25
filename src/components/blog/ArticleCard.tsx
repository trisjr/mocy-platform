import Link from "next/link";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Article } from "@/types";
import { SafeImage } from "@/components/ui";

/** Ngày đăng và thời gian đọc, ngăn bằng một nét dọc. */
export function ArticleMeta({ article, className }: { article: Article; className?: string }) {
  return (
    <span className={cn("flex flex-wrap items-center gap-x-3 text-label text-ink-muted", className)}>
      <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      <span className="border-l border-line-strong pl-3">{article.readingMinutes} phút đọc</span>
    </span>
  );
}

/**
 * Bài viết trong danh sách.
 * - "feature": bài đầu, ảnh lớn bên trái (màn lớn) như trang mở đầu của một số báo.
 * - "entry": bài thường; điện thoại là một dòng có ảnh vuông nhỏ, màn lớn là cột có ảnh ngang.
 */
export function ArticleCard({
  article,
  priority,
  variant = "entry",
}: {
  article: Article;
  priority?: boolean;
  variant?: "feature" | "entry";
}) {
  const feature = variant === "feature";
  return (
    <Link
      href={`/kien-thuc/${article.slug}`}
      className={cn(
        "group flex h-full gap-4",
        feature ? "flex-col md:grid md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-center md:gap-10" : "sm:flex-col",
      )}
    >
      <span
        className={cn(
          "label-frame relative block shrink-0 overflow-hidden bg-surface",
          feature ? "aspect-[16/9] w-full" : "size-24 sm:aspect-[16/10] sm:size-auto sm:w-full",
        )}
      >
        {/* Tiêu đề đã có trong link: ảnh minh họa để alt rỗng. */}
        <SafeImage
          src={article.coverImage}
          alt=""
          className="absolute inset-0 size-full"
          loading={priority ? "eager" : "lazy"}
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-2">
        <ArticleMeta article={article} />
        <span
          className={cn(
            "font-heading leading-snug font-bold text-ink group-hover:underline",
            feature ? "text-3xl md:text-4xl" : "text-xl",
          )}
        >
          {article.title}
        </span>
        <span className={cn("text-ink-muted", feature ? "text-lg" : "line-clamp-3 max-sm:hidden")}>{article.excerpt}</span>
        <span className="mt-auto pt-1 font-semibold text-herb-700 underline decoration-2 underline-offset-4 max-sm:hidden">
          Đọc bài viết
        </span>
      </span>
    </Link>
  );
}
