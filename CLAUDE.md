# CLAUDE.md

- Install: `npm install`
- Run: `npm run dev` (http://localhost:3000)
- Test: `npm test` (Vitest, runs once and exits)
- Build/type-check: `npm run build`

Cart, discount, shipping, size-filter, stock-status and checkout-validation logic live as plain functions in `lib/`. Keep logic there, not in components, and add Vitest tests next to it (`lib/*.test.ts`). The catalog is `data/shoes.json`; there is no database. Stock in the JSON is fixed and is never decremented.
