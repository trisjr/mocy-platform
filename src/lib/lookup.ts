import type { Appointment, ConsultRequest, Order } from "@/types";
import { isValidPhone } from "./utils";

/**
 * Tra cứu đơn hàng / lịch hẹn / yêu cầu tư vấn theo mã hoặc số điện thoại.
 * Hàm thuần, không đọc store: trang /tra-cuu truyền dữ liệu từ hook vào.
 */

export type LookupKind = "order" | "appointment" | "consult";

export type LookupQuery = { type: "code"; code: string } | { type: "phone"; phone: string };

export interface LookupMatches {
  orders: Order[];
  appointments: Appointment[];
  consults: ConsultRequest[];
}

const CODE_PATTERN = /^(DH|LH|TV)[0-9A-Z]{4,}$/i;
const KIND_BY_PREFIX: Record<string, LookupKind> = { DH: "order", LH: "appointment", TV: "consult" };

const digits = (s: string) => s.replace(/\D/g, "");

/** Đọc ô nhập: bỏ khoảng trắng và dấu chấm, rồi nhận dạng mã hoặc số điện thoại. */
export function parseLookupInput(input: string): LookupQuery | { error: string } {
  const compact = input.replace(/[\s.]/g, "");
  if (!compact) return { error: "Vui lòng nhập mã đơn, mã lịch hẹn hoặc số điện thoại." };
  if (CODE_PATTERN.test(compact)) return { type: "code", code: compact.toUpperCase() };
  if (isValidPhone(compact)) return { type: "phone", phone: compact };
  return {
    error: "Mã gồm DH, LH hoặc TV và các ký tự in trên phiếu (VD DH2611S21), hoặc số điện thoại 10 chữ số.",
  };
}

/** Loại bản ghi theo tiền tố mã, null nếu không phải mã hợp lệ. */
export function codeKind(code: string): LookupKind | null {
  return CODE_PATTERN.test(code) ? KIND_BY_PREFIX[code.slice(0, 2).toUpperCase()] : null;
}

export function findMatches(q: LookupQuery, data: LookupMatches): LookupMatches {
  if (q.type === "code") {
    return {
      orders: data.orders.filter((o) => o.code === q.code),
      appointments: data.appointments.filter((a) => a.code === q.code),
      consults: data.consults.filter((c) => c.code === q.code),
    };
  }
  const phone = digits(q.phone);
  return {
    orders: data.orders.filter((o) => digits(o.shipping.phone) === phone),
    appointments: data.appointments.filter((a) => digits(a.customer.phone) === phone),
    consults: data.consults.filter((c) => digits(c.customer.phone) === phone),
  };
}

/** "0973219821" -> "0973 *** 821". */
export function maskPhone(phone: string): string {
  const d = digits(phone);
  return d.length < 7 ? "***" : `${d.slice(0, 4)} *** ${d.slice(-3)}`;
}

/** "Tạ Quang Vinh" -> "Tạ Q. Vinh"; tên 1–2 từ giữ nguyên. */
export function shortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 2) return parts.join(" ");
  const middle = parts.slice(1, -1).map((p) => `${p[0]}.`);
  return [parts[0], ...middle, parts[parts.length - 1]].join(" ");
}
