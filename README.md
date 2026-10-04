# Steff Store

**Genuine devices. Honest prices. Delivered.** — the electronics store of Steff Cloud Limited, Nakuru.

Laptops, TVs, smartphones, tablets, audio, gaming, smartwatches, monitors, cameras, printers, Wi‑Fi and
accessories, with M-Pesa checkout and delivery to all 47 counties. Built in the Steff Cloud web identity.

- **Brand guidelines** → [`docs/BRAND.md`](docs/BRAND.md)
- **Integrations / plugins needed** → [`docs/INTEGRATIONS.md`](docs/INTEGRATIONS.md)
- **Competitor research** → [`docs/RESEARCH.md`](docs/RESEARCH.md)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · plain CSS design tokens (no UI framework) ·
self-hosted Unbounded, Inter and Dela Gothic One. Every catalogue page is pre-rendered (158 pages); two
small API routes handle orders and M-Pesa.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint && npm run typecheck
```

Nothing in `.env.example` is required locally. Without M-Pesa keys, checkout still works and asks the
customer to confirm the order on WhatsApp.

## Pages

| Area | Routes |
|---|---|
| Landing | `/` |
| Browse | `/shop`, `/category/[slug]` (12), `/brands`, `/brands/[slug]` (30), `/deals`, `/search` |
| Product | `/product/[slug]` (87) |
| Buy | `/cart`, `/checkout`, `/checkout/success`, `/wishlist`, `/compare`, `/track-order` |
| Ways to buy | `/lipa-mdogo-mdogo`, `/trade-in`, `/business` |
| Company | `/about`, `/contact`, `/faq`, `/delivery`, `/warranty-returns` |
| Legal | `/privacy-policy`, `/terms`, `/cookie-policy` |
| API | `POST /api/orders`, `POST /api/mpesa/callback` |

## Where to edit things

| What | File |
|---|---|
| Phone, email, address, hours, socials, deal end date | `src/lib/site.ts` |
| Products, prices, stock, colours, specs | `src/lib/catalog/*.ts` |
| Categories and brands | `src/lib/categories.ts`, `src/lib/brands.ts` |
| Delivery zones and fees | `src/lib/delivery.ts` |
| Colours, spacing, type | `src/app/globals.css` (tokens at the top) |

## Before launch — please confirm

- **Prices and stock in `src/lib/catalog` are placeholder launch data.** Replace them with your live stock list.
- **Phone number** — the site uses +254 118 407 026 (from steffcloud.co.ke). Confirm it, or send the new line.
- **Delivery fees, warranty, returns and pay-on-delivery terms** are sensible defaults, not yet confirmed policy.
- **Lipa Mdogo Mdogo** needs a financing partner; the calculator shows indicative figures only.
- Have the privacy policy and terms of sale reviewed before you start trading.

## How orders flow

1. The customer checks out. `POST /api/orders` re-prices every line from the catalogue on the server, so
   prices sent by the browser are ignored.
2. If Daraja keys are set, the customer gets an M-Pesa STK prompt, and Safaricom posts the result to
   `/api/mpesa/callback`.
3. The order JSON goes to `ORDER_WEBHOOK_URL`, for example a Google Sheet. If no webhook is set, the
   confirmation page asks the customer to send the order on WhatsApp.
4. The customer can always message the store with their order number (`SS-XXXXXXXX`).
