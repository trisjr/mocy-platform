"use client";

import { CalendarCheck, ChevronLeft, ChevronRight, Hospital, Video } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { SafeImage } from "@/components/ui";
import { Container } from "@/components/layout";
import { Button, Card, ChoiceCard, Input, Stepper, Textarea } from "@/components/ui";
import { doctors, symptomGroups } from "@/data";
import { getDoctorById, getDoctorBySlug, getSymptomGroupById } from "@/lib/catalog";
import { CONSULT_MODE_LABELS, ONLINE_CHANNEL_LABELS, SITE, WEEKDAY_LABELS } from "@/lib/constants";
import { parseDateKey } from "@/lib/date";
import { formatDate, formatDateKey } from "@/lib/format";
import { getAvailableSlots, getUpcomingWorkingDates } from "@/lib/schedule";
import { createAppointment, StoreError, useHydrated, useStore } from "@/lib/store";
import { isValidPhone } from "@/lib/utils";
import type { ConsultMode, OnlineChannel } from "@/types";
import { PillOption } from "./PillOption";
import { SummaryList } from "./SummaryList";

const STEPS = ["Nhóm triệu chứng", "Hình thức", "Lương y", "Ngày & giờ", "Thông tin"];
const BOOKING_DAYS = 14;
const SLOT_TAKEN_MESSAGE = "Khung giờ này vừa có người đặt. Vui lòng chọn giờ khác.";

