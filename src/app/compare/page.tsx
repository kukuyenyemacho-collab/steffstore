import type { Metadata } from 'next';
import { CompareView } from '@/components/ListViews';
import { PageHero } from '@/components/Bits';

export const metadata: Metadata = { title: 'Compare devices', robots: { index: false } };

export default function ComparePage() {
  return (
    <>
      <PageHero crumbs={[['Compare']]} title="Side by side." lede="Compare up to four devices — price, warranty and every spec on one table." />
      <section className="section tight">
        <div className="wrap">
          <CompareView />
        </div>
      </section>
    </>
  );
}
