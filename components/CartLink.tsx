"use client";

import Link from "next/link";
import { itemCount } from "@/lib/cart";
import { useCart } from "./CartProvider";

export function CartLink() {
  const { cart } = useCart();
  const count = itemCount(cart);
  return (
    <Link href="/cart" className="cart-link">
      Cart
      <span className="count">{count}</span>
    </Link>
  );
}
