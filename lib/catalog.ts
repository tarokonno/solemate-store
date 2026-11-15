import shoesData from "../data/shoes.json";
import type { Shoe } from "./types";

const shoes = shoesData as Shoe[];

export function getShoes(): Shoe[] {
  return shoes;
}

export function getShoe(id: string): Shoe | undefined {
  return shoes.find((shoe) => shoe.id === id);
}
