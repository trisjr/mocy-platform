"use client";

import { Leaf } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SafeImageProps {
  src?: string;
  alt: string;
  /** Áp cho cả ảnh lẫn khung thay thế, VD "size-full". */
  className?: string;
  /** Nội dung hiện khi không có ảnh hoặc ảnh lỗi. Mặc định là icon lá. */
  fallback?: ReactNode;
  loading?: "lazy" | "eager";
}

/** Ảnh có khung thay thế khi thiếu đường dẫn hoặc tải lỗi, để không bao giờ hiện ảnh vỡ. */
export function SafeImage({ src, alt, className, fallback, loading = "lazy" }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn("flex items-center justify-center bg-herb-50 text-herb-400", className)}
      >
        {fallback ?? <Leaf aria-hidden="true" className="size-1/3 max-h-24 max-w-24" />}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src.startsWith("/") && !src.startsWith("//") ? process.env.NEXT_PUBLIC_BASE_PATH + src : src}
      alt={alt}
      loading={loading}
      className={cn("object-cover", className)}
      onError={() => setFailedSrc(src)}
      ref={(el) => {
        // Ảnh lỗi trước khi hydrate thì onError không chạy: kiểm tra lại khi gắn vào DOM.
        if (el && el.complete && el.naturalWidth === 0) {
          el.decode().catch(() => setFailedSrc(src));
        }
      }}
    />
  );
}
