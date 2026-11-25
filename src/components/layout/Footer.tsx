import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { GENERAL_DISCLAIMER, LEGAL_INFO, SITE } from "@/lib/constants";
import { Container } from "./Container";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/san-pham", label: "Sản phẩm & Dược liệu" },
  { href: "/dat-lich", label: "Đặt lịch tư vấn" },
  { href: "/kien-thuc", label: "Kiến thức Đông y" },
  { href: "/gio-hang", label: "Giỏ hàng" },
  { href: "/admin", label: "Trang quản trị (demo)" },
];

export function Footer() {
  return (
    <footer className="bg-wood-900 text-wood-100">
      <Container className="grid gap-10 py-12 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Logo inverted />
          <p>{SITE.tagline}. Khám, tư vấn và bốc thuốc theo thể trạng từng người.</p>
        </div>
        <div>
          <h2 className="mb-4 text-lg text-paper-50">Liên hệ</h2>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-bronze-300" />
              {SITE.address}
            </li>
            <li>
              <a href={SITE.hotlineHref} className="flex gap-3 font-semibold text-paper-50 hover:underline">
                <Phone aria-hidden="true" className="mt-1 size-5 shrink-0 text-bronze-300" />
                Hotline / Zalo: {SITE.hotline}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail aria-hidden="true" className="mt-1 size-5 shrink-0 text-bronze-300" />
              {SITE.email}
            </li>
            <li className="flex gap-3">
              <Clock aria-hidden="true" className="mt-1 size-5 shrink-0 text-bronze-300" />
              {SITE.openingHours}
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-lg text-paper-50">Liên kết</h2>
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex min-h-12 items-center hover:text-paper-50 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-wood-700">
        <Container className="flex flex-col gap-3 py-6 text-sm">
          <h2 className="flex items-center gap-2 font-sans text-base font-semibold text-paper-50">
            <ShieldCheck aria-hidden="true" className="size-5 text-bronze-300" />
            Thông tin pháp lý
          </h2>
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
