'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { brandName } from '@/lib/brands';
import { comparePrice, unitPrice } from '@/lib/catalog';
import { installment, money } from '@/lib/format';
import { counties, pickup, riderZone, zoneFor } from '@/lib/delivery';
import { site, waLink } from '@/lib/site';
import { actions } from '@/lib/store';
import DeviceArt from './DeviceArt';
import { Badges } from './ProductCard';
import { CompareButton, WishButton } from './ProductButtons';
import { Icon, WhatsAppIcon } from './Icon';

function Estimator() {
  const [county, setCounty] = useState('Nakuru');
  const zone = zoneFor(county);
  return (
    <div className="estimator">
      <label htmlFor="est-county">
        <Icon name="truck" /> Delivery to
      </label>
      <select id="est-county" className="select" value={county} onChange={(e) => setCounty(e.target.value)}>
        {counties.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      {county === 'Nakuru' ? (
        <p className="est-out">
          <b>{pickup.name}: free</b> — {pickup.eta.toLowerCase()}.<br />
          <b>Rider: {money(riderZone.fee)}</b> — {riderZone.eta.toLowerCase()}, free over {money(riderZone.freeOver!)}.
        </p>
      ) : (
        <p className="est-out">
          <b>
            {zone.name}: {money(zone.fee)}
          </b>{' '}
          — {zone.eta}.{zone.freeOver ? ` Free over ${money(zone.freeOver)}.` : ''}
        </p>
      )}
    </div>
  );
}

export default function ProductView({ p }: { p: Product }) {
  const router = useRouter();
  const [colour, setColour] = useState(p.colours?.[0]?.name);
  const [option, setOption] = useState(p.options?.values[0]?.name);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    actions.viewed(p.slug);
  }, [p.slug]);

  const tone = p.colours?.find((c) => c.name === colour)?.hex;
  const now = unitPrice(p, option);
  const was = comparePrice(p, option);
  const out = p.stock <= 0;
  const lipa = installment(now);
  const variant = [option, colour].filter(Boolean).join(', ');
  const waText = `Hi Steff Store, I'd like to order:\n• ${p.name}${variant ? ` (${variant})` : ''} × ${qty} — ${money(now * qty)}\n${site.url}/product/${p.slug}`;

  const add = (silent = false) => actions.add(p.slug, { qty, option, colour, name: p.name, silent });

  return (
    <div className="pdp">
      <div className="gallery">
        <div className="g-main">
          <div className="g-badges">
            <Badges p={p} />
          </div>
          <DeviceArt kind={p.art} tone={tone} seed={p.slug} label={`${p.name}${colour ? ` in ${colour}` : ''}`} />
        </div>
        {p.colours && p.colours.length > 1 && (
          <div className="g-thumbs" role="group" aria-label="Colour previews">
            {p.colours.map((c) => (
              <button key={c.name} type="button" aria-pressed={c.name === colour} aria-label={c.name} onClick={() => setColour(c.name)}>
                <DeviceArt kind={p.art} tone={c.hex} seed={p.slug} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="buybox">
        <div>
          <Link className="bb-brand" href={`/brands/${p.brand}`}>
            {brandName(p.brand)}
          </Link>
          <h1>{p.name}</h1>
          <p className="bb-tag">{p.tagline}</p>
        </div>

        <div className="bb-price">
          <span className="now">{money(now)}</span>
          {was && was > now && (
            <>
              <span className="was">{money(was)}</span>
              <span className="save">Save {money(was - now)}</span>
            </>
          )}
          {now >= 10000 && (
            <p className="lipa">
              Or <b>{money(lipa.deposit)}</b> deposit and about <b>{money(lipa.monthly)}/month</b> for {lipa.months} months with{' '}
              <Link href="/lipa-mdogo-mdogo">Lipa Mdogo Mdogo</Link>.
            </p>
          )}
        </div>

        {p.options && (
          <div className="opt-group">
            <span className="og-label">
              {p.options.label}: <span>{option}</span>
            </span>
            <div className="opts" role="group" aria-label={p.options.label}>
              {p.options.values.map((v) => (
                <button key={v.name} type="button" className="opt" aria-pressed={v.name === option} onClick={() => setOption(v.name)}>
                  {v.name}
                  <small>{money(p.price + (v.delta ?? 0))}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {p.colours && (
          <div className="opt-group">
            <span className="og-label">
              Colour: <span>{colour}</span>
            </span>
            <div className="opts" role="group" aria-label="Colour">
              {p.colours.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  className="swatch"
                  style={{ background: c.hex }}
                  aria-pressed={c.name === colour}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => setColour(c.name)}
                />
              ))}
            </div>
          </div>
        )}

        <p className={`stock-line${out ? ' out' : p.stock <= 3 ? ' low' : ''}`}>
          <span className="dot" aria-hidden="true" />
          {out ? 'Out of stock — ask us about the next shipment' : p.stock <= 3 ? `Only ${p.stock} left in Nakuru` : 'In stock in Nakuru · ready to ship'}
        </p>

        <div className="bb-actions">
          <div className="qty" role="group" aria-label="Quantity">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              <Icon name="minus" />
            </button>
            <output aria-live="polite">{qty}</output>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))}>
              <Icon name="plus" />
            </button>
          </div>
          <button className="btn btn-accent btn-lg" type="button" disabled={out} onClick={() => add()}>
            <Icon name="bag" /> Add to cart
          </button>
          <button
            className="btn btn-solid btn-lg bb-full"
            type="button"
            disabled={out}
            onClick={() => {
              add(true);
              router.push('/checkout');
            }}
          >
            Buy now — pay with M-Pesa <Icon name="arrow" />
          </button>
          <a className="btn btn-line btn-lg bb-full" href={waLink(waText)} target="_blank" rel="noopener">
            <WhatsAppIcon /> Order on WhatsApp
          </a>
        </div>

        <div className="bb-mini">
          <WishButton slug={p.slug} name={p.name} className="chip-btn" withLabel />
          <CompareButton slug={p.slug} name={p.name} className="chip-btn" withLabel />
          <a className="chip-btn" href={waLink(`Hi Steff Store, a question about the ${p.name}: `)} target="_blank" rel="noopener">
            <Icon name="info" /> Ask a question
          </a>
        </div>

        <Estimator />

        <ul className="assure">
          <li>
            <Icon name="shield" />
            <div>
              <b>{p.warranty}</b>
              <span>Claims handled by us in Nakuru.</span>
            </div>
          </li>
          <li>
            <Icon name="box" />
            <div>
              <b>{p.condition === 'new' ? 'Brand new, sealed in box' : 'Ex-UK, graded and tested'}</b>
              <span>{p.condition === 'new' ? 'Genuine stock — check the seal on delivery.' : 'Every port, key and battery checked before dispatch.'}</span>
            </div>
          </li>
          <li>
            <Icon name="refresh" />
            <div>
              <b>7-day fault return</b>
              <span>
                Faulty on arrival? We replace it. <Link href="/warranty-returns">Returns policy</Link>
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div className="sticky-buy" aria-hidden="true">
        <span className="now">{money(now)}</span>
        <button className="btn btn-accent btn-sm" type="button" tabIndex={-1} disabled={out} onClick={() => add()}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
