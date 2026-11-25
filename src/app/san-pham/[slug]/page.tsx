import {
  BadgeCheck,
  ClipboardList,
  FlaskConical,
  HeartPulse,
  MapPin,
  MessageCircleQuestion,
  ShieldAlert,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductGallery } from "@/components/store/ProductGallery";
import { ProductPurchase } from "@/components/store/ProductPurchase";
import { Badge, ButtonLink, Card, DisclaimerBox, LegalBadge, PriceTag } from "@/components/ui";
import { products } from "@/data";
import { getProductBySlug, getSymptomGroupById } from "@/lib/catalog";
import { PRODUCT_CATEGORY_LABELS, SALE_TYPE_LABELS } from "@/lib/constants";

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

  const sections: { title: string; icon: LucideIcon; body: string }[] = [
    { title: "Nguồn gốc, vùng trồng", icon: MapPin, body: product.origin },
    { title: "Thành phần", icon: FlaskConical, body: product.ingredients },
    { title: "Công dụng", icon: HeartPulse, body: product.uses },
    { title: isConsult ? "Cách dùng" : "Hướng dẫn sắc / sử dụng", icon: ClipboardList, body: product.usage },
    { title: "Chống chỉ định, lưu ý", icon: ShieldAlert, body: product.contraindications },
  ].filter((s) => s.body.trim());

  return (
    <Container className="py-6 md:py-10">
      <nav aria-label="Đường dẫn" className="mb-5 text-ink-muted">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/san-pham" className="hover:underline">
              Sản phẩm
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            <LegalBadge label={product.legalLabel} />
            <Badge tone={isConsult ? "wood" : "herb"}>{SALE_TYPE_LABELS[product.saleType]}</Badge>
            <Badge>{PRODUCT_CATEGORY_LABELS[product.category]}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl">{product.name}</h1>
          <p className="text-lg">{product.shortDescription}</p>
          {product.registrationNumber && (
            <p className="flex items-start gap-2 text-ink-muted">
              <BadgeCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-herb-700" />
              <span>
                Số công bố / đăng ký: <span className="font-semibold text-ink">{product.registrationNumber}</span>
              </span>
            </p>
          )}
          {groups.length > 0 && (
            <p className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">Phù hợp:</span>
              {groups.map((g) => (
                <Link
                  key={g.id}
                  href={`/san-pham?nhom=${g.slug}`}
                  className="inline-flex min-h-12 items-center rounded-full bg-herb-50 px-3 font-semibold text-herb-800 hover:bg-herb-100"
                >
                  {g.name}
                </Link>
              ))}
            </p>
          )}

          {product.legalLabel === "supplement" && <DisclaimerBox variant="supplement" />}

          <Card className="border-line-strong" padding="lg">
            {isConsult ? (
              <div className="flex flex-col gap-4">
                <PriceTag size="lg" />
                <p>
                  Bài thuốc được lương y <strong>gia giảm theo thể trạng</strong> từng người nên không có giá cố
                  định. Anh/chị mô tả triệu chứng hoặc gửi ảnh đơn thuốc cũ, lương y sẽ gọi lại tư vấn và báo giá.
                </p>
                <ButtonLink
                  href={`/tu-van?san-pham=${product.slug}`}
                  size="lg"
                  fullWidth
                  icon={<MessageCircleQuestion aria-hidden="true" className="size-5" />}
                >
                  Đăng ký tư vấn cắt thang
                </ButtonLink>
                <ButtonLink
                  href="/dat-lich"
                  variant="outline"
                  fullWidth
                  icon={<CalendarCheck aria-hidden="true" className="size-5" />}
                >
                  Đặt lịch khám với lương y
                </ButtonLink>
              </div>
            ) : (
              <ProductPurchase product={product} />
            )}
          </Card>
        </div>
      </div>

      {sections.length > 0 && (
        <section aria-labelledby="thong-tin" className="mt-10 md:mt-14">
          <h2 id="thong-tin" className="text-2xl md:text-3xl">
            Thông tin sản phẩm
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {sections.map((s) => (
              <Card key={s.title} className={s.icon === ShieldAlert ? "md:col-span-2" : undefined}>
                <h3 className="flex items-center gap-2 text-xl">
                  <s.icon aria-hidden="true" className="size-6 shrink-0 text-herb-700" />
                  {s.title}
                </h3>
                <p className="mt-2 whitespace-pre-line">{s.body}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      <DisclaimerBox variant="general" className="mt-6" />

      {related.length > 0 && (
        <section aria-labelledby="lien-quan" className="mt-10 md:mt-14">
          <h2 id="lien-quan" className="text-2xl md:text-3xl">
            Sản phẩm cùng nhóm
          </h2>
          <ul className="mt-5 grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
