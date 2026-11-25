import Link from "next/link";
import { GENERAL_DISCLAIMER, LEGAL_INFO, SITE } from "@/lib/constants";
import { Container } from "./Container";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/gioi-thieu", label: "Về Mộc Y" },
  { href: "/san-pham", label: "Sản phẩm & Dược liệu" },
  { href: "/dat-lich", label: "Đặt lịch tư vấn" },
  { href: "/luong-y", label: "Đội ngũ lương y" },
  { href: "/kien-thuc", label: "Kiến thức Đông y" },
  { href: "/gio-hang", label: "Giỏ hàng" },
  { href: "/admin", label: "Trang quản trị (demo)" },
];

/**
 * Footer nền gỗ trầm. Trên điện thoại có khoảng đệm đáy bằng chiều cao nav đáy (+ vùng an toàn)
 * để dòng cuối không bị nav che.
 */
export function Footer() {
  return (
    <footer className="on-dark bg-wood-800 pb-[calc(4.5rem+env(safe-area-inset-bottom))] text-wood-100 md:pb-0">
      <div aria-hidden="true" className="fret border-b border-wood-700" />
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Logo inverted />
          <p>{SITE.tagline}. Khám, tư vấn và bốc thuốc theo thể trạng từng người.</p>
        </div>
        <div>
          <h2 className="mb-3 text-xl text-paper-50">Liên hệ</h2>
          <ul className="flex flex-col gap-2">
            <li>{SITE.address}</li>
            <li>
              <a
                href={SITE.hotlineHref}
                className="inline-flex min-h-12 items-center font-semibold text-paper-50 underline decoration-bronze-500 decoration-2 underline-offset-4 hover:text-bronze-200"
              >
                Hotline / Zalo: {SITE.hotline}
              </a>
            </li>
            <li>{SITE.email}</li>
            <li>{SITE.openingHours}</li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-xl text-paper-50">Liên kết</h2>
          <ul className="flex flex-col border-t border-wood-600">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-wood-700">
                <Link href={l.href} className="flex min-h-12 items-center hover:text-bronze-200 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-wood-700">
        <Container className="flex flex-col gap-3 py-6 text-label">
          <h2 className="font-sans text-base font-semibold text-paper-50">Thông tin pháp lý</h2>
          <ul className="flex flex-col gap-1.5">
            <li>{LEGAL_INFO.clinicLicense}</li>
            <li>{LEGAL_INFO.practitionerLicense}</li>
            <li>{LEGAL_INFO.businessLicense}</li>
            <li>{LEGAL_INFO.productNotice}</li>
          </ul>
          <p className="italic">{GENERAL_DISCLAIMER}</p>
          <p className="pt-2 text-wood-200">© 2026 {SITE.name}. Bản demo giới thiệu giải pháp.</p>
        </Container>
      </div>
    </footer>
  );
}
