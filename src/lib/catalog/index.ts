import type { CartLine, CategorySlug, Product } from '../types';
import { brandName } from '../brands';
import { categoryName } from '../categories';
import { phones } from './phones';
import { laptops, monitors, tablets } from './computing';
import { audio, gaming, tvs } from './home-entertainment';
import { accessories, cameras, networking, printers, wearables } from './more';

export const products: Product[] = [
  ...phones,
  ...laptops,
  ...tvs,
  ...tablets,
  ...audio,
  ...gaming,
  ...wearables,
  ...monitors,
  ...cameras,
  ...printers,
  ...networking,
  ...accessories,
];

const bySlug = new Map(products.map((p) => [p.slug, p]));

export const productBySlug = (slug: string) => bySlug.get(slug);

export const byRank = (a: Product, b: Product) => (b.rank ?? 0) - (a.rank ?? 0);

export const inCategory = (slug: CategorySlug) => products.filter((p) => p.category === slug).sort(byRank);

export const byBrand = (slug: string) => products.filter((p) => p.brand === slug).sort(byRank);

export const deals = () => products.filter((p) => p.compareAt && p.compareAt > p.price).sort(byRank);

export const newArrivals = (n = 8) =>
  [...products].sort((a, b) => b.added.localeCompare(a.added) || byRank(a, b)).slice(0, n);

export const picks = () => products.filter((p) => p.badges?.includes('pick')).sort(byRank);

export const exUk = () => products.filter((p) => p.condition !== 'new').sort(byRank);

export const countIn = (slug: CategorySlug) => products.filter((p) => p.category === slug).length;

export const brandCount = (slug: string) => products.filter((p) => p.brand === slug).length;

/** Related items: same category first, then same brand. */
export function related(p: Product, n = 4) {
  const same = products.filter((x) => x.slug !== p.slug && x.category === p.category).sort(byRank);
  const brand = products.filter((x) => x.slug !== p.slug && x.brand === p.brand && x.category !== p.category).sort(byRank);
  return [...same, ...brand].slice(0, n);
}

export function searchText(p: Product) {
  return [p.name, brandName(p.brand), categoryName(p.category), p.tagline, p.keywords ?? '', p.condition]
    .join(' ')
    .toLowerCase();
}

const index = products.map((p) => ({ p, text: searchText(p) }));

/** Lightweight scored search — every term must match somewhere. */
export function search(query: string, limit?: number): Product[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z0-9.+"-]/g, ''))
    .filter(Boolean);
  if (!terms.length) return [];
  const scored = index
    .map(({ p, text }) => {
      let score = 0;
      for (const t of terms) {
        if (!text.includes(t)) return null;
        if (p.name.toLowerCase().includes(t)) score += 3;
        if (p.name.toLowerCase().startsWith(t)) score += 2;
        score += 1;
      }
      return { p, score: score + (p.rank ?? 0) / 100 };
    })
    .filter((x): x is { p: Product; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
  return limit ? scored.slice(0, limit) : scored;
}

/** Price of a product for a chosen option. */
export function unitPrice(p: Product, option?: string) {
  const delta = p.options?.values.find((v) => v.name === option)?.delta ?? 0;
  return p.price + delta;
}

export function comparePrice(p: Product, option?: string) {
  if (!p.compareAt) return undefined;
  const delta = p.options?.values.find((v) => v.name === option)?.delta ?? 0;
  return p.compareAt + delta;
}

export function lineId(slug: string, option?: string, colour?: string) {
  return [slug, option ?? '', colour ?? ''].join('|');
}

export interface PricedLine extends CartLine {
  product: Product;
  unit: number;
  total: number;
}

/** Resolve cart lines against the catalogue. Unknown products are dropped. */
export function priceLines(lines: CartLine[]): PricedLine[] {
  const out: PricedLine[] = [];
  for (const l of lines) {
    const product = productBySlug(l.slug);
    if (!product) continue;
    // Never trust variant names or quantities from the browser: keep only real options and cap at stock.
    const option = product.options?.values.some((v) => v.name === l.option) ? l.option : product.options?.values[0]?.name;
    const colour = product.colours?.some((c) => c.name === l.colour) ? l.colour : product.colours?.[0]?.name;
    const cap = Math.max(1, Math.min(10, product.stock || 1));
    const qty = Math.max(1, Math.min(cap, Math.floor(Number(l.qty) || 1)));
    const unit = unitPrice(product, option);
    out.push({ ...l, option, colour, qty, product, unit, total: unit * qty });
  }
  return out;
}

export const priceBands = [
  { id: 'u15', label: 'Under KES 15,000', min: 0, max: 15000 },
  { id: '15-50', label: 'KES 15,000 – 50,000', min: 15000, max: 50000 },
  { id: '50-100', label: 'KES 50,000 – 100,000', min: 50000, max: 100000 },
  { id: '100-200', label: 'KES 100,000 – 200,000', min: 100000, max: 200000 },
  { id: 'o200', label: 'Over KES 200,000', min: 200000, max: Infinity },
] as const;
