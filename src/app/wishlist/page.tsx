import type { Metadata } from 'next';
import { WishlistView } from '@/components/ListViews';
import { PageHero } from '@/components/Bits';

export const metadata: Metadata = { title: 'Wishlist', robots: { index: false } };

export default function WishlistPage() {
  return (
    <>
      <PageHero crumbs={[['Wishlist']]} title="Saved for later." lede="Your wishlist lives on this device. Share it with us on WhatsApp and we will tell you when prices drop." />
      <section className="section tight">
        <div className="wrap">
          <WishlistView />
        </div>
      </section>
    </>
  );
}
