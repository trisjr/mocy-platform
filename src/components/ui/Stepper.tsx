import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperProps {
  steps: string[];
  /** Bước hiện tại, tính từ 0. */
  current: number;
  /** Bấm để quay lại bước đã qua. Không truyền thì các bước không bấm được. */
  onStepClick?: (index: number) => void;
  className?: string;
}

/** Thanh bước cho form nhiều bước. Điện thoại: "Bước 2/5" + thanh tiến độ; màn lớn: các bước có số. */
export function Stepper({ steps, current, onStepClick, className }: StepperProps) {
  const percent = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 100;
  return (
    <nav aria-label="Các bước" className={className}>
      <div className="sm:hidden">
        <p className="font-semibold text-wood-800">
          Bước {current + 1}/{steps.length}: {steps[current]}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-200" aria-hidden="true">
          <div className="h-full rounded-full bg-herb-600 transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>
      <ol className="hidden items-start sm:flex">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = done && onStepClick;
          const circle = (
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full border-2 font-bold",
                done && "border-herb-700 bg-herb-700 text-white",
                active && "border-herb-700 bg-surface text-herb-700",
                !done && !active && "border-line-strong bg-surface text-ink-muted",
              )}
            >
              {done ? <Check aria-hidden="true" className="size-5" /> : i + 1}
            </span>
          );
          const text = (
            <span className={cn("text-center text-sm", active ? "font-semibold text-ink" : "text-ink-muted")}>
              {label}
            </span>
          );
          return (
            <li
              key={label}
              className="relative flex flex-1 flex-col items-center gap-2"
              aria-current={active ? "step" : undefined}
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-5 right-1/2 h-0.5 w-full -translate-y-1/2",
                    i <= current ? "bg-herb-700" : "bg-line",
                  )}
                />
              )}
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick(i)}
                  className="relative flex min-h-12 flex-col items-center gap-2 rounded-lg px-1"
                >
                  {circle}
                  {text}
                </button>
              ) : (
                <span className="relative flex flex-col items-center gap-2">
                  {circle}
                  {text}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
