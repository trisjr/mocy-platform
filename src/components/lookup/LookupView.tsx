"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { SummaryList } from "@/components/booking/SummaryList";
import { Badge, Button, Input } from "@/components/ui";
import { getDoctorById } from "@/lib/catalog";
import {
  APPOINTMENT_STATUS_META,
  CONSULT_MODE_LABELS,
  CONSULT_STATUS_META,
  ORDER_STATUS_FLOW,
  ORDER_STATUS_META,
  PAYMENT_METHOD_LABELS,
  SITE,
  type Tone,
} from "@/lib/constants";
import { formatDate, formatDateKey, formatDateTime, formatPrice } from "@/lib/format";
import { codeKind, findMatches, maskPhone, parseLookupInput, shortName, type LookupMatches } from "@/lib/lookup";
import { useAppointments, useConsultRequests, useHydrated, useOrders } from "@/lib/store";
import type { Appointment, ConsultRequest, Order } from "@/types";

const LINK = "inline-flex min-h-12 items-center font-semibold text-herb-700 underline decoration-2 underline-offset-4";

/**
 * Form và kết quả tra cứu: mã lấy từ `?ma=`, số điện thoại chỉ giữ trong state (không ghi lên URL).
 * Tiêu đề trang nằm ở page.tsx để có trong HTML tĩnh.
 */
export function LookupView() {
  const router = useRouter();
  const urlCode = useSearchParams().get("ma");
  const hydrated = useHydrated();
  const orders = useOrders();
  const appointments = useAppointments();
  const consults = useConsultRequests();

  const [value, setValue] = useState(urlCode ?? "");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState<string | null>(null);
  // Ô nhập theo mã trên URL khi điều hướng (VD bấm một dòng trong danh sách theo SĐT, hoặc Back).
  const [syncedCode, setSyncedCode] = useState(urlCode);
  if (urlCode !== syncedCode) {
    setSyncedCode(urlCode);
    if (urlCode) setValue(urlCode);
  }

  const parsedUrl = urlCode ? parseLookupInput(urlCode) : null;
  const code = parsedUrl && "code" in parsedUrl && codeKind(parsedUrl.code) ? parsedUrl.code : null;
  const badUrlCode = urlCode && !code ? urlCode.trim() : null;
  const data: LookupMatches = useMemo(() => ({ orders, appointments, consults }), [orders, appointments, consults]);
  const byCode = useMemo(() => (code ? findMatches({ type: "code", code }, data) : null), [code, data]);
  const byPhone = useMemo(() => (phone ? findMatches({ type: "phone", phone }, data) : null), [phone, data]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = parseLookupInput(value);
    if ("error" in q) {
      setError(q.error);
      setPhone(null);
      if (urlCode) router.replace("/tra-cuu", { scroll: false });
      return;
    }
    setError("");
    if (q.type === "code") {
      setPhone(null);
      router.replace(`/tra-cuu?ma=${q.code}`, { scroll: false });
    } else {
      setPhone(q.phone);
      router.replace("/tra-cuu", { scroll: false });
    }
  }

  let content: ReactNode = null;
  if (!hydrated) {
    if (urlCode || phone) content = <p className="text-lg text-ink-muted">Đang tải…</p>;
  } else if (code && byCode) {
    content = <CodeResult code={code} matches={byCode} />;
  } else if (badUrlCode) {
    content = <NotFound what={`mã ${badUrlCode}`} />;
  } else if (phone && byPhone) {
    content = <PhoneResult phone={phone} matches={byPhone} />;
  }

  return (
    <>
      <form noValidate onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <Input
          name="q"
          label="Mã đơn, mã lịch hẹn hoặc số điện thoại"
          placeholder="VD DH2611S21 hoặc 0901 234 567"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={error || undefined}
          wrapperClassName="flex-1"
        />
        <Button type="submit" size="lg" className="sm:mt-8">
          Tra cứu
        </Button>
      </form>

      {/* Vùng live luôn có trong DOM để trình đọc màn hình đọc kết quả mới. */}
      <div aria-live="polite">{content}</div>

      <p className="text-label text-ink-muted">
        Trạng thái tự cập nhật khi nhà thuốc xử lý, không cần tải lại trang.
      </p>
    </>
  );
}

