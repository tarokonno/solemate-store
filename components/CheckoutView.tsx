"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  AU_STATES,
  cardLast4,
  checkoutTotals,
  emptyCheckoutForm,
  PICKUP_LOCATION,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutForm,
  type Fulfilment,
} from "@/lib/checkout";
import { useCart } from "./CartProvider";

export const ORDER_KEY = "solemate-last-order";
const money = (n: number) => `A$${n.toFixed(2)}`;

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className={error ? "field has-error" : "field"}>
      <span>{label}</span>
      {children}
      {error && <small className="error">{error}</small>}
    </label>
  );
}

export function CheckoutView() {
  const { cart, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<CheckoutForm>(emptyCheckoutForm);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const totals = checkoutTotals(cart, form.fulfilment);

  const update = (next: CheckoutForm) => {
    setForm(next);
    if (submitted) setErrors(validateCheckout(next));
  };
  const setAddress = (key: keyof CheckoutForm["address"], value: string) =>
    update({ ...form, address: { ...form.address, [key]: value } });
  const setCard = (key: keyof CheckoutForm["card"], value: string) =>
    update({ ...form, card: { ...form.card, [key]: value } });

  if (cart.items.length === 0) {
    return (
      <section className="empty-cart">
        <h1>Nothing to check out</h1>
        <p className="muted">Your cart is empty.</p>
        <Link href="/" className="btn">Browse shoes</Link>
      </section>
    );
  }

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validateCheckout(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const order = {
      number: `SM-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      name: form.name.trim(),
      email: form.email.trim(),
      fulfilment: form.fulfilment,
      address:
        form.fulfilment === "delivery"
          ? `${form.address.line1}, ${form.address.suburb} ${form.address.state} ${form.address.postcode}`
          : PICKUP_LOCATION,
      cardLast4: cardLast4(form.card.number),
      items: cart.items,
      totals,
    };
    try {
      sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {}
    clear();
    router.push("/checkout/success");
  };

  return (
    <>
      <h1 className="page-title">Checkout</h1>
      <form className="cart-layout" onSubmit={placeOrder} noValidate>
        <div className="checkout-steps">
          <section className="panel">
            <h2>Contact</h2>
            <div className="field-grid">
              <Field label="Full name" error={errors.name}>
                <input autoComplete="name" value={form.name} onChange={(e) => update({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" autoComplete="email" value={form.email} onChange={(e) => update({ ...form, email: e.target.value })} />
              </Field>
            </div>
          </section>

          <section className="panel">
            <h2>Delivery or pickup</h2>
            <div className="choice-row">
              {(["delivery", "pickup"] as Fulfilment[]).map((option) => (
                <label key={option} className={form.fulfilment === option ? "choice active" : "choice"}>
                  <input
                    type="radio"
                    name="fulfilment"
                    checked={form.fulfilment === option}
                    onChange={() => update({ ...form, fulfilment: option })}
                  />
                  <strong>{option === "delivery" ? "Delivery" : "Click & collect"}</strong>
                  <span className="muted">
                    {option === "delivery" ? "A$10, free on orders of $100 or more" : "Free, ready in 2 hours"}
                  </span>
                </label>
              ))}
            </div>
            {form.fulfilment === "delivery" ? (
              <div className="field-grid">
                <Field label="Street address" error={errors["address.line1"]}>
                  <input autoComplete="address-line1" value={form.address.line1} onChange={(e) => setAddress("line1", e.target.value)} />
                </Field>
                <Field label="Suburb" error={errors["address.suburb"]}>
                  <input autoComplete="address-level2" value={form.address.suburb} onChange={(e) => setAddress("suburb", e.target.value)} />
                </Field>
                <Field label="State" error={errors["address.state"]}>
                  <select value={form.address.state} onChange={(e) => setAddress("state", e.target.value)}>
                    <option value="">Choose…</option>
                    {AU_STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Postcode" error={errors["address.postcode"]}>
                  <input inputMode="numeric" autoComplete="postal-code" maxLength={4} value={form.address.postcode} onChange={(e) => setAddress("postcode", e.target.value)} />
                </Field>
              </div>
            ) : (
              <p className="pickup-note">Pick up from {PICKUP_LOCATION}.</p>
            )}
          </section>

          <section className="panel">
            <h2>Payment</h2>
            <p className="demo-note">Demo only. No payment is taken and card details are not stored. Use test card 4242 4242 4242 4242.</p>
            <div className="field-grid">
              <Field label="Name on card" error={errors["card.name"]}>
                <input autoComplete="cc-name" value={form.card.name} onChange={(e) => setCard("name", e.target.value)} />
              </Field>
              <Field label="Card number" error={errors["card.number"]}>
                <input inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" value={form.card.number} onChange={(e) => setCard("number", e.target.value)} />
              </Field>
              <Field label="Expiry" error={errors["card.expiry"]}>
                <input autoComplete="cc-exp" placeholder="MM/YY" maxLength={5} value={form.card.expiry} onChange={(e) => setCard("expiry", e.target.value)} />
              </Field>
              <Field label="CVC" error={errors["card.cvc"]}>
                <input inputMode="numeric" autoComplete="cc-csc" maxLength={4} value={form.card.cvc} onChange={(e) => setCard("cvc", e.target.value)} />
              </Field>
            </div>
          </section>
        </div>

        <aside className="summary">
          <h2>Order summary</h2>
          <ul className="summary-lines">
            {cart.items.map((item) => (
              <li key={`${item.shoeId}-${item.size}`}>
                <span>{item.name} · US {item.size} × {item.quantity}</span>
                <span>{money(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <dt>Subtotal</dt>
            <dd>{money(totals.subtotal)}</dd>
            {totals.discount > 0 && (
              <>
                <dt>Discount</dt>
                <dd>−{money(totals.discount)}</dd>
              </>
            )}
            <dt>{form.fulfilment === "pickup" ? "Pickup" : "Shipping"}</dt>
            <dd>{totals.shipping === 0 ? "Free" : money(totals.shipping)}</dd>
            <dt className="total">Total</dt>
            <dd className="total">{money(totals.total)}</dd>
          </dl>
          {submitted && Object.keys(errors).length > 0 && <p className="error">Please fix the highlighted fields.</p>}
          <button type="submit" className="btn block">Place order</button>
          <Link href="/cart" className="back-link">← Back to cart</Link>
        </aside>
      </form>
    </>
  );
}
