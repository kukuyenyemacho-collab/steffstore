'use client';

import { productBySlug } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { SecHead } from './Bits';

export default function RecentlyViewed({ exclude }: { exclude?: string }) {
  const { recent } = useStore();
  const items = recent
    .filter((s) => s !== exclude)
    .map((s) => productBySlug(s))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);
  if (!items.length) return null;
  return (
    <section className="section">
      <div className="wrap">
        <SecHead eyebrow="Recently viewed" title="Pick up where you left off." />
        <div className="p-grid">
          {items.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
