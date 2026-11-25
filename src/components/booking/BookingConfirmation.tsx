"use client";

import { CalendarCheck, CheckCircle2, ClipboardList, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout";
import { Badge, ButtonLink, Card } from "@/components/ui";
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
        <Card padding="lg" className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl">Không tìm thấy lịch hẹn</h1>
          <p className="mt-2 text-ink-muted">
            Mã lịch hẹn không đúng hoặc dữ liệu đã được xóa. Bạn có thể đặt lịch mới hoặc gọi {SITE.hotline} để được hỗ trợ.
          </p>
          <ButtonLink href="/dat-lich" size="lg" className="mt-5">Đặt lịch mới</ButtonLink>
        </Card>
      </Container>
    );
  }

  const doctor = getDoctorById(appointment.doctorId);
  const group = getSymptomGroupById(appointment.symptomGroupId);
  const status = APPOINTMENT_STATUS_META[appointment.status];
  const isOnline = appointment.mode === "online";
  const prep = [...COMMON_PREP, ...(isOnline ? ONLINE_PREP : CLINIC_PREP)];

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-card bg-herb-50 p-6 text-center sm:p-8">
          <CheckCircle2 aria-hidden="true" className="mx-auto size-14 text-herb-700" />
          <h1 className="mt-3 text-3xl">Đặt lịch thành công</h1>
          <p className="mt-2 text-lg text-ink-muted">Mã lịch hẹn của bạn</p>
          <p className="mt-1 font-mono text-4xl font-bold tracking-wider text-herb-800">{appointment.code}</p>
          <p className="mt-3">
            <Badge tone={status.tone}>{status.label}</Badge>
          </p>
          <p className="mt-3 text-ink-muted">
            Lương y sẽ gọi xác nhận qua số {formatPhone(appointment.customer.phone)}. Hãy lưu lại mã lịch hẹn này.
          </p>
        </div>

        <Card padding="lg" className="mt-6">
          <h2 className="text-2xl">Thông tin lịch hẹn</h2>
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
        </Card>

        <Card padding="lg" className="mt-6">
          <h2 className="flex items-center gap-2 text-2xl">
            <ClipboardList aria-hidden="true" className="size-6 text-herb-700" />
            Chuẩn bị trước khi khám
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-lg marker:text-herb-600">
            {prep.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-ink-muted">
            <Phone aria-hidden="true" className="size-5" />
            Cần đổi giờ hoặc hủy lịch, vui lòng gọi {SITE.hotline}.
          </p>
        </Card>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">Về trang chủ</ButtonLink>
          <ButtonLink href="/kien-thuc" variant="outline" size="lg">Đọc kiến thức Đông y</ButtonLink>
          <ButtonLink
            href="/dat-lich"
            variant="ghost"
            size="lg"
            icon={<CalendarCheck aria-hidden="true" className="size-5" />}
          >
            Đặt thêm lịch khác
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
