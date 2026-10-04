import 'server-only';

// Safaricom Daraja — Lipa na M-Pesa Online (STK Push).
// Docs: https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate
// Everything is read from environment variables; with none set, `mpesaConfigured()` is false and
// checkout falls back to confirming payment on WhatsApp.

const env = () => ({
  mode: process.env.MPESA_ENV === 'production' ? 'production' : 'sandbox',
  key: process.env.MPESA_CONSUMER_KEY ?? '',
  secret: process.env.MPESA_CONSUMER_SECRET ?? '',
  shortcode: process.env.MPESA_SHORTCODE ?? '',
  partyB: process.env.MPESA_PARTY_B || process.env.MPESA_SHORTCODE || '',
  passkey: process.env.MPESA_PASSKEY ?? '',
  type: process.env.MPESA_TRANSACTION_TYPE === 'CustomerBuyGoodsOnline' ? 'CustomerBuyGoodsOnline' : 'CustomerPayBillOnline',
  callback: process.env.MPESA_CALLBACK_URL || `${(process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')}/api/mpesa/callback`,
});

export function mpesaConfigured() {
  const e = env();
  return Boolean(e.key && e.secret && e.shortcode && e.passkey && /^https:\/\//.test(e.callback));
}

const base = () => (env().mode === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke');

let cached: { token: string; expires: number } | null = null;

async function token() {
  if (cached && cached.expires > Date.now() + 30_000) return cached.token;
  const { key, secret } = env();
  const res = await fetch(`${base()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Daraja auth failed (${res.status})`);
  const data = (await res.json()) as { access_token: string; expires_in: string };
  cached = { token: data.access_token, expires: Date.now() + Number(data.expires_in) * 1000 };
  return cached.token;
}

/** YYYYMMDDHHmmss in East Africa Time, as Daraja expects. */
function timestamp() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  return `${get('year')}${get('month')}${get('day')}${get('hour') === '24' ? '00' : get('hour')}${get('minute')}${get('second')}`;
}

export interface StkResult {
  ok: boolean;
  checkoutRequestId?: string;
  message: string;
}

/** Send an M-Pesa PIN prompt to `phone` (2547XXXXXXXX) for `amount` KES. */
export async function stkPush(phone: string, amount: number, reference: string): Promise<StkResult> {
  const e = env();
  const ts = timestamp();
  const password = Buffer.from(`${e.shortcode}${e.passkey}${ts}`).toString('base64');
  const res = await fetch(`${base()}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      BusinessShortCode: e.shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: e.type,
      Amount: Math.max(1, Math.round(amount)),
      PartyA: phone,
      PartyB: e.partyB,
      PhoneNumber: phone,
      CallBackURL: e.callback,
      AccountReference: reference.slice(0, 12),
      TransactionDesc: 'Steff Store',
    }),
    cache: 'no-store',
  });
  const data = (await res.json().catch(() => ({}))) as {
    ResponseCode?: string;
    CheckoutRequestID?: string;
    CustomerMessage?: string;
    errorMessage?: string;
  };
  if (res.ok && data.ResponseCode === '0') {
    return { ok: true, checkoutRequestId: data.CheckoutRequestID, message: data.CustomerMessage ?? 'Prompt sent' };
  }
  return { ok: false, message: data.errorMessage ?? `M-Pesa request failed (${res.status})` };
}
