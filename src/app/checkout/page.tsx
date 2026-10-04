import type { Metadata } from 'next';
import CheckoutView from '@/components/CheckoutView';
import { PageHero } from '@/components/Bits';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

export default function CheckoutPage() {
  return (
    <>
      <PageHero crumbs={[['Cart', '/cart'], ['Checkout']]} title="Checkout." lede="Three short steps. Pay with an M-Pesa prompt, on delivery in Nakuru, or Lipa Mdogo Mdogo." />
      <CheckoutView />
    </>
  );
}
