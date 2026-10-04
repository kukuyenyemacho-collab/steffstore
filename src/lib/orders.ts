import 'server-only';

// Order recording. Until a database is connected, orders are forwarded to ORDER_WEBHOOK_URL
// (Google Apps Script → Sheets, Make, Zapier, n8n or a Slack/Discord webhook) and the customer
// confirms on WhatsApp. Swap `recordOrder` for a database insert when you add one.

export interface OrderRecord {
  ref: string;
  createdAt: string;
  customer: { name: string; phone: string; email?: string };
  delivery: { method: string; county: string; town: string; address: string; notes?: string; fee: number };
  payment: string;
  lines: { slug: string; name: string; option?: string; colour?: string; qty: number; unit: number; total: number }[];
  subtotal: number;
  total: number;
  mpesa?: { status: string; checkoutRequestId?: string; message?: string };
}

export async function recordOrder(order: OrderRecord | Record<string, unknown>, kind: 'order' | 'mpesa-callback' = 'order') {
  const url = process.env.ORDER_WEBHOOK_URL;
  if (!url) {
    console.info(`[steffstore] ${kind} (no ORDER_WEBHOOK_URL set)`, JSON.stringify(order));
    return false;
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, ...order }),
      signal: ctrl.signal,
      cache: 'no-store',
    });
    clearTimeout(t);
    return res.ok;
  } catch (err) {
    console.error('[steffstore] webhook failed', err);
    return false;
  }
}

export function newRef() {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  const r = Math.floor(Math.random() * 36 ** 3)
    .toString(36)
    .toUpperCase()
    .padStart(3, '0');
  return `SS-${t}${r}`;
}
