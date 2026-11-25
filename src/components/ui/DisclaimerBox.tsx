import { Info } from "lucide-react";
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

export function DisclaimerBox({ variant = "supplement", children, className }: DisclaimerBoxProps) {
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-xl border border-bronze-200 border-l-4 border-l-bronze-400 bg-bronze-50 p-4 text-ink",
        className,
      )}
    >
      <Info aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-bronze-700" />
      <p className={cn(variant === "supplement" && "font-semibold")}>
        {children ?? (variant === "supplement" ? SUPPLEMENT_DISCLAIMER : GENERAL_DISCLAIMER)}
      </p>
    </div>
  );
}
