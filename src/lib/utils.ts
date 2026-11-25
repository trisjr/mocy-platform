/** Ghép className, bỏ giá trị rỗng. Không tự gộp class Tailwind trùng nhau. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function randomChars(length: number): string {
  let out = "";
  while (out.length < length) out += Math.random().toString(36).slice(2).toUpperCase();
  return out.slice(0, length);
}

/** Id nội bộ. Không dùng crypto.randomUUID vì không có trên HTTP qua IP LAN (demo trên điện thoại). */
export function generateId(): string {
  return `${Date.now().toString(36)}-${randomChars(8).toLowerCase()}`;
}

/** Mã hiển thị: tiền tố + ngày tháng + 3 ký tự, VD "DH2611A3F". Chỉ gọi trong action, không gọi khi render. */
export function generateCode(prefix: string, date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${prefix}${dd}${mm}${randomChars(3)}`;
}

/** Bỏ dấu tiếng Việt, chữ thường, gọn khoảng trắng. Dùng cho tìm kiếm: "Mất ngủ" -> "mat ngu". */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Kiểm tra SĐT Việt Nam: 10 số, bắt đầu bằng 0 (cho phép khoảng trắng, dấu chấm). */
export function isValidPhone(phone: string): boolean {
  return /^0\d{9}$/.test(phone.replace(/[\s.]/g, ""));
}
