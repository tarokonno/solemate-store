import { ProductGrid } from "@/components/ProductGrid";
import { getShoes } from "@/lib/catalog";
import { shoeImages } from "@/lib/images";

export default function HomePage() {
  const shoes = getShoes();
  return (
    <>
      <section className="hero">
        <h1>Find your next pair.</h1>
        <p>Road and trail running shoes. Free shipping on orders of $100 or more, and 10% off with code <strong>RUN10</strong>.</p>
      </section>
      <ProductGrid shoes={shoes} images={shoeImages(shoes)} />
    </>
  );
}
