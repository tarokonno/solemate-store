import { existsSync } from "node:fs";
import path from "node:path";
import type { Shoe } from "./types";

const EXTENSIONS = ["webp", "avif", "jpg", "jpeg", "png"];

export function findShoeImage(id: string): string | undefined {
  for (const ext of EXTENSIONS) {
    if (existsSync(path.join(process.cwd(), "public", "shoes", `${id}.${ext}`))) {
      return `/shoes/${id}.${ext}`;
    }
  }
  return undefined;
}

export function shoeImages(shoes: Shoe[]): Record<string, string> {
  const images: Record<string, string> = {};
  for (const shoe of shoes) {
    const src = findShoeImage(shoe.id);
    if (src) images[shoe.id] = src;
  }
  return images;
}
