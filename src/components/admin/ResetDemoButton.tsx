"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button, Modal } from "@/components/ui";
import { resetDemoData, StoreError } from "@/lib/store";

/** Xóa đơn, lịch hẹn, yêu cầu tư vấn đang có và nạp lại dữ liệu mẫu để chạy lại buổi trình diễn. */
export function ResetDemoButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function confirm() {
    try {
      resetDemoData();
      setMessage({ ok: true, text: "Đã đưa dữ liệu demo về ban đầu." });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof StoreError ? e.message : "Không thể reset, vui lòng thử lại." });
    }
    setOpen(false);
  }

  return (
    <div className={className}>
      <Button
        variant="outline"
        fullWidth
        icon={<RotateCcw aria-hidden="true" className="size-5" />}
        onClick={() => {
          setMessage(null);
          setOpen(true);
        }}
      >
        Reset dữ liệu demo
      </Button>
      {message && (
        <p
          role="status"
          className={
            message.ok
              ? "mt-2 rounded-lg bg-herb-100 px-3 py-2 text-sm font-semibold text-herb-900"
              : "mt-2 rounded-lg bg-danger-soft px-3 py-2 text-sm font-semibold text-danger"
          }
        >
          {message.text}
        </p>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Reset dữ liệu demo?"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Để sau
            </Button>
            <Button variant="danger" onClick={confirm}>
              Reset ngay
            </Button>
          </>
        }
      >
        <p>
          Toàn bộ đơn hàng, lịch hẹn, yêu cầu tư vấn và giỏ hàng đã tạo sẽ bị xóa, rồi nạp lại dữ liệu mẫu ban đầu. Mọi tab đang mở
          cũng cập nhật theo.
        </p>
      </Modal>
    </div>
  );
}
