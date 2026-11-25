import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout";
import { Badge, ButtonLink, DisclaimerBox, SafeImage, Seal } from "@/components/ui";
import { articles, doctors, testimonials } from "@/data";
import { CONSULT_MODE_LABELS, LEGAL_INFO, WEEKDAY_LABELS } from "@/lib/constants";
import type { Doctor } from "@/types";

export const metadata: Metadata = {
  title: "Đội ngũ lương y",
  description: "Hồ sơ lương y, bác sĩ Y học cổ truyền của Mộc Y: chuyên môn, chứng chỉ hành nghề và lịch khám.",
};

/** Ngày làm việc xếp từ Thứ 2 đến Chủ nhật (dữ liệu lưu 0 = Chủ nhật, không theo thứ tự). */
function workingDays(doctor: Doctor) {
  return [...doctor.schedule.weekdays].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)).map((d) => WEEKDAY_LABELS[d]);
}

/** Gom giờ hẹn theo buổi; mỗi buổi in giờ hẹn sớm nhất và muộn nhất (là giờ bắt đầu, không phải giờ kết thúc). */
function slotSessions(doctor: Doctor) {
  const sessions: { name: string; slots: string[] }[] = [];
  for (const slot of doctor.schedule.slots) {
    const hour = Number(slot.slice(0, 2));
    const name = hour < 12 ? "Sáng" : hour < 17 ? "Chiều" : "Tối";
    const last = sessions.at(-1);
    if (last?.name === name) last.slots.push(slot);
    else sessions.push({ name, slots: [slot] });
  }
  return sessions.map(({ name, slots }) => `${name} ${slots[0]}${slots.length > 1 ? ` – ${slots.at(-1)}` : ""}`);
}

export default function DoctorsPage() {
  return (
    <Container className="py-8 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl">Đội ngũ lương y</h1>
        <p className="mt-3 text-lg text-ink-muted">
          Lương y, bác sĩ Y học cổ truyền có chứng chỉ hành nghề, bắt mạch và gia giảm bài thuốc theo thể trạng từng
          người. Khám trực tuyến qua Zalo, video hoặc tại phòng khám.
        </p>
        <nav aria-label="Chọn lương y" className="mt-4">
          <ul className="flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-6">
            {doctors.map((d) => (
              <li key={d.id}>
                <a
                  href={`#${d.slug}`}
                  className="inline-flex min-h-12 items-center font-semibold text-herb-700 underline decoration-2 underline-offset-4"
                >
                  {d.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="mt-8 border-t-2 border-double border-line-strong/70">
        {doctors.map((d) => (
          <DoctorProfile key={d.id} doctor={d} />
        ))}
      </div>

      <section className="label-frame paper-fiber relative mt-12 bg-surface px-5 pt-8 pb-6 shadow-card md:flex md:items-center md:justify-between md:gap-8 md:px-10 md:py-10">
        <Seal className="absolute -top-6 right-5 size-16 rotate-6" />
        <div>
          <h2 className="text-3xl md:text-4xl">Chưa biết nên chọn lương y nào?</h2>
          <p className="mt-2 max-w-xl text-lg">
            Chọn nhóm triệu chứng khi đặt lịch, hệ thống sẽ gợi ý lương y nhận khám đúng nhu cầu của anh/chị.
          </p>
        </div>
        <ButtonLink href="/dat-lich" size="lg" className="mt-5 w-full shrink-0 md:mt-0 md:w-auto">
          Đặt lịch tư vấn
        </ButtonLink>
      </section>

      <p className="mt-8 text-label text-ink-muted">{LEGAL_INFO.practitionerLicense}</p>
      <DisclaimerBox variant="general" className="mt-4" />
    </Container>
  );
}

function DoctorProfile({ doctor }: { doctor: Doctor }) {
  const reviewed = articles.filter((a) => a.reviewedByDoctorId === doctor.id);
  const quote = testimonials.find((t) => t.doctorId === doctor.id);
  const facts = [
    { label: "Hình thức khám", value: doctor.consultModes.map((m) => CONSULT_MODE_LABELS[m]).join(", ") },
    { label: "Ngày làm việc", value: workingDays(doctor).join(", ") },
    { label: "Giờ hẹn", value: slotSessions(doctor).join("; ") },
    { label: "Chứng chỉ hành nghề", value: `CCHN số ${doctor.licenseNumber}` },
  ];

  return (
    <article
      id={doctor.slug}
      aria-labelledby={`${doctor.slug}-name`}
      className="grid scroll-mt-28 gap-6 border-b border-line-strong/60 py-8 sm:grid-cols-[11rem_minmax(0,1fr)] md:grid-cols-[15rem_minmax(0,1fr)] md:gap-10 md:py-12"
    >
      <div className="w-40 self-start bg-paper-200 p-1.5 shadow-[0_0_0_1px_var(--color-line-strong)] sm:w-auto">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-50">
          <SafeImage src={doctor.avatar} alt={`Chân dung ${doctor.name}`} className="absolute inset-0 size-full object-top" />
        </div>
      </div>

      <div className="min-w-0">
        <h2 id={`${doctor.slug}-name`} className="text-3xl md:text-4xl">
          {doctor.name}
        </h2>
        <p className="mt-1 text-lg font-semibold text-herb-700">{doctor.experienceYears} năm kinh nghiệm</p>
        {doctor.specialties.length > 0 && (
          <ul aria-label="Chuyên môn" className="mt-3 flex flex-wrap gap-2">
            {doctor.specialties.map((s) => (
              <li key={s}>
                <Badge tone="herb">{s}</Badge>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 max-w-3xl text-lg">{doctor.bio}</p>

        <dl className="mt-5 grid max-w-3xl border-t border-dashed border-line-strong/60 md:grid-cols-[12rem_minmax(0,1fr)]">
          {facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="pt-3 font-semibold md:border-b md:border-dashed md:border-line-strong/60 md:pb-3">{f.label}</dt>
              <dd className="border-b border-dashed border-line-strong/60 pb-3 text-ink-muted md:pt-3">{f.value}</dd>
            </div>
          ))}
        </dl>

        {quote && (
          <figure className="mt-6 max-w-3xl border-l-4 border-bronze-500 pl-4">
            <blockquote className="font-heading text-xl leading-snug italic">“{quote.content}”</blockquote>
            <figcaption className="mt-2 text-label text-ink-muted">
              {quote.name}
              {quote.age ? `, ${quote.age} tuổi` : ""}, {quote.location}
            </figcaption>
          </figure>
        )}

        {reviewed.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl">Bài viết đã kiểm duyệt</h3>
            <ul className="mt-1">
              {reviewed.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/kien-thuc/${a.slug}`}
                    className="inline-flex min-h-12 items-center py-1 font-semibold text-herb-700 underline decoration-2 underline-offset-4"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ButtonLink
          href={`/dat-lich?luong-y=${doctor.slug}`}
          size="lg"
          className="mt-6 w-full sm:w-auto"
          aria-label={`Đặt lịch khám với ${doctor.name}`}
        >
          Đặt lịch khám
        </ButtonLink>
      </div>
    </article>
  );
}
