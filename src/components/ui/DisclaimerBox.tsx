import type { ReactNode } from "react";
import { GENERAL_DISCLAIMER, SUPPLEMENT_DISCLAIMER } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface DisclaimerBoxProps {
  /** "supplement": dòng khuyến cáo bắt buộc cho TPBVSK. "general": lưu ý chung. */
  variant?: "supplement" | "general";
  /** Thay nội dung mặc định. */
  children?: ReactNode;
  className?: string;
}

/** Lời lưu ý in như chú thích trên nhãn thuốc: nét đồng bên trái, không icon. */
export function DisclaimerBox({ variant = "supplement", children, className }: DisclaimerBoxProps) {
  return (
    <div role="note" className={cn("border-l-4 border-bronze-500 bg-bronze-50 px-4 py-3 text-ink", className)}>
      <p className={cn(variant === "supplement" && "font-semibold")}>
        {children ?? (variant === "supplement" ? SUPPLEMENT_DISCLAIMER : GENERAL_DISCLAIMER)}
      </p>
    </div>
  );
}
