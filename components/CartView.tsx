"use client";

import Link from "next/link";
import { useState } from "react";
import { calculateTotals } from "@/lib/cart";
import { useCart } from "./CartProvider";
import { ShoeImage } from "./ShoeImage";

const money = (n: number) => `A$${n.toFixed(2)}`;

export function CartView({ images, colors }: { images: Record<string, string>; colors: Record<string, string> }) {
  const { cart, remove, applyCode } = useCart();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const totals = calculateTotals(cart);

  if (cart.items.length === 0) {
    return (
      <section className="empty-cart">
        <h1>Your cart is empty</h1>
        <p className="muted">Find a pair you like and add it here.</p>
        <Link href="/" className="btn">Browse shoes</Link>
      </section>
    );
  }

  return (
    <>
      <h1 className="page-title">Your cart</h1>
      <div className="cart-layout">
        <ul className="cart-lines">
          {cart.items.map((item) => (
            <li key={`${item.shoeId}-${item.size}`}>
              <ShoeImage small name={item.name} color={colors[item.shoeId] ?? "#999999"} src={images[item.shoeId]} />
              <div className="line-info">
                <strong>{item.name}</strong>
                <span className="muted">US {item.size} · Qty {item.quantity}</span>
                <button className="link" onClick={() => remove(item.shoeId, item.size)}>Remove</button>
              </div>
              <span className="line-price">{money(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <aside className="summary">
          <form
            className="discount"
            onSubmit={(e) => {
              e.preventDefault();
              const ok = applyCode(code);
              setMessage(ok ? { ok, text: "Code applied." } : { ok, text: "That code isn't valid." });
              if (ok) setCode("");
            }}
          >
            <label htmlFor="code">Discount code</label>
            <div className="discount-row">
              <input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="RUN10" />
              <button type="submit" className="btn secondary">Apply</button>
            </div>
            {message && <p className={message.ok ? "ok" : "error"}>{message.text}</p>}
          </form>

          <dl className="totals">
            <dt>Subtotal</dt>
            <dd>{money(totals.subtotal)}</dd>
            {totals.discount > 0 && (
              <>
                <dt>Discount ({cart.discountCodes.join(", ")})</dt>
                <dd>−{money(totals.discount)}</dd>
              </>
            )}
            <dt>Shipping</dt>
            <dd>{totals.shipping === 0 ? "Free" : money(totals.shipping)}</dd>
            <dt className="total">Total</dt>
            <dd className="total">{money(totals.total)}</dd>
          </dl>
          <Link href="/checkout" className="btn block">Checkout</Link>
        </aside>
      </div>
    </>
  );
}
