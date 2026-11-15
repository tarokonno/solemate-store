import { describe, expect, it } from "vitest";
import {
  addItem,
  applyDiscountCode,
  calculateTotals,
  emptyCart,
  itemCount,
  removeItem,
  SHIPPING_FEE,
  subtotal,
} from "./cart";
import type { CartItem } from "./types";

const item = (overrides: Partial<CartItem> = {}): CartItem => ({
  shoeId: "nike-pegasus",
  name: "Nike Pegasus",
  size: 9,
  quantity: 1,
  unitPrice: 190,
  ...overrides,
});

describe("addItem", () => {
  it("adds a new line to an empty cart", () => {
    const cart = addItem(emptyCart, item());
    expect(cart.items).toHaveLength(1);
    expect(itemCount(cart)).toBe(1);
  });

  it("merges quantity for the same shoe and size", () => {
    const cart = addItem(addItem(emptyCart, item()), item({ quantity: 2 }));
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(3);
  });

  it("keeps different sizes as separate lines", () => {
    const cart = addItem(addItem(emptyCart, item()), item({ size: 10 }));
    expect(cart.items).toHaveLength(2);
  });

  it("does not mutate the original cart", () => {
    addItem(emptyCart, item());
    expect(emptyCart.items).toHaveLength(0);
  });
});

describe("removeItem", () => {
  it("removes the matching line", () => {
    const cart = addItem(addItem(emptyCart, item()), item({ size: 10 }));
    const next = removeItem(cart, "nike-pegasus", 9);
    expect(next.items).toEqual([item({ size: 10 })]);
  });

  it("is a no-op when the line is not in the cart", () => {
    const cart = addItem(emptyCart, item());
    expect(removeItem(cart, "brooks-ghost", 9).items).toEqual(cart.items);
  });
});

describe("applyDiscountCode", () => {
  it("accepts RUN10 regardless of case and whitespace", () => {
    const { ok, cart } = applyDiscountCode(emptyCart, "  run10 ");
    expect(ok).toBe(true);
    expect(cart.discountCodes).toEqual(["RUN10"]);
  });

  it("rejects unknown codes and leaves the cart unchanged", () => {
    const { ok, cart } = applyDiscountCode(emptyCart, "FREESHOES");
    expect(ok).toBe(false);
    expect(cart).toBe(emptyCart);
  });
});

describe("calculateTotals", () => {
  it("returns zeros for an empty cart", () => {
    expect(calculateTotals(emptyCart)).toEqual({ subtotal: 0, discount: 0, shipping: 0, total: 0 });
  });

  it("sums line prices by quantity", () => {
    const cart = addItem(addItem(emptyCart, item({ quantity: 2 })), item({ shoeId: "x", unitPrice: 25 }));
    expect(subtotal(cart)).toBe(405);
  });

  it("charges shipping below the free shipping threshold", () => {
    const cart = addItem(emptyCart, item({ unitPrice: 60 }));
    expect(calculateTotals(cart)).toEqual({ subtotal: 60, discount: 0, shipping: SHIPPING_FEE, total: 70 });
  });

  it("ships free well above the threshold", () => {
    const cart = addItem(emptyCart, item({ unitPrice: 250 }));
    expect(calculateTotals(cart).shipping).toBe(0);
    expect(calculateTotals(cart).total).toBe(250);
  });

  it("takes 10% off with RUN10", () => {
    const { cart } = applyDiscountCode(addItem(emptyCart, item({ unitPrice: 200 })), "RUN10");
    expect(calculateTotals(cart)).toEqual({ subtotal: 200, discount: 20, shipping: 0, total: 180 });
  });

  it("rounds the discount to cents", () => {
    const { cart } = applyDiscountCode(addItem(emptyCart, item({ unitPrice: 33.33 })), "RUN10");
    expect(calculateTotals(cart).discount).toBe(3.33);
  });
});
