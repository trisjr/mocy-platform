"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button, ButtonLink, Card, DisclaimerBox, Input, Select } from "@/components/ui";
import { products, symptomGroups } from "@/data";
import { getMinPrice } from "@/lib/catalog";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { cn, normalizeText } from "@/lib/utils";
import type { ProductCategory, SaleType } from "@/types";
import { ProductCard, ProductSheet } from "./ProductCard";
import { SupplementNotice } from "./SupplementNotice";

/** Tên query trên URL: ?q=&danh-muc=&nhom=&gia=&tinh-trang= */
const PARAM = { q: "q", category: "danh-muc", group: "nhom", price: "gia", status: "tinh-trang" } as const;

const CATEGORY_OPTIONS: { value: string; category: ProductCategory }[] = [
  { value: "duoc-lieu-tho", category: "raw-herb" },
  { value: "thanh-pham", category: "finished" },
  { value: "combo", category: "combo" },
];

const STATUS_OPTIONS: { value: string; label: string; saleType: SaleType }[] = [
  { value: "co-san", label: "Có sẵn (mua ngay)", saleType: "retail" },
  { value: "can-tu-van", label: "Cần tư vấn (bốc theo thể trạng)", saleType: "consult" },
];

/** Khoảng giá so với giá thấp nhất của sản phẩm; min tính cả, max không tính. */
const PRICE_OPTIONS = [
  { value: "duoi-200k", min: 0, max: 200000 },
  { value: "200k-500k", min: 200000, max: 500000 },
  { value: "500k-1tr", min: 500000, max: 1000000 },
  { value: "tren-1tr", min: 1000000, max: Infinity },
].map((r) => ({
  ...r,
  label:
    r.min === 0
      ? `Dưới ${formatPrice(r.max)}`
      : r.max === Infinity
        ? `Từ ${formatPrice(r.min)} trở lên`
        : `${formatPrice(r.min)} – ${formatPrice(r.max)}`,
}));

/** Từ cần tìm: bỏ dấu, bỏ dấu câu. */
function searchWords(text: string): string[] {
  return normalizeText(text).split(/[^a-z0-9]+/).filter(Boolean);
}

/** Chuỗi tìm kiếm (tên, mô tả, công dụng, từ khóa, nhóm bệnh), mở đầu bằng dấu cách để so đầu từ. */
const SEARCH_INDEX = new Map(
  products.map((p) => {
    const text = [
      p.name,
      p.shortDescription,
      p.uses,
      ...(p.keywords ?? []),
      ...p.symptomGroupIds.map((id) => symptomGroups.find((g) => g.id === id)?.name ?? ""),
    ].join(" ");
    return [p.id, ` ${searchWords(text).join(" ")}`];
  }),
);

const SEARCH_DELAY = 300;

