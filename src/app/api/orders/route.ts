import { NextResponse } from 'next/server';
import { priceLines } from '@/lib/catalog';
import { counties, deliveryFee, type DeliveryMethod } from '@/lib/delivery';
import { normalisePhone } from '@/lib/format';
import { mpesaConfigured, stkPush } from '@/lib/mpesa';
import { newRef, recordOrder, type OrderRecord } from '@/lib/orders';
import type { CartLine } from '@/lib/types';

const METHODS: DeliveryMethod[] = ['pickup', 'rider', 'courier'];
const PAYMENTS = ['mpesa', 'cod', 'lipa', 'bank'] as const;
type Payment = (typeof PAYMENTS)[number];

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const customer = (body.customer ?? {}) as Record<string, unknown>;
  const delivery = (body.delivery ?? {}) as Record<string, unknown>;
  const name = str(customer.name, 80);
  const phone = normalisePhone(str(customer.phone, 20));
  const email = str(customer.email, 120);
  const method = str(delivery.method) as DeliveryMethod;
  const county = str(delivery.county, 40);
  const town = str(delivery.town, 80);
  const address = str(delivery.address, 200);
  const notes = str(delivery.notes, 400);
  const payment = str(body.payment) as Payment;

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = 'Enter your name';
  if (!phone) errors.phone = 'Enter a valid Safaricom or Airtel number, e.g. 0712 345 678';
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = 'Check your email address';
  if (!METHODS.includes(method)) errors.method = 'Choose a delivery option';
  if (!(counties as readonly string[]).includes(county)) errors.county = 'Choose your county';
  if (method !== 'pickup' && town.length < 2) errors.town = 'Enter your town or area';
  if (method === 'rider' && county !== 'Nakuru') errors.method = 'Rider delivery is for Nakuru only';
  if (!PAYMENTS.includes(payment)) errors.payment = 'Choose how to pay';
  if (payment === 'cod' && method === 'courier') errors.payment = 'Pay on delivery is available in Nakuru only';

  // Prices always come from the catalogue on the server — never from the browser.
  const rawLines = Array.isArray(body.lines) ? (body.lines as CartLine[]).slice(0, 30) : [];
  const lines = priceLines(rawLines.filter((l) => l && typeof l.slug === 'string'));
  if (!lines.length) errors.cart = 'Your cart is empty';
  const outOfStock = lines.filter((l) => l.product.stock <= 0).map((l) => l.product.name);
  if (outOfStock.length) errors.cart = `Out of stock: ${outOfStock.join(', ')}`;

  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const subtotal = lines.reduce((n, l) => n + l.total, 0);
  const fee = deliveryFee(method, county, subtotal);
  const total = subtotal + fee;

  const order: OrderRecord = {
    ref: newRef(),
    createdAt: new Date().toISOString(),
    customer: { name, phone: phone!, email: email || undefined },
    delivery: { method, county, town, address, notes: notes || undefined, fee },
    payment,
    lines: lines.map((l) => ({
      slug: l.slug,
      name: l.product.name,
      option: l.option,
      colour: l.colour,
      qty: l.qty,
      unit: l.unit,
      total: l.total,
    })),
    subtotal,
    total,
  };

  if (payment === 'mpesa') {
    if (mpesaConfigured()) {
      try {
        const r = await stkPush(phone!, total, order.ref);
        order.mpesa = { status: r.ok ? 'sent' : 'failed', checkoutRequestId: r.checkoutRequestId, message: r.message };
      } catch (err) {
        order.mpesa = { status: 'failed', message: err instanceof Error ? err.message : 'M-Pesa unavailable' };
      }
    } else {
      order.mpesa = { status: 'not_configured' };
    }
  }

  const recorded = await recordOrder(order);
  return NextResponse.json({ order, recorded });
}
