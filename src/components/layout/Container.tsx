import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Khung nội dung căn giữa, rộng tối đa 72rem, lề ngang 16px trên điện thoại. */
export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...rest} />;
}