export function ProductCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchKey, setSearchKey] = useState(0);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rời trang trong lúc đang chờ cập nhật ô tìm kiếm thì bỏ lượt cập nhật đó.
  useEffect(() => {
    const timer = searchTimer;
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const q = searchParams.get(PARAM.q) ?? "";
  const category = CATEGORY_OPTIONS.find((o) => o.value === searchParams.get(PARAM.category));
  const group = symptomGroups.find((g) => g.slug === searchParams.get(PARAM.group));
  const price = PRICE_OPTIONS.find((o) => o.value === searchParams.get(PARAM.price));
  const status = STATUS_OPTIONS.find((o) => o.value === searchParams.get(PARAM.status));
  const activeCount = [q, category, group, price, status].filter(Boolean).length;
  const extraCount = [category, price, status].filter(Boolean).length;

  function update(changes: Partial<Record<keyof typeof PARAM, string | null>>) {
    // Đọc URL hiện tại thay vì searchParams của lần render trước (ô tìm kiếm cập nhật trễ 300ms).
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) {
      const name = PARAM[key as keyof typeof PARAM];
      if (value) next.set(name, value);
      else next.delete(name);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function onSearchChange(value: string) {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => update({ q: value.trim() || null }), SEARCH_DELAY);
  }

  function clearAll() {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearchKey((k) => k + 1);
    router.replace(pathname, { scroll: false });
  }

  const results = useMemo(() => {
    const words = searchWords(q);
    return products.filter((p) => {
      if (category && p.category !== category.category) return false;
      if (group && !p.symptomGroupIds.includes(group.id)) return false;
      if (status && p.saleType !== status.saleType) return false;
      if (price) {
        // Đặt khoảng giá thì ẩn sản phẩm cần tư vấn (không có giá niêm yết).
        const min = getMinPrice(p);
        if (min === undefined || min < price.min || min >= price.max) return false;
      }
      // Mỗi từ phải khớp với đầu một từ trong nội dung, để "an" không khớp "toan", "an toàn"... ở giữa từ.
      const haystack = SEARCH_INDEX.get(p.id) ?? "";
      return words.every((w) => haystack.includes(` ${w}`));
    });
  }, [q, category, group, price, status]);

  if (products.length === 0) {
    return (
      <Card className="mt-6 text-center" padding="lg">
        <p className="text-lg font-semibold">Danh mục sản phẩm đang được cập nhật.</p>
        <p className="mt-2 text-ink-muted">Anh/chị có thể đặt lịch để lương y tư vấn trực tiếp.</p>
        <ButtonLink href="/dat-lich" className="mt-5">
          Đặt lịch tư vấn
        </ButtonLink>
      </Card>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-5">
      <form role="search" noValidate onSubmit={(e) => e.preventDefault()}>
        <Input
          key={searchKey}
          type="search"
          label="Tìm theo tên dược liệu hoặc công dụng"
          placeholder="VD: kỳ tử, an thần, đau lưng..."
          // Sau khi "Xóa bộ lọc", ô được dựng lại trước khi URL đổi nên không đọc q.
          defaultValue={searchKey === 0 ? q : ""}
          onChange={(e) => onSearchChange(e.target.value)}
          enterKeyHint="search"
        />
      </form>

      {symptomGroups.length > 0 && (
        <div>
          <p className="mb-2 font-semibold text-ink" id="nhom-benh-label">
            Nhóm bệnh / nhu cầu
          </p>
          <div
            role="group"
            aria-labelledby="nhom-benh-label"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            <Chip active={!group} onClick={() => update({ group: null })}>
              Tất cả
            </Chip>
            {symptomGroups.map((g) => (
              <Chip key={g.id} active={group?.id === g.id} onClick={() => update({ group: g.slug })}>
                {g.name}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div className="sm:hidden">
        <Button
          variant="outline"
          fullWidth
          aria-expanded={showFilters}
          aria-controls="bo-loc-khac"
          onClick={() => setShowFilters((v) => !v)}
        >
          {showFilters ? "Ẩn bộ lọc" : "Bộ lọc khác"}
          {extraCount > 0 && ` (${extraCount})`}
        </Button>
      </div>
      <div id="bo-loc-khac" className={cn("grid gap-4 sm:grid-cols-3", !showFilters && "hidden sm:grid")}>
        <Select
          label="Danh mục"
          placeholder="Tất cả danh mục"
          value={category?.value ?? ""}
          onChange={(e) => update({ category: e.target.value || null })}
          options={CATEGORY_OPTIONS.map((o) => ({ value: o.value, label: PRODUCT_CATEGORY_LABELS[o.category] }))}
        />
        <Select
          label="Khoảng giá"
          placeholder="Mọi mức giá"
          value={price?.value ?? ""}
          onChange={(e) => update({ price: e.target.value || null })}
          options={PRICE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
        <Select
          label="Tình trạng"
          placeholder="Tất cả"
          value={status?.value ?? ""}
          onChange={(e) => update({ status: e.target.value || null })}
          options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-double border-line-strong/70 pt-4">
        <p aria-live="polite" className="font-semibold">
          {results.length > 0 ? `Tìm thấy ${results.length} sản phẩm` : "Không có sản phẩm phù hợp"}
          {group && <span className="font-normal text-ink-muted"> cho nhóm “{group.name}”</span>}
        </p>
        {activeCount > 0 && (
          <Button variant="ghost" className="underline decoration-2 underline-offset-4" onClick={clearAll}>
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {price && status?.saleType !== "retail" && (
        <p className="border-l-4 border-info bg-info-soft px-4 py-3 text-info">
          Đang lọc theo giá nên tạm ẩn các bài thuốc cần tư vấn, vì giá của chúng tùy theo thể trạng từng người.
        </p>
      )}

      {results.length > 0 ? (
        <>
          <ProductSheet className="mt-2">
            {results.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ProductSheet>
          <SupplementNotice products={results} className="mt-2" />
        </>
      ) : (
        <Card padding="lg" className="text-center">
          <p className="text-lg font-semibold">Chưa tìm thấy sản phẩm phù hợp với bộ lọc.</p>
          <p className="mt-2 text-ink-muted">
            Anh/chị thử bỏ bớt điều kiện lọc, hoặc để lương y tư vấn bài thuốc hợp thể trạng.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="outline" onClick={clearAll}>
              Xóa bộ lọc
            </Button>
            <ButtonLink href="/dat-lich">Đặt lịch tư vấn</ButtonLink>
          </div>
        </Card>
      )}

      <DisclaimerBox variant="general" className="mt-4" />
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-12 shrink-0 rounded-[3px] border-2 px-4 font-semibold whitespace-nowrap transition-colors",
        active
          ? "border-wood-800 bg-wood-800 text-paper-50"
          : "border-line-strong bg-surface text-ink hover:border-wood-600",
      )}
    >
      {children}
    </button>
  );
}
