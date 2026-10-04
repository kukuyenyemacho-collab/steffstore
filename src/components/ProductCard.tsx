import Link from 'next/link';
import type { Badge, Product } from '@/lib/types';
import { brandName } from '@/lib/brands';
import { money, pct } from '@/lib/format';
import DeviceArt from './DeviceArt';
import { QuickAdd, WishButton } from './ProductButtons';

// Shared (server + client) — no hooks here, interactive bits live in ProductButtons.

const BADGE_LABEL: Record<Badge, string> = { new: 'New', deal: 'Deal', pick: 'Staff pick', 'ex-uk': 'Ex-UK' };

export function Badges({ p }: { p: Product }) {
  const list = [...(p.badges ?? [])];
  if (p.compareAt && !list.includes('deal')) list.unshift('deal');
  if (p.condition === 'ex-uk' && !list.includes('ex-uk')) list.push('ex-uk');
  return (
    <>
      {list.slice(0, 2).map((b) => (
        <span key={b} className={`badge ${b}`}>
          {b === 'deal' && p.compareAt ? `−${pct(p.compareAt - p.price, p.compareAt)}%` : BADGE_LABEL[b]}
        </span>
      ))}
    </>
  );
}

export function Price({ now, was, compact = false }: { now: number; was?: number; compact?: boolean }) {
  const save = was && was > now ? was - now : 0;
  return (
    <div className="price">
      <span className="now">{money(now)}</span>
      {save > 0 && (
        <span>
          <span className="was">{money(was!)}</span>
          {!compact && <span className="save"> · Save {money(save)}</span>}
        </span>
      )}
    </div>
  );
}

export function StockNote({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="pc-stock">Out of stock · ask about restock</span>;
  if (stock <= 3) return <span className="pc-stock low">Only {stock} left</span>;
  return <span className="pc-stock">In stock · ships from Nakuru</span>;
}

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="p-card">
      <div className="pc-art">
        <DeviceArt kind={p.art} tone={p.colours?.[0]?.hex} seed={p.slug} />
      </div>
      <div className="pc-badges">
        <Badges p={p} />
      </div>
      <WishButton slug={p.slug} name={p.name} className="icon-btn pc-fav" />
      <div className="pc-body">
        <span className="pc-brand">{brandName(p.brand)}</span>
        <h3>
          <Link href={`/product/${p.slug}`}>{p.name}</Link>
        </h3>
        <p className="pc-line">{p.tagline}</p>
        <div className="pc-foot">
          <Price now={p.price} was={p.compareAt} compact />
          <QuickAdd p={p} />
        </div>
        <StockNote stock={p.stock} />
      </div>
    </article>
  );
}
