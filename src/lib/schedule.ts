import type { Appointment, Doctor } from "@/types";
import { toDateKey } from "./date";

/** Các ngày làm việc sắp tới của lương y (date key), tính từ hôm nay, trong `days` ngày. */
export function getUpcomingWorkingDates(doctor: Doctor, days = 14, from = new Date()): string[] {
  const result: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    if (doctor.schedule.weekdays.includes(d.getDay())) result.push(toDateKey(d));
  }
  return result;
}

/** Khung giờ đã có người đặt (bỏ qua lịch đã hủy). */
export function getBookedSlots(doctorId: string, date: string, appointments: Appointment[]): string[] {
  return appointments
    .filter((a) => a.doctorId === doctorId && a.date === date && a.status !== "cancelled")
    .map((a) => a.time);
}

/**
 * Khung giờ còn trống của lương y trong ngày `date`:
 * thuộc lịch làm việc, chưa ai đặt, và (nếu là hôm nay) chưa qua giờ.
 */
export function getAvailableSlots(
  doctor: Doctor,
  date: string,
  appointments: Appointment[],
  now = new Date(),
): string[] {
  const [y, m, d] = date.split("-").map(Number);
  if (!doctor.schedule.weekdays.includes(new Date(y, m - 1, d).getDay())) return [];
  const booked = new Set(getBookedSlots(doctor.id, date, appointments));
  const isToday = date === toDateKey(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return doctor.schedule.slots.filter((slot) => {
    if (booked.has(slot)) return false;
    if (!isToday) return true;
    const [h, min] = slot.split(":").map(Number);
    return h * 60 + min > nowMinutes;
  });
}
