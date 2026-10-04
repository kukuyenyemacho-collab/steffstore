const kes = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 });

/** KES 12,499 */
export const money = (n: number) => `KES ${kes.format(Math.round(n))}`;

/** 12,499 */
export const num = (n: number) => kes.format(Math.round(n));

export const pct = (part: number, whole: number) => Math.round((part / whole) * 100);

/** Lipa Mdogo Mdogo indicative split: 30% deposit, balance over the given months. */
export function installment(price: number, months = 6, depositRate = 0.3) {
  const deposit = Math.ceil((price * depositRate) / 50) * 50;
  const monthly = Math.ceil((price - deposit) / months / 50) * 50;
  return { deposit, monthly, months };
}

/** Normalise a Kenyan phone number to 2547XXXXXXXX / 2541XXXXXXXX, or null if invalid. */
export function normalisePhone(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, '').replace(/^\+/, '');
  let local: string;
  if (/^254[17]\d{8}$/.test(digits)) local = digits.slice(3);
  else if (/^0[17]\d{8}$/.test(digits)) local = digits.slice(1);
  else if (/^[17]\d{8}$/.test(digits)) local = digits;
  else return null;
  return `254${local}`;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/["'’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Small, stable string hash for deterministic visual variety. */
export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