function NotFound({ what }: { what: string }) {
  return (
    <section
      id="ket-qua"
      className="label-frame paper-fiber bg-surface px-5 py-8 text-center shadow-card sm:px-10"
    >
      <h2 className="text-2xl md:text-3xl">Không tìm thấy</h2>
      <p className="mt-2 text-ink-muted">
        Không tìm thấy {what} trên thiết bị này. Anh/chị kiểm tra lại hoặc gọi{" "}
        <a href={SITE.hotlineHref} className={LINK}>
          {SITE.hotline}
        </a>{" "}
        để được hỗ trợ.
      </p>
    </section>
  );
}

function CodeResult({ code, matches }: { code: string; matches: LookupMatches }) {
  const order = matches.orders[0];
  const appointment = matches.appointments[0];
  const consult = matches.consults[0];
  if (!order && !appointment && !consult) return <NotFound what={`mã ${code}`} />;
  return (
    <section
      id="ket-qua"
      aria-labelledby="ket-qua-title"
      className="label-frame paper-fiber bg-surface px-5 py-7 shadow-card sm:px-10"
    >
      {order ? <OrderDetail order={order} /> : appointment ? <AppointmentDetail appointment={appointment} /> : <ConsultDetail consult={consult} />}
    </section>
  );
}

function DetailHead({ kind, code, tone, label }: { kind: string; code: string; tone: Tone; label: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-line-strong/60 pb-4">
      <h2 id="ket-qua-title" className="text-2xl md:text-3xl">
        {kind} <span className="tabular-nums">{code}</span>
      </h2>
      <Badge tone={tone}>{label}</Badge>
    </div>
  );
}

function OrderDetail({ order }: { order: Order }) {
  const meta = ORDER_STATUS_META[order.status];
  const current = ORDER_STATUS_FLOW.indexOf(order.status);
  return (
    <>
      <DetailHead kind="Đơn hàng" code={order.code} tone={meta.tone} label={meta.label} />
      <h3 className="mt-5 text-xl">Tiến độ xử lý</h3>
      <ol className="mt-3 flex flex-col gap-3">
        {ORDER_STATUS_FLOW.map((status, i) => {
          const at = order.statusHistory.find((h) => h.status === status)?.at;
          const done = i <= current;
          return (
            <li
              key={status}
              aria-current={i === current ? "step" : undefined}
              className={done ? "flex gap-3" : "flex gap-3 text-ink-muted"}
            >
              <span
                aria-hidden="true"
                className={
                  "mt-1.5 size-3 shrink-0 rotate-45 border-2 " +
                  (i === current ? "border-herb-700 bg-herb-700" : done ? "border-herb-700" : "border-line-strong")
                }
              />
              <span>
                <span className={i === current ? "font-semibold" : undefined}>{ORDER_STATUS_META[status].label}</span>
                {done && at && <span className="block text-label text-ink-muted">{formatDateTime(at)}</span>}
              </span>
            </li>
          );
        })}
      </ol>
      <SummaryList
        rows={[
          {
            label: "Sản phẩm",
            value: (
              <ul>
                {order.items.map((i) => (
                  <li key={i.productId + i.variantId}>
                    {i.productName} ({i.variantLabel}) × {i.quantity}
                  </li>
                ))}
              </ul>
            ),
          },
          { label: "Tổng tiền", value: <span className="tabular-nums">{formatPrice(order.total)}</span> },
          { label: "Thanh toán", value: PAYMENT_METHOD_LABELS[order.paymentMethod] },
          { label: "Người nhận", value: `${shortName(order.shipping.name)}, ${maskPhone(order.shipping.phone)}` },
          { label: "Đặt lúc", value: formatDateTime(order.createdAt) },
        ]}
      />
    </>
  );
}

