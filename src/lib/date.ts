/**
 * Ngày giờ theo giờ địa phương của trình duyệt.
 * "date key" là chuỗi "YYYY-MM-DD" dùng cho ngày hẹn.
 */

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "YYYY-MM-DD" -> Date lúc 00:00 giờ địa phương. */
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

/** Date key cách hôm nay `offsetDays` ngày (âm là quá khứ). Dùng cho dữ liệu seed. */
export function dateKeyFromNow(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return toDateKey(d);
}

/** Chuỗi ISO cách hôm nay `offsetDays` ngày, lúc `time` ("HH:mm"). Dùng cho createdAt của dữ liệu seed. */
export function isoFromNow(offsetDays: number, time = "09:00"): string {
  const [h, min] = time.split(":").map(Number);
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(h, min, 0, 0);
  return d.toISOString();
}
