import type { Metadata } from 'next';
import { Suspense } from 'react';
import Catalog from '@/components/Catalog';
import { PageHero } from '@/components/Bits';

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <PageHero crumbs={[['Search']]} eyebrow="Search" title="Find your next device." />
      <section className="section tight">
        <div className="wrap">
          <Suspense fallback={<p className="muted">Loading results…</p>}>
            <Catalog products={[]} searchMode />
          </Suspense>
        </div>
      </section>
    </>
  );
}
