import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { brandBySlug, brands } from '@/lib/brands';
import { byBrand } from '@/lib/catalog';
import Catalog, { StaticGrid } from '@/components/Catalog';
import { PageHero } from '@/components/Bits';

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = brandBySlug(slug);
  if (!b) return {};
  return {
    title: `${b.name} in Kenya — genuine ${b.name} devices`,
    description: `Buy genuine ${b.name} in Kenya: ${b.blurb} Pay with M-Pesa, warranty and delivery from Steff Store, Nakuru.`,
    alternates: { canonical: `/brands/${b.slug}` },
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = brandBySlug(slug);
  if (!b) notFound();
  const items = byBrand(b.slug);
  return (
    <>
      <PageHero crumbs={[['Brands', '/brands'], [b.name]]} eyebrow={`${items.length} products`} title={`Genuine ${b.name}.`} lede={b.blurb} />
      <section className="section tight">
        <div className="wrap">
          <Suspense fallback={<StaticGrid products={items} />}>
            <Catalog products={items} showBrand={false} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
