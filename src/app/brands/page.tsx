import type { Metadata } from 'next';
import Link from 'next/link';
import { brands } from '@/lib/brands';
import { brandCount } from '@/lib/catalog';
import { PageHero } from '@/components/Bits';

export const metadata: Metadata = {
  title: 'Shop by brand',
  description: 'Apple, Samsung, HP, Dell, Lenovo, LG, Sony, Tecno, Infinix, JBL, PlayStation and more — genuine devices from the brands you trust at Steff Store.',
  alternates: { canonical: '/brands' },
};

export default function BrandsPage() {
  const sorted = [...brands].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <PageHero crumbs={[['Brands']]} eyebrow={`${brands.length} brands`} title="The names you trust, in one place." lede="Every brand we stock, A to Z. Tap one to see everything we carry from them." />
      <section className="section tight">
        <div className="wrap">
          <div className="brand-grid">
            {sorted.map((b) => (
              <Link key={b.slug} href={`/brands/${b.slug}`}>
                <span>
                  {b.name}
                  <small>{brandCount(b.slug)} products</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
