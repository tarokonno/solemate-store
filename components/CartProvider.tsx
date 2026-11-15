"use client";

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import { addItem, applyDiscountCode, emptyCart, removeItem } from "@/lib/cart";
import type { Cart, CartItem } from "@/lib/types";

type Action =
  | { type: "add"; item: CartItem }
  | { type: "remove"; shoeId: string; size: number }
  | { type: "discount"; code: string }
  | { type: "load"; cart: Cart };

function reducer(cart: Cart, action: Action): Cart {
  switch (action.type) {
    case "add":
      return addItem(cart, action.item);
    case "remove":
      return removeItem(cart, action.shoeId, action.size);
    case "discount":
      return applyDiscountCode(cart, action.code).cart;
    case "load":
      return action.cart;
  }
}

interface CartContextValue {
  cart: Cart;
  add: (item: CartItem) => void;
  remove: (shoeId: string, size: number) => void;
  applyCode: (code: string) => boolean;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "solemate-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(reducer, emptyCart);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "load", cart: JSON.parse(saved) as Cart });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, loaded]);

  const value: CartContextValue = {
    cart,
    add: (item) => dispatch({ type: "add", item }),
    remove: (shoeId, size) => dispatch({ type: "remove", shoeId, size }),
    applyCode: (code) => {
      const { ok } = applyDiscountCode(cart, code);
      if (ok) dispatch({ type: "discount", code });
      return ok;
    },
    clear: () => dispatch({ type: "load", cart: emptyCart }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
