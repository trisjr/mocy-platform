"use client";

import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout";
import { Badge, ButtonLink, Slip } from "@/components/ui";
import { getDoctorById, getSymptomGroupById } from "@/lib/catalog";
import { APPOINTMENT_STATUS_META, CONSULT_MODE_LABELS, ONLINE_CHANNEL_LABELS, SITE } from "@/lib/constants";
import { formatDateKey, formatPhone } from "@/lib/format";
import { useAppointment, useHydrated } from "@/lib/store";
import { SummaryList } from "./SummaryList";

const COMMON_PREP = [
  "Chuẩn bị đơn thuốc, kết quả xét nghiệm hoặc kết quả khám cũ (nếu có).",
  "Ghi lại triệu chứng: bắt đầu từ khi nào, ăn ngủ, đại tiểu tiện ra sao.",
  "Liệt kê các thuốc và thực phẩm chức năng bạn đang dùng.",
];
const ONLINE_PREP = [
  "Giữ điện thoại có Zalo hoặc mạng ổn định, mở máy trước giờ hẹn 5 phút.",
  "Chọn nơi yên tĩnh, đủ sáng để lương y quan sát sắc mặt và lưỡi.",
  "Trước khi gọi, tránh ăn đồ có màu đậm (cà phê, trà đặc, nước ngọt có màu) vì ảnh hưởng đến việc xem lưỡi.",
];
const CLINIC_PREP = [
  "Đến trước giờ hẹn khoảng 10 phút để làm thủ tục.",
  "Không ăn quá no hoặc uống cà phê, trà đặc trước khi khám để bắt mạch và xem lưỡi chính xác.",
  "Mặc quần áo rộng, dễ xắn tay để lương y bắt mạch.",
];

export function BookingConfirmation() {
  const params = useSearchParams();
  const code = params.get("ma");
  const hydrated = useHydrated();
  const appointment = useAppointment(code);

  if (!hydrated) {
    return (
      <Container className="py-16 text-center">
        <p className="text-lg text-ink-muted">Đang tải thông tin lịch hẹn...</p>
      </Container>
    );
  }

  if (!appointment) {
    return (
      <Container className="py-16">
        <div className="label-frame paper-fiber mx-auto max-w-xl bg-surface px-6 py-10 text-center shadow-card">
          <h1 className="text-3xl md:text-4xl">Không tìm thấy lịch hẹn</h1>
          <p className="mt-2 text-ink-muted">
            Mã lịch hẹn không đúng hoặc dữ liệu đã được xóa. Bạn có thể đặt lịch mới hoặc gọi {SITE.hotline} để được hỗ trợ.
          </p>
          <ButtonLink href="/dat-lich" size="lg" className="mt-5">Đặt lịch mới</ButtonLink>
        </div>
      </Container>
    );
  }

  const doctor = getDoctorById(appointment.doctorId);
  const group = getSymptomGroupById(appointment.symptomGroupId);
  const status = APPOINTMENT_STATUS_META[appointment.status];
  const isOnline = appointment.mode === "online";
  const prep = [...COMMON_PREP, ...(isOnline ? ONLINE_PREP : CLINIC_PREP)];

  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        {/* Phiếu hẹn: cuống có mã, giờ hẹn và dấu son; thân phiếu là thông tin lịch hẹn */}
        <Slip
          title="Đặt lịch thành công"
          lead="Mã lịch hẹn của bạn"
          code={appointment.code}
          meta={
            <>
              <p className="font-heading text-2xl font-bold">
                {appointment.time}, {formatDateKey(appointment.date)}
              </p>
              <Badge tone={status.tone}>{status.label}</Badge>
              <p className="text-ink-muted">
                Lương y sẽ gọi xác nhận qua số {formatPhone(appointment.customer.phone)}. Hãy lưu lại mã lịch hẹn này.
              </p>
            </>
          }
        >
          <section aria-labelledby="thong-tin-hen" className="px-5 py-7 sm:px-10">
            <h2 id="thong-tin-hen" className="text-2xl md:text-3xl">
              Thông tin lịch hẹn
            </h2>
            <SummaryList
              rows={[
                { label: "Khách hàng", value: appointment.customer.name },
                { label: "Số điện thoại", value: formatPhone(appointment.customer.phone) },
                { label: "Lương y", value: doctor ? doctor.name : "Đang cập nhật" },
                { label: "Thời gian", value: `${appointment.time}, ${formatDateKey(appointment.date)}` },
                {
                  label: "Hình thức",
                  value: isOnline
                    ? `${CONSULT_MODE_LABELS.online} (${appointment.onlineChannel ? ONLINE_CHANNEL_LABELS[appointment.onlineChannel] : "Zalo"})`
                    : `${CONSULT_MODE_LABELS.clinic}, ${SITE.address}`,
                },
                ...(group ? [{ label: "Nhóm triệu chứng", value: group.name }] : []),
                ...(appointment.symptoms ? [{ label: "Triệu chứng bạn mô tả", value: appointment.symptoms }] : []),
              ]}
            />
          </section>
        </Slip>

        {/* Lời dặn trước khi khám, in như tờ dặn dò kèm phiếu */}
        <section
          aria-labelledby="chuan-bi"
          className="paper-fiber border-y-2 border-double border-line-strong/70 bg-surface/80 px-5 py-6 sm:px-8"
        >
          <h2 id="chuan-bi" className="text-2xl md:text-3xl">
            Chuẩn bị trước khi khám
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-lg">
            {prep.map((p) => (
              <li key={p} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rotate-45 bg-bronze-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-dashed border-line-strong/60 pt-4 text-ink-muted">
            Cần đổi giờ hoặc hủy lịch, vui lòng gọi{" "}
            <a href={SITE.hotlineHref} className="inline-flex min-h-12 items-center font-semibold text-herb-700 underline">
              {SITE.hotline}
            </a>
            .
          </p>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Về trang chủ
          </ButtonLink>
          <ButtonLink href={`/tra-cuu?ma=${appointment.code}`} variant="outline" size="lg">
            Theo dõi lịch hẹn
          </ButtonLink>
          <ButtonLink href="/kien-thuc" variant="outline" size="lg">
            Đọc kiến thức Đông y
          </ButtonLink>
          <ButtonLink href="/dat-lich" variant="ghost" size="lg">
            Đặt thêm lịch khác
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
