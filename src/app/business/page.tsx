import type { Metadata } from 'next';
import { mailLink, site } from '@/lib/site';
import { WhatsAppForm } from '@/components/Forms';
import { PageHero, SecHead } from '@/components/Bits';
import { Icon } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Devices for business, schools & institutions',
  description: 'Bulk laptops, desktops, printers, networking and TVs for Kenyan offices, saccos, schools and county teams — with pro-forma invoices, delivery and set-up.',
  alternates: { canonical: '/business' },
};

export default function BusinessPage() {
  return (
    <>
      <PageHero
        crumbs={[['Business & schools']]}
        eyebrow="For organisations"
        title="Equip the whole team. One invoice."
        lede="Laptops, desktops, printers, Wi‑Fi and screens for offices, saccos, schools, NGOs and county teams — quoted, delivered and set up by one Nakuru partner."
      />
      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="What you get" title="Built for procurement, not just checkout." />
          <div className="svc-grid">
            <div className="svc-card">
              <span className="svc-num">01</span>
              <Icon name="tag" className="svc-ic" />
              <h3>Volume pricing</h3>
              <p>Better pricing from five units up, with pro-forma invoices and LPO support for your approval process.</p>
            </div>
            <div className="svc-card">
              <span className="svc-num">02</span>
              <Icon name="truck" className="svc-ic" />
              <h3>Delivery &amp; set-up</h3>
              <p>Delivered to your office or school, unboxed, updated, and connected to your Wi‑Fi and printers.</p>
            </div>
            <div className="svc-card olive">
              <span className="svc-num">03</span>
              <Icon name="briefcase" className="svc-ic" />
              <h3>Systems that come with it</h3>
              <p>
                As part of {site.parent}, we can also build the website, business system or automation the devices will run.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Who we serve</p>
            <h2>Organisations across the Rift Valley and beyond.</h2>
            <div className="prose">
              <ul>
                <li>Schools and colleges — computer labs, staff laptops, projectors and printers.</li>
                <li>Saccos, retailers and offices — desktops, receipt and office printers, UPS and networking.</li>
                <li>NGOs and county teams — field laptops, tablets and 4G routers.</li>
              </ul>
              <p>
                Prefer email? Write to <a href={mailLink('Business quote request')}>{site.email}</a> with your list and we reply with a quote.
              </p>
            </div>
          </div>
          <WhatsAppForm
            title="Request a quote"
            lead="Hi Steff Store, we would like a business quote:"
            submit="Send quote request"
            fields={[
              { name: 'org', label: 'Organisation', required: true, half: true },
              { name: 'contact', label: 'Your name', required: true, half: true },
              { name: 'sector', label: 'Sector', type: 'select', options: ['School / college', 'Sacco / finance', 'Retail / office', 'NGO', 'County / government', 'Other'], half: true },
              { name: 'timeline', label: 'Needed by', placeholder: 'e.g. end of month', half: true },
              { name: 'needs', label: 'What do you need?', type: 'textarea', required: true, placeholder: 'e.g. 20 × Core i5 laptops, 2 printers, Wi‑Fi for 3 rooms' },
            ]}
          />
        </div>
      </section>
    </>
  );
}
