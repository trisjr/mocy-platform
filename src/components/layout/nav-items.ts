import { BookOpen, CalendarCheck, House, Leaf, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Trang chủ", icon: House },
  { href: "/san-pham", label: "Sản phẩm", icon: Leaf },
  { href: "/dat-lich", label: "Đặt lịch", icon: CalendarCheck },
  { href: "/kien-thuc", label: "Kiến thức", icon: BookOpen },
];

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
