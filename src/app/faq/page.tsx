import type { Metadata } from 'next';
import Link from 'next/link';
import { FREE_DELIVERY_OVER } from '@/lib/delivery';
import { site, waLink } from '@/lib/site';
import { CtaBand, Faq, JsonLd, PageHero, faqSchema } from '@/components/Bits';
import { WhatsAppIcon } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Frequently asked questions',
  description: 'Answers about ordering, M-Pesa payment, delivery across Kenya, warranty, returns, ex-UK laptops and Lipa Mdogo Mdogo at Steff Store.',
  alternates: { canonical: '/faq' },
};

const free = FREE_DELIVERY_OVER.toLocaleString('en-KE');

const GROUPS: [string, [string, string][]][] = [
  [
    'Ordering & payment',
    [
      ['How do I place an order?', 'Add items to your cart and check out in three steps, or tap “Order on WhatsApp” on any product and we will take it from there.'],
      ['Which payment methods do you accept?', 'M-Pesa (we send a prompt to your phone), bank transfer, and cash or M-Pesa on delivery for Nakuru pickup and rider orders. Lipa Mdogo Mdogo is available on most items over KES 10,000.'],
      ['Is it safe to pay before delivery?', `Yes. Payments go to ${site.legalName}'s registered M-Pesa and bank accounts only — we will never ask you to pay a personal number. If anyone contacts you from a different number, do not pay and call us on ${site.phone}.`],
      ['Do you give receipts and invoices?', 'Yes. Every order gets a receipt, and businesses can request a pro-forma invoice before paying.'],
      ['Are prices inclusive of VAT?', 'Prices shown are the full price you pay for the device. Delivery is shown separately before you pay.'],
    ],
  ],
  [
    'Delivery & pickup',
    [
      ['Where do you deliver?', 'All 47 counties. Same day in Nakuru town, 1–2 working days to Nairobi and major towns, 2–3 days elsewhere and 3–5 days to remote counties.'],
      ['How much is delivery?', `Pickup in Nakuru is free. The Nakuru rider is KES 200 (free over KES 10,000). Courier delivery starts at KES 400 and is free on orders over KES ${free}, except to remote counties.`],
      ['Can I collect from the shop?', `Yes — choose “Pick up in Nakuru” at checkout. Orders are ready in about two hours during opening hours at ${site.address.street}.`],
      ['Can I inspect before I accept?', 'Always. Open the parcel in front of the rider. If anything is wrong, refuse it and we replace it at no cost.'],
    ],
  ],
  [
    'Warranty & returns',
    [
      ['What warranty do I get?', 'New devices carry the manufacturer warranty shown on the product page — usually 12 months. Ex-UK laptops carry a 6-month Steff Store warranty.'],
      ['Who handles warranty claims?', 'We do. Bring or courier the device to our Nakuru shop and we handle the claim with the brand, so you deal with one Kenyan team.'],
      ['What if it arrives faulty?', 'Tell us within 7 days and we replace it or refund you after checking the fault. See the warranty & returns page for the details.'],
    ],
  ],
  [
    'Products',
    [
      ['Are your products genuine?', 'Yes. New stock arrives sealed with the manufacturer warranty. We never sell clones or refurbished stock as new.'],
      ['What does ex-UK mean?', 'Ex-UK laptops are former corporate machines imported from the United Kingdom, graded, cleaned and fully tested. They are always labelled clearly and cost far less than new.'],
      ['Will this phone work on Safaricom, Airtel and Telkom?', 'Yes. Every phone we sell works on all Kenyan networks, and 5G phones work on Safaricom 5G where available.'],
      ['Can you get a product you do not list?', 'Often, yes. Tell us the model on WhatsApp and we will check availability and price — usually within the day.'],
    ],
  ],
];

export default function FaqPage() {
  const all = GROUPS.flatMap(([, items]) => items);
  return (
    <>
      <JsonLd data={faqSchema(all)} />
      <PageHero crumbs={[['FAQ']]} eyebrow="Help" title="Questions, answered honestly." lede="Everything people ask before they buy. Missing something? Ask us on WhatsApp.">
        <ul className="chips">
          {GROUPS.map(([g]) => (
            <li key={g}>
              <a href={`#${g.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{g}</a>
            </li>
          ))}
        </ul>
      </PageHero>
      {GROUPS.map(([g, items], i) => (
        <section key={g} className={`section tight${i % 2 ? ' tint' : ''}`} id={g.toLowerCase().replace(/[^a-z]+/g, '-')}>
          <div className="wrap two-col">
            <div>
              <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
              <h2>{g}</h2>
              {g === 'Warranty & returns' && (
                <p className="muted">
                  Full details on the <Link href="/warranty-returns">warranty &amp; returns</Link> page.
                </p>
              )}
              {g === 'Delivery & pickup' && (
                <p className="muted">
                  Fees by county on the <Link href="/delivery">delivery</Link> page.
                </p>
              )}
            </div>
            <Faq items={items} />
          </div>
        </section>
      ))}
      <CtaBand
        title="Still have a question?"
        actions={
          <a className="btn btn-accent btn-lg" href={waLink('Hi Steff Store, I have a question:')} target="_blank" rel="noopener">
            <WhatsAppIcon /> Ask on WhatsApp
          </a>
        }
      >
        We usually reply within minutes during opening hours.
      </CtaBand>
    </>
  );
}
