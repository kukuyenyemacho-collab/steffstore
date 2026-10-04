import type { Metadata } from 'next';
import { site, waLink } from '@/lib/site';
import { CtaBand, PageHero } from '@/components/Bits';
import { WhatsAppIcon } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Warranty & returns',
  description: 'Manufacturer warranty on new devices, 6-month Steff Store warranty on ex-UK laptops, and 7-day replacement if a device arrives faulty. Claims handled in Nakuru.',
  alternates: { canonical: '/warranty-returns' },
};

export default function WarrantyPage() {
  return (
    <>
      <PageHero
        crumbs={[['Warranty & returns']]}
        eyebrow="After you buy"
        title="Warranty you can actually use."
        lede="We handle every claim ourselves in Nakuru — you deal with one Kenyan team, not an overseas helpline."
      />
      <section className="section">
        <div className="wrap">
          <ol className="steps light">
            <li>
              <span className="step-n">01</span>
              <h3>Tell us</h3>
              <p>WhatsApp or call with your order number and a short video or photo of the problem.</p>
            </li>
            <li>
              <span className="step-n">02</span>
              <h3>Send or bring it</h3>
              <p>Drop it at the shop or send it by courier. Faulty-on-arrival returns are collected at our cost.</p>
            </li>
            <li>
              <span className="step-n">03</span>
              <h3>Fixed or replaced</h3>
              <p>We repair, replace or refund under the terms below, and keep you updated on WhatsApp.</p>
            </li>
          </ol>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap legal-layout" style={{ paddingBlock: 0 }}>
          <nav className="legal-nav" aria-label="On this page">
            <ul>
              <li><a href="#warranty">Warranty cover</a></li>
              <li><a href="#doa">Faulty on arrival</a></li>
              <li><a href="#change">Change of mind</a></li>
              <li><a href="#not-covered">Not covered</a></li>
              <li><a href="#refunds">Refunds</a></li>
            </ul>
          </nav>
          <div className="prose">
            <h2 id="warranty" style={{ marginTop: 0 }}>Warranty cover</h2>
            <p>
              <b>New devices</b> carry the manufacturer warranty shown on each product page — usually 12 months from delivery. <b>Ex-UK laptops</b>{' '}
              carry a 6-month Steff Store warranty covering hardware faults that are not caused by misuse. Keep your receipt or order number; it is
              your proof of purchase.
            </p>
            <h2 id="doa">Faulty on arrival</h2>
            <p>
              If a device is faulty when it arrives, tell us within <b>7 days</b> of delivery. Once we confirm the fault we replace it with the same
              item or, if none is available, refund you in full — including delivery.
            </p>
            <h2 id="change">Change of mind</h2>
            <p>
              Sealed, unopened items can be returned within 7 days of delivery for a refund or store credit, less any delivery cost. For hygiene
              and data reasons, opened earphones, headphones and memory cards cannot be returned unless faulty.
            </p>
            <h2 id="not-covered">What is not covered</h2>
            <ul>
              <li>Physical damage, cracked screens, liquid damage or power-surge damage.</li>
              <li>Repairs or modifications by anyone other than us or the brand’s authorised service centre.</li>
              <li>Software issues, lost data, forgotten passwords and accounts (we can help, but it is not a warranty fault).</li>
              <li>Normal wear of batteries, cables and cosmetic parts.</li>
            </ul>
            <p>
              Back up your data before sending a device for repair. Using a surge protector or UPS — especially during KPLC outages — protects your
              warranty and your device.
            </p>
            <h2 id="refunds">Refunds</h2>
            <p>
              Approved refunds are paid to the original M-Pesa number or bank account within 7 working days. Nothing on this page limits your
              rights under the Consumer Protection Act, 2012.
            </p>
            <p className="muted">Questions? Email {site.email} or WhatsApp {site.phone}.</p>
          </div>
        </div>
      </section>
      <CtaBand
        title="Something not right?"
        actions={
          <a className="btn btn-accent btn-lg" href={waLink('Hi Steff Store, I need help with a warranty claim. Order number: ')} target="_blank" rel="noopener">
            <WhatsAppIcon /> Start a claim
          </a>
        }
      >
        Send your order number and a short video of the problem. We reply with next steps the same day.
      </CtaBand>
    </>
  );
}
