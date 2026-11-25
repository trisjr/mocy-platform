"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { controlClasses, describedBy, Field } from "./Field";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Class cho khung bao (nhãn + ô). `className` áp vào thẻ input. */
  wrapperClassName?: string;
}

/** Ô nhập một dòng, cao 48px. Với SĐT dùng type="tel" inputMode="tel". */
export function Input({ label, hint, error, required, id, className, wrapperClassName, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <Field id={inputId} label={label} required={required} hint={hint} error={error} className={wrapperClassName}>
      <input
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, hint, error)}
        className={cn(controlClasses(Boolean(error)), "min-h-12", className)}
        {...rest}
      />
    </Field>
  );
}
