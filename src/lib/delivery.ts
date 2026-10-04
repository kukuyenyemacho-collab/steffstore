// Delivery zones and fees. TODO(owner): confirm fees and timings with your courier before launch.

export const counties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
  'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
  'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', "Murang'a", 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
] as const;

export type County = (typeof counties)[number];

export interface Zone {
  id: 'nakuru' | 'a' | 'b' | 'c';
  name: string;
  fee: number;
  eta: string;
  freeOver: number | null;
}

export const FREE_DELIVERY_OVER = 30000;

const zones: Record<Zone['id'], Zone> = {
  nakuru: { id: 'nakuru', name: 'Nakuru same-day rider', fee: 200, eta: 'Same day if you order by 3pm', freeOver: 10000 },
  a: { id: 'a', name: 'Courier — major towns', fee: 400, eta: '1–2 working days', freeOver: FREE_DELIVERY_OVER },
  b: { id: 'b', name: 'Courier — countrywide', fee: 550, eta: '2–3 working days', freeOver: FREE_DELIVERY_OVER },
  c: { id: 'c', name: 'Courier — remote counties', fee: 800, eta: '3–5 working days', freeOver: null },
};

const zoneA: County[] = [
  'Nairobi', 'Kiambu', 'Nyandarua', 'Baringo', 'Laikipia', 'Narok', 'Kericho', 'Bomet', 'Uasin Gishu', 'Kajiado',
  'Machakos', "Murang'a", 'Nyeri', 'Kisumu',
];
const zoneC: County[] = [
  'Turkana', 'Mandera', 'Wajir', 'Marsabit', 'Garissa', 'Lamu', 'Tana River', 'Samburu', 'West Pokot', 'Isiolo',
];

export function zoneFor(county: string): Zone {
  if (county === 'Nakuru') return zones.nakuru;
  if ((zoneA as string[]).includes(county)) return zones.a;
  if ((zoneC as string[]).includes(county)) return zones.c;
  return zones.b;
}

export type DeliveryMethod = 'pickup' | 'rider' | 'courier';

export function deliveryFee(method: DeliveryMethod, county: string, subtotal: number): number {
  if (method === 'pickup') return 0;
  const zone = method === 'rider' ? zones.nakuru : zoneFor(county === 'Nakuru' ? 'Nairobi' : county);
  if (zone.freeOver !== null && subtotal >= zone.freeOver) return 0;
  return zone.fee;
}

export const pickup = {
  name: 'Pick up in Nakuru',
  detail: 'Steff Store, Nakuru–Solai Road, opposite Emboita',
  eta: 'Ready in 2 hours during opening hours',
};

export const riderZone = zones.nakuru;
