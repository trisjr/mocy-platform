import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarCheck,
  Leaf,
  ShieldCheck,
  Sprout,
  Star,
  Stethoscope,
  Truck,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/layout";
import { ProductCard } from "@/components/store/ProductCard";
import { SafeImage } from "@/components/ui";
import { ButtonLink, Card, DisclaimerBox } from "@/components/ui";
import { articles, doctors, products, symptomGroups, testimonials } from "@/data";
import { FREE_SHIPPING_THRESHOLD, SITE } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/format";
import type { Product } from "@/types";

/** Sản phẩm nổi bật theo luồng bán; thiếu sản phẩm featured thì lấy thêm theo thứ tự dữ liệu. */
function pickFeatured(saleType: Product["saleType"], count: number) {
  const list = products.filter((p) => p.saleType === saleType);
  return [...list.filter((p) => p.featured), ...list.filter((p) => !p.featured)].slice(0, count);
}

const COMMITMENTS = [
  { icon: Sprout, title: "Dược liệu rõ nguồn gốc", text: "Thu mua tận vùng trồng, có số công bố sản phẩm." },
  { icon: Stethoscope, title: "Lương y có chứng chỉ", text: "Bắt mạch, kê đơn theo thể trạng từng người." },
  { icon: ShieldCheck, title: "Ghi nhãn minh bạch", text: "Phân biệt rõ Thuốc Đông y, Dược liệu và TPBVSK." },
  { icon: Truck, title: "Giao tận nhà", text: `Miễn phí giao hàng cho đơn từ ${formatPrice(FREE_SHIPPING_THRESHOLD)}.` },
];

