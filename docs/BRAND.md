# Steff Store — Brand guidelines

Steff Store is a Steff Cloud platform. It uses the **Steff Cloud web identity** exactly as it ships on
steffcloud.co.ke's marketing site (`kukuyenyemacho-collab/steffcloudmarketing`): editorial monochrome,
ink and cream straight from the logo, chunky display type, orange for action and olive for proof.

All of it lives as tokens in `src/app/globals.css`. Change a colour there, never in a component.

---

## 1. Logo

| Use | File | Notes |
|---|---|---|
| Header mark | `public/brand/wordmark-mask.webp` | Drawn as a CSS mask, so it takes the text colour and flips in dark mode. |
| Footer, large | `public/brand/wordmark-black.png` | Same wordmark at higher resolution, also used as a mask. |
| Favicon / app icons | `public/favicon.ico`, `public/brand/icon-*.png`, `apple-touch-icon.png` | Cream mark on ink. |

**Lock-up:** the `steff cloud.` wordmark + a 1.5px vertical rule + **DEVICE STORE** in Unbounded 600,
uppercase, 0.08em tracking. This mirrors how the marketing site shows `digital marketing`.

**Never use the "Creative Agency" strapline.** It is the pre-incorporation identity and must not appear
anywhere that names Steff Cloud Limited. The strapline versions (`logo-black.*`, `logo-cream.png`) were
deliberately left out of this repo.

The katakana mark **ステフクラウド** ("Steff Cloud") in Dela Gothic One runs vertically in the footer, in
orange — a signature of the parent brand. Keep it as the parent name; the font is subset to those
glyphs only.

## 2. Colour

| Token | Light | Dark | Role |
|---|---|---|---|
| `--fg` (Ink) | `#0B0B0B` | `#F2F1EC` | Text, borders, solid buttons |
| `--bg` (Cream) | `#F5F4F0` | `#0E0E0D` | Page background |
| `--bg-2` | `#EBE9E2` | `#171715` | Tinted sections, product "studio" |
| `--bg-3` | `#DEDBD1` | `#24241F` | Offset shadows, tracks |
| `--fg-2` | `#3D3D3A` | `#CDCBC3` | Body copy |
| `--muted` | `#64635D` | `#A09E95` | Meta text |
| **`--accent` (Steff Orange)** | **`#FF5B1F`** | `#FF6A33` | **Primary action**: Add to cart, Checkout, deal badges, underline marks |
| `--accent-text` | `#C2410C` | `#FF8A5C` | Orange used *as text* (AA contrast on cream) |
| `--olive` | `#4F5D2F` | `#3D4A21` | Proof & calm: "Staff pick", savings, Lipa Mdogo Mdogo |
| `--olive-2` | `#6B7B3A` | `#A9BA68` | Ticks, in-stock dots |
| M-Pesa green | `#2F9E44` | — | Only on the M-PESA payment mark |
| WhatsApp green | `#1F8F4E` | — | Only on "Send on WhatsApp" buttons |

**Primary colour = Ink.** The brand is monochrome first. **Orange is the single action colour** — one
orange button per view where possible, so the next step is never in doubt. Olive is for reassurance,
never for calls to action.

> **Print vs web.** Steff Cloud's PDF/letterhead palette uses Orange `#E8600A`, Cream `#F5F0E6` and Ink
> `#0A0A0A`. The website (and this store) uses the brighter screen values above. Keep the two separate:
> screen tokens for anything digital, print tokens for documents. Separately, steffcloud.co.ke's
> `theme-color` meta is a dark green (`#14361C`) that matches neither palette and is worth fixing on the
> main site.

## 3. Typography

| Face | Use | Weights |
|---|---|---|
| **Unbounded** (`--display`) | Headlines, prices, numbers, labels | 700 headings · 800 prices · 900 hero |
| **Inter** (`--body`) | Body, UI, forms | 400 body · 500 nav · 600 buttons |
| **Dela Gothic One** (`--jp`) | ステフクラウド in the footer only | 400 |

