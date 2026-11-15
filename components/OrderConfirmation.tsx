"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CartItem, Totals } from "@/lib/types";
import { ORDER_KEY } from "./CheckoutView";

interface Order {
  number: string;
  name: string;
  email: string;
  fulfilment: "delivery" | "pickup";
  address: string;
  cardLast4: string;
  items: CartItem[];
  totals: Totals;
}

const money = (n: number) => `A$${n.toFixed(2)}`;

export function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(ORDER_KEY);
      setOrder(saved ? (JSON.parse(saved) as Order) : null);
    } catch {
      setOrder(null);
    }
  }, []);

  if (order === undefined) return null;

  if (order === null) {
    return (
      <section className="empty-cart">
        <h1>No recent order</h1>
        <Link href="/" className="btn">Browse shoes</Link>
      </section>
    );
  }

  return (
    <section className="confirmation panel">
      <div className="tick" aria-hidden="true">✓</div>
      <h1>Thanks, {order.name.split(" ")[0]}!</h1>
      <p className="muted">
        Order <strong>{order.number}</strong> is confirmed. This is a demo, so no payment was taken and nothing will ship.
      </p>
      <dl className="order-facts">
        <dt>{order.fulfilment === "delivery" ? "Delivering to" : "Pick up from"}</dt>
        <dd>{order.address}</dd>
        <dt>Confirmation email</dt>
        <dd>{order.email}</dd>
        <dt>Paid with</dt>
        <dd>Card ending {order.cardLast4}</dd>
      </dl>
      <ul className="summary-lines">
        {order.items.map((item) => (
          <li key={`${item.shoeId}-${item.size}`}>
            <span>{item.name} · US {item.size} × {item.quantity}</span>
            <span>{money(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="totals">
        <dt>Subtotal</dt>
        <dd>{money(order.totals.subtotal)}</dd>
        {order.totals.discount > 0 && (
          <>
            <dt>Discount</dt>
            <dd>−{money(order.totals.discount)}</dd>
          </>
        )}
        <dt>{order.fulfilment === "pickup" ? "Pickup" : "Shipping"}</dt>
        <dd>{order.totals.shipping === 0 ? "Free" : money(order.totals.shipping)}</dd>
        <dt className="total">Total</dt>
        <dd className="total">{money(order.totals.total)}</dd>
      </dl>
      <Link href="/" className="btn">Keep shopping</Link>
    </section>
  );
}
