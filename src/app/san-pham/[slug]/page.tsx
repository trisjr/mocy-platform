import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout";
import { ProductCard, ProductSheet } from "@/components/store/ProductCard";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductPurchase } from "@/components/store/ProductPurchase";
import { ButtonLink, DisclaimerBox, LegalBadge, PriceTag } from "@/components/ui";
import { products } from "@/data";
import { getProductBySlug, getSymptomGroupById } from "@/lib/catalog";
import { PRODUCT_CATEGORY_LABELS, SALE_TYPE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/san-pham/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  return { title: product.name, description: product.shortDescription };
}

export default async function ProductDetailPage({ params }: PageProps<"/san-pham/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const isConsult = product.saleType === "consult";
  const groups = product.symptomGroupIds.map(getSymptomGroupById).filter((g) => g !== undefined);
  const related = products
    .filter((p) => p.id !== product.id && p.symptomGroupIds.some((id) => product.symptomGroupIds.includes(id)))
    .slice(0, 3);

  const sections: { title: string; body: string; caution?: boolean }[] = [
    { title: "Nguồn gốc, vùng trồng", body: product.origin },
    { title: "Thành phần", body: product.ingredients },
    { title: "Công dụng", body: product.uses },
    { title: isConsult ? "Cách dùng" : "Hướng dẫn sắc / sử dụng", body: product.usage },
    { title: "Chống chỉ định, lưu ý", body: product.contraindications, caution: true },
  ].filter((s) => s.body.trim());

  const crumb = "inline-flex min-h-12 items-center underline-offset-4 hover:underline";

  return (
    <Container className="pt-2 pb-10 md:pb-14">
      <nav aria-label="Đường dẫn" className="mb-3 text-ink-muted">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link href="/" className={crumb}>
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/san-pham" className={crumb}>
              Sản phẩm
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="py-3 font-semibold text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <LegalBadge label={product.legalLabel} />
            <p className="flex gap-x-3 text-label text-ink-muted">
              <span>{SALE_TYPE_LABELS[product.saleType]}</span>
              <span className="border-l border-line-strong pl-3">{PRODUCT_CATEGORY_LABELS[product.category]}</span>
            </p>
          </div>
          <h1 className="text-4xl leading-tight md:text-5xl">{product.name}</h1>
          <p className="text-lg">{product.shortDescription}</p>
          {product.registrationNumber && (
            <p className="text-ink-muted">
              Số công bố / đăng ký: <span className="font-semibold text-ink">{product.registrationNumber}</span>
            </p>
          )}
          {groups.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">Phù hợp:</span>
              {groups.map((g) => (
                <Link
                  key={g.id}
                  href={`/san-pham?nhom=${g.slug}`}
                  className="inline-flex min-h-12 items-center rounded-[3px] border-2 border-line-strong bg-surface px-3 font-semibold text-ink hover:border-wood-600"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          )}

          {product.legalLabel === "supplement" && <DisclaimerBox variant="supplement" />}

          <div className="label-frame paper-fiber bg-surface px-5 py-6 shadow-card sm:px-7">
            {isConsult ? (
              <div className="flex flex-col gap-4">
                <PriceTag size="lg" />
                <p>
                  Bài thuốc được lương y <strong>gia giảm theo thể trạng</strong> từng người nên không có giá cố
                  định. Anh/chị mô tả triệu chứng hoặc gửi ảnh đơn thuốc cũ, lương y sẽ gọi lại tư vấn và báo giá.
                </p>
                <ButtonLink href={`/tu-van?san-pham=${product.slug}`} size="lg" fullWidth>
                  Đăng ký tư vấn cắt thang
                </ButtonLink>
                <ButtonLink href="/dat-lich" variant="outline" fullWidth>
                  Đặt lịch khám với lương y
                </ButtonLink>
              </div>
            ) : (
              <ProductPurchase product={product} />
            )}
          </div>
        </div>
      </div>

      {sections.length > 0 && (
        <section aria-labelledby="thong-tin" className="mt-12 md:mt-16">
          <h2 id="thong-tin" className="text-3xl md:text-4xl">
            Thông tin sản phẩm
          </h2>
          {/* In như tờ hướng dẫn kèm hộp thuốc: các mục ngăn bằng đường kẻ, không icon. */}
          <div className="paper-fiber mt-5 border-y-2 border-double border-line-strong/70 bg-surface/70 px-5 md:px-8">
            <div className="md:grid md:grid-cols-2 md:gap-x-12">
              {sections.map((s) => (
                <section
                  key={s.title}
                  className={cn("border-b border-line py-5 last:border-b-0", s.caution && "md:col-span-2")}
                >
                  <h3 className={cn("text-xl", s.caution && "text-danger")}>{s.title}</h3>
                  <p className="mt-2 whitespace-pre-line">{s.body}</p>
                </section>
              ))}
            </div>
          </div>
        </section>
      )}

      <DisclaimerBox variant="general" className="mt-6" />

      {related.length > 0 && (
        <section aria-labelledby="lien-quan" className="mt-12 md:mt-16">
          <h2 id="lien-quan" className="text-3xl md:text-4xl">
            Sản phẩm cùng nhóm
          </h2>
          <ProductSheet columns={3} className="mt-6">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ProductSheet>
        </section>
      )}
    </Container>
  );
}
