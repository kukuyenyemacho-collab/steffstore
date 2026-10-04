import type { Metadata } from 'next';
import { WhatsAppForm } from '@/components/Forms';
import { PageHero, SecHead } from '@/components/Bits';

export const metadata: Metadata = {
  title: 'Trade in your phone or laptop',
  description: 'Trade in your old phone, laptop, tablet or console at Steff Store and put the value towards a new device. Same-day offers on WhatsApp.',
  alternates: { canonical: '/trade-in' },
};

export default function TradeInPage() {
  return (
    <>
      <PageHero
        crumbs={[['Trade-in']]}
        eyebrow="Trade-in"
        title="Your old device is worth something."
        lede="Send us the details and a few photos. We reply with an offer the same day and put the value straight towards your new device."
      />
      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="How it works" title="Swap in three steps." />
          <ol className="steps light">
            <li>
              <span className="step-n">01</span>
              <h3>Tell us about it</h3>
              <p>Fill in the form below — it opens WhatsApp so you can attach photos of the front, back and screen.</p>
            </li>
            <li>
              <span className="step-n">02</span>
              <h3>Get an offer</h3>
              <p>We reply with a fair offer the same day, based on model, condition and current market value.</p>
            </li>
            <li>
              <span className="step-n">03</span>
              <h3>Swap and save</h3>
              <p>Bring it to the shop or send it with the rider. We check it, and the value comes off your new device.</p>
            </li>
          </ol>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">What we accept</p>
            <h2>Phones, laptops, tablets and consoles.</h2>
            <div className="prose">
              <ul>
                <li>Smartphones — iPhone, Samsung, Pixel and recent Tecno, Infinix and Redmi models.</li>
                <li>Laptops — MacBook and business laptops from the last six years.</li>
                <li>Tablets, iPads, PlayStation, Xbox and Nintendo Switch.</li>
              </ul>
              <p>
                Before you hand it over, back up your data, sign out of iCloud or Google, and remove your SIM and memory card. We wipe every device we
                receive.
              </p>
            </div>
          </div>
          <WhatsAppForm
            title="Get an offer"
            lead="Hi Steff Store, I'd like a trade-in offer:"
            submit="Send for an offer"
            fields={[
              { name: 'type', label: 'Device type', type: 'select', required: true, options: ['Phone', 'Laptop', 'Tablet / iPad', 'Console', 'Other'], half: true },
              { name: 'model', label: 'Brand & model', required: true, placeholder: 'e.g. iPhone 13 128GB', half: true },
              { name: 'condition', label: 'Condition', type: 'select', required: true, options: ['Like new', 'Good — light scratches', 'Fair — visible wear', 'Cracked or faulty'] },
              { name: 'extras', label: 'Box, charger or receipt?', placeholder: 'e.g. box and charger' },
              { name: 'want', label: 'What would you like to buy?', placeholder: 'e.g. iPhone 17' },
            ]}
          />
        </div>
      </section>
    </>
  );
}
