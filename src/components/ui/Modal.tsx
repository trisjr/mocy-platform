"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  /** Vùng nút cuối modal. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = { sm: "sm:max-w-md", md: "sm:max-w-lg", lg: "sm:max-w-3xl" };

/** Hộp thoại dùng thẻ <dialog>: Esc và bấm nền tối để đóng. Trên điện thoại hiện như bottom sheet. */
export function Modal({ open, onClose, title, children, footer, size = "md", className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "m-0 mt-auto w-full max-w-none rounded-t-lg bg-surface p-0 text-ink shadow-xl backdrop:bg-wood-900/50",
        "sm:m-auto sm:rounded-lg",
        SIZE[size],
        className,
      )}
    >
      <div className="flex max-h-[85vh] flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="-mt-1 -mr-2 flex size-12 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-paper-200"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}
