'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { priceLines } from '@/lib/catalog';
import { counties, deliveryFee, pickup, riderZone, zoneFor, type DeliveryMethod } from '@/lib/delivery';
import { money, normalisePhone } from '@/lib/format';
import { actions, useStore } from '@/lib/store';
import DeviceArt from './DeviceArt';
import { Icon } from './Icon';

type Payment = 'mpesa' | 'cod' | 'lipa' | 'bank';

export const LAST_ORDER_KEY = 'steffstore:last-order';

export default function CheckoutView() {
  const router = useRouter();
  const store = useStore();
  const lines = priceLines(store.cart);
  const subtotal = lines.reduce((n, l) => n + l.total, 0);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [county, setCounty] = useState('Nakuru');
  const [method, setMethod] = useState<DeliveryMethod>('pickup');
  const [town, setTown] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState<Payment>('mpesa');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const inNakuru = county === 'Nakuru';
  // Rider and pay-on-delivery are Nakuru-only; fall back gracefully when the county changes.
  const effMethod: DeliveryMethod = !inNakuru && method === 'rider' ? 'courier' : method;
  const effPayment: Payment = effMethod === 'courier' && payment === 'cod' ? 'mpesa' : payment;
  const fee = deliveryFee(effMethod, county, subtotal);
  const total = subtotal + fee;
  const courier = zoneFor(inNakuru ? 'Nairobi' : county);

  if (!lines.length) {
    return (
      <div className="wrap" style={{ paddingBlock: 'var(--s-7) var(--section)' }}>
        <div className="empty">
          <h2>Nothing to check out yet.</h2>
          <p>Your cart is empty. Add a device and come back — it only takes a minute.</p>
          <div className="btns center">
            <Link className="btn btn-accent" href="/shop">
              Shop all devices <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = 'Enter your name';
    if (!normalisePhone(phone)) errs.phone = 'Enter a valid number, e.g. 0712 345 678';
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = 'Check your email address';
    if (effMethod !== 'pickup' && town.trim().length < 2) errs.town = 'Enter your town or area';
    if (!agree) errs.agree = 'Please accept the terms of sale';
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: store.cart,
          customer: { name, phone, email },
          delivery: { method: effMethod, county, town, address, notes },
          payment: effPayment,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? { form: 'Something went wrong. Please try again or order on WhatsApp.' });
        setBusy(false);
        return;
      }
      try {
        sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ ...data.order, recorded: data.recorded }));
      } catch {
        /* ignore */
      }
      actions.clearCart();
      router.push(`/checkout/success?ref=${encodeURIComponent(data.order.ref)}`);
    } catch {
      setErrors({ form: 'We could not reach the store. Check your connection, or order on WhatsApp.' });
      setBusy(false);
    }
  }

  const err = (k: string) => (errors[k] ? <span className="err">{errors[k]}</span> : null);
  // Clear a field's error as soon as the customer edits it.
  const edit = (k: string, set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    set(e.target.value);
    if (errors[k]) setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => key !== k)));
  };

  return (
    <form className="wrap cart-layout" onSubmit={submit} noValidate>
      <div>
        {errors.form && <p className="alert err" role="alert">{errors.form}</p>}
        {errors.cart && <p className="alert err" role="alert">{errors.cart}</p>}

        <fieldset className="form-card" style={{ margin: 0 }}>
          <h2>
            <span className="n">1</span> Your details
          </h2>
          <div className="row2">
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" autoComplete="name" value={name} onChange={edit('name', setName)} aria-invalid={!!errors.name} />
              {err('name')}
            </div>
            <div className="field">
              <label htmlFor="phone">M-Pesa / phone number</label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={edit('phone', setPhone)}
                aria-invalid={!!errors.phone}
              />
              {err('phone') ?? <span className="hint">We send the M-Pesa prompt and delivery updates here.</span>}
            </div>
          </div>
          <div className="field">
            <label htmlFor="email">
              Email <span className="opt-l">(optional — for your receipt)</span>
            </label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={edit('email', setEmail)} aria-invalid={!!errors.email} />
            {err('email')}
          </div>
        </fieldset>

        <fieldset className="form-card">
          <h2>
            <span className="n">2</span> Delivery
          </h2>
          <div className="field">
            <label htmlFor="county">County</label>
            <select
              id="county"
              value={county}
              onChange={(e) => {
                setCounty(e.target.value);
                if (e.target.value !== 'Nakuru') setMethod('courier');
              }}
            >
              {counties.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="choice-list" role="radiogroup" aria-label="Delivery option">
            <label className="choice">
              <input type="radio" name="method" checked={effMethod === 'pickup'} onChange={() => setMethod('pickup')} />
              <span>
                <b>{pickup.name}</b>
                <small>
                  {pickup.detail} · {pickup.eta}
                </small>
              </span>
              <span className="ch-price">Free</span>
            </label>
            <label className="choice">
              <input type="radio" name="method" checked={effMethod === 'rider'} disabled={!inNakuru} onChange={() => setMethod('rider')} />
              <span>
                <b>Nakuru same-day rider</b>
                <small>{inNakuru ? riderZone.eta : 'Available in Nakuru County only'}</small>
              </span>
              <span className="ch-price">{inNakuru ? (deliveryFee('rider', county, subtotal) ? money(riderZone.fee) : 'Free') : '—'}</span>
            </label>
            <label className="choice">
              <input type="radio" name="method" checked={effMethod === 'courier'} onChange={() => setMethod('courier')} />
              <span>
                <b>Courier to your town</b>
                <small>
                  {courier.eta} · insured, track by SMS
                </small>
              </span>
              <span className="ch-price">{deliveryFee('courier', county, subtotal) ? money(deliveryFee('courier', county, subtotal)) : 'Free'}</span>
            </label>
          </div>
          {effMethod !== 'pickup' && (
            <>
              <div className="row2">
                <div className="field">
                  <label htmlFor="town">Town / area</label>
                  <input id="town" autoComplete="address-level2" placeholder={inNakuru ? 'e.g. Milimani, Lanet, Section 58' : 'e.g. Eldoret CBD'} value={town} onChange={edit('town', setTown)} aria-invalid={!!errors.town} />
                  {err('town')}
                </div>
                <div className="field">
                  <label htmlFor="address">
                    Building, street or landmark <span className="opt-l">(optional)</span>
                  </label>
                  <input id="address" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="notes">
                  Notes for the rider <span className="opt-l">(optional)</span>
                </label>
                <textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Gate colour, best time to call…" />
              </div>
            </>
          )}
        </fieldset>

        <fieldset className="form-card">
          <h2>
            <span className="n">3</span> Payment
          </h2>
          <div className="choice-list" role="radiogroup" aria-label="Payment method">
            <label className="choice">
              <input type="radio" name="payment" checked={effPayment === 'mpesa'} onChange={() => setPayment('mpesa')} />
              <span>
                <b>
                  <span className="mpesa-mark">M-PESA</span> Pay now with M-Pesa
                </b>
                <small>We send a prompt to your phone — enter your PIN to pay. No paybill to type.</small>
              </span>
              <span />
            </label>
            <label className="choice">
              <input type="radio" name="payment" checked={effPayment === 'cod'} disabled={effMethod === 'courier'} onChange={() => setPayment('cod')} />
              <span>
                <b>Pay on delivery</b>
                <small>{effMethod === 'courier' ? 'Nakuru pickup and rider orders only' : 'Inspect first, then pay by M-Pesa or cash.'}</small>
              </span>
              <span />
            </label>
            <label className="choice">
              <input type="radio" name="payment" checked={effPayment === 'lipa'} onChange={() => setPayment('lipa')} />
              <span>
                <b>Lipa Mdogo Mdogo</b>
                <small>Deposit today, balance monthly. We call you to complete a quick approval.</small>
              </span>
              <span />
            </label>
            <label className="choice">
              <input type="radio" name="payment" checked={effPayment === 'bank'} onChange={() => setPayment('bank')} />
              <span>
                <b>Bank transfer</b>
                <small>For businesses and schools — we send a pro-forma invoice with our bank details.</small>
              </span>
              <span />
            </label>
          </div>
          {errors.payment && <span className="err">{errors.payment}</span>}
          <label className="consent">
            <input type="checkbox" checked={agree} onChange={(e) => {
                setAgree(e.target.checked);
                if (errors.agree) setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => key !== 'agree')));
              }} aria-invalid={!!errors.agree} />
            <span>
              I agree to the <Link href="/terms">Terms of Sale</Link> and the <Link href="/privacy-policy">Privacy Policy</Link>.
            </span>
          </label>
          {err('agree')}
        </fieldset>
      </div>

      <aside className="summary" aria-label="Order summary">
        <h2>Your order</h2>
        <ul className="s-lines">
          {lines.map((l) => (
            <li key={l.id}>
              <span className="sl-art">
                <DeviceArt kind={l.product.art} tone={l.product.colours?.find((c) => c.name === l.colour)?.hex} seed={l.slug} />
                <span className="sl-qty">{l.qty}</span>
              </span>
              <span>
                {l.product.name}
                {(l.option || l.colour) && <small className="muted"> · {[l.option, l.colour].filter(Boolean).join(', ')}</small>}
              </span>
              <b className="tnum">{money(l.total)}</b>
            </li>
          ))}
        </ul>
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{money(subtotal)}</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>{fee ? money(fee) : 'Free'}</dd>
          </div>
          <div className="total">
            <dt>Total</dt>
            <dd>{money(total)}</dd>
          </div>
        </dl>
        <button className="btn btn-accent btn-lg btn-block" type="submit" disabled={busy}>
          {busy ? 'Placing order…' : effPayment === 'mpesa' ? `Pay ${money(total)} with M-Pesa` : 'Place order'}
        </button>
        <p className="note">
          <Icon name="shield" /> Your details are used only to process and deliver this order.
        </p>
      </aside>
    </form>
  );
}
