/** Tra cứu dữ liệu tĩnh trong `@/data`. */
import { articles, doctors, products, symptomGroups } from "@/data";
import type { Product, ProductVariant } from "@/types";

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getDoctorById(id: string) {
  return doctors.find((d) => d.id === id);
}

export function getDoctorBySlug(slug: string) {
  return doctors.find((d) => d.slug === slug);
}

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getSymptomGroupById(id: string) {
  return symptomGroups.find((g) => g.id === id);
}

export function getSymptomGroupBySlug(slug: string) {
  return symptomGroups.find((g) => g.slug === slug);
}

/** Giá thấp nhất trong các biến thể; undefined nếu sản phẩm cần tư vấn (không có giá). */
export function getMinPrice(product: Product): number | undefined {
  if (product.variants.length === 0) return undefined;
  return Math.min(...product.variants.map((v) => v.price));
}

export function getVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((v) => v.id === variantId);
}
