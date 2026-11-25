"use client";

import { useState } from "react";

/**
 * Trả về các id xuất hiện thêm sau lần đọc đầu tiên (bản ghi vừa được tab Storefront tạo),
 * để bảng Admin highlight đậm hơn. `ready` = đã hydrate, tránh coi dữ liệu nạp ban đầu là "mới".
 */
export function useFreshIds(ids: string[], ready: boolean): Set<string> {
  const [seen, setSeen] = useState<Set<string> | null>(null);
  const [fresh, setFresh] = useState<Set<string>>(() => new Set());

  if (ready && seen === null) {
    setSeen(new Set(ids));
  } else if (seen !== null) {
    const added = ids.filter((id) => !seen.has(id));
    if (added.length > 0) {
      setSeen(new Set([...seen, ...added]));
      setFresh(new Set([...fresh, ...added]));
    }
  }
  return fresh;
}
