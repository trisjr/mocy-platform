import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Con dấu son "MỘC Y" bằng chữ Quốc ngữ, vân mực loang như dấu đóng tay. Chỉ để trang trí: luôn aria-hidden.
 * Chữ dùng font tiêu đề của trang nên phải vẽ inline (không dùng file SVG qua thẻ img).
 */
export function Seal({ className }: { className?: string }) {
  const filterId = `seal-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={cn("shrink-0", className)}>
      <defs>
        <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.5 1.42" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" result="s" />
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={3} result="d" />
          <feDisplacementMap in="s" in2="d" scale={3} />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <rect x="3" y="3" width="94" height="94" rx="6" className="fill-seal" />
        <rect x="10" y="10" width="80" height="80" rx="2" fill="none" strokeWidth="3" className="stroke-paper-50" />
        <g className="fill-paper-50" fontWeight={800} textAnchor="middle" style={{ fontFamily: "var(--font-heading)" }}>
          <text x="50" y="49" fontSize="31">
            MỘC
          </text>
          <text x="50" y="84" fontSize="34">
            Y
          </text>
        </g>
        <path d="M24 70h14M62 70h14" strokeWidth="3" className="stroke-paper-50" />
      </g>
    </svg>
  );
}
