"use client";

import { CalendarCheck, CheckCircle2, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Container } from "@/components/layout";
import { Button, ButtonLink, Card, Input, Select, Textarea } from "@/components/ui";
import { products } from "@/data";
import { getProductById, getProductBySlug } from "@/lib/catalog";
import { SITE } from "@/lib/constants";
import { formatPhone } from "@/lib/format";
import { compressImage } from "@/lib/image";
import { createConsultRequest, StoreError } from "@/lib/store";
import { isValidPhone } from "@/lib/utils";
import type { ConsultRequest } from "@/types";
import { SafeImage } from "@/components/ui";
import { SummaryList } from "./SummaryList";

export function ConsultForm() {
  const params = useSearchParams();
  const productParam = params.get("product") ?? params.get("san-pham");
  const requested = useMemo(
    () => (productParam ? (getProductBySlug(productParam) ?? getProductById(productParam)) : undefined),
    [productParam],
  );
  const options = useMemo(() => {
    const list = products.filter((p) => p.saleType === "consult");
    if (requested && !list.some((p) => p.id === requested.id)) list.unshift(requested);
    return list.map((p) => ({ value: p.id, label: p.name }));
  }, [requested]);

  const fileRef = useRef<HTMLInputElement>(null);
  const [productId, setProductId] = useState(requested?.id ?? "");
  const [symptoms, setSymptoms] = useState("");
  const [image, setImage] = useState("");
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState<ConsultRequest | null>(null);

  const product = productId ? getProductById(productId) : undefined;

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Vui lòng chọn tệp ảnh (JPG hoặc PNG).");
      return;
    }
    setImageBusy(true);
    setImageError("");
    try {
      setImage(await compressImage(file));
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Không đọc được ảnh, vui lòng thử ảnh khác.");
    } finally {
      setImageBusy(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Vui lòng nhập họ và tên.";
    if (!phone.trim()) next.phone = "Vui lòng nhập số điện thoại.";
    else if (!isValidPhone(phone)) next.phone = "Số điện thoại gồm 10 chữ số, bắt đầu bằng số 0. Ví dụ: 0901 234 567.";
    setErrors(next);
    if (next.name || next.phone) return;
    try {
      const request = createConsultRequest({
        productId: product?.id,
        productName: product?.name,
        symptoms,
        prescriptionImage: image || undefined,
        customer: { name, phone },
      });
      setSubmitError("");
      setDone(request);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setSubmitError(err instanceof StoreError ? err.message : "Có lỗi xảy ra, vui lòng thử lại.");
    }
  }

  if (done) {
    return (
      <Container className="py-6 sm:py-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-card bg-herb-50 p-6 text-center sm:p-8">
            <CheckCircle2 aria-hidden="true" className="mx-auto size-14 text-herb-700" />
            <h1 className="mt-3 text-3xl">Đã gửi yêu cầu tư vấn</h1>
            <p className="mt-2 text-lg text-ink-muted">Mã yêu cầu của bạn</p>
            <p className="mt-1 font-mono text-4xl font-bold tracking-wider text-herb-800">{done.code}</p>
            <p className="mt-3 text-ink-muted">
              Lương y sẽ xem thông tin, liên hệ qua số {formatPhone(done.customer.phone)} và báo giá bài thuốc phù hợp thể trạng của bạn.
            </p>
          </div>
          <Card padding="lg" className="mt-6">
            <h2 className="text-2xl">Thông tin đã gửi</h2>
            <SummaryList
              rows={[
                { label: "Khách hàng", value: done.customer.name },
                { label: "Số điện thoại", value: formatPhone(done.customer.phone) },
                { label: "Bài thuốc quan tâm", value: done.productName ?? "Tư vấn chung" },
                ...(done.symptoms ? [{ label: "Triệu chứng", value: done.symptoms }] : []),
              ]}
            />
            {done.prescriptionImage && (
              <div className="relative mt-3 h-56 w-full overflow-hidden rounded-xl bg-paper-100">
                <Image src={done.prescriptionImage} alt="Ảnh đơn thuốc cũ bạn đã gửi" fill unoptimized className="object-contain" />
              </div>
            )}
          </Card>
          <p className="mt-4 text-ink-muted">Cần gấp, bạn có thể gọi {SITE.hotline}.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg">Về trang chủ</ButtonLink>
            <ButtonLink href="/dat-lich" variant="outline" size="lg" icon={<CalendarCheck aria-hidden="true" className="size-5" />}>
              Đặt lịch gặp lương y
            </ButtonLink>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl sm:text-4xl">Đăng ký tư vấn cắt thang</h1>
        <p className="mt-2 text-lg text-ink-muted">
          Bài thuốc gia giảm theo thể trạng từng người nên chưa có giá cố định. Bạn mô tả triệu chứng, lương y sẽ tư vấn và báo giá.
        </p>

        {product && (
          <Card padding="sm" className="mt-5 flex items-center gap-3">
            <span className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-paper-100">
              <SafeImage src={product.images[0]} alt={product.name} className="absolute inset-0 size-full" />
            </span>
            <span>
              <span className="block text-sm text-ink-muted">Bài thuốc bạn quan tâm</span>
              <span className="block font-heading text-xl font-semibold">{product.name}</span>
            </span>
          </Card>
        )}

        <form noValidate onSubmit={submit} className="mt-6">
          <Card padding="lg" className="grid gap-5">
            {options.length > 0 && (
              <Select
                label="Bài thuốc quan tâm"
                placeholder="Chưa chọn, tư vấn chung"
                options={options}
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            )}
            <Textarea
              label="Mô tả triệu chứng"
              name="symptoms"
              rows={5}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              hint="Bắt đầu từ khi nào, mức độ ra sao, đang dùng thuốc gì, có bệnh nền không."
            />

            <div>
              <p className="font-semibold">Ảnh đơn thuốc hoặc kết quả khám cũ (không bắt buộc)</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFile}
                className="sr-only"
                tabIndex={-1}
                aria-label="Chọn ảnh đơn thuốc"
              />
              {image ? (
                <div className="mt-2">
                  <div className="relative h-56 w-full overflow-hidden rounded-xl border border-line bg-paper-100">
                    <Image src={image} alt="Ảnh đơn thuốc cũ đã chọn" fill unoptimized className="object-contain" />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => fileRef.current?.click()} icon={<ImagePlus aria-hidden="true" className="size-5" />}>
                      Chọn ảnh khác
                    </Button>
                    <Button variant="ghost" onClick={() => setImage("")} icon={<Trash2 aria-hidden="true" className="size-5" />}>
                      Bỏ ảnh
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  fullWidth
                  disabled={imageBusy}
                  onClick={() => fileRef.current?.click()}
                  icon={<ImagePlus aria-hidden="true" className="size-5" />}
                  className="mt-2"
                >
                  {imageBusy ? "Đang xử lý ảnh..." : "Chọn ảnh từ máy"}
                </Button>
              )}
              <p className="mt-1.5 text-sm text-ink-muted">Ảnh chỉ lưu trong trình duyệt của bản demo này, không tải lên máy chủ.</p>
              {imageError && (
                <p role="alert" className="mt-1.5 text-sm font-medium text-danger">{imageError}</p>
              )}
            </div>

            <Input
              label="Họ và tên"
              required
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              placeholder="Ví dụ: Nguyễn Văn An"
            />
            <Input
              label="Số điện thoại"
              required
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              hint="Lương y sẽ liên hệ theo số này."
              placeholder="Ví dụ: 0901 234 567"
            />

            {submitError && (
              <p role="alert" className="rounded-xl bg-danger-soft p-3 font-semibold text-danger">{submitError}</p>
            )}
            <Button type="submit" size="lg" fullWidth disabled={imageBusy}>
              Gửi yêu cầu tư vấn
            </Button>
          </Card>
        </form>
      </div>
    </Container>
  );
}
