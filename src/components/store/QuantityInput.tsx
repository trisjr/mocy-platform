"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Tên sản phẩm, dùng cho nhãn đọc màn hình. */
  label: string;
  className?: string;
}

/** Bộ tăng giảm số lượng, nút 48px. */
export function QuantityInput({ value, onChange, min = 1, max = 99, label, className }: QuantityInputProps) {
  const btn =
    "flex size-12 items-center justify-center rounded-md text-wood-800 hover:bg-paper-200 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div
      role="group"
      aria-label={`Số lượng ${label}`}
      className={cn("inline-flex items-center rounded-md border-2 border-line-strong bg-surface", className)}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Giảm số lượng"
      >
        <Minus aria-hidden="true" className="size-5" />
      </button>
      <span aria-live="polite" className="min-w-10 text-center text-lg font-semibold">
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Tăng số lượng"
      >
        <Plus aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}
