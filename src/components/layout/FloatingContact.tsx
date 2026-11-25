import { Phone } from "lucide-react";
import { SITE } from "@/lib/constants";

const BASE =
  "flex size-14 items-center justify-center rounded-full shadow-card ring-2 ring-paper-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-bronze-500";

/** Nút nhắn Zalo và gọi hotline cố định góc phải, chỉ hiện từ lg (điện thoại đã có nút gọi ở header và nav đáy). */
export function FloatingContact() {
  return (
    <div className="fixed right-6 bottom-6 z-30 hidden flex-col gap-3 lg:flex">
      <a
        href={SITE.zaloHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nhắn Zalo cho nhà thuốc"
        className={`${BASE} bg-herb-700 text-sm font-bold text-white hover:bg-herb-800`}
      >
        Zalo
      </a>
      <a
        href={SITE.hotlineHref}
        aria-label={`Gọi hotline ${SITE.hotline}`}
        className={`${BASE} bg-bronze-500 text-wood-900 hover:bg-bronze-400`}
      >
        <Phone aria-hidden="true" className="size-6" />
      </a>
    </div>
  );
}
