import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/layout";
import { ProductCard, ProductSheet } from "@/components/store/ProductCard";
import { SupplementNotice } from "@/components/store/SupplementNotice";
import { ButtonLink, DisclaimerBox, LegalBadge, SafeImage, Seal } from "@/components/ui";
import { articles, careSteps, doctors, faqs, products, symptomGroups, testimonials } from "@/data";
import { FREE_SHIPPING_THRESHOLD, SITE } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

/** Sản phẩm nổi bật theo luồng bán; thiếu sản phẩm featured thì lấy thêm theo thứ tự dữ liệu. */
function pickFeatured(saleType: Product["saleType"], count: number) {
  const list = products.filter((p) => p.saleType === saleType);
  return [...list.filter((p) => p.featured), ...list.filter((p) => !p.featured)].slice(0, count);
}

const COMMITMENTS = [
  { title: "Dược liệu rõ nguồn gốc", text: "Thu mua tận vùng trồng, có số công bố sản phẩm." },
  { title: "Lương y có chứng chỉ", text: "Bắt mạch, kê đơn theo thể trạng từng người." },
  { title: "Ghi nhãn minh bạch", text: "Phân biệt rõ Thuốc Đông y, Dược liệu và TPBVSK." },
  { title: "Giao tận nhà", text: `Miễn phí giao hàng cho đơn từ ${formatPrice(FREE_SHIPPING_THRESHOLD)}.` },
];

