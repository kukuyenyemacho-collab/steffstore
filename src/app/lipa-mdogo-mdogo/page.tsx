import type { Metadata } from 'next';
import Link from 'next/link';
import { waLink } from '@/lib/site';
import { LipaCalculator } from '@/components/Forms';
import { CtaBand, Faq, PageHero, SecHead } from '@/components/Bits';
import { Icon, WhatsAppIcon } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Lipa Mdogo Mdogo — pay in instalments',
  description: 'Take your phone, laptop or TV home with a deposit and pay the balance in monthly M-Pesa instalments. Simple approval, clear costs.',
  alternates: { canonical: '/lipa-mdogo-mdogo' },
};

export default function LipaPage() {
  return (
    <>
      <PageHero
        crumbs={[['Lipa Mdogo Mdogo']]}
        eyebrow="Pay in instalments"
        title="Take it home today. Pay mdogo mdogo."
        lede="Pay a deposit, take your device, and clear the balance in monthly M-Pesa payments. You see the full cost before you sign — no surprises."
      />
      <section className="section">
        <div className="wrap two-col">
          <div>
            <SecHead eyebrow="How it works" title="Three steps to yours." />
            <ol className="steps light" style={{ gridTemplateColumns: '1fr' }}>
              <li>
                <span className="step-n">01</span>
                <h3>Choose your device</h3>
                <p>Most phones, laptops and TVs over KES 10,000 qualify. Pick one and choose Lipa Mdogo Mdogo at checkout, or ask on WhatsApp.</p>
              </li>
              <li>
                <span className="step-n">02</span>
                <h3>Quick approval</h3>
                <p>Share your ID and recent M-Pesa statement. Our financing partner confirms your plan, usually the same day.</p>
              </li>
              <li>
                <span className="step-n">03</span>
                <h3>Pay the deposit, take it home</h3>
                <p>Pay the deposit by M-Pesa, collect or receive your device, and pay monthly by M-Pesa until it is cleared.</p>
              </li>
            </ol>
          </div>
          <div style={{ position: 'sticky', top: 140 }}>
            <LipaCalculator />
          </div>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Questions</p>
            <h2>Before you apply.</h2>
          </div>
          <Faq
            items={[
              ['Who can apply?', 'Kenyan residents aged 18+ with a national ID and an active M-Pesa line with at least three months of history.'],
              ['How much is the deposit?', 'Usually 30% of the device price. Your exact deposit and monthly amount are confirmed by our financing partner before you commit.'],
              ['Are there extra costs?', 'Instalment plans can include a financing fee. You will see the total cost in writing before you agree — if it does not suit you, there is no obligation.'],
              ['What if I miss a payment?', 'Talk to us early. We would rather agree a new date than add penalties. Repeated missed payments may affect future eligibility.'],
              ['Can I pay off early?', 'Yes, you can clear the balance at any time.'],
            ]}
          />
        </div>
      </section>
      <CtaBand
        title="Ready to start?"
        actions={
          <>
            <Link className="btn btn-accent btn-lg" href="/shop?price=15-50">
              Shop devices <Icon name="arrow" />
            </Link>
            <a className="btn btn-inv-line btn-lg" href={waLink('Hi Steff Store, I want to buy on Lipa Mdogo Mdogo. The device is: ')} target="_blank" rel="noopener">
              <WhatsAppIcon /> Apply on WhatsApp
            </a>
          </>
        }
      >
        Tell us which device you want and we will walk you through it.
      </CtaBand>
    </>
  );
}
