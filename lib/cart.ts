import type { Cart, CartItem, Totals } from "./types";

export const DISCOUNTS: Record<string, number> = { RUN10: 0.1 };
export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_FEE = 10;

export const emptyCart: Cart = { items: [], discountCodes: [] };

const roundCents = (value: number) => Math.round(value * 100) / 100;

const sameLine = (item: CartItem, shoeId: string, size: number) =>
  item.shoeId === shoeId && item.size === size;

export function addItem(cart: Cart, item: CartItem): Cart {
  const existing = cart.items.find((i) => sameLine(i, item.shoeId, item.size));
  if (!existing) return { ...cart, items: [...cart.items, item] };
  return {
    ...cart,
    items: cart.items.map((i) =>
      i === existing ? { ...i, quantity: i.quantity + item.quantity } : i,
    ),
  };
}

export function removeItem(cart: Cart, shoeId: string, size: number): Cart {
  return { ...cart, items: cart.items.filter((i) => !sameLine(i, shoeId, size)) };
}

export function itemCount(cart: Cart): number {
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}

export function applyDiscountCode(cart: Cart, code: string): { cart: Cart; ok: boolean } {
  const normalized = code.trim().toUpperCase();
  if (!(normalized in DISCOUNTS)) return { cart, ok: false };
  return { cart: { ...cart, discountCodes: [...cart.discountCodes, normalized] }, ok: true };
}

export function subtotal(cart: Cart): number {
  return roundCents(cart.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0));
}

export function discountAmount(cart: Cart): number {
  const rate = cart.discountCodes.reduce((sum, code) => sum + (DISCOUNTS[code] ?? 0), 0);
  return roundCents(subtotal(cart) * rate);
}

export function shipping(cart: Cart): number {
  if (cart.items.length === 0) return 0;
  const afterDiscount = subtotal(cart) - discountAmount(cart);
  return afterDiscount > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function calculateTotals(cart: Cart): Totals {
  const sub = subtotal(cart);
  const discount = discountAmount(cart);
  const ship = shipping(cart);
  return { subtotal: sub, discount, shipping: ship, total: roundCents(sub - discount + ship) };
}
