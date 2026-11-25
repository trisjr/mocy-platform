"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/ui";

/** Ảnh lớn + dãy ảnh nhỏ để chọn. */
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div className="label-frame paper-fiber relative aspect-square overflow-hidden bg-surface shadow-card">
        <SafeImage
          src={images[active]}
          alt={images.length > 1 ? `${name}, ảnh ${active + 1}/${images.length}` : name}
          className="absolute inset-0 size-full"
          loading="eager"
        />
      </div>
      {images.length > 1 && (
        <ul className="flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <li key={src + i} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-pressed={i === active}
                className={cn(
                  "block size-20 overflow-hidden rounded-[3px] border-2 bg-surface",
                  i === active ? "border-herb-700" : "border-line hover:border-herb-400",
                )}
              >
                <SafeImage src={src} alt="" className="size-full" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
