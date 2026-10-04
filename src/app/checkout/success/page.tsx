import type { Metadata } from 'next';
import SuccessView from '@/components/SuccessView';

export const metadata: Metadata = { title: 'Order received', robots: { index: false } };

export default function SuccessPage() {
  return <SuccessView />;
}
