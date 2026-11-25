"use client";

import { ChevronDown } from "lucide-react";
import { useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { controlClasses, describedBy, Field } from "./Field";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: SelectOption[];
  /** Dòng đầu giá trị rỗng, VD "Tất cả danh mục". */
  placeholder?: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  wrapperClassName?: string;
}

/** Select gốc của trình duyệt (dễ dùng trên điện thoại), cao 48px. */
export function Select({
  options,
  placeholder,
  label,
  hint,
  error,
  required,
  id,
  className,
  wrapperClassName,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <Field id={selectId} label={label} required={required} hint={hint} error={error} className={wrapperClassName}>
      <div className="relative">
        <select
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(selectId, hint, error)}
          className={cn(controlClasses(Boolean(error)), "min-h-12 appearance-none pr-11", className)}
          {...rest}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-ink-muted"
        />
      </div>
    </Field>
  );
}
