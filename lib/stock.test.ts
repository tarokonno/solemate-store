import { describe, expect, it } from "vitest";
import { getShoes } from "./catalog";
import { productStockStatus, stockFor, stockStatus } from "./stock";
import type { Shoe } from "./types";

const shoe = (stock: Record<string, number>): Shoe =>
  ({ id: "t", sizes: Object.keys(stock).map(Number), stock }) as Shoe;

describe("stockStatus", () => {
  it("classifies quantities", () => {
    expect(stockStatus(0)).toBe("out");
    expect(stockStatus(1)).toBe("low");
    expect(stockStatus(3)).toBe("low");
    expect(stockStatus(4)).toBe("in");
  });
});

describe("stockFor", () => {
  it("returns 0 for sizes not listed", () => {
    expect(stockFor(shoe({ "9": 5 }), 13)).toBe(0);
  });
});

describe("productStockStatus", () => {
  it("is out when every size is zero", () => {
    expect(productStockStatus(shoe({ "8": 0, "9": 0 }))).toBe("out");
  });

  it("is low when every available size is low", () => {
    expect(productStockStatus(shoe({ "8": 0, "9": 2, "10": 3 }))).toBe("low");
  });

  it("is in stock when any size has plenty", () => {
    expect(productStockStatus(shoe({ "8": 1, "9": 8 }))).toBe("in");
  });
});

describe("catalog stock", () => {
  const statuses = getShoes().map(productStockStatus);

  it("includes in-stock, low-stock and out-of-stock products", () => {
    expect(statuses).toContain("in");
    expect(statuses).toContain("low");
    expect(statuses).toContain("out");
  });

  it("has a fixed whole-number stock for every listed size", () => {
    for (const s of getShoes()) {
      for (const size of s.sizes) expect(Number.isInteger(s.stock[String(size)])).toBe(true);
    }
  });
});
