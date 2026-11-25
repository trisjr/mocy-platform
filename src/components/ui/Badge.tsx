import type { HTMLAttributes, ReactNode } from "react";
import { LEGAL_LABEL_META, type Tone } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { LegalLabel } from "@/types";

const TONE_CLASSES: Record<Tone, string> = {
  herb: "bg-herb-100 text-herb-800 border-herb-200",
  wood: "bg-wood-100 text-wood-800 border-wood-200",
  bronze: "bg-bronze-100 text-bronze-800 border-bronze-200",
  neutral: "bg-paper-200 text-ink border-line",
  danger: "bg-danger-soft text-danger border-danger/30",
  info: "bg-info-soft text-info border-info/30",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  icon?: ReactNode;
}

/** Nhãn nhỏ. Với trạng thái đơn/lịch hẹn: tone={ORDER_STATUS_META[status].tone}. */
export function Badge({ tone = "neutral", icon, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-sm font-semibold whitespace-nowrap",
        TONE_CLASSES[tone],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}

export interface LegalBadgeProps {
  label: LegalLabel;
  /** Dùng nhãn ngắn ("TPBVSK") cho thẻ sản phẩm chật chỗ. */
  short?: boolean;
  className?: string;
}

/** Nhãn pháp lý: Thuốc Đông y / Dược liệu / Thực phẩm bảo vệ sức khỏe. */
export function LegalBadge({ label, short, className }: LegalBadgeProps) {
  const meta = LEGAL_LABEL_META[label];
  return (
    <Badge tone={meta.tone} className={className} title={meta.label}>
      {short ? meta.short : meta.label}
    </Badge>
  );
}
