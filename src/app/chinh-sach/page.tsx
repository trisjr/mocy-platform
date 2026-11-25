import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout";
import { DisclaimerBox } from "@/components/ui";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Chính sách",
  description:
    "Chính sách giao hàng, đóng gói, đổi trả và bảo mật thông tin khách hàng của nhà thuốc Đông y Mộc Y.",
};

const SECTIONS = [
  {
    id: "giao-hang",
    title: "Giao hàng & đóng gói",
    items: [
      `Giao hàng toàn quốc. Phí giao ${formatPrice(SHIPPING_FEE)}/đơn, miễn phí cho đơn từ ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`,
      "Nội thành Hà Nội nhận trong ngày, các tỉnh khác 2–4 ngày (mẫu).",
      "Dược liệu và thuốc thang được sấy lại, đóng túi zip kèm gói hút ẩm.",
      "Thuốc sắc sẵn đóng túi hút chân không, xếp trong thùng xốp chống va đập. Khi nhận, anh/chị cho ngay vào ngăn mát tủ lạnh và dùng trong 7 ngày.",
      "Anh/chị được kiểm tra hàng trước khi thanh toán với đơn thanh toán khi nhận hàng (COD).",
    ],
  },
  {
    id: "doi-tra",
    title: "Đổi trả & hoàn tiền",
    items: [
      "Nhà thuốc đổi mới hoặc hoàn tiền khi dược liệu bị ẩm mốc, hư hỏng do vận chuyển, hoặc giao sai, thiếu so với đơn.",
      `Anh/chị báo trong 48 giờ kể từ khi nhận hàng (mẫu), kèm ảnh hoặc video lúc mở hàng, qua hotline/Zalo ${SITE.hotline}.`,
      "Tiền hoàn chuyển về tài khoản của anh/chị trong 3 ngày làm việc (mẫu) sau khi nhà thuốc xác nhận.",
      "Thuốc thang đã bốc hoặc đã sắc theo thể trạng riêng không đổi trả vì lý do đổi ý, do không bán lại được cho người khác.",
    ],
  },
  {
    id: "bao-mat",
    title: "Bảo mật thông tin",
    items: [
      "Nhà thuốc chỉ thu thập thông tin cần cho việc tư vấn và giao hàng: họ tên, số điện thoại, địa chỉ, triệu chứng và ảnh đơn thuốc anh/chị gửi.",
      "Triệu chứng và đơn thuốc chỉ lương y và nhân viên phụ trách được xem.",
      "Đơn vị vận chuyển chỉ nhận họ tên, số điện thoại và địa chỉ giao hàng.",
      "Nhà thuốc không bán hay chia sẻ thông tin của anh/chị cho bên khác vì mục đích quảng cáo.",
      `Anh/chị có thể yêu cầu xem, sửa hoặc xóa thông tin của mình qua hotline ${SITE.hotline}.`,
    ],
  },
];

const LINK = "inline-flex min-h-12 items-center font-semibold text-herb-700 underline decoration-2 underline-offset-4";

export default function PolicyPage() {
  return (
    <Container className="py-8 sm:py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl">Chính sách</h1>
        <nav aria-label="Mục lục chính sách" className="mt-4">
          <ul className="flex flex-wrap gap-x-6">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <Link href={`#${s.id}`} className={LINK}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {SECTIONS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-title`}
            className="mt-10 scroll-mt-28 border-t-2 border-double border-line-strong/70 pt-8"
          >
            <h2 id={`${s.id}-title`} className="text-3xl md:text-4xl">
              {s.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-3 text-lg">
              {s.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rotate-45 bg-bronze-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-10 text-label text-ink-muted">
          Nội dung chính sách là bản mẫu cho bản demo, sẽ cập nhật theo quy định thực tế của nhà thuốc. Trang
          quản trị trong bản demo mở công khai để trình diễn; bản chính thức có đăng nhập và phân quyền.
        </p>
        <DisclaimerBox variant="general" className="mt-4" />
      </div>
    </Container>
  );
}
