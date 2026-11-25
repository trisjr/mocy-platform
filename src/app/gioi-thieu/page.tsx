import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout";
import { ButtonLink, DisclaimerBox, SafeImage, Seal } from "@/components/ui";
import { doctors } from "@/data";
import { LEGAL_INFO, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Về Mộc Y",
  description:
    "Câu chuyện nhà thuốc Đông y Mộc Y phố Lãn Ông, tiêu chuẩn dược liệu sạch, không gian phòng khám, giấy phép hoạt động và chứng chỉ hành nghề.",
};

const STANDARDS = [
  {
    title: "Rõ vùng trồng",
    text: "Dược liệu trong nước lấy từ vùng trồng Lào Cai, Hòa Bình, Phú Thọ, Đồng Tháp; dược liệu nhập như kỷ tử Ninh Hạ, táo nhân Hà Bắc có hồ sơ kiểm nghiệm từng lô.",
  },
  {
    title: "Sơ chế sạch",
    text: "Không xông diêm sinh, không dùng chất bảo quản; thái lát, sao tẩm và sấy tại cơ sở ở Hà Nội.",
  },
  {
    title: "Kiểm tra trước khi bốc",
    text: "Lương y kiểm tra màu, mùi, độ khô của từng vị trước khi bốc thang.",
  },
  {
    title: "Bảo quản chống ẩm",
    text: "Kho khô thoáng; đóng túi zip kèm gói hút ẩm trước khi giao.",
  },
];

const SPACES = [
  { title: "Phòng bắt mạch", text: "Yên tĩnh, riêng tư khi hỏi bệnh." },
  { title: "Tủ thuốc trăm ngăn", text: "Mỗi vị một ngăn, ghi nhãn tên và ngày nhập." },
  { title: "Khu sắc thuốc", text: "Nồi sắc kín, đóng túi hút chân không." },
];

const LINK = "inline-flex min-h-12 items-center font-semibold text-herb-700 underline decoration-2 underline-offset-4";

export default function AboutPage() {
  return (
    <Container className="py-8 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl">Về Mộc Y</h1>
        <p className="mt-3 text-lg text-ink-muted">
          Nhà thuốc Đông y gia truyền trên phố Lãn Ông: khám, tư vấn và bốc thuốc theo thể trạng từng người, với dược
          liệu rõ nguồn gốc.
        </p>
      </header>

      <section id="cau-chuyen" aria-labelledby="cau-chuyen-title" className="mt-10 max-w-3xl scroll-mt-28">
        <h2 id="cau-chuyen-title" className="text-3xl md:text-4xl">
          Câu chuyện & triết lý
        </h2>
        <p className="mt-4 text-lg">
          Mộc Y bắt đầu từ một tủ thuốc gia truyền trên phố Lãn Ông. Qua nhiều thế hệ, nhà thuốc vẫn giữ cách làm cũ:
          lương y trực tiếp hỏi bệnh, chọn từng vị thuốc và dặn dò anh/chị cách sắc, cách uống.
        </p>
        <p className="mt-4 text-lg">
          Triết lý của chúng tôi là <strong>“Bốc thuốc theo thể trạng”</strong>. Cùng một chứng bệnh nhưng mỗi người
          một cơ địa, nên lương y bắt mạch, xem xét kỹ rồi mới gia giảm từng thang cho phù hợp với anh/chị.
        </p>
      </section>

      <section
        id="duoc-lieu"
        aria-labelledby="duoc-lieu-title"
        className="mt-12 scroll-mt-28 border-t-2 border-double border-line-strong/70 pt-8"
      >
        <h2 id="duoc-lieu-title" className="text-3xl md:text-4xl">
          Tiêu chuẩn dược liệu
        </h2>
        <ul className="mt-5 grid sm:grid-cols-2">
          {STANDARDS.map((s) => (
            <li key={s.title} className="border-b border-dashed border-line-strong/50 py-4 sm:pr-6 sm:odd:border-r sm:even:pl-6">
              <h3 className="text-xl">{s.title}</h3>
              <p className="mt-1 text-ink-muted">{s.text}</p>
            </li>
          ))}
        </ul>
        <Link href="/san-pham" className={`mt-3 ${LINK}`}>
          Xem dược liệu & sản phẩm
        </Link>
      </section>

      <section
        id="khong-gian"
        aria-labelledby="khong-gian-title"
        className="mt-12 grid scroll-mt-28 gap-8 border-t-2 border-double border-line-strong/70 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12"
      >
        <div>
          <h2 id="khong-gian-title" className="text-3xl md:text-4xl">
            Không gian phòng khám
          </h2>
          <ul className="mt-5 border-t border-dashed border-line-strong/50">
            {SPACES.map((s) => (
              <li key={s.title} className="border-b border-dashed border-line-strong/50 py-4">
                <h3 className="text-xl">{s.title}</h3>
                <p className="mt-1 text-ink-muted">{s.text}</p>
              </li>
            ))}
          </ul>
          <ul className="mt-5 flex flex-col gap-1">
            <li>{SITE.address}</li>
            <li>
              <a href={SITE.mapsHref} target="_blank" rel="noopener noreferrer" className={LINK}>
                Chỉ đường
              </a>
            </li>
            <li>{SITE.openingHours}</li>
            <li>
              <a href={SITE.hotlineHref} className={LINK}>
                Hotline / Zalo: {SITE.hotline}
              </a>
            </li>
          </ul>
        </div>
        <figure className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="label-frame paper-fiber bg-surface p-2 shadow-card">
            <SafeImage src="/images/hero/can-thuoc.svg" alt="" className="aspect-[6/5] w-full object-contain" />
          </div>
          <figcaption className="mt-2 text-label text-ink-muted">Hình minh họa</figcaption>
        </figure>
      </section>

      <section id="giay-phep" aria-labelledby="giay-phep-title" className="mt-12 scroll-mt-28">
        <div className="label-frame paper-fiber relative bg-surface px-5 pt-10 pb-6 shadow-card md:px-10 md:py-10">
          <Seal className="absolute -top-6 right-5 size-16 rotate-6" />
          <h2 id="giay-phep-title" className="text-3xl md:text-4xl">
            Giấy phép & chứng chỉ hành nghề
          </h2>
          <ul className="mt-5 flex flex-col border-t border-dashed border-line-strong/60">
            {[LEGAL_INFO.clinicLicense, LEGAL_INFO.practitionerLicense, LEGAL_INFO.businessLicense].map((l) => (
              <li key={l} className="border-b border-dashed border-line-strong/60 py-3 break-words">
                {l}
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-xl">Chứng chỉ hành nghề của lương y</h3>
          <ul className="mt-1">
            {doctors.map((d) => (
              <li key={d.id} className="flex flex-col py-1 break-words sm:flex-row sm:items-center sm:gap-3">
                <Link href={`/luong-y#${d.slug}`} className={LINK}>
                  {d.name}
                </Link>
                <span className="text-ink-muted">CCHN số {d.licenseNumber}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-label text-ink-muted">{LEGAL_INFO.productNotice}</p>
        </div>
      </section>

      <section className="mt-12 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/dat-lich" size="lg">
          Đặt lịch tư vấn
        </ButtonLink>
        <ButtonLink href="/luong-y" variant="outline" size="lg">
          Xem hồ sơ lương y
        </ButtonLink>
      </section>

      <DisclaimerBox variant="general" className="mt-8" />
    </Container>
  );
}
