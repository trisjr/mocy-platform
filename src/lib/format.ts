import { WEEKDAY_LABELS } from "./constants";
import { parseDateKey } from "./date";

const priceFormatter = new Intl.NumberFormat("vi-VN");

/** 150000 -> "150.000đ". */
export function formatPrice(value: number): string {
  return `${priceFormatter.format(Math.round(value))}đ`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Date | ISO -> "26/11/2026". */
export function formatDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Date | ISO -> "14:05 26/11/2026". */
export function formatDateTime(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ${formatDate(d)}`;
}

/** "2026-11-26" -> "Thứ 5, 26/11/2026". */
export function formatDateKey(key: string): string {
  const d = parseDateKey(key);
  return `${WEEKDAY_LABELS[d.getDay()]}, ${formatDate(d)}`;
}

/** "0901234567" -> "0901 234 567". */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}
