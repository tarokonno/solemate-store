import type { Metadata } from "next";
import Link from "next/link";
import { CartLink } from "@/components/CartLink";
import { CartProvider } from "@/components/CartProvider";
import { Logo } from "@/components/Logo";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoleMate",
  description: "A fictional running shoe store demo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <header className="site-header">
            <div className="header-inner">
              <Link href="/" aria-label="SoleMate home">
                <Logo />
              </Link>
              <CartLink />
            </div>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <p>SoleMate is a fictional demo store. It is not affiliated with any brand or retailer.</p>
            <p>Shoe attributes are illustrative approximations, not manufacturer specs.</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
