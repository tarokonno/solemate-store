"use client";

import { useState } from "react";
import { filterBySize, sizeOptions } from "@/lib/filter";
import type { Shoe } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ shoes, images }: { shoes: Shoe[]; images: Record<string, string> }) {
  const [size, setSize] = useState<number | null>(null);
  const visible = filterBySize(shoes, size);

  return (
    <>
      <div className="toolbar">
        <div className="size-pills" role="group" aria-label="Filter by size (US)">
          <button className={size === null ? "pill active" : "pill"} onClick={() => setSize(null)}>
            All sizes
          </button>
          {sizeOptions(shoes).map((s) => (
            <button key={s} className={size === s ? "pill active" : "pill"} onClick={() => setSize(s)}>
              {s}
            </button>
          ))}
        </div>
        <span className="muted">{visible.length} shoes</span>
      </div>
      <div className="grid">
        {visible.map((shoe) => (
          <ProductCard key={`${shoe.id}-${size}`} shoe={shoe} image={images[shoe.id]} preferredSize={size} />
        ))}
      </div>
      {visible.length === 0 && <p className="empty">No shoes in stock in that size.</p>}
    </>
  );
}
