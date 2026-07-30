# Sirya storefront

Original Next.js frontend for **Sirya**, a home textiles brand (bedsheets,
comforters, blankets), now wired to the `sirya-backend` Express + sql.js API.

## Design tokens

- Background: `#F7F2E9` (raw cotton)
- Primary: `#1F3D3B` (deep pine-indigo)
- Accent: `#C99A2E` (turmeric)
- Sale tag: `#A85C6B` (dusty rose)
- Display font: Fraunces · Body font: Inter

## Setup

1. Start the backend first (see `sirya-backend/README.md`) — it should be
   running on `http://localhost:4000`.
2. Then:

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

## Structure

```
app/
  layout.tsx            Root layout (Header + Footer)
  page.tsx               Home page — fetches products from the API
  category/[slug]/       Product listing — fetches by category
  product/[slug]/        Product detail (server fetch + client interactivity)
  cart/                   Cart — shows bundle discount progress
  checkout/               Checkout — creates a real order via the API
  order/[id]/success/    Order confirmation
  login/, signup/         Auth forms wired to the backend
  account/                 Order history for the signed-in user
  wishlist/                Saved products (requires sign-in)
components/
  layout/                 Header, Footer
  product/                ProductCard — includes wishlist heart toggle
store/
  cartStore.ts             Cart state (keyed by variant id)
  userStore.ts              Session state (sessionStorage-backed)
  wishlistStore.ts           Wishlist ids, synced with the backend
lib/
  api.ts                   Typed client for the backend API
```

## Bundle discount

The cart and checkout pages fetch `GET /api/bundle-rule` and show a progress
bar toward the discount threshold. This is **display-only** — the actual
discount applied to what the customer pays is recalculated server-side in
`POST /api/orders`, so nothing here can be spoofed by editing client state.

## Wishlist

The heart icon on `ProductCard` calls `wishlistStore.toggle()`, which
optimistically updates the UI and syncs with `/api/wishlist`. If the request
fails (user isn't signed in), it rolls back and redirects to `/login`.

## How auth works right now

`api.ts` reads a JWT from `sessionStorage` (cleared when the tab closes) and
attaches it as `Authorization: Bearer <token>` on every request. This is
fine for getting the MVP working end to end. Before going live, move the
token into an httpOnly cookie set by a Next.js route handler instead —
`sessionStorage` is readable by any script on the page, which is a real risk
if a dependency is ever compromised (XSS).

## Next steps

1. Add real product photography to `/public/images`.
2. Wire the checkout button to Razorpay once the backend's
   `orders.create` + verify flow is built (see `sirya-backend/README.md`).
3. Move the JWT from `sessionStorage` to an httpOnly cookie.
4. Add a `/wishlist` page backed by a new backend table, following the same
   pattern as orders.