function AppointmentDetail({ appointment }: { appointment: Appointment }) {
  const meta = APPOINTMENT_STATUS_META[appointment.status];
  const doctor = getDoctorById(appointment.doctorId);
  return (
    <>
      <DetailHead kind="Lịch hẹn" code={appointment.code} tone={meta.tone} label={meta.label} />
      <SummaryList
        rows={[
          { label: "Thời gian", value: `${appointment.time}, ${formatDateKey(appointment.date)}` },
          { label: "Lương y", value: doctor ? doctor.name : "Đang cập nhật" },
          { label: "Hình thức", value: CONSULT_MODE_LABELS[appointment.mode] },
          { label: "Khách hàng", value: `${shortName(appointment.customer.name)}, ${maskPhone(appointment.customer.phone)}` },
          { label: "Cập nhật lúc", value: formatDateTime(appointment.updatedAt) },
        ]}
      />
      {appointment.status === "cancelled" && (
        <p className="mt-4 text-ink-muted">
          Lịch hẹn đã hủy. Anh/chị muốn đặt lại, vui lòng gọi{" "}
          <a href={SITE.hotlineHref} className={LINK}>
            {SITE.hotline}
          </a>{" "}
          hoặc{" "}
          <Link href="/dat-lich" className={LINK}>
            đặt lịch mới
          </Link>
          .
        </p>
      )}
    </>
  );
}

function ConsultDetail({ consult }: { consult: ConsultRequest }) {
  const meta = CONSULT_STATUS_META[consult.status];
  return (
    <>
      <DetailHead kind="Yêu cầu tư vấn" code={consult.code} tone={meta.tone} label={meta.label} />
      <SummaryList
        rows={[
          { label: "Bài thuốc quan tâm", value: consult.productName ?? "Tư vấn chung" },
          { label: "Khách hàng", value: `${shortName(consult.customer.name)}, ${maskPhone(consult.customer.phone)}` },
          { label: "Gửi lúc", value: formatDateTime(consult.createdAt) },
        ]}
      />
    </>
  );
}

interface Row {
  kind: string;
  code: string;
  /** Để sắp xếp: mới tạo nhất trước. */
  createdAt: string;
  /** Dòng ngày có nhãn, VD "Đặt ngày 24/11/2026" hoặc "Hẹn 09:00, Thứ 4, 25/11/2026". */
  when: string;
  tone: Tone;
  label: string;
}

function PhoneResult({ phone, matches }: { phone: string; matches: LookupMatches }) {
  const rows: Row[] = [
    ...matches.orders.map((o) => ({
      kind: "Đơn hàng",
      code: o.code,
      createdAt: o.createdAt,
      when: `Đặt ngày ${formatDate(o.createdAt)}`,
      ...ORDER_STATUS_META[o.status],
    })),
    ...matches.appointments.map((a) => ({
      kind: "Lịch hẹn",
      code: a.code,
      createdAt: a.createdAt,
      when: `Hẹn ${a.time}, ${formatDateKey(a.date)}`,
      ...APPOINTMENT_STATUS_META[a.status],
    })),
    ...matches.consults.map((c) => ({
      kind: "Yêu cầu tư vấn",
      code: c.code,
      createdAt: c.createdAt,
      when: `Gửi ngày ${formatDate(c.createdAt)}`,
      ...CONSULT_STATUS_META[c.status],
    })),
  ].sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));

  if (rows.length === 0) return <NotFound what={`đơn hàng hay lịch hẹn nào của số ${maskPhone(phone)}`} />;
  return (
    <section id="ket-qua" aria-labelledby="ket-qua-title">
      <h2 id="ket-qua-title" className="text-2xl md:text-3xl">
        Kết quả cho số {maskPhone(phone)}
      </h2>
      <p className="mt-1 text-ink-muted">Chọn một dòng để xem chi tiết.</p>
      <ul className="mt-4 border-t border-dashed border-line-strong/60">
        {rows.map((r) => (
          <li key={r.code} className="border-b border-dashed border-line-strong/60">
            <Link
              href={`/tra-cuu?ma=${r.code}`}
              className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 hover:bg-paper-100"
            >
              <span>
                <span className="font-semibold">{r.kind}</span>{" "}
                <span className="tabular-nums text-herb-700 underline underline-offset-4">{r.code}</span>
                <span className="block text-label text-ink-muted">{r.when}</span>
              </span>
              <Badge tone={r.tone}>{r.label}</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
