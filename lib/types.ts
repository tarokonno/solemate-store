export type ShoeType = "road" | "trail";

export type Category =
  | "neutral daily"
  | "max cushion"
  | "stability"
  | "tempo"
  | "long-run"
  | "race"
  | "trail";

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  type: ShoeType;
  category: Category;
  supportType: "neutral" | "stability";
  terrain: string;
  cushioning: "low" | "medium" | "high" | "max";
  dropMm: number;
  weightG: number;
  widths: string[];
  plated: boolean;
  bestFor: string;
  priceAud: number;
  color: string;
  sizes: number[];
  stock: Record<string, number>;
}

export interface CartItem {
  shoeId: string;
  name: string;
  size: number;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  items: CartItem[];
  discountCodes: string[];
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}
