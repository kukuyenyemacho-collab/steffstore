import type { Metadata } from 'next';
import { Suspense } from 'react';
import { products } from '@/lib/catalog';
import Catalog, { StaticGrid } from '@/components/Catalog';
import { PageHero } from '@/components/Bits';

export const metadata: Metadata = {
  title: 'Shop all devices',
  description: 'Browse every laptop, TV, smartphone, tablet, audio, gaming and office device at Steff Store. Filter by brand, budget and condition. Delivery across Kenya.',
  alternates: { canonical: '/shop' },
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        crumbs={[['Shop']]}
        eyebrow="All devices"
        title="Every device, one honest price list."
        lede={`${products.length} products across 12 departments. Filter by budget, brand and condition — prices include VAT where applicable.`}
      />
      <section className="section tight">
        <div className="wrap">
          <Suspense fallback={<StaticGrid products={products} />}>
            <Catalog products={products} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
