import type { Shoe } from "./types";

export function inStock(shoe: Shoe, size: number): boolean {
  return (shoe.stock[String(size)] ?? 0) > 0;
}

export function sizeOptions(shoes: Shoe[]): number[] {
  const sizes = new Set<number>();
  for (const shoe of shoes) {
    for (const size of shoe.sizes) sizes.add(size);
  }
  return [...sizes].sort((a, b) => a - b);
}

export function filterBySize(shoes: Shoe[], size: number | null): Shoe[] {
  if (size === null) return shoes;
  return shoes.filter((shoe) =>
    Object.entries(shoe.stock).some(
      ([key, qty]) => qty > 0 && Math.round(Number(key)) === Math.round(size),
    ),
  );
}
