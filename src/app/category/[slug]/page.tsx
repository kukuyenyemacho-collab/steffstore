import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { categories, categoryBySlug } from '@/lib/categories';
import { brandName } from '@/lib/brands';
import { inCategory } from '@/lib/catalog';
import { money } from '@/lib/format';
import { site } from '@/lib/site';
import Catalog, { StaticGrid } from '@/components/Catalog';
import DeviceArt from '@/components/DeviceArt';
import { JsonLd, PageHero } from '@/components/Bits';

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) return {};
  return {
    title: c.seoTitle,
    description: `${c.intro} Pay with M-Pesa, delivery across Kenya from Steff Store, Nakuru.`,
    alternates: { canonical: `/category/${c.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) notFound();
  const items = inCategory(c.slug);
  const brands = [...new Set(items.map((p) => p.brand))];
  const from = Math.min(...items.map((p) => p.price));

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: c.name,
          url: `${site.url}/category/${c.slug}`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/product/${p.slug}`, name: p.name })),
          },
        }}
      />
      <PageHero
        crumbs={[['Shop', '/shop'], [c.name]]}
        eyebrow={`${items.length} products · from ${money(from)}`}
        title={c.name}
        lede={c.intro}
        art={<DeviceArt kind={c.art} seed={`cat-${c.slug}`} />}
      >
        <ul className="chips">
          {brands.slice(0, 8).map((b) => (
            <li key={b}>
              <Link href={`/category/${c.slug}?brand=${b}`}>{brandName(b)}</Link>
            </li>
          ))}
        </ul>
      </PageHero>
      <section className="section tight">
        <div className="wrap">
          <Suspense fallback={<StaticGrid products={items} />}>
            <Catalog products={items} showCategory={false} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
