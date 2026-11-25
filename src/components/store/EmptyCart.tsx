import { ButtonLink, SafeImage } from "@/components/ui";

/** Giỏ trống: nia tre chưa có gì, kèm lời mời chọn sản phẩm. Dùng ở giỏ hàng và trang đặt hàng. */
export function EmptyCart({ message }: { message: string }) {
  return (
    <div className="label-frame paper-fiber mt-6 flex flex-col items-center gap-3 bg-surface px-6 pt-4 pb-8 text-center shadow-card">
      <SafeImage src="/images/states/gio-trong.svg" alt="" className="aspect-[3/2] w-full max-w-xs object-contain" />
      <p className="font-heading text-2xl font-bold">Giỏ hàng đang trống</p>
      <p className="max-w-md text-ink-muted">{message}</p>
      <ButtonLink href="/san-pham" size="lg" className="mt-2">
        Mua dược liệu
      </ButtonLink>
    </div>
  );
}
