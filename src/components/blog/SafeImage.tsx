"use client";

import { Leaf } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface SafeImageProps {
  src?: string;
  alt: string;
  /** Giá trị sizes cho next/image, VD "(min-width: 768px) 33vw, 100vw". */
  sizes?: string;
  className?: string;
  /** Class cho ảnh (VD object-top). Mặc định object-cover. */
  imageClassName?: string;
  priority?: boolean;
}

/**
 * Ảnh phủ kín khung cha (cha cần `relative` và có kích thước).
 * Ảnh thiếu hoặc lỗi thì hiện nền thảo mộc kèm icon lá thay vì ảnh vỡ.
 */
export function SafeImage({ src, alt, sizes = "100vw", className, imageClassName, priority }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !src || failedSrc === src;
  if (failed) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn("absolute inset-0 flex items-center justify-center bg-herb-100", className)}
      >
        <Leaf aria-hidden="true" className="size-1/4 min-w-6 max-w-12 text-herb-700/60" />
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailedSrc(src)}
      className={cn("object-cover", imageClassName, className)}
    />
  );
}
