import { Clock } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { Article } from "@/types";
import { SafeImage } from "@/components/ui";

export function ArticleCard({ article, priority }: { article: Article; priority?: boolean }) {
  return (
    <Card padding="none" interactive className="h-full overflow-hidden">
      <Link href={`/kien-thuc/${article.slug}`} className="flex h-full flex-col">
        <span className="relative block aspect-[16/10] w-full bg-paper-100">
          <SafeImage
            src={article.coverImage}
            alt={article.title}
            className="absolute inset-0 size-full"
            loading={priority ? "eager" : "lazy"}
          />
        </span>
        <span className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
          <span className="flex flex-wrap items-center gap-x-3 text-sm text-ink-muted">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="size-4" />
              {article.readingMinutes} phút đọc
            </span>
          </span>
          <span className="font-heading text-xl font-semibold leading-snug text-ink">{article.title}</span>
          <span className="text-ink-muted">{article.excerpt}</span>
          <span className="mt-auto pt-2 font-semibold text-herb-700">Đọc bài viết</span>
        </span>
      </Link>
    </Card>
  );
}
