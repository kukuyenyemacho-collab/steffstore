import type { Metadata } from 'next';
import { Suspense } from 'react';
import { deals } from '@/lib/catalog';
import { site } from '@/lib/site';
import Catalog, { StaticGrid } from '@/components/Catalog';
import Countdown from '@/components/Countdown';
import { PageHero } from '@/components/Bits';

export const metadata: Metadata = {
  title: `${site.dealsName} — real discounts on laptops, TVs & phones`,
  description: 'Genuine discounts on laptops, smart TVs, phones, audio and gaming at Steff Store. Every deal shows the previous price and a real end date.',
  alternates: { canonical: '/deals' },
};

export default function DealsPage() {
  const items = deals();
  return (
    <>
      <PageHero
        crumbs={[['Deals']]}
        eyebrow={site.dealsName}
        title="Real discounts. A real end date."
        lede="Every deal shows the price it was before and the date it ends. When the timer hits zero, prices go back — no fake countdowns that reset at midnight."
      >
        <div style={{ marginTop: 'var(--s-5)' }}>
          <Countdown to={site.dealsEndAt} />
        </div>
      </PageHero>
      <section className="section tight">
        <div className="wrap">
          <Suspense fallback={<StaticGrid products={items} />}>
            <Catalog products={items} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
