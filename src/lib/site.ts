// Single source of truth for Steff Store business details.
// Company facts mirror steffcloud.co.ke — change them here, never in page code.

export const site = {
  name: 'Steff Store',
  shortName: 'Steff Store',
  parent: 'Steff Cloud',
  legalName: 'Steff Cloud Limited',
  registrationNo: 'PVT-RQ13VMZZ',
  // Katakana for “Steff Cloud” — the parent brand mark used in the footer.
  japaneseName: 'ステフクラウド',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://store.steffcloud.co.ke').replace(/\/$/, ''),
  parentUrl: 'https://steffcloud.co.ke',
  slogan: 'Your Digital Arm.',
  tagline: 'Genuine devices. Honest prices. Delivered across Kenya.',
  description:
    'Steff Store sells genuine laptops, TVs, smartphones, audio, gaming and office tech with M-Pesa payments, warranty and delivery across all 47 counties. Based in Nakuru, Kenya.',
  founded: '2026',
  founder: 'Antony Mungai',
  founderTitle: 'Founder & CEO',
  // TODO(owner): confirm the store line — steffcloud.co.ke lists this number, but a new line may replace it.
  phone: '+254 118 407 026',
  phoneE164: '+254118407026',
  whatsapp: '254118407026',
  whatsappCatalogue: 'https://wa.me/c/254118407026',
  email: 'info@steffcloud.co.ke',
  address: {
    street: 'Nakuru–Solai Road, opposite Emboita',
    locality: 'Nakuru',
    region: 'Nakuru County',
    postalCode: '20100',
    country: 'KE',
  },
  geo: { lat: -0.3031, lng: 36.08 },
  hours: [
    { days: 'Mon – Fri', open: '8:00am', close: '6:00pm' },
    { days: 'Saturday', open: '8:00am', close: '6:00pm' },
    { days: 'Sunday', open: 'Closed', close: '' },
  ],
  // Machine-readable opening hours (Mon=1 … Sun=0), 24h local time (EAT).
  openingSchedule: { 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 18] } as Record<number, [number, number]>,
  hoursSchema: ['Mo-Sa 08:00-18:00'],
  hoursText: 'Mon – Sat, 8:00am – 6:00pm · WhatsApp replies 7 days',
  timezone: 'Africa/Nairobi',
  socials: [
    { label: 'TikTok', handle: '@cloud.steff', url: 'https://www.tiktok.com/@cloud.steff' },
    { label: 'Instagram', handle: '@cloud.steff', url: 'https://www.instagram.com/cloud.steff' },
    { label: 'YouTube', handle: '@steffcloud', url: 'https://www.youtube.com/@steffcloud' },
    { label: 'X', handle: '@cloud_steff', url: 'https://x.com/cloud_steff' },
    { label: 'Threads', handle: '@cloud.steff', url: 'https://www.threads.net/@cloud.steff' },
  ],
  values: ['Move slower to go faster', 'Systems over chaos', 'Honesty in pricing', 'Quality before speed'],
  mission:
    'To help every Kenyan business operate like a serious, structured, professional company — through technology, automation and good systems.',
  topbar: {
    text: 'October Deals are live — genuine devices, honest prices',
    cta: 'Shop deals',
    href: '/deals',
  },
  // Deal countdowns run to this date and disappear after it. No rolling fake timers.
  dealsEndAt: '2026-10-31T23:59:59+03:00',
  dealsName: 'October Deals',
  analytics: {
    ga4: process.env.NEXT_PUBLIC_GA4_ID || '',
    metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
    tiktokPixel: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '',
  },
};

export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
export const telLink = `tel:${site.phoneE164}`;
export const mailLink = (subject?: string) =>
  `mailto:${site.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`;
export const mapsEmbed = `https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=15&output=embed`;
