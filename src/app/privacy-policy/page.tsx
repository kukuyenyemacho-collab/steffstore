import type { Metadata } from 'next';
import { site } from '@/lib/site';
import Legal from '@/components/Legal';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Steff Store (Steff Cloud Limited) collects, uses and protects your personal data under the Kenya Data Protection Act, 2019.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPage() {
  return (
    <Legal title="Privacy Policy" path="/privacy-policy" updated="4 October 2026">
      <p>
        {site.legalName} (“Steff Store”, “we”, “us”) respects your privacy. This policy explains what personal data we collect when you use this
        store, why, and the choices you have. It is written to meet our obligations under the <b>Kenya Data Protection Act, 2019</b> and the Data
        Protection (General) Regulations, 2021.
      </p>
      <h2>Who is responsible</h2>
      <p>
        {site.legalName} (registration no. {site.registrationNo}), {site.address.street}, {site.address.locality}, Kenya, is the data controller.
        Contact us about privacy at <a href={`mailto:${site.email}`}>{site.email}</a> or {site.phone}.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li><b>Order details</b> — your name, phone number, optional email, delivery county, town and address, and the items you buy.</li>
        <li><b>Payment details</b> — the M-Pesa number and transaction reference. We never see or store your M-Pesa PIN or card numbers.</li>
        <li><b>Messages</b> — what you send us on WhatsApp, phone or email.</li>
        <li><b>On this device only</b> — your cart, wishlist, compare list, recently viewed items and theme are kept in your browser’s storage and are not sent to us.</li>
        <li><b>Analytics</b> — only if you accept optional cookies: pages visited and general device information, with IP addresses anonymised.</li>
      </ul>
      <h2>Why we use it</h2>
      <ul>
        <li>To process, deliver and support your order and any warranty claim (performance of a contract).</li>
        <li>To meet tax, accounting and consumer-protection obligations (legal obligation).</li>
        <li>To improve the store and measure our advertising — only with your consent, which you can withdraw at any time.</li>
      </ul>
      <h2>Who we share it with</h2>
      <p>
        Only the people who help us complete your order: Safaricom (M-Pesa payments), our delivery riders and courier partners, our financing
        partner if you choose Lipa Mdogo Mdogo, and the service providers that host this store and our order records. We never sell your data.
      </p>
      <h2>How long we keep it</h2>
      <p>Order and payment records are kept for up to seven years for tax purposes. Messages and marketing preferences are kept only as long as needed.</p>
      <h2>Your rights</h2>
      <p>
        You can ask to access, correct or delete your data, object to processing, or withdraw consent. Email {site.email}; we respond within the
        timelines set by the Act. You can also complain to the Office of the Data Protection Commissioner (ODPC).
      </p>
      <h2>Security</h2>
      <p>We use encrypted connections (HTTPS), limit staff access to what each person needs, and never ask for your M-Pesa PIN.</p>
    </Legal>
  );
}
