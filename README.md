# solemate-store

SoleMate is a fictional running shoe store, built with Next.js (App Router) and TypeScript. There is no database. The catalog of 24 road and trail shoes is loaded from `data/shoes.json`.

> **Disclaimer:** SoleMate is a fictional demo store. It is not affiliated with any brand or retailer. Shoe attributes (drop, weight, cushioning and so on) are illustrative approximations, not manufacturer specs. Prices are made up. No brand logos or manufacturer photos are included; shoes are shown as generic illustrations.

## Getting started

You need Node.js 20 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server on http://localhost:3000 |
| `npm test` | Runs the Vitest unit tests once |
| `npm run build` | Type-checks and builds for production |
| `npm start` | Serves the production build |

## Features

- Product grid with a size filter
- Cart with add and remove
- Discount code box: `RUN10` gives 10% off
- Shipping is A$10, or free on orders of $100 or more
- Checkout with delivery or click & collect (pickup is always free), an address form, and card details. It is a demo: no payment is taken and card details are never stored. Use test card `4242 4242 4242 4242`, any future expiry and any 3-digit CVC.
- Stock levels: every shoe has a fixed stock amount per size in `data/shoes.json`. Stock never changes when you order; it is there to show the states. A size with 0 is sold out, 1–3 is low stock, and 4 or more is in stock. Two shoes are fully sold out and two are low in every size.

## Project layout

- `app/`: pages (`/` product grid, `/cart` cart, `/checkout` checkout, `/checkout/success` order confirmation)
- `components/`: React components, including the cart context
- `lib/`: plain functions for cart, filter, stock and checkout logic, with tests in `*.test.ts`
- `data/shoes.json`: the catalog
- `.github/workflows/ci.yml`: runs `npm ci` and `npm test` on pull requests

## Product images

Each shoe shows a generic illustration in its catalog color. To use a real photo, add an image you have the rights to at `public/shoes/<id>.webp` (or `.avif`, `.jpg`, `.jpeg`, `.png`), where `<id>` is the shoe's `id` in `data/shoes.json`, for example `public/shoes/nike-pegasus.webp`. It is picked up automatically, no code changes needed.
