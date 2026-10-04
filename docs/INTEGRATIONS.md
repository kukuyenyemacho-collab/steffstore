# Integrations ("plugins") Steff Store needs

The store runs today with **no paid services**: orders confirm on WhatsApp and nothing breaks if a key is
missing. Each integration below switches on by adding environment variables (see `.env.example`) or
editing one config file.

✅ = already built in, just needs your keys · 🔧 = small build task when you are ready

## A. Needed before taking real money

| # | Integration | Why | Status | What I need from you |
|---|---|---|---|---|
| 1 | **Safaricom Daraja — Lipa na M-Pesa Online (STK Push)** | Customer gets an M-Pesa PIN prompt at checkout; result comes back to `/api/mpesa/callback`. | ✅ `src/lib/mpesa.ts` | A Paybill or Till registered to Steff Cloud Limited, a Daraja app (Consumer Key + Secret) and the go-live **Passkey** from Safaricom. Test in sandbox first. |
| 2 | **Order inbox (webhook)** | Every order and M-Pesa result is POSTed as JSON. Easiest: a Google Apps Script web app that appends rows to a Google Sheet. Make, Zapier or n8n also work. | ✅ `ORDER_WEBHOOK_URL` | Where you want orders to land. I can write the Apps Script for you. |
| 3 | **Hosting + domain** | Vercel (free tier is fine to start) runs Next.js, including the API routes. | 🔧 | Domain choice: `store.steffcloud.co.ke` (free, a DNS record) or a new `steffstore.co.ke`. Set `NEXT_PUBLIC_SITE_URL`. |
| 4 | **WhatsApp Business** | Order confirmations, support, trade-in offers. The catalogue link is already in the footer. | ✅ | **Confirm the store number.** The site uses +254 118 407 026 from steffcloud.co.ke — tell me if the new line should replace it (`src/lib/site.ts`). |

## B. Strongly recommended in the first month

| # | Integration | Why | Status |
|---|---|---|---|
| 5 | **Supabase** (Postgres + Auth + Storage) | Real stock levels, an order database, product photos and an admin page for your team. Replaces the webhook and the hand-edited catalogue files. | 🔧 |
| 6 | **Google Analytics 4** | Traffic and conversion tracking. Loads only after cookie consent. | ✅ `NEXT_PUBLIC_GA4_ID` |
| 7 | **Google Search Console + sitemap** | Gets all 158 pages indexed. `sitemap.xml` and `robots.txt` are generated automatically. | ✅ just verify the domain |
| 8 | **Google Merchant Center** | Free product listings in Google Shopping. Product structured data is already on every product page. | 🔧 product feed |
| 9 | **Google Business Profile** | Map listing and **real** customer reviews for the Nakuru shop. | Set up by you |
| 10 | **Meta Pixel + TikTok Pixel** | Measure Facebook, Instagram and TikTok ads. Consent-gated. | ✅ `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID` |
| 11 | **Africa's Talking (SMS)** | "Order received", "Out for delivery" texts — works on every phone. | 🔧 |
| 12 | **Resend or Brevo (email)** | Email receipts from `orders@steffcloud.co.ke`. | 🔧 |
| 13 | **Courier account** | Pick Up Mtaani (agents countrywide), G4S, Wells Fargo or Fargo Courier. Their rates go into `src/lib/delivery.ts`. | 🔧 rates |
| 14 | **Lipa Mdogo Mdogo financing partner** | A licensed buy-now-pay-later or asset-finance partner (for example Lipa Later). The page and calculator are built; the partner does approval and collections. | 🔧 partner |

## C. Compliance (talk to your accountant and lawyer)

| # | Item | Notes |
|---|---|---|
| 15 | **KRA eTIMS** | Kenyan businesses must issue electronic tax invoices. Integrate through eTIMS (OSCU/VSCU) or a certified integrator as volume grows. |
| 16 | **ODPC registration** | Check whether Steff Cloud Limited must register as a data controller under the Data Protection Act 2019. The privacy and cookie policies are drafted to that Act. |
| 17 | **Consumer Protection Act 2012** | The warranty and returns policy references it — have it reviewed before launch. |

## D. Later, as you grow

| # | Integration | When |
|---|---|---|
| 18 | **Card payments** — Pesapal, Paystack or Flutterwave (Visa, Mastercard, Airtel Money) | When customers ask for card |
| 19 | **Meilisearch or Algolia** | Above ~500 products; built-in search handles today's catalogue instantly |
| 20 | **Genuine reviews** (post-purchase, stored in Supabase or Google) | After the first orders. Never seed fake reviews. |
| 21 | **WhatsApp Cloud API automation** | Auto-replies, order status bot — a natural Steff Cloud AI-automation project |
| 22 | **Sentry + an uptime monitor** | Error alerts and downtime alerts |

## What I need from you to go live

1. The store phone number (keep +254 118 407 026, or the new line?).
2. The domain.
3. Your real stock list: products, prices, quantities, colours, and photos when ready.
4. Courier choice and delivery fees (current fees are placeholders in `src/lib/delivery.ts`).
5. Confirmation of the warranty, returns and pay-on-delivery policies as written.
6. Daraja credentials (sandbox first), and where orders should land.
7. Your Facebook page URL (the other social links are already in place).
