'use client';

import { useOpenNow } from '@/lib/hooks';

export default function OpenStatus({ big = false }: { big?: boolean }) {
  const open = useOpenNow();
  const text = open === null ? 'Mon – Sat, 8am – 6pm EAT' : open ? 'Open now · until 6pm' : 'Closed now · WhatsApp us, we reply fast';
  return (
    <p className={`open-status${open ? ' is-open' : ''}${big ? ' big' : ''}`}>
      <span className="dot" aria-hidden="true" />
      <span>{text}</span>
    </p>
  );
}
