import { calculateTotals } from "./cart";
import type { Cart, Totals } from "./types";

export type Fulfilment = "delivery" | "pickup";

export const PICKUP_LOCATION = "SoleMate Demo Store, 1 Example Lane, Melbourne VIC 3000";
export const AU_STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

export interface CheckoutForm {
  name: string;
  email: string;
  fulfilment: Fulfilment;
  address: { line1: string; suburb: string; state: string; postcode: string };
  card: { name: string; number: string; expiry: string; cvc: string };
}

export type CheckoutErrors = Partial<Record<string, string>>;

export const emptyCheckoutForm: CheckoutForm = {
  name: "",
  email: "",
  fulfilment: "delivery",
  address: { line1: "", suburb: "", state: "", postcode: "" },
  card: { name: "", number: "", expiry: "", cvc: "" },
};

export function checkoutTotals(cart: Cart, fulfilment: Fulfilment): Totals {
  const totals = calculateTotals(cart);
  if (fulfilment === "delivery") return totals;
  return { ...totals, shipping: 0, total: Math.round((totals.total - totals.shipping) * 100) / 100 };
}

const digits = (value: string) => value.replace(/[\s-]/g, "");

function passesLuhn(number: string): boolean {
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    let d = Number(number[number.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

function expiryError(expiry: string, now: Date): string | undefined {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(expiry.trim());
  if (!match) return "Use MM/YY";
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return "Use MM/YY";
  const lastValidMonth = year * 12 + month;
  if (lastValidMonth < now.getFullYear() * 12 + now.getMonth() + 1) return "Card has expired";
  return undefined;
}

export function validateCheckout(form: CheckoutForm, now: Date = new Date()): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (!form.name.trim()) errors.name = "Enter your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email";

  if (form.fulfilment === "delivery") {
    const { line1, suburb, state, postcode } = form.address;
    if (!line1.trim()) errors["address.line1"] = "Enter a street address";
    if (!suburb.trim()) errors["address.suburb"] = "Enter a suburb";
    if (!AU_STATES.includes(state)) errors["address.state"] = "Choose a state";
    if (!/^\d{4}$/.test(postcode.trim())) errors["address.postcode"] = "Use a 4-digit postcode";
  }

  const number = digits(form.card.number);
  if (!form.card.name.trim()) errors["card.name"] = "Enter the name on the card";
  if (!/^\d{13,19}$/.test(number) || !passesLuhn(number)) errors["card.number"] = "Enter a valid card number";
  const expiry = expiryError(form.card.expiry, now);
  if (expiry) errors["card.expiry"] = expiry;
  if (!/^\d{3,4}$/.test(form.card.cvc.trim())) errors["card.cvc"] = "Use 3 or 4 digits";

  return errors;
}

export function cardLast4(number: string): string {
  return digits(number).slice(-4);
}
