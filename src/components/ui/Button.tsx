import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
export type ButtonSize = "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-herb-700 text-white hover:bg-herb-800",
  secondary: "bg-wood-700 text-white hover:bg-wood-800",
  accent: "bg-bronze-300 text-wood-900 hover:bg-bronze-200",
  outline: "border-2 border-herb-700 bg-surface text-herb-700 hover:bg-herb-50",
  ghost: "text-herb-700 hover:bg-herb-50",
  danger: "bg-danger text-white hover:opacity-90",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 text-base",
  lg: "min-h-14 px-7 text-lg",
};

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/** Class của nút, dùng khi cần áp kiểu nút cho phần tử khác. */
export function buttonClasses({ variant = "primary", size = "md", fullWidth }: ButtonStyleProps = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold leading-tight transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && "w-full",
  );
}

interface IconProps {
  /** Icon đặt trước chữ, VD <ShoppingCart className="size-5" /> từ lucide-react. */
  icon?: ReactNode;
  children?: ReactNode;
}

export type ButtonProps = ButtonStyleProps & IconProps & ButtonHTMLAttributes<HTMLButtonElement>;

/** Nút cao tối thiểu 48px (md) hoặc 56px (lg). Mặc định type="button". */
export function Button({ variant, size, fullWidth, icon, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonClasses({ variant, size, fullWidth }), className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export type ButtonLinkProps = ButtonStyleProps & IconProps & ComponentProps<typeof Link>;

/** Link điều hướng có hình dạng nút (dùng next/link). */
export function ButtonLink({ variant, size, fullWidth, icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonClasses({ variant, size, fullWidth }), className)} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
