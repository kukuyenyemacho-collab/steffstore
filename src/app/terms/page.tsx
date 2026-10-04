import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import Legal from '@/components/Legal';

export const metadata: Metadata = {
  title: 'Terms of Sale',
  description: 'The terms that apply when you buy from Steff Store — pricing, payment, delivery, warranty and returns.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <Legal title="Terms of Sale" path="/terms" updated="4 October 2026">
      <p>
        These terms apply when you buy from Steff Store, operated by {site.legalName} (registration no. {site.registrationNo}). By placing an order you
        agree to them. Nothing here limits your rights under the Consumer Protection Act, 2012 or other Kenyan law.
      </p>
      <h2>1. Prices and availability</h2>
      <p>
        Prices are in Kenya Shillings and are the full price for the device. Delivery fees are shown before you pay. We work hard to keep stock and
        prices accurate; if an error slips through, we will tell you before dispatch and you can cancel for a full refund.
      </p>
      <h2>2. Orders</h2>
      <p>
        Your order is accepted when we confirm it by WhatsApp, SMS, phone or email. We may decline or cancel an order — for example if an item is
        out of stock or a payment cannot be verified — and will refund anything paid.
      </p>
      <h2>3. Payment</h2>
      <p>
        We accept M-Pesa, bank transfer, and cash or M-Pesa on delivery for Nakuru pickup and rider orders. Only pay to the official {site.legalName}{' '}
        M-Pesa and bank details shown at checkout or in your order confirmation. Lipa Mdogo Mdogo plans are subject to approval and to the
        financing partner’s written terms.
      </p>
      <h2>4. Delivery</h2>
      <p>
        Delivery times are estimates. Risk passes to you when the device is delivered and you accept it. Please inspect your order in front of the
        rider. See <Link href="/delivery">Delivery</Link> for fees and timings.
      </p>
      <h2>5. Warranty and returns</h2>
      <p>
        Warranty, faulty-on-arrival and change-of-mind returns are set out on the <Link href="/warranty-returns">Warranty &amp; returns</Link> page,
        which forms part of these terms.
      </p>
      <h2>6. Ex-UK devices</h2>
      <p>Devices labelled ex-UK are pre-owned, graded and tested. Cosmetic signs of use consistent with their grade are not a fault.</p>
      <h2>7. Liability</h2>
      <p>
        We are responsible for losses that are a foreseeable result of our breaking these terms. We are not responsible for lost data — please back
        up your devices.
      </p>
      <h2>8. Contact and disputes</h2>
      <p>
        Talk to us first at {site.email} or {site.phone}; most issues are solved in a message. These terms are governed by the laws of Kenya.
      </p>
    </Legal>
  );
}
