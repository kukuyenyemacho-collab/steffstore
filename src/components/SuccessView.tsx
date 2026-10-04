'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { money } from '@/lib/format';
import { waLink } from '@/lib/site';
import { Icon, WhatsAppIcon } from './Icon';
import { LAST_ORDER_KEY } from './CheckoutView';

interface Order {
  ref: string;
  customer: { name: string; phone: string };
  delivery: { method: string; county: string; town: string; fee: number };
  payment: string;
  lines: { name: string; option?: string; colour?: string; qty: number; total: number }[];
  subtotal: number;
  total: number;
  mpesa?: { status: string; message?: string };
  recorded?: boolean;
}

function readOrder() {
  try {
    return sessionStorage.getItem(LAST_ORDER_KEY);
  } catch {
    return null;
  }
}

const PAYMENT: Record<string, string> = {
  mpesa: 'M-Pesa',
  cod: 'Pay on delivery',
  lipa: 'Lipa Mdogo Mdogo',
  bank: 'Bank transfer',
};
const METHOD: Record<string, string> = { pickup: 'Pick up in Nakuru', rider: 'Nakuru rider', courier: 'Courier' };

export default function SuccessView() {
  const raw = useSyncExternalStore(
    () => () => {},
    readOrder,
    () => null,
  );
  const order: Order | null = raw ? JSON.parse(raw) : null;

  if (!order) {
    return (
      <div className="wrap success-hero">
        <h1>Thank you.</h1>
        <p className="lede" style={{ marginInline: 'auto' }}>
          If you just placed an order, we will confirm it on WhatsApp shortly.
        </p>
        <div className="btns center">
          <Link className="btn btn-solid" href="/shop">
            Keep shopping
          </Link>
        </div>
      </div>
    );
  }

  const items = order.lines.map((l) => `• ${l.name}${l.option || l.colour ? ` (${[l.option, l.colour].filter(Boolean).join(', ')})` : ''} × ${l.qty} — ${money(l.total)}`).join('\n');
  const text = `Hi Steff Store, please confirm my order ${order.ref}:\n${items}\nDelivery: ${METHOD[order.delivery.method]} — ${order.delivery.town || ''} ${order.delivery.county}\nPayment: ${PAYMENT[order.payment]}\nTotal: ${money(order.total)}\nName: ${order.customer.name}`;

  const mpesa = order.mpesa?.status;
  return (
    <div className="wrap narrow" style={{ paddingBottom: 'var(--section)' }}>
      <div className="success-hero">
        <div className="tick">
          <Icon name="check" />
        </div>
        <p className="eyebrow" style={{ justifyContent: 'center' }}>
          Order received
        </p>
        <h1>Asante, {order.customer.name.split(' ')[0]}.</h1>
        <p>
          Your order number is <span className="ref">{order.ref}</span>
        </p>
      </div>

      {mpesa === 'sent' && (
        <p className="alert ok" role="status">
          <b>Check your phone.</b> We have sent an M-Pesa prompt for <b>{money(order.total)}</b> to {order.customer.phone}. Enter your PIN to
          complete payment — we will confirm on WhatsApp as soon as it lands.
        </p>
      )}
      {mpesa === 'not_configured' && (
        <p className="alert" role="status">
          <b>Payment:</b> no money has been taken yet. When we confirm your order we send an M-Pesa prompt or our paybill details for{' '}
          <b>{money(order.total)}</b> — never pay anyone who contacts you from a different number.
        </p>
      )}
      {mpesa === 'failed' && (
        <p className="alert err" role="status">
          The M-Pesa prompt could not be sent ({order.mpesa?.message}). No money has been taken. Send your order on WhatsApp below and we will send
          a fresh prompt or our paybill details.
        </p>
      )}

      <div className="form-card" style={{ marginTop: 'var(--s-5)' }}>
        <h2>
          <span className="n">{order.recorded ? <Icon name="check" /> : '!'}</span>
          {order.recorded ? 'We have your order' : 'One last step: send it to us on WhatsApp'}
        </h2>
        <p className="muted" style={{ margin: 0 }}>
          {order.recorded
            ? 'Our team will call or WhatsApp you to confirm delivery. Keep your order number handy.'
            : 'Tap the button to send your order to our team. We confirm stock, delivery time and payment in one message.'}
        </p>
        <a className={`btn ${order.recorded ? 'btn-line' : 'btn-wa'} btn-lg btn-block`} href={waLink(text)} target="_blank" rel="noopener">
          <WhatsAppIcon /> {order.recorded ? 'Message us about this order' : 'Send order on WhatsApp'}
        </a>
      </div>

      <div className="summary" style={{ position: 'static', marginTop: 'var(--s-5)' }}>
        <h2>Summary</h2>
        <ul className="s-lines" style={{ maxHeight: 'none' }}>
          {order.lines.map((l, i) => (
            <li key={i} style={{ gridTemplateColumns: '1fr auto' }}>
              <span>
                {l.qty} × {l.name}
                {(l.option || l.colour) && <small className="muted"> · {[l.option, l.colour].filter(Boolean).join(', ')}</small>}
              </span>
              <b className="tnum">{money(l.total)}</b>
            </li>
          ))}
        </ul>
        <dl>
          <div>
            <dt>Delivery · {METHOD[order.delivery.method]}</dt>
            <dd>{order.delivery.fee ? money(order.delivery.fee) : 'Free'}</dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>{PAYMENT[order.payment]}</dd>
          </div>
          <div className="total">
            <dt>Total</dt>
            <dd>{money(order.total)}</dd>
          </div>
        </dl>
      </div>
      <div className="btns center">
        <Link className="btn btn-solid" href="/shop">
          Keep shopping <Icon name="arrow" />
        </Link>
      </div>
    </div>
  );
}
