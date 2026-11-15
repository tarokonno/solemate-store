import { CartView } from "@/components/CartView";
import { getShoes } from "@/lib/catalog";
import { shoeImages } from "@/lib/images";

export default function CartPage() {
  const shoes = getShoes();
  const colors = Object.fromEntries(shoes.map((s) => [s.id, s.color]));
  return <CartView images={shoeImages(shoes)} colors={colors} />;
}
