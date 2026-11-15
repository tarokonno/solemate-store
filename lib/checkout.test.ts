import { describe, expect, it } from "vitest";
import { addItem, emptyCart } from "./cart";
import { cardLast4, checkoutTotals, emptyCheckoutForm, validateCheckout, type CheckoutForm } from "./checkout";

const now = new Date(2026, 10, 15);

const valid: CheckoutForm = {
  name: "Sam Runner",
  email: "sam@example.com",
  fulfilment: "delivery",
  address: { line1: "12 Track St", suburb: "Fitzroy", state: "VIC", postcode: "3065" },
  card: { name: "Sam Runner", number: "4242 4242 4242 4242", expiry: "12/28", cvc: "123" },
};

const withCard = (card: Partial<CheckoutForm["card"]>): CheckoutForm => ({ ...valid, card: { ...valid.card, ...card } });

describe("validateCheckout", () => {
  it("accepts a complete delivery order", () => {
    expect(validateCheckout(valid, now)).toEqual({});
  });

  it("does not need an address for pickup", () => {
    const form = { ...valid, fulfilment: "pickup" as const, address: emptyCheckoutForm.address };
    expect(validateCheckout(form, now)).toEqual({});
  });

  it("requires every delivery address field", () => {
    const errors = validateCheckout({ ...valid, address: emptyCheckoutForm.address }, now);
    expect(Object.keys(errors).sort()).toEqual(["address.line1", "address.postcode", "address.state", "address.suburb"]);
  });

  it("flags an empty form", () => {
    const errors = validateCheckout(emptyCheckoutForm, now);
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors["card.number"]).toBeDefined();
  });

  it("rejects a bad email and postcode", () => {
    const errors = validateCheckout({ ...valid, email: "sam@", address: { ...valid.address, postcode: "30" } }, now);
    expect(errors.email).toBeDefined();
    expect(errors["address.postcode"]).toBeDefined();
  });

  it("rejects card numbers that fail the checksum", () => {
    expect(validateCheckout(withCard({ number: "4242 4242 4242 4241" }), now)["card.number"]).toBeDefined();
  });

  it("rejects expired cards and bad expiry formats", () => {
    expect(validateCheckout(withCard({ expiry: "10/26" }), now)["card.expiry"]).toBe("Card has expired");
    expect(validateCheckout(withCard({ expiry: "13/30" }), now)["card.expiry"]).toBe("Use MM/YY");
  });

  it("accepts a card expiring this month", () => {
    expect(validateCheckout(withCard({ expiry: "11/26" }), now)).toEqual({});
  });

  it("rejects a bad CVC", () => {
    expect(validateCheckout(withCard({ cvc: "12" }), now)["card.cvc"]).toBeDefined();
  });
});

describe("checkoutTotals", () => {
  const cart = addItem(emptyCart, { shoeId: "x", name: "x", size: 9, quantity: 1, unitPrice: 60 });

  it("charges shipping for delivery under the threshold", () => {
    expect(checkoutTotals(cart, "delivery")).toEqual({ subtotal: 60, discount: 0, shipping: 10, total: 70 });
  });

  it("never charges shipping for pickup", () => {
    expect(checkoutTotals(cart, "pickup")).toEqual({ subtotal: 60, discount: 0, shipping: 0, total: 60 });
  });
});

describe("cardLast4", () => {
  it("returns the last four digits", () => {
    expect(cardLast4("4242 4242 4242 1234")).toBe("1234");
  });
});
