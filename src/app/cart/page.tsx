import type { Metadata } from 'next';
import CartView from '@/components/CartView';
import { PageHero } from '@/components/Bits';

export const metadata: Metadata = { title: 'Your cart', robots: { index: false } };

export default function CartPage() {
  return (
    <>
      <PageHero crumbs={[['Cart']]} title="Your cart." />
      <CartView />
    </>
  );
}
