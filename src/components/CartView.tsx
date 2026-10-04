'use client';

import Link from 'next/link';
import { priceLines, productBySlug } from '@/lib/catalog';
import { FREE_DELIVERY_OVER } from '@/lib/delivery';
import { money } from '@/lib/format';
import { waLink } from '@/lib/site';
import { actions, useStore } from '@/lib/store';
import type { Product } from '@/lib/types';
import DeviceArt from './DeviceArt';
import ProductCard from './ProductCard';
import { SecHead } from './Bits';
import { Icon, WhatsAppIcon } from './Icon';

const ADD_ONS = ['anker-powercore-20k', 'apple-20w-usb-c-adapter', 'samsung-25w-super-fast-charger', 'sandisk-ultra-128gb-microsd', 'logitech-m185-wireless-mouse', 'apc-back-ups-650va'];

export function cartWhatsAppText(lines: ReturnType<typeof priceLines>, subtotal: number) {
  const rows = lines.map((l) => `• ${l.product.name}${l.option || l.colour ? ` (${[l.option, l.colour].filter(Boolean).join(', ')})` : ''} × ${l.qty} — ${money(l.total)}`);
  return `Hi Steff Store, I'd like to order:\n${rows.join('\n')}\nSubtotal: ${money(subtotal)}`;
}

export default function CartView() {
  const store = useStore();
  const lines = priceLines(store.cart);
  const subtotal = lines.reduce((n, l) => n + l.total, 0);
  const toFree = Math.max(0, FREE_DELIVERY_OVER - subtotal);
  const inCart = new Set(lines.map((l) => l.slug));
  const addOns = ADD_ONS.map((s) => productBySlug(s)).filter((p): p is Product => Boolean(p) && !inCart.has(p!.slug)).slice(0, 4);

  if (!lines.length) {
    return (
      <div className="wrap" style={{ paddingBlock: 'var(--s-7) var(--section)' }}>
        <div className="empty">
          <Icon name="bag" className="svc-ic" />
          <h2>Your cart is empty.</h2>
          <p>Start with a category, or tell us your budget on WhatsApp and we will suggest three options.</p>
          <div className="btns center">
            <Link className="btn btn-accent" href="/shop">
              Shop all devices <Icon name="arrow" />
            </Link>
            <Link className="btn btn-line" href="/deals">
              See deals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrap cart-layout">
        <div>
          <ul className="cart-lines">
            {lines.map((l) => (
              <li className="cart-line" key={l.id}>
                <Link className="cl-art" href={`/product/${l.slug}`} tabIndex={-1} aria-hidden="true">
                  <DeviceArt kind={l.product.art} tone={l.product.colours?.find((c) => c.name === l.colour)?.hex} seed={l.slug} />
                </Link>
                <div>
                  <h3>
                    <Link href={`/product/${l.slug}`}>{l.product.name}</Link>
                  </h3>
                  <p className="cl-meta">
                    {[l.option, l.colour].filter(Boolean).join(' · ') || l.product.tagline}
                    {l.product.stock > 0 && l.product.stock <= 3 && <b style={{ color: 'var(--accent-text)' }}> · Only {l.product.stock} left</b>}
                  </p>
                  <div className="cl-row">
                    <div className="qty" role="group" aria-label={`Quantity for ${l.product.name}`}>
                      <button type="button" aria-label="Decrease quantity" onClick={() => actions.setQty(l.id, l.qty - 1)}>
                        <Icon name={l.qty === 1 ? 'trash' : 'minus'} />
                      </button>
                      <output>{l.qty}</output>
                      <button type="button" aria-label="Increase quantity" onClick={() => actions.setQty(l.id, l.qty + 1)}>
                        <Icon name="plus" />
                      </button>
                    </div>
                    <button className="link-btn" type="button" onClick={() => actions.remove(l.id)}>
                      Remove
                    </button>
                    {!store.wishlist.includes(l.slug) && (
                      <button
                        className="link-btn"
                        type="button"
                        onClick={() => {
                          actions.toggleWish(l.slug, l.product.name);
                          actions.remove(l.id);
                        }}
                      >
                        Save for later
                      </button>
                    )}
                  </div>
                </div>
                <div className="cl-price">
                  {money(l.total)}
                  {l.qty > 1 && <small>{money(l.unit)} each</small>}
                </div>
              </li>
            ))}
          </ul>
          <div className="btns">
            <Link className="btn btn-line btn-sm" href="/shop">
              <Icon name="arrow-left" /> Continue shopping
            </Link>
          </div>
        </div>

        <aside className="summary" aria-label="Order summary">
          <h2>Order summary</h2>
          <dl>
            <div>
              <dt>Subtotal ({lines.reduce((n, l) => n + l.qty, 0)} items)</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>Calculated at checkout</dd>
            </div>
            <div className="total">
              <dt>Total</dt>
              <dd>{money(subtotal)}</dd>
            </div>
          </dl>
          <div>
            <p className="note" style={{ marginBottom: 8 }}>
              {toFree > 0 ? (
                <>
                  Add <b>{money(toFree)}</b> more for free countrywide delivery.
                </>
              ) : (
                <>
                  <b>Free delivery</b> unlocked (excluding remote counties).
                </>
              )}
            </p>
            <div className="progress" aria-hidden="true">
              <span style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_OVER) * 100)}%` }} />
            </div>
          </div>
          <Link className="btn btn-accent btn-lg btn-block" href="/checkout">
            Checkout <Icon name="arrow" />
          </Link>
          <a className="btn btn-line btn-block" href={waLink(cartWhatsAppText(lines, subtotal))} target="_blank" rel="noopener">
            <WhatsAppIcon /> Order on WhatsApp instead
          </a>
          <p className="note">
            <span className="mpesa-mark">M-PESA</span> Pay by M-Pesa prompt, bank transfer, or on delivery in Nakuru.
          </p>
        </aside>
      </div>

      {addOns.length > 0 && (
        <section className="section tint">
          <div className="wrap">
            <SecHead eyebrow="Don’t forget" title="Power and the small things." />
            <div className="p-grid">
              {addOns.map((p) => (
                <ProductCard key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
