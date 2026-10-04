'use client';

// Fixed UI that sits on every page: WhatsApp float, mobile bottom bar and the toast.

import Link from 'next/link';
import { waLink } from '@/lib/site';
import { actions, cartCount, useStore } from '@/lib/store';
import { Icon, WhatsAppIcon } from './Icon';

export function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={waLink('Hi Steff Store, I need help choosing a device.')}
      target="_blank"
      rel="noopener"
      aria-label="Chat with Steff Store on WhatsApp"
    >
      <WhatsAppIcon />
    </a>
  );
}

export function MobileBar() {
  const store = useStore();
  const count = cartCount(store);
  return (
    <nav className="m-bar" aria-label="Quick actions">
      <Link href="/shop">
        <Icon name="grid" />
        Shop
      </Link>
      <Link href="/deals">
        <Icon name="tag" />
        Deals
      </Link>
      <a href={waLink('Hi Steff Store, I need help choosing a device.')} target="_blank" rel="noopener">
        <WhatsAppIcon />
        WhatsApp
      </a>
      <Link className="hl" href="/cart">
        <Icon name="bag" />
        Cart
        {count > 0 && <span className="count">{count}</span>}
      </Link>
    </nav>
  );
}

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite" key={toast.id}>
      <Icon name="check" />
      <span>{toast.text}</span>
      {toast.href && (
        <Link href={toast.href} onClick={() => actions.dismissToast()}>
          {toast.cta ?? 'View'}
        </Link>
      )}
      <button className="icon-btn" style={{ width: 32, height: 32, borderColor: 'transparent', color: 'inherit' }} onClick={() => actions.dismissToast()} aria-label="Dismiss">
        <Icon name="close" />
      </button>
    </div>
  );
}
