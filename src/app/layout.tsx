import type { Metadata, Viewport } from "next";
import { Alegreya, Be_Vietnam_Pro } from "next/font/google";
import { Footer, SiteShell } from "@/components/layout";
import { SITE } from "@/lib/constants";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Alegreya: font biến thiên (400–900), có nghiêng cho trích dẫn.
const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} – ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Mua dược liệu, trà thảo mộc, thuốc Đông y và đặt lịch tư vấn với lương y trực tuyến hoặc tại phòng khám.",
};

export const viewport: Viewport = {
  themeColor: "#3b2416",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${alegreya.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteShell footer={<Footer />}>{children}</SiteShell>
      </body>
    </html>
  );
}
