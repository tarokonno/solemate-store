"use client";

import { useState } from "react";
import { productStockStatus, STOCK_LABELS, stockFor, stockStatus } from "@/lib/stock";
import type { Shoe } from "@/lib/types";
import { useCart } from "./CartProvider";
import { ShoeImage } from "./ShoeImage";

function sizeLabel(shoe: Shoe, size: number): string {
  const qty = stockFor(shoe, size);
  const status = stockStatus(qty);
  if (status === "out") return `US ${size} · sold out`;
  if (status === "low") return `US ${size} · ${qty} left`;
  return `US ${size}`;
}

export function ProductCard({ shoe, image, preferredSize }: { shoe: Shoe; image?: string; preferredSize: number | null }) {
  const { add } = useCart();
  const status = productStockStatus(shoe);
  const available = shoe.sizes.filter((s) => stockFor(shoe, s) > 0);
  const initial = preferredSize !== null && available.includes(preferredSize) ? preferredSize : available[0];
  const [size, setSize] = useState<number | undefined>(initial);
  const [added, setAdded] = useState(false);
  const selected = size !== undefined && available.includes(size) ? size : initial;
  const selectedQty = selected !== undefined ? stockFor(shoe, selected) : 0;

  return (
    <article className={status === "out" ? "card sold-out" : "card"}>
      <div className="image-wrap">
        <ShoeImage name={shoe.name} color={shoe.color} src={image} />
        <span className={`stock-badge ${status}`}>{STOCK_LABELS[status]}</span>
      </div>
      <div className="card-body">
        <div className="badges">
          <span className="badge">{shoe.type === "road" ? "Road" : "Trail"}</span>
          {shoe.category !== shoe.type && <span className="badge">{shoe.category}</span>}
          {shoe.supportType === "stability" && shoe.category !== "stability" && <span className="badge">Stability</span>}
          {shoe.plated && <span className="badge accent">Plated</span>}
        </div>
        <p className="brand">{shoe.brand}</p>
        <h2>{shoe.name}</h2>
        <p className="best-for">{shoe.bestFor}</p>
        <dl className="specs">
          <div><dt>Drop</dt><dd>{shoe.dropMm} mm</dd></div>
          <div><dt>Weight</dt><dd>{shoe.weightG} g</dd></div>
          <div><dt>Cushion</dt><dd className="cap">{shoe.cushioning}</dd></div>
        </dl>
        <p className="details">{shoe.terrain} · Widths: {shoe.widths.join(", ")}</p>
        <div className="card-foot">
          <span className="price">A${shoe.priceAud}</span>
          {status === "out" ? (
            <button className="btn" disabled>Sold out</button>
          ) : (
            <div className="buy">
              <select aria-label={`Size for ${shoe.name}`} value={selected} onChange={(e) => setSize(Number(e.target.value))}>
                {shoe.sizes.map((s) => (
                  <option key={s} value={s} disabled={stockFor(shoe, s) === 0}>
                    {sizeLabel(shoe, s)}
                  </option>
                ))}
              </select>
              <button
                className={added ? "btn added" : "btn"}
                onClick={() => {
                  add({ shoeId: shoe.id, name: shoe.name, size: selected!, quantity: 1, unitPrice: shoe.priceAud });
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1200);
                }}
              >
                {added ? "Added ✓" : "Add"}
              </button>
            </div>
          )}
        </div>
        {status !== "out" && stockStatus(selectedQty) === "low" && (
          <p className="low-note">Only {selectedQty} left in US {selected}</p>
        )}
      </div>
    </article>
  );
}