export default function HomePage() {
  const retail = pickFeatured("retail", 4);
  const consult = pickFeatured("consult", 3);
  const latestArticles = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);
  const [leadDoctor, ...otherDoctors] = doctors;
  const [leadQuote, ...otherQuotes] = testimonials.slice(0, 6);
  // Tủ thuốc: mỗi ngăn là một nhóm bệnh, ngăn cuối mở toàn bộ sản phẩm.
  const drawers = [
    ...symptomGroups.map((g) => ({
      href: `/san-pham?nhom=${g.slug}`,
      name: g.name,
      count: products.filter((p) => p.symptomGroupIds.includes(g.id)).length,
    })),
    { href: "/san-pham", name: "Tất cả", count: products.length },
  ];

  return (
    <>
      {/* Hero: chữ bên trái, bản vẽ cân thuốc bên phải (màn lớn) */}
      <section>
        <Container className="grid gap-8 pt-8 pb-10 md:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,29rem)] lg:items-center lg:gap-14 lg:py-16">
          <div>
            <p className="font-semibold text-herb-700">Nhà thuốc Đông y gia truyền phố Lãn Ông</p>
            <h1 className="mt-3 text-[2.5rem] leading-[1.08] font-extrabold tracking-[-0.01em] text-balance md:text-6xl">
              {SITE.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-lg md:text-xl">
              Mua dược liệu, trà thảo mộc có giá niêm yết, hoặc đặt lịch để lương y bắt mạch, gia giảm bài thuốc
              hợp với cơ địa của anh/chị.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/dat-lich" size="lg">
                Đặt lịch tư vấn
              </ButtonLink>
              <ButtonLink href="/san-pham" variant="outline" size="lg">
                Mua dược liệu
              </ButtonLink>
            </div>
            <a
              href={SITE.hotlineHref}
              className="mt-3 inline-flex min-h-12 items-center font-semibold text-wood-800 underline decoration-bronze-500 decoration-2 underline-offset-[6px] hover:text-herb-700"
            >
              Hoặc gọi hotline {SITE.hotline}
            </a>
          </div>
          <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="label-frame paper-fiber bg-surface p-2 shadow-card">
              <SafeImage
                src="/images/hero/can-thuoc.svg"
                alt=""
                loading="eager"
                className="aspect-[6/5] w-full object-contain"
              />
            </div>
            <figcaption className="mt-3 flex flex-col gap-0.5 text-label text-ink-muted sm:flex-row sm:justify-between sm:gap-4">
              <span>{SITE.address}</span>
              <span>{SITE.openingHours}</span>
            </figcaption>
            <Seal className="absolute -top-5 -right-2 size-16 rotate-6 md:size-20" />
          </figure>
        </Container>
      </section>

      {/* Cam kết: in như dòng chữ trên nhãn, không icon */}
      <section aria-label="Cam kết chất lượng" className="border-y-2 border-double border-line-strong/70 bg-surface/60">
        <Container>
          <ul className="grid grid-cols-2 lg:grid-cols-4">
            {COMMITMENTS.map((c, i) => (
              <li
                key={c.title}
                className={cn(
                  "border-dashed border-line-strong/50 py-5 pr-3 lg:px-5 lg:first:pl-0",
                  i % 2 === 0 && "border-r pl-0",
                  i % 2 === 1 && "pl-4",
                  i < 2 && "max-lg:border-b",
                  i < COMMITMENTS.length - 1 && "lg:border-r",
                )}
              >
                <p className="font-heading text-xl leading-snug font-bold">{c.title}</p>
                <p className="mt-1 text-ink-muted">{c.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Quy trình khám – bốc thuốc – giao thuốc: 4 bước đánh số, không icon */}
      <section id="quy-trinh" aria-labelledby="quy-trinh-title" className="scroll-mt-28 py-10 md:py-16">
        <Container>
          <SectionHead
            id="quy-trinh"
            title="Quy trình khám & bốc thuốc"
            intro="Từ lúc đặt lịch đến khi thuốc về tận nhà, lương y theo sát từng bước."
            more={{ href: "/gioi-thieu", label: "Về Mộc Y & tiêu chuẩn dược liệu" }}
          />
          <ol className="mt-7 grid border-t-2 border-double border-line-strong/70 sm:grid-cols-2 lg:grid-cols-4">
            {careSteps.map((s, i) => (
              <li
                key={s.title}
                className={cn(
                  "flex gap-4 border-b border-dashed border-line-strong/50 py-5 sm:flex-col sm:gap-2 sm:pr-5",
                  i % 2 === 1 && "sm:border-l sm:pl-5",
                  "lg:border-b-0 lg:pl-5 lg:first:pl-0",
                  i > 0 && "lg:border-l",
                )}
              >
                <span aria-hidden="true" className="font-heading text-5xl leading-none font-bold text-bronze-600">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl leading-snug">{s.title}</h3>
                  <p className="mt-1 text-ink-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Tủ thuốc: tra cứu theo nhóm bệnh */}
      {symptomGroups.length > 0 && (
        <section aria-labelledby="nhom-benh-title" className="on-dark bg-wood-800 py-10 text-wood-100 md:py-14">
          <Container>
            <h2 id="nhom-benh-title" className="text-3xl text-paper-50 md:text-4xl">
              Tra cứu theo nhu cầu
            </h2>
            <p className="mt-2 max-w-2xl text-lg">Chọn nhóm bệnh để xem dược liệu, trà thảo mộc và bài thuốc phù hợp.</p>
            <ul className="mt-7 grid grid-cols-2 gap-2 rounded-[3px] bg-wood-900 p-2 shadow-[inset_0_0_0_2px_rgb(0_0_0/0.35),0_2px_0_var(--color-wood-600)] md:grid-cols-3 md:gap-3 md:p-3">
              {drawers.map((d) => (
                <li key={d.href}>
                  <Link
                    href={d.href}
                    className="wood-grain flex min-h-36 flex-col items-center justify-center gap-3 rounded-[2px] px-2 py-4 transition-[filter] hover:brightness-110"
                  >
                    <span className="brass-holder block">
                      <span className="paper-fiber block min-w-32 bg-paper-50 px-3 py-1.5 text-center md:min-w-44">
                        <span className="block font-heading text-xl leading-tight font-bold text-ink">{d.name}</span>
                        <span className="block text-label text-ink-muted">{d.count} sản phẩm</span>
                      </span>
                    </span>
                    <span aria-hidden="true" className="drawer-pull" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Tờ nhãn sản phẩm bán sẵn */}
      {retail.length > 0 && (
        <section aria-labelledby="mua-ngay-title" className="py-10 md:py-16">
          <Container>
            <SectionHead
              id="mua-ngay"
              title="Mua ngay – giá niêm yết"
              intro="Dược liệu, trà thảo mộc và combo liệu trình có sẵn, thêm vào giỏ và đặt hàng ngay."
              more={{ href: "/san-pham?tinh-trang=co-san", label: "Xem tất cả sản phẩm có sẵn" }}
            />
            <ProductSheet className="mt-7">
              {retail.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ProductSheet>
            <SupplementNotice products={retail} className="mt-6" />
          </Container>
        </section>
      )}

      {/* Bài thuốc thang: dải gỗ, danh sách */}
      {consult.length > 0 && (
        <section aria-labelledby="can-tu-van-title" className="on-dark bg-wood-800 py-10 text-wood-100 md:py-14">
          <Container>
            <SectionHead
              id="can-tu-van"
              dark
              title="Bài thuốc cần lương y tư vấn"
              intro="Thuốc thang được gia giảm theo thể trạng nên không có giá cố định. Anh/chị mô tả triệu chứng hoặc gửi đơn thuốc cũ, lương y sẽ báo giá."
              more={{ href: "/san-pham?tinh-trang=can-tu-van", label: "Xem tất cả bài thuốc" }}
            />
            <ul className="mt-6 border-t border-bronze-500/40 md:grid md:grid-cols-3 md:gap-8 md:border-t-0">
              {consult.map((p) => (
                <li key={p.id} className="border-b border-bronze-500/40 md:border-b-0">
                  <Link href={`/san-pham/${p.slug}`} className="group flex gap-4 py-4 md:flex-col md:py-0">
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-[2px] bg-paper-50 md:aspect-[4/3] md:size-auto md:w-full">
                      <SafeImage src={p.images[0]} alt="" className="absolute inset-0 size-full" />
                    </div>
                    <div className="min-w-0">
                      <LegalBadge label={p.legalLabel} className="text-bronze-200" />
                      <h3 className="mt-2 text-xl text-paper-50 group-hover:underline md:text-2xl">{p.name}</h3>
                      <p className="mt-1 line-clamp-3">{p.shortDescription}</p>
                      <span className="mt-2 inline-flex min-h-12 items-center font-semibold text-bronze-300 underline decoration-2 underline-offset-4">
                        Xem &amp; nhận tư vấn
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Lương y: một người nổi bật + danh sách */}
      {leadDoctor && (
        <section aria-labelledby="luong-y-title" className="py-10 md:py-16">
          <Container>
            <SectionHead
              id="luong-y"
              title="Đội ngũ lương y"
              intro="Lương y, bác sĩ Y học cổ truyền có chứng chỉ hành nghề, khám trực tuyến hoặc tại phòng khám."
              more={{ href: "/luong-y", label: "Xem hồ sơ lương y" }}
            />
            <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
              <article className="grid gap-5 sm:grid-cols-[11rem_minmax(0,1fr)] md:grid-cols-[13rem_minmax(0,1fr)]">
                <div className="w-40 self-start bg-paper-200 p-1.5 shadow-[0_0_0_1px_var(--color-line-strong)] sm:w-auto">
                  <div className="relative aspect-[4/5] overflow-hidden bg-paper-50">
                    <SafeImage src={leadDoctor.avatar} alt="" className="absolute inset-0 size-full object-top" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl">{leadDoctor.name}</h3>
                  <p className="mt-1 font-semibold text-herb-700">{leadDoctor.experienceYears} năm kinh nghiệm</p>
                  {leadDoctor.specialties.length > 0 && (
                    <p className="mt-1 text-ink-muted">{leadDoctor.specialties.join(", ")}</p>
                  )}
                  <p className="mt-3">{leadDoctor.bio}</p>
                  <p className="mt-3 text-label text-ink-muted">CCHN số {leadDoctor.licenseNumber}</p>
                  <ButtonLink
                    href={`/dat-lich?luong-y=${leadDoctor.slug}`}
                    className="mt-4 w-full sm:w-auto"
                    aria-label={`Đặt lịch khám với ${leadDoctor.name}`}
                  >
                    Đặt lịch khám
                  </ButtonLink>
                </div>
              </article>
              {otherDoctors.length > 0 && (
                <ul className="border-t border-line-strong/60 lg:self-start">
                  {otherDoctors.map((d) => (
                    <li key={d.id} className="flex items-center gap-4 border-b border-line-strong/60 py-4">
                      <div className="relative size-20 shrink-0 overflow-hidden bg-paper-50 shadow-[0_0_0_1px_var(--color-line-strong)]">
                        <SafeImage src={d.avatar} alt="" className="absolute inset-0 size-full object-top" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl leading-snug">{d.name}</h3>
                        <p className="text-label text-ink-muted">
                          {d.experienceYears} năm kinh nghiệm, {d.specialties.join(", ").toLowerCase()}
                        </p>
                        <Link
                          href={`/dat-lich?luong-y=${d.slug}`}
                          aria-label={`Đặt lịch khám với ${d.name}`}
                          className="inline-flex min-h-12 items-center font-semibold text-herb-700 underline decoration-2 underline-offset-4"
                        >
                          Đặt lịch khám
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Cảm nhận: một trích dẫn lớn, các ghi chép còn lại */}
      {leadQuote && (
        <section aria-labelledby="cam-nhan-title" className="border-t border-line-strong/50 py-10 md:py-16">
          <Container>
            <h2 id="cam-nhan-title" className="text-3xl md:text-4xl">
              Khách hàng nói về Mộc Y
            </h2>
            <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
              <figure>
                <blockquote className="font-heading text-2xl leading-snug font-medium italic md:text-3xl">
                  <span aria-hidden="true" className="block font-heading text-6xl leading-[0.6] text-bronze-600 not-italic">
                    “
                  </span>
                  {leadQuote.content}
                </blockquote>
                <figcaption className="mt-4">
                  <span className="font-semibold">{leadQuote.name}</span>
                  <span className="text-ink-muted">
                    {leadQuote.age ? `, ${leadQuote.age} tuổi` : ""}, {leadQuote.location}
                  </span>
                </figcaption>
              </figure>
              {otherQuotes.length > 0 && (
                <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
                  {otherQuotes.map((t) => (
                    <li
                      key={t.id}
                      className="paper-fiber flex w-[80%] shrink-0 snap-start flex-col gap-3 border-l-4 border-bronze-500 bg-surface p-4 shadow-card sm:w-auto"
                    >
                      <blockquote className="flex-1">“{t.content}”</blockquote>
                      <p className="text-label">
                        <span className="font-semibold">{t.name}</span>
                        <span className="text-ink-muted">
                          {t.age ? `, ${t.age} tuổi` : ""}, {t.location}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="mt-5 text-label text-ink-muted">
              Cảm nhận mang tính cá nhân, hiệu quả có thể khác nhau tùy cơ địa mỗi người.
            </p>
          </Container>
        </section>
      )}

      {/* Bài viết: danh sách có ảnh nhỏ */}
      {latestArticles.length > 0 && (
        <section aria-labelledby="kien-thuc-title" className="border-t border-line-strong/50 py-10 md:py-16">
          <Container>
            <SectionHead
              id="kien-thuc"
              title="Kiến thức Đông y"
              intro="Bài viết do lương y biên soạn và kiểm duyệt chuyên môn."
              more={{ href: "/kien-thuc", label: "Xem tất cả bài viết" }}
            />
            <ul className="mt-6 grid gap-x-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr]">
              {latestArticles.map((a, i) => (
                <li
                  key={a.id}
                  className={cn(
                    "border-b border-line-strong/50 first:border-t",
                    i === 0 ? "md:row-span-2 md:border-b-0" : "md:self-start",
                    i === 1 && "md:border-t",
                  )}
                >
                  <Link
                    href={`/kien-thuc/${a.slug}`}
                    className={cn("group flex gap-4 py-4", i === 0 && "md:flex-col md:gap-3")}
                  >
                    <div
                      className={cn(
                        "relative size-24 shrink-0 overflow-hidden bg-surface shadow-[0_0_0_1px_var(--color-line-strong)]",
                        i === 0 && "md:aspect-[16/9] md:size-auto md:w-full",
                      )}
                    >
                      <SafeImage src={a.coverImage} alt="" className="absolute inset-0 size-full" />
                    </div>
                    <div className="min-w-0">
                      <h3 className={cn("text-xl leading-snug group-hover:underline", i === 0 && "md:text-2xl")}>
                        {a.title}
                      </h3>
                      <p className={cn("mt-1 line-clamp-2 text-ink-muted max-md:hidden", i !== 0 && "md:hidden")}>
                        {a.excerpt}
                      </p>
                      <p className="mt-1 flex flex-wrap gap-x-3 text-label text-ink-muted">
                        <span>{formatDate(a.publishedAt)}</span>
                        <span className="border-l border-line-strong pl-3">{a.readingMinutes} phút đọc</span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* Câu hỏi thường gặp: details/summary gốc, không cần JS */}
      {faqs.length > 0 && (
        <section id="cau-hoi" aria-labelledby="cau-hoi-title" className="scroll-mt-28 border-t border-line-strong/50 py-10 md:py-16">
          <Container>
            <h2 id="cau-hoi-title" className="text-3xl md:text-4xl">
              Câu hỏi thường gặp
            </h2>
            <div className="mt-6 max-w-3xl border-t-2 border-double border-line-strong/70">
              {faqs.map((f) => (
                <details key={f.id} className="group border-b border-dashed border-line-strong/60">
                  <summary className="flex min-h-12 cursor-pointer list-none items-start justify-between gap-4 py-4 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-herb-700 [&::-webkit-details-marker]:hidden">
                    <span>{f.question}</span>
                    <span aria-hidden="true" className="shrink-0 font-heading text-2xl leading-none text-bronze-600">
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </summary>
                  <p className="pb-5 text-ink-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Lời mời đặt lịch: tờ giấy khung nhãn có dấu son */}
      <section className="pb-10 md:pb-16">
        <Container>
          <div className="label-frame paper-fiber relative bg-surface px-5 pt-8 pb-6 shadow-card md:flex md:items-center md:justify-between md:gap-8 md:px-10 md:py-10">
            <Seal className="absolute -top-6 right-5 size-16 rotate-6" />
            <div>
              <h2 className="text-3xl md:text-4xl">Chưa biết nên dùng gì?</h2>
              <p className="mt-2 max-w-xl text-lg">
                Đặt lịch để lương y lắng nghe triệu chứng và tư vấn bài thuốc phù hợp, trực tuyến qua Zalo hoặc tại
                phòng khám.
              </p>
            </div>
            <ButtonLink href="/dat-lich" size="lg" className="mt-5 w-full shrink-0 md:mt-0 md:w-auto">
              Đặt lịch tư vấn
            </ButtonLink>
          </div>
          <DisclaimerBox variant="general" className="mt-8 border-line-strong bg-transparent text-ink-muted" />
        </Container>
      </section>
    </>
  );
}

function SectionHead({
  id,
  title,
  intro,
  more,
  dark,
}: {
  id: string;
  title: string;
  intro?: string;
  more?: { href: string; label: string };
  dark?: boolean;
}): ReactNode {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-8">
      <div>
        <h2 id={`${id}-title`} className={cn("text-3xl md:text-4xl", dark && "text-paper-50")}>
          {title}
        </h2>
        {intro && <p className={cn("mt-2 max-w-2xl text-lg", !dark && "text-ink-muted")}>{intro}</p>}
      </div>
      {more && (
        <Link
          href={more.href}
          className={cn(
            "inline-flex min-h-12 shrink-0 items-center font-semibold underline decoration-2 underline-offset-[6px]",
            dark ? "text-bronze-300" : "text-herb-700",
          )}
        >
          {more.label}
        </Link>
      )}
    </div>
  );
}
