"use client";

import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode } from "react";

export interface RadioGroupProps {
  /** Tên nhóm đọc cho trình đọc màn hình (aria-label). */
  label: string;
  className?: string;
  children: ReactNode;
}

/**
 * Khung role="radiogroup" cho ChoiceCard, PillOption, hành xử như nhóm radio của trình duyệt:
 * cả nhóm chỉ là một điểm dừng Tab (ô đang chọn, chưa chọn thì ô đầu tiên còn chọn được),
 * phím mũi tên / Home / End chuyển sang ô khác và chọn luôn ô đó.
 */
export function RadioGroup({ label, className, children }: RadioGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Không truyền deps: ô đang chọn hoặc ô bị khóa có thể đổi sau mỗi lần render.
  useLayoutEffect(() => {
    const radios = enabledRadios(ref.current);
    const current = radios.find((r) => r.getAttribute("aria-checked") === "true") ?? radios[0];
    ref.current?.querySelectorAll<HTMLElement>('[role="radio"]').forEach((r) => {
      r.tabIndex = r === current ? 0 : -1;
    });
  });

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const radios = enabledRadios(e.currentTarget);
    const i = radios.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    const n = radios.length;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? (i + 1) % n
      : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (i - 1 + n) % n
      : e.key === "Home" ? 0
      : e.key === "End" ? n - 1
      : -1;
    if (next === -1) return;
    e.preventDefault();
    radios[next].focus();
    radios[next].click();
  }

  return (
    <div ref={ref} role="radiogroup" aria-label={label} className={className} onKeyDown={onKeyDown}>
      {children}
    </div>
  );
}

function enabledRadios(root: HTMLElement | null) {
  return [...(root?.querySelectorAll<HTMLElement>('[role="radio"]:not(:disabled)') ?? [])];
}