All three are self-hosted from the Steff Cloud site under the SIL Open Font License
(`src/app/fonts/FONTS-LICENSE.txt`) — no Google Fonts requests.

Scale (fluid, `clamp()`): hero 2.2→3.6rem · H1 2.2→4.6rem · H2 1.6→2.7rem · H3 1.15rem · body 16px/1.6 ·
small 0.78–0.86rem. Headings use −0.02em tracking (−0.035em for 900 weight) and `text-wrap: balance`.
Prices always use `font-variant-numeric: tabular-nums`.

## 4. Whitespace (the 8-point rule)

Yes — whitespace is a real design rule, and this store is built on it. Every space is a step on an
8-point scale, so the rhythm stays consistent everywhere:

| Token | px | Typical use |
|---|---|---|
| `--s-1` | 4 | Icon nudges |
| `--s-2` | 8 | Gaps inside chips and badges |
| `--s-3` | 12 | Between related controls |
| `--s-4` | 16 | Card padding (mobile), grid gaps |
| `--s-5` | 24 | Card padding, gaps between groups |
| `--s-6` | 32 | Between components |
| `--s-7` | 48 | Between a heading block and its content |
| `--s-8` | 64 | Between page sections inside a page |
| `--s-9` | 96 | Footer top padding |
| `--section` | 64 → 128 | Vertical padding of every full-width section |

Rules:
- **One idea per section.** Each band has an eyebrow, one headline, at most one line of support, then content.
- **Breathing room beats density.** Kenyan competitors pack the homepage; we show fewer, clearer choices.
- **Measure:** body copy is capped at ~54–70 characters per line (`max-width: 54ch–70ch`).
- **Alternate bands** — cream → tint → ink — so sections separate without divider lines.

## 5. The rule of three

The director writes to the rule of three, and the store follows it: three-beat hero line
("Genuine devices. Honest prices. Delivered."), three trust points, three buying steps, three
use-case picks, three services (Lipa Mdogo Mdogo · Trade-in · Business), three highlights per product,
promises in two rows of three. Do not pad to four or trail to five in a block that could be three.

## 6. Shape, line and depth

- Radius: `22px` cards, `12px` inputs, `999px` pills and buttons.
- Borders: `1.5px solid var(--edge)` — the ink outline is the brand's main structural line.
- Depth: **flat offset shadows**, never blur — `8px 8px 0 var(--fg)` on hover, `14px 14px 0` on hero stages.
- Motion: small lifts (`translateY(-2px/-4px)`), the drawn orange underline, a rotated marquee band.
  All of it is disabled under `prefers-reduced-motion`.

## 7. Components

- **Buttons:** `btn-accent` (primary, orange), `btn-solid` (ink), `btn-line` (outline), `btn-wa` (WhatsApp only).
- **Eyebrow:** 26px orange dash + uppercase label, 0.14em tracking.
- **Kicker:** outlined pill with an orange dot.
- **Badges:** `Deal −10%` (orange), `Staff pick` (olive), `New` (outline), `Ex-UK` (olive tint).
- **Product card:** studio panel (`--art-bg`) on top, brand in small caps, name in Inter 600, price in Unbounded 800.

## 8. Voice

Plain, warm, specific and honest — the Steff Cloud values in copy:
*Move slower to go faster · Systems over chaos · Honesty in pricing · Quality before speed.*

- Say what it costs and when it ends. **No fake countdowns, no invented reviews, no "sold 1,000+" claims.**
- Use Kenyan context naturally: M-Pesa, KPLC outages, matatus, "Lipa Mdogo Mdogo", "Asante".
- Never claim certifications, partnerships or authorised-dealer status that are not in hand.
- Slogan: **"Your Digital Arm."** — three words, keep the full stop.

## 9. Product imagery

Until real photos arrive, every product uses an on-brand illustration (`src/components/DeviceArt.tsx`)
drawn in the brand palette, recoloured per product colour. When you add photography: shoot on a plain
cream/grey sweep, 4:3, product centred with a soft floor shadow, so it sits in the same frame.
