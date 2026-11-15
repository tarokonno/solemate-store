import type { Shoe } from "./types";

export type StockStatus = "in" | "low" | "out";

export const LOW_STOCK_MAX = 3;

export function stockFor(shoe: Shoe, size: number): number {
  return shoe.stock[String(size)] ?? 0;
}

export function stockStatus(quantity: number): StockStatus {
  if (quantity <= 0) return "out";
  if (quantity <= LOW_STOCK_MAX) return "low";
  return "in";
}

export function productStockStatus(shoe: Shoe): StockStatus {
  const available = shoe.sizes.map((size) => stockFor(shoe, size)).filter((q) => q > 0);
  if (available.length === 0) return "out";
  if (available.every((q) => q <= LOW_STOCK_MAX)) return "low";
  return "in";
}

export const STOCK_LABELS: Record<StockStatus, string> = {
  in: "In stock",
  low: "Low stock",
  out: "Out of stock",
};
