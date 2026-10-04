import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { brandName } from '@/lib/brands';
import { categoryBySlug } from '@/lib/categories';
import { productBySlug, products, related } from '@/lib/catalog';
import { money } from '@/lib/format';
import { site, waLink } from '@/lib/site';
import ProductView from '@/components/ProductView';
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from '@/components/RecentlyViewed';
import { Crumbs, Faq, JsonLd, SecHead, SeeAll } from '@/components/Bits';
import { WhatsAppIcon } from '@/components/Icon';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  const title = `${p.name} — ${money(p.price)}`;
  const description = `Buy the ${p.name} in Kenya for ${money(p.price)}. ${p.tagline} ${p.warranty}, pay with M-Pesa, delivery across Kenya.`;
  return {
    title,
    description,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title, description, type: 'website', url: `/product/${p.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();
  const cat = categoryBySlug(p.category)!;
  const more = related(p, 4);
  const brand = brandName(p.brand);

  const faq: [string, string][] = [
    [`Is this ${p.name} genuine?`, p.condition === 'new' ? `Yes. It is brand new, sealed in the box, and comes with ${p.warranty.toLowerCase()}.` : `Yes. It is a genuine ${brand} imported ex-UK, graded and fully tested, with ${p.warranty.toLowerCase()}.`],
    ['How fast can I get it?', 'Same day in Nakuru town if you order by 3pm, 1–2 working days to Nairobi and major towns, and 2–5 days elsewhere in Kenya.'],
    ['Can I pay in instalments?', 'Yes — most items over KES 10,000 qualify for Lipa Mdogo Mdogo: a deposit today and the balance in monthly M-Pesa payments, subject to approval.'],
  ];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name,
          description: p.description,
          brand: { '@type': 'Brand', name: brand },
          category: cat.name,
          sku: p.slug,
          image: `${site.url}/og.png`,
          offers: {
            '@type': 'Offer',
            url: `${site.url}/product/${p.slug}`,
            priceCurrency: 'KES',
            price: p.price,
            availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: p.condition === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/RefurbishedCondition',
            seller: { '@type': 'Organization', name: site.legalName },
            areaServed: 'KE',
          },
        }}
      />
      <div className="wrap" style={{ paddingTop: 'var(--s-5)' }}>
        <Crumbs items={[['Shop', '/shop'], [cat.name, `/category/${cat.slug}`], [p.name]]} />
        <ProductView p={p} />

        <div className="pdp-sections">
          <section className="pdp-sec" aria-labelledby="why">
            <SecHead eyebrow="Overview" title={<span id="why">Why people choose it.</span>}>
              {p.description}
            </SecHead>
            <ol className="highlights">
              {p.highlights.map((h, i) => (
                <li key={h}>
                  <span className="hl-n">{String(i + 1).padStart(2, '0')}</span>
                  <b>{h}</b>
                </li>
              ))}
            </ol>
          </section>

          <section className="pdp-sec two-col" aria-labelledby="specs">
            <div>
              <p className="eyebrow">Specifications</p>
              <h2 id="specs">The details.</h2>
              <p className="muted">
                Need a spec we have not listed? Ask on WhatsApp and we will check the unit in the shop.
              </p>
              <div className="btns">
                <a className="btn btn-line" href={waLink(`Hi Steff Store, can you confirm a spec on the ${p.name}?`)} target="_blank" rel="noopener">
                  <WhatsAppIcon /> Ask about a spec
                </a>
              </div>
            </div>
            <table className="spec-table">
              <tbody>
                <tr>
                  <th scope="row">Brand</th>
                  <td>{brand}</td>
                </tr>
                <tr>
                  <th scope="row">Condition</th>
                  <td>{p.condition === 'new' ? 'Brand new' : p.condition === 'ex-uk' ? 'Ex-UK, graded and tested' : 'Refurbished'}</td>
                </tr>
                {p.specs.map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">Warranty</th>
                  <td>{p.warranty}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="pdp-sec two-col" aria-labelledby="box">
            <div>
              <p className="eyebrow">In the box</p>
              <h2 id="box">What you get.</h2>
            </div>
            <ul className="box-list">
              {p.inBox.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>

          <section className="pdp-sec two-col" aria-labelledby="pfaq">
            <div>
              <p className="eyebrow">Questions</p>
              <h2 id="pfaq">Before you buy.</h2>
              <p className="muted">
                Read our <Link href="/delivery">delivery</Link> and <Link href="/warranty-returns">warranty &amp; returns</Link> pages for the full detail.
              </p>
            </div>
            <Faq items={faq} />
          </section>
        </div>
      </div>

      {more.length > 0 && (
        <section className="section tint">
          <div className="wrap">
            <SecHead eyebrow="You may also like" title={`More ${cat.name.toLowerCase()}.`} action={<SeeAll href={`/category/${cat.slug}`}>All {cat.short.toLowerCase()}</SeeAll>} />
            <div className="p-grid">
              {more.map((x) => (
                <ProductCard key={x.slug} p={x} />
              ))}
            </div>
          </div>
        </section>
      )}
      <RecentlyViewed exclude={p.slug} />
    </>
  );
}
