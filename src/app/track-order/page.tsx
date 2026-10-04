import type { Metadata } from 'next';
import { TrackOrderForm } from '@/components/ListViews';
import { PageHero } from '@/components/Bits';

export const metadata: Metadata = {
  title: 'Track your order',
  description: 'Check the status of your Steff Store order — enter your order number and we reply on WhatsApp with rider or courier details.',
  alternates: { canonical: '/track-order' },
};

export default function TrackPage() {
  return (
    <>
      <PageHero crumbs={[['Track order']]} eyebrow="Order status" title="Where’s my order?" lede="Enter your order number and phone, and we will send you the latest status on WhatsApp." />
      <section className="section tight">
        <div className="wrap narrow">
          <TrackOrderForm />
        </div>
      </section>
    </>
  );
}
