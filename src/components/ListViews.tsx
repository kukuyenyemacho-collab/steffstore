'use client';

import Link from 'next/link';
import { useState } from 'react';
import { brandName } from '@/lib/brands';
import { productBySlug } from '@/lib/catalog';
import { money } from '@/lib/format';
import { waLink } from '@/lib/site';
import { actions, COMPARE_MAX, useStore } from '@/lib/store';
import type { Product } from '@/lib/types';
import DeviceArt from './DeviceArt';
import ProductCard from './ProductCard';
import { Icon, WhatsAppIcon } from './Icon';

const resolve = (slugs: string[]) => slugs.map((s) => productBySlug(s)).filter((p): p is Product => Boolean(p));

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="btns center">
        <Link className="btn btn-accent" href="/shop">
          Browse devices <Icon name="arrow" />
        </Link>
      </div>
    </div>
  );
}

export function WishlistView() {
  const { wishlist } = useStore();
  const items = resolve(wishlist);
  if (!items.length) return <Empty title="Nothing saved yet." text="Tap the heart on any product to keep it here for later — it stays on this device." />;
  const inStock = items.filter((p) => p.stock > 0);
  return (
    <>
      <div className="toolbar">
        <p className="count" style={{ margin: 0 }}>
          {items.length} saved
        </p>
        <div className="tb-right">
          <a
            className="btn btn-line btn-sm"
            href={waLink(`Hi Steff Store, I'm interested in:\n${items.map((p) => `• ${p.name} — ${money(p.price)}`).join('\n')}`)}
            target="_blank"
            rel="noopener"
          >
            <WhatsAppIcon /> Share with us
          </a>
          <button
            className="btn btn-solid btn-sm"
            type="button"
            disabled={!inStock.length}
            onClick={() => actions.addMany(inStock.map((p) => ({ slug: p.slug, option: p.options?.values[0]?.name, colour: p.colours?.[0]?.name })))}
          >
            <Icon name="bag" /> Add all to cart
          </button>
        </div>
      </div>
      <div className="p-grid">
        {items.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
    </>
  );
}

export function CompareView() {
  const { compare } = useStore();
  const items = resolve(compare);
  if (!items.length)
    return <Empty title="Pick devices to compare." text={`Tap “Compare” on up to ${COMPARE_MAX} products to see their prices and specs side by side.`} />;

  const labels = [...new Set(items.flatMap((p) => p.specs.map(([k]) => k)))];
  const spec = (p: Product, k: string) => p.specs.find(([l]) => l === k)?.[1] ?? '—';

  return (
    <div className="compare-wrap">
      <table className="compare">
        <thead>
          <tr>
            <th scope="col" className="sr">
              Feature
            </th>
            {items.map((p) => (
              <td key={p.slug}>
                <div className="cmp-head">
                  <Link className="cmp-art" href={`/product/${p.slug}`} aria-hidden="true" tabIndex={-1}>
                    <DeviceArt kind={p.art} tone={p.colours?.[0]?.hex} seed={p.slug} />
                  </Link>
                  <small className="muted">{brandName(p.brand)}</small>
                  <Link href={`/product/${p.slug}`}>
                    <b>{p.name}</b>
                  </Link>
                  <b className="tnum" style={{ fontFamily: 'var(--display)' }}>
                    {money(p.price)}
                  </b>
                  <div className="btns" style={{ marginTop: 0 }}>
                    <button
                      className="btn btn-accent btn-sm"
                      type="button"
                      disabled={p.stock <= 0}
                      onClick={() => actions.add(p.slug, { option: p.options?.values[0]?.name, colour: p.colours?.[0]?.name, name: p.name })}
                    >
                      Add
                    </button>
                    <button className="btn btn-line btn-sm" type="button" onClick={() => actions.toggleCompare(p.slug, p.name)}>
                      Remove
                    </button>
                  </div>
                </div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Condition</th>
            {items.map((p) => (
              <td key={p.slug}>{p.condition === 'new' ? 'Brand new' : 'Ex-UK, tested'}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Warranty</th>
            {items.map((p) => (
              <td key={p.slug}>{p.warranty}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Availability</th>
            {items.map((p) => (
              <td key={p.slug}>{p.stock > 0 ? (p.stock <= 3 ? `Only ${p.stock} left` : 'In stock') : 'Out of stock'}</td>
            ))}
          </tr>
          {labels.map((k) => (
            <tr key={k}>
              <th scope="row">{k}</th>
              {items.map((p) => (
                <td key={p.slug}>{spec(p, k)}</td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row">Key points</th>
            {items.map((p) => (
              <td key={p.slug}>
                <ul style={{ margin: 0, paddingLeft: '1.1em' }}>
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function TrackOrderForm() {
  const [ref, setRef] = useState('');
  const [phone, setPhone] = useState('');
  const ready = ref.trim().length >= 4 && phone.trim().length >= 9;
  return (
    <form
      className="form-card"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ready) return;
        window.open(waLink(`Hi Steff Store, please share the status of order ${ref.trim().toUpperCase()} (phone ${phone.trim()}).`), '_blank', 'noopener');
      }}
    >
      <h2>Find your order</h2>
      <div className="row2">
        <div className="field">
          <label htmlFor="ref">Order number</label>
          <input id="ref" placeholder="SS-XXXXXXXX" value={ref} onChange={(e) => setRef(e.target.value)} autoCapitalize="characters" />
        </div>
        <div className="field">
          <label htmlFor="tphone">Phone used at checkout</label>
          <input id="tphone" type="tel" inputMode="tel" placeholder="0712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-solid btn-lg" type="submit" disabled={!ready}>
        <WhatsAppIcon /> Get status on WhatsApp
      </button>
      <p className="muted" style={{ margin: 0, fontSize: '.88rem' }}>
        Your order number starts with SS- and is on your confirmation screen and WhatsApp message. We reply with the status, rider details
        and courier tracking number — usually within minutes during opening hours.
      </p>
    </form>
  );
}
