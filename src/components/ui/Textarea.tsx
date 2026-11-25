"use client";

import { useId, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { controlClasses, describedBy, Field } from "./Field";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  wrapperClassName?: string;
}

/** Ô nhập nhiều dòng (mô tả triệu chứng, ghi chú). */
export function Textarea({ label, hint, error, required, id, className, wrapperClassName, rows = 4, ...rest }: TextareaProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field id={inputId} label={label} required={required} hint={hint} error={error} className={wrapperClassName}>
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, hint, error)}
        className={cn(controlClasses(Boolean(error)), "py-3", className)}
        {...rest}
      />
    </Field>
  );
}