export function BookingFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const appointments = useStore((s) => s.appointments);

  const requestedDoctorParam = params.get("doctor") ?? params.get("luong-y");
  const requestedDoctor = useMemo(
    () => (requestedDoctorParam ? (getDoctorBySlug(requestedDoctorParam) ?? getDoctorById(requestedDoctorParam)) : undefined),
    [requestedDoctorParam],
  );

  const topRef = useRef<HTMLDivElement>(null);
  const [rawStep, setStep] = useState(0);
  const [groupId, setGroupId] = useState("");
  const [mode, setMode] = useState<ConsultMode | "">("");
  const [channel, setChannel] = useState<OnlineChannel>("zalo");
  const [doctorId, setDoctorId] = useState(requestedDoctor?.id ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const group = getSymptomGroupById(groupId);
  const eligibleDoctors = useMemo(
    () => (groupId && mode ? doctors.filter((d) => d.symptomGroupIds.includes(groupId) && d.consultModes.includes(mode)) : []),
    [groupId, mode],
  );
  const doctor = eligibleDoctors.find((d) => d.id === doctorId);
  const requestedIneligible = requestedDoctor && !doctor && doctorId === requestedDoctor.id;

  const dates = useMemo(() => (hydrated && doctor ? getUpcomingWorkingDates(doctor, BOOKING_DAYS) : []), [hydrated, doctor]);
  const slotsByDate = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (doctor) for (const d of dates) map[d] = getAvailableSlots(doctor, d, appointments);
    return map;
  }, [doctor, dates, appointments]);
  const slots = date ? (slotsByDate[date] ?? []) : [];
  const validTime = slots.includes(time) ? time : "";
  // Giờ đã chọn không còn trống (tab khác vừa đặt): đưa khách về bước chọn giờ, không để bước thông tin trống giờ.
  const slotLost = Boolean(time) && !validTime;
  const step = rawStep === 4 && slotLost ? 3 : rawStep;
  const slotNotice = submitError || (slotLost ? SLOT_TAKEN_MESSAGE : "");

  const canNext = [Boolean(group), Boolean(mode), Boolean(doctor), Boolean(date && validTime)][step] ?? false;

  function goTo(next: number) {
    setStep(next);
    setSubmitError("");
    topRef.current?.scrollIntoView({ block: "start" });
  }

  function resetSchedule() {
    setDate("");
    setTime("");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!doctor || !group || !mode || !date || !validTime) return;
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Vui lòng nhập họ và tên.";
    if (!phone.trim()) next.phone = "Vui lòng nhập số điện thoại.";
    else if (!isValidPhone(phone)) next.phone = "Số điện thoại gồm 10 chữ số, bắt đầu bằng số 0. Ví dụ: 0901 234 567.";
    setErrors(next);
    if (next.name || next.phone) return;

    setSubmitting(true);
    try {
      const appointment = createAppointment({
        symptomGroupId: group.id,
        mode,
        onlineChannel: mode === "online" ? channel : undefined,
        doctorId: doctor.id,
        date,
        time: validTime,
        customer: { name, phone },
        symptoms,
      });
      router.push(`/dat-lich/xac-nhan?ma=${appointment.code}`);
    } catch (err) {
      const message = err instanceof StoreError ? err.message : "Có lỗi xảy ra, vui lòng thử lại.";
      setSubmitError(message);
      setSubmitting(false);
      if (err instanceof StoreError && err.code === "SLOT_TAKEN") {
        setTime("");
        setStep(3);
        topRef.current?.scrollIntoView({ block: "start" });
      }
    }
  }

  return (
    <Container className="py-6 sm:py-10">
      <div ref={topRef} className="mx-auto max-w-3xl scroll-mt-24">
        <h1 className="text-3xl sm:text-4xl">Đặt lịch cùng lương y</h1>
        <p className="mt-2 text-lg text-ink-muted">Chỉ mất khoảng 2 phút. Bạn chỉ cần để lại họ tên và số điện thoại.</p>

        {requestedDoctor && (
          <p className="mt-4 rounded-xl bg-herb-50 p-3 text-herb-900">
            Bạn đang đặt lịch với <strong>{requestedDoctor.name}</strong>. Chọn nhóm triệu chứng và
            hình thức, hệ thống sẽ chọn sẵn lương y này nếu phù hợp.
          </p>
        )}

        <Stepper steps={STEPS} current={step} onStepClick={goTo} className="mt-6" />

        <Card padding="lg" className="mt-6">
          {step === 0 && (
            <section aria-labelledby="step-title">
              <h2 id="step-title" className="text-2xl">Bạn đang gặp vấn đề gì?</h2>
              <p className="mt-1 text-ink-muted">Chọn nhóm triệu chứng gần nhất để chúng tôi gợi ý đúng lương y.</p>
              {symptomGroups.length === 0 ? (
                <p className="mt-4 rounded-xl bg-paper-100 p-4">Danh sách nhóm triệu chứng đang được cập nhật. Vui lòng quay lại sau.</p>
              ) : (
                <div role="radiogroup" aria-label="Nhóm triệu chứng" className="mt-4 grid gap-3 sm:grid-cols-2">
                  {symptomGroups.map((g) => (
                    <ChoiceCard
                      key={g.id}
                      selected={g.id === groupId}
                      onSelect={() => {
                        setGroupId(g.id);
                        resetSchedule();
                      }}
                      title={g.name}
                      description={g.description}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {step === 1 && (
            <section aria-labelledby="step-title">
              <h2 id="step-title" className="text-2xl">Bạn muốn tư vấn bằng cách nào?</h2>
              <div role="radiogroup" aria-label="Hình thức tư vấn" className="mt-4 grid gap-3">
                <ChoiceCard
                  selected={mode === "online"}
                  onSelect={() => {
                    setMode("online");
                    resetSchedule();
                  }}
                  media={<Video aria-hidden="true" className="size-8 text-herb-700" />}
                  title={CONSULT_MODE_LABELS.online}
                  description="Lương y gọi hoặc nhắn cho bạn qua Zalo hoặc video, không cần đi lại."
                />
                <ChoiceCard
                  selected={mode === "clinic"}
                  onSelect={() => {
                    setMode("clinic");
                    resetSchedule();
                  }}
                  media={<Hospital aria-hidden="true" className="size-8 text-herb-700" />}
                  title={CONSULT_MODE_LABELS.clinic}
                  description={`Thăm khám trực tiếp, bắt mạch, xem lưỡi. Địa chỉ: ${SITE.address}`}
                />
              </div>
              {mode === "online" && (
                <div className="mt-5">
                  <p className="font-semibold">Bạn muốn gọi bằng kênh nào?</p>
                  <div role="radiogroup" aria-label="Kênh tư vấn trực tuyến" className="mt-2 flex flex-wrap gap-3">
                    {(Object.keys(ONLINE_CHANNEL_LABELS) as OnlineChannel[]).map((c) => (
                      <PillOption key={c} selected={channel === c} onSelect={() => setChannel(c)} className="px-5">
                        {ONLINE_CHANNEL_LABELS[c]}
                      </PillOption>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="step-title">
              <h2 id="step-title" className="text-2xl">Chọn lương y</h2>
              <p className="mt-1 text-ink-muted">
                Các lương y nhận khám nhóm &quot;{group?.name}&quot; theo hình thức &quot;{mode ? CONSULT_MODE_LABELS[mode] : ""}&quot;.
              </p>
              {requestedIneligible && (
                <p role="status" className="mt-3 rounded-xl bg-bronze-50 p-3 text-wood-900">
                  {requestedDoctor.name} chưa nhận nhóm triệu chứng hoặc hình thức bạn chọn. Vui lòng chọn
                  lương y khác bên dưới, hoặc quay lại đổi lựa chọn.
                </p>
              )}
              {eligibleDoctors.length === 0 ? (
                <div className="mt-4 rounded-xl bg-paper-100 p-4">
                  <p className="font-semibold">Chưa có lương y phù hợp với lựa chọn này.</p>
                  <p className="mt-1 text-ink-muted">Bạn thử đổi hình thức hoặc nhóm triệu chứng nhé.</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => goTo(1)}>Đổi hình thức</Button>
                    <Button variant="outline" onClick={() => goTo(0)}>Đổi nhóm triệu chứng</Button>
                  </div>
                </div>
              ) : (
                <div role="radiogroup" aria-label="Lương y" className="mt-4 grid gap-3">
                  {eligibleDoctors.map((d) => (
                    <ChoiceCard
                      key={d.id}
                      selected={d.id === doctorId}
                      onSelect={() => {
                        setDoctorId(d.id);
                        resetSchedule();
                      }}
                      media={
                        <span className="relative block size-16 overflow-hidden rounded-full bg-paper-100">
                          <SafeImage src={d.avatar} alt={d.name} className="absolute inset-0 size-full object-top" />
                        </span>
                      }
                      title={d.name}
                      description={
                        <>
                          <span className="block">{d.specialties.join(", ")}</span>
                          <span className="block">{d.experienceYears} năm kinh nghiệm</span>
                        </>
                      }
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="step-title">
              <h2 id="step-title" className="text-2xl">Chọn ngày và giờ khám</h2>
              {doctor && (
                <p className="mt-1 text-ink-muted">
                  Lịch của {doctor.name} trong {BOOKING_DAYS} ngày tới.
                </p>
              )}
              {slotNotice && (
                <p role="alert" className="mt-3 rounded-xl bg-danger-soft p-3 font-semibold text-danger">{slotNotice}</p>
              )}
              {!hydrated ? (
                <p className="mt-4 text-ink-muted">Đang tải lịch...</p>
              ) : dates.length === 0 ? (
                <p className="mt-4 rounded-xl bg-paper-100 p-4">Lương y chưa có lịch trong thời gian tới. Vui lòng chọn lương y khác.</p>
              ) : (
                <>
                  <p className="mt-4 font-semibold">Ngày khám</p>
                  <div role="radiogroup" aria-label="Ngày khám" className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {dates.map((d) => {
                      const full = (slotsByDate[d] ?? []).length === 0;
                      const parsed = parseDateKey(d);
                      return (
                        <PillOption
                          key={d}
                          selected={d === date}
                          disabled={full}
                          onSelect={() => {
                            setDate(d);
                            setTime("");
                            setStep(3);
                            setSubmitError("");
                          }}
                        >
                          <span>{WEEKDAY_LABELS[parsed.getDay()]}</span>
                          <span>{formatDate(parsed).slice(0, 5)}</span>
                          {full && <span className="text-sm font-normal">Hết giờ</span>}
                        </PillOption>
                      );
                    })}
                  </div>
                  {date && (
                    <>
                      <p className="mt-5 font-semibold">Giờ khám, {formatDateKey(date)}</p>
                      <div role="radiogroup" aria-label="Giờ khám" className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {slots.map((s) => (
                          <PillOption key={s} selected={s === validTime} onSelect={() => {
                              setTime(s);
                              setStep(3);
                              setSubmitError("");
                            }}>
                            {s}
                          </PillOption>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </section>
          )}

          {step === 4 && doctor && group && mode && (
            <form noValidate onSubmit={submit} aria-labelledby="step-title">
              <h2 id="step-title" className="text-2xl">Thông tin của bạn</h2>
              <div className="mt-4 rounded-xl bg-herb-50 px-4">
                <SummaryList
                  rows={[
                    { label: "Nhóm triệu chứng", value: group.name },
                    {
                      label: "Hình thức",
                      value: mode === "online" ? `${CONSULT_MODE_LABELS.online} (${ONLINE_CHANNEL_LABELS[channel]})` : CONSULT_MODE_LABELS.clinic,
                    },
                    { label: "Lương y", value: doctor.name },
                    { label: "Thời gian", value: `${validTime}, ${formatDateKey(date)}` },
                  ]}
                />
              </div>
              <div className="mt-5 grid gap-4">
                <Input
                  label="Họ và tên"
                  required
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  placeholder="Ví dụ: Nguyễn Văn An"
                />
                <Input
                  label="Số điện thoại"
                  required
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                  hint="Lương y sẽ liên hệ theo số này."
                  placeholder="Ví dụ: 0901 234 567"
                />
                <Textarea
                  label="Mô tả triệu chứng (không bắt buộc)"
                  name="symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  hint="Bắt đầu từ khi nào, ăn ngủ ra sao, đang dùng thuốc gì..."
                />
              </div>
              {submitError && (
                <p role="alert" className="mt-4 rounded-xl bg-danger-soft p-3 font-semibold text-danger">{submitError}</p>
              )}
              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={submitting}
                icon={<CalendarCheck aria-hidden="true" className="size-5" />}
                className="mt-6"
              >
                {submitting ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
              </Button>
            </form>
          )}

          {step < 4 && (
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              {step > 0 ? (
                <Button variant="outline" onClick={() => goTo(step - 1)} icon={<ChevronLeft aria-hidden="true" className="size-5" />}>
                  Quay lại
                </Button>
              ) : (
                <span />
              )}
              <Button size="lg" disabled={!canNext} onClick={() => goTo(step + 1)}>
                Tiếp tục
                <ChevronRight aria-hidden="true" className="size-5" />
              </Button>
            </div>
          )}
          {step === 4 && (
            <div className="mt-3">
              <Button variant="ghost" onClick={() => goTo(3)} icon={<ChevronLeft aria-hidden="true" className="size-5" />}>
                Quay lại chọn giờ
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
}
