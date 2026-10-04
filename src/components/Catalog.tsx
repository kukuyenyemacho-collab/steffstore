'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useRef } from 'react';
import type { CategorySlug, Condition, Product } from '@/lib/types';
import { brandName } from '@/lib/brands';
import { categories, categoryName } from '@/lib/categories';
import { byRank, priceBands, search } from '@/lib/catalog';
import ProductCard from './ProductCard';
import { Icon } from './Icon';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'discount';

const SORTS: [Sort, string][] = [
  ['featured', 'Featured'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['newest', 'Newest'],
  ['discount', 'Biggest saving'],
];

const CONDITIONS: [Condition, string][] = [
  ['new', 'Brand new'],
  ['ex-uk', 'Ex-UK (tested)'],
  ['refurbished', 'Refurbished'],
];

interface Props {
  products: Product[];
  /** Hide the category facet on category pages. */
  showCategory?: boolean;
  /** Hide the brand facet on brand pages. */
  showBrand?: boolean;
  /** Search page: results come from the `q` parameter. */
  searchMode?: boolean;
}

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

export default function Catalog({ products, showCategory = true, showBrand = true, searchMode = false }: Props) {
  const params = useSearchParams();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);

  const q = params.get('q') ?? '';
  const f = {
    cat: list(params.get('cat')),
    brand: list(params.get('brand')),
    price: params.get('price') ?? '',
    cond: list(params.get('cond')),
    stock: params.get('stock') === '1',
    deal: params.get('deal') === '1',
    sort: (params.get('sort') as Sort) || 'featured',
  };

  function update(next: Record<string, string | string[] | boolean | null>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      const val = Array.isArray(v) ? v.join(',') : typeof v === 'boolean' ? (v ? '1' : '') : (v ?? '');
      if (val && !(k === 'sort' && val === 'featured')) sp.set(k, val);
      else sp.delete(k);
    }
    const qs = sp.toString();
    window.history.replaceState(null, '', `${pathname}${qs ? `?${qs}` : ''}`);
  }

  const toggleIn = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const base = useMemo(() => (searchMode ? search(q) : products), [searchMode, q, products]);

  const filtered = (() => {
    const band = priceBands.find((b) => b.id === f.price);
    const out = base.filter(
      (p) =>
        (!f.cat.length || f.cat.includes(p.category)) &&
        (!f.brand.length || f.brand.includes(p.brand)) &&
        (!band || (p.price >= band.min && p.price < band.max)) &&
        (!f.cond.length || f.cond.includes(p.condition)) &&
        (!f.stock || p.stock > 0) &&
        (!f.deal || (p.compareAt ?? 0) > p.price),
    );
    const sorted = [...out];
    switch (f.sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => b.added.localeCompare(a.added));
        break;
      case 'discount':
        sorted.sort((a, b) => (b.compareAt ?? b.price) - b.price - ((a.compareAt ?? a.price) - a.price));
        break;
      default:
        if (!searchMode) sorted.sort(byRank);
    }
    return sorted;
  })();

  // Facet counts come from the unfiltered base so options never vanish while browsing.
  const brandOpts = useMemo(() => {
    const m = new Map<string, number>();
    base.forEach((p) => m.set(p.brand, (m.get(p.brand) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [base]);
  const catOpts = useMemo(() => {
    const m = new Map<CategorySlug, number>();
    base.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return categories.filter((c) => m.has(c.slug)).map((c) => [c.slug, m.get(c.slug)!] as const);
  }, [base]);
  const condOpts = CONDITIONS.filter(([c]) => base.some((p) => p.condition === c));

  const chips: [string, () => void][] = [
    ...f.cat.map((c): [string, () => void] => [categoryName(c as CategorySlug), () => update({ cat: f.cat.filter((x) => x !== c) })]),
    ...f.brand.map((b): [string, () => void] => [brandName(b), () => update({ brand: f.brand.filter((x) => x !== b) })]),
    ...(f.price ? [[priceBands.find((b) => b.id === f.price)?.label ?? f.price, () => update({ price: null })] as [string, () => void]] : []),
    ...f.cond.map((c): [string, () => void] => [CONDITIONS.find(([k]) => k === c)?.[1] ?? c, () => update({ cond: f.cond.filter((x) => x !== c) })]),
    ...(f.stock ? [['In stock', () => update({ stock: false })] as [string, () => void]] : []),
    ...(f.deal ? [['On deal', () => update({ deal: false })] as [string, () => void]] : []),
  ];

  const facets = (id: string) => (
    <>
      {showCategory && catOpts.length > 1 && (
        <div className="f-group">
          <h3>Category</h3>
          <ul>
            {catOpts.map(([slug, n]) => (
              <li key={slug}>
                <label>
                  <input type="checkbox" checked={f.cat.includes(slug)} onChange={() => update({ cat: toggleIn(f.cat, slug) })} />
                  {categoryName(slug)}
                  <small>{n}</small>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="f-group">
        <h3>Budget</h3>
        <ul>
          <li>
            <label>
              <input type="radio" name={`${id}-price`} checked={!f.price} onChange={() => update({ price: null })} />
              Any price
            </label>
          </li>
          {priceBands.map((b) => (
            <li key={b.id}>
              <label>
                <input type="radio" name={`${id}-price`} checked={f.price === b.id} onChange={() => update({ price: b.id })} />
                {b.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
      {showBrand && brandOpts.length > 1 && (
        <div className="f-group">
          <h3>Brand</h3>
          <ul>
            {brandOpts.map(([slug, n]) => (
              <li key={slug}>
                <label>
                  <input type="checkbox" checked={f.brand.includes(slug)} onChange={() => update({ brand: toggleIn(f.brand, slug) })} />
                  {brandName(slug)}
                  <small>{n}</small>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      {condOpts.length > 1 && (
        <div className="f-group">
          <h3>Condition</h3>
          <ul>
            {condOpts.map(([c, label]) => (
              <li key={c}>
                <label>
                  <input type="checkbox" checked={f.cond.includes(c)} onChange={() => update({ cond: toggleIn(f.cond, c) })} />
                  {label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="f-group">
        <h3>Show</h3>
        <ul>
          <li>
            <label>
              <input type="checkbox" checked={f.stock} onChange={() => update({ stock: !f.stock })} />
              In stock only
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" checked={f.deal} onChange={() => update({ deal: !f.deal })} />
              On deal
            </label>
          </li>
        </ul>
      </div>
    </>
  );

  return (
    <div className="catalog">
      <aside className="filters" aria-label="Filters">
        {facets('side')}
      </aside>
      <div>
        <div className="toolbar">
          <p className="count" aria-live="polite" style={{ margin: 0 }}>
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            {searchMode && q && <span className="muted"> for “{q}”</span>}
          </p>
          <div className="tb-right">
            <button className="btn btn-line btn-sm filter-btn" type="button" onClick={() => dialog.current?.showModal()}>
              <Icon name="filter" /> Filters{chips.length ? ` (${chips.length})` : ''}
            </button>
            <label className="sr" htmlFor="sort">
              Sort by
            </label>
            <select id="sort" className="select" value={f.sort} onChange={(e) => update({ sort: e.target.value })}>
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
        {chips.length > 0 && (
          <div className="active-filters">
            {chips.map(([label, clear]) => (
              <button key={label} type="button" onClick={clear} aria-label={`Remove filter ${label}`}>
                {label} <Icon name="close" />
              </button>
            ))}
            <button type="button" onClick={() => update({ cat: null, brand: null, price: null, cond: null, stock: null, deal: null })}>
              Clear all
            </button>
          </div>
        )}
        {filtered.length ? (
          <div className="p-grid three">
            {filtered.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>{searchMode && !q ? 'What are you looking for?' : 'Nothing matches — yet.'}</h2>
            <p>
              {searchMode && !q
                ? 'Type a product, brand or model in the search bar above.'
                : 'Try removing a filter, or tell us what you need on WhatsApp — we can usually source it within days.'}
            </p>
          </div>
        )}
      </div>
      <dialog ref={dialog} className="filter-dialog" aria-label="Filters">
        <div className="fd-head">
          <h2>Filters</h2>
          <button className="icon-btn" type="button" aria-label="Close filters" onClick={() => dialog.current?.close()}>
            <Icon name="close" />
          </button>
        </div>
        <div className="fd-body">{facets('dlg')}</div>
        <div className="fd-foot">
          <button className="btn btn-solid btn-block" type="button" onClick={() => dialog.current?.close()}>
            Show {filtered.length} products
          </button>
        </div>
      </dialog>
    </div>
  );
}

/** Server-rendered fallback (and no-JS view) while search params resolve. */
export function StaticGrid({ products }: { products: Product[] }) {
  return (
    <div className="catalog">
      <aside className="filters" aria-hidden="true" />
      <div>
        <div className="toolbar">
          <p className="count" style={{ margin: 0 }}>
            {products.length} products
          </p>
        </div>
        <div className="p-grid three">
          {products.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
