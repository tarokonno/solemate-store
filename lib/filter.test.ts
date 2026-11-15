import { describe, expect, it } from "vitest";
import { getShoes } from "./catalog";
import { filterBySize, inStock, sizeOptions } from "./filter";
import type { Shoe } from "./types";

const shoe = (id: string, stock: Record<string, number>): Shoe => ({
  id,
  name: id,
  brand: "Test",
  type: "road",
  category: "neutral daily",
  supportType: "neutral",
  terrain: "Road",
  cushioning: "medium",
  dropMm: 8,
  weightG: 250,
  widths: ["Standard"],
  plated: false,
  bestFor: "Testing",
  priceAud: 150,
  color: "#000000",
  sizes: Object.keys(stock).map(Number),
  stock,
});

const shoes = [
  shoe("a", { "8": 2, "9": 0, "11": 1 }),
  shoe("b", { "9": 3, "12": 1 }),
  shoe("c", { "8": 0, "11": 4 }),
];

describe("filterBySize", () => {
  it("returns every shoe when no size is selected", () => {
    expect(filterBySize(shoes, null)).toBe(shoes);
  });

  it("returns only shoes with stock in the size", () => {
    expect(filterBySize(shoes, 11).map((s) => s.id)).toEqual(["a", "c"]);
  });

  it("excludes shoes that list the size with zero stock", () => {
    expect(filterBySize(shoes, 9).map((s) => s.id)).toEqual(["b"]);
  });

  it("returns nothing when no shoe stocks the size", () => {
    expect(filterBySize(shoes, 7)).toEqual([]);
  });
});

describe("inStock and sizeOptions", () => {
  it("checks stock for one size", () => {
    expect(inStock(shoes[0], 8)).toBe(true);
    expect(inStock(shoes[0], 9)).toBe(false);
    expect(inStock(shoes[0], 10)).toBe(false);
  });

  it("lists unique sizes in ascending order", () => {
    expect(sizeOptions(shoes)).toEqual([8, 9, 11, 12]);
  });
});

describe("catalog", () => {
  const all = getShoes();

  it("has 14 road and 10 trail shoes", () => {
    expect(all).toHaveLength(24);
    expect(all.filter((s) => s.type === "road")).toHaveLength(14);
    expect(all.filter((s) => s.type === "trail")).toHaveLength(10);
  });

  it("uses unique ids and positive prices", () => {
    expect(new Set(all.map((s) => s.id)).size).toBe(24);
    expect(all.every((s) => s.priceAud > 0)).toBe(true);
  });
});