export default function HomePage() {
  const retail = pickFeatured("retail", 4);
  const consult = pickFeatured("consult", 3);
  const latestArticles = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);

  return (
    <>
      {/* Banner */}
      <section className="relative overflow-hidden bg-herb-800 text-herb-50">
        <Leaf
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -right-16 size-80 rotate-12 text-herb-700 md:size-[28rem]"
        />
        <Leaf
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 left-1/3 size-56 -rotate-45 text-herb-700/60"
        />
        <Container className="relative py-12 md:py-20">
          <p className="inline-flex items-center gap-2 rounded-full bg-herb-700 px-4 py-1 font-semibold text-bronze-200">
            <Award aria-hidden="true" className="size-5" />
            Nhà thuốc Đông y gia truyền phố Lãn Ông
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl text-paper-50 md:text-5xl">{SITE.tagline}</h1>
          <p className="mt-4 max-w-2xl text-lg text-herb-100 md:text-xl">
            Mua dược liệu, trà thảo mộc có giá niêm yết, hoặc đặt lịch để lương y bắt mạch, gia giảm bài thuốc
            hợp với cơ địa của anh/chị.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href="/dat-lich"
              variant="accent"
              size="lg"
              icon={<CalendarCheck aria-hidden="true" className="size-6" />}
            >
              Đặt lịch tư vấn
            </ButtonLink>
            <ButtonLink href="/san-pham" variant="outline" size="lg" icon={<Leaf aria-hidden="true" className="size-6" />}>
              Mua dược liệu
            </ButtonLink>
          </div>
          <a
            href={SITE.hotlineHref}
            className="mt-6 inline-flex min-h-12 items-center gap-2 font-semibold text-paper-50 underline underline-offset-4"
          >
            Hoặc gọi hotline {SITE.hotline}
          </a>
        </Container>
      </section>

      {/* Cam kết */}
      <section aria-label="Cam kết chất lượng" className="border-b border-line bg-surface">
        <Container className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {COMMITMENTS.map((c) => (
            <div key={c.title} className="flex gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-herb-50 text-herb-700">
                <c.icon aria-hidden="true" className="size-6" />
              </span>
              <div>
                <p className="font-semibold text-wood-800">{c.title}</p>
                <p className="text-ink-muted">{c.text}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* Tra cứu theo nhóm bệnh */}
      {symptomGroups.length > 0 && (
        <Section
          id="nhom-benh"
          title="Tra cứu theo nhu cầu"
          intro="Chọn nhóm bệnh để xem dược liệu, trà thảo mộc và bài thuốc phù hợp."
        >
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {symptomGroups.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/san-pham?nhom=${g.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-shadow hover:border-herb-400 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] bg-herb-50">
                    <SafeImage src={g.image} alt="" className="size-full" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
                    <span className="flex items-center justify-between gap-2 text-lg font-semibold text-wood-800 group-hover:text-herb-700">
                      {g.name}
                      <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
                    </span>
                    <span className="hidden sm:block">
                      <span className="line-clamp-2 text-ink-muted">{g.description}</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Sản phẩm nổi bật */}
      {retail.length > 0 && (
        <Section
          id="mua-ngay"
          tone="surface"
          title="Mua ngay – giá niêm yết"
          intro="Dược liệu, trà thảo mộc và combo liệu trình có sẵn, thêm vào giỏ và đặt hàng ngay."
          more={{ href: "/san-pham?tinh-trang=co-san", label: "Xem tất cả sản phẩm có sẵn" }}
        >
          <ul className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-4">
            {retail.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {consult.length > 0 && (
        <Section
          id="can-tu-van"
          title="Bài thuốc cần lương y tư vấn"
          intro="Thuốc thang được gia giảm theo thể trạng nên không có giá cố định. Anh/chị mô tả triệu chứng hoặc gửi đơn thuốc cũ, lương y sẽ báo giá."
          more={{ href: "/san-pham?tinh-trang=can-tu-van", label: "Xem tất cả bài thuốc" }}
        >
          <ul className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3">
            {consult.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Đội ngũ lương y */}
      {doctors.length > 0 && (
        <Section
          id="luong-y"
          tone="surface"
          title="Đội ngũ lương y"
          intro="Lương y, bác sĩ Y học cổ truyền có chứng chỉ hành nghề, khám trực tuyến hoặc tại phòng khám."
          more={{ href: "/dat-lich", label: "Đặt lịch tư vấn" }}
        >
          <ul className="grid gap-5 md:grid-cols-3">
            {doctors.map((d) => (
              <li key={d.id}>
                <Card className="flex h-full flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="size-20 shrink-0 overflow-hidden rounded-full border-2 border-bronze-300 bg-herb-50">
                      <SafeImage src={d.avatar} alt={d.name} className="size-full" />
                    </div>
                    <div>
                      <h3 className="text-xl">{d.name}</h3>
                      <p className="text-ink-muted">{d.experienceYears} năm kinh nghiệm</p>
                    </div>
                  </div>
                  {d.specialties.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {d.specialties.map((s) => (
                        <li key={s} className="rounded-full bg-herb-50 px-3 py-0.5 text-sm font-semibold text-herb-800">
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="line-clamp-3">{d.bio}</p>
                  <p className="text-sm text-ink-muted">CCHN số {d.licenseNumber}</p>
                  <ButtonLink
                    href={`/dat-lich?luong-y=${d.slug}`}
                    variant="outline"
                    fullWidth
                    className="mt-auto"
                    aria-label={`Đặt lịch khám với ${d.name}`}
                    icon={<CalendarCheck aria-hidden="true" className="size-5" />}
                  >
                    Đặt lịch khám
                  </ButtonLink>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Cảm nhận khách hàng */}
      {testimonials.length > 0 && (
        <Section id="cam-nhan" title="Khách hàng nói về Mộc Y">
          <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {testimonials.slice(0, 6).map((t) => (
              <li key={t.id} className="w-[85%] shrink-0 snap-start md:w-auto">
                <Card className="flex h-full flex-col gap-3">
                  <p className="flex gap-0.5 text-bronze-500" aria-label={`${t.rating} trên 5 sao`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        className={i < t.rating ? "size-5 fill-current" : "size-5 text-line-strong"}
                      />
                    ))}
                  </p>
                  <blockquote className="flex-1 text-lg">“{t.content}”</blockquote>
                  <p className="font-semibold text-wood-800">
                    {t.name}
                    <span className="font-normal text-ink-muted">
                      {t.age ? `, ${t.age} tuổi` : ""} · {t.location}
                    </span>
                  </p>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-muted">
            Cảm nhận mang tính cá nhân, hiệu quả có thể khác nhau tùy cơ địa mỗi người.
          </p>
        </Section>
      )}

      {/* Tin tức kiến thức */}
      {latestArticles.length > 0 && (
        <Section
          id="kien-thuc"
          tone="surface"
          title="Kiến thức Đông y"
          intro="Bài viết do lương y biên soạn và kiểm duyệt chuyên môn."
          more={{ href: "/kien-thuc", label: "Xem tất cả bài viết" }}
        >
          <ul className="grid gap-5 md:grid-cols-3">
            {latestArticles.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/kien-thuc/${a.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-shadow hover:border-line-strong hover:shadow-lg"
                >
                  <div className="aspect-[16/9] bg-paper-200">
                    <SafeImage src={a.coverImage} alt="" className="size-full" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="text-xl group-hover:text-herb-700">{a.title}</h3>
                    <p className="line-clamp-3 text-ink-muted">{a.excerpt}</p>
                    <p className="mt-auto flex items-center gap-2 pt-2 text-sm text-ink-muted">
                      <BookOpen aria-hidden="true" className="size-4" />
                      {formatDate(a.publishedAt)} · {a.readingMinutes} phút đọc
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Lời kêu gọi cuối trang */}
      <section className="bg-wood-800 text-paper-100">
        <Container className="flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl text-paper-50">Chưa biết nên dùng gì?</h2>
            <p className="mt-2 max-w-xl text-lg">
              Đặt lịch để lương y lắng nghe triệu chứng và tư vấn bài thuốc phù hợp, trực tuyến qua Zalo hoặc tại
              phòng khám.
            </p>
          </div>
          <ButtonLink
            href="/dat-lich"
            variant="accent"
            size="lg"
            className="shrink-0"
            icon={<CalendarCheck aria-hidden="true" className="size-6" />}
          >
            Đặt lịch tư vấn
          </ButtonLink>
        </Container>
      </section>
      <Container className="py-6">
        <DisclaimerBox variant="general" />
      </Container>
    </>
  );
}

function Section({
  id,
  title,
  intro,
  more,
  tone = "background",
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  more?: { href: string; label: string };
  tone?: "background" | "surface";
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className={tone === "surface" ? "bg-surface" : undefined}>
      <Container className="py-12 md:py-16">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id={`${id}-title`} className="text-3xl md:text-4xl">
              {title}
            </h2>
            {intro && <p className="mt-2 max-w-3xl text-lg text-ink-muted">{intro}</p>}
          </div>
          {more && (
            <Link
              href={more.href}
              className="inline-flex min-h-12 shrink-0 items-center gap-2 font-semibold text-herb-700 hover:underline"
            >
              {more.label}
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
          )}
        </div>
        {children}
      </Container>
    </section>
  );
}
