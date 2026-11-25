import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  id: string;
  label?: ReactNode;
  /** Hiện dấu * đỏ cạnh nhãn. */
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Khung nhãn + gợi ý + lỗi dùng chung cho Input, Textarea, Select. */
export function Field({ id, label, required, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="font-semibold text-ink">
          {label}
          {required && (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-label text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-label font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Class chung cho ô nhập liệu. */
export function controlClasses(hasError?: boolean) {
  return cn(
    "w-full rounded-md border-2 bg-surface px-4 text-base text-ink placeholder:text-ink-muted",
    "transition-colors focus:border-herb-700 disabled:bg-paper-200 disabled:opacity-70",
    hasError ? "border-danger" : "border-line-strong",
  );
}

export function describedBy(id: string, hint?: ReactNode, error?: ReactNode) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
