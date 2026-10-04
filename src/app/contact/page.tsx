import type { Metadata } from 'next';
import { mailLink, mapsLink, site, telLink, waLink } from '@/lib/site';
import MapEmbed from '@/components/MapEmbed';
import OpenStatus from '@/components/OpenStatus';
import { WhatsAppForm } from '@/components/Forms';
import { PageHero } from '@/components/Bits';
import { Icon, WhatsAppIcon } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Contact & visit',
  description: `Visit Steff Store on the ${site.address.street}, Nakuru, or reach us on WhatsApp and phone ${site.phone}. Open ${site.hoursText}.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <PageHero crumbs={[['Contact']]} eyebrow="Contact & visit" title="Talk to a real person." lede="WhatsApp is fastest. Calls, email and walk-ins are just as welcome.">
        <div style={{ marginTop: 'var(--s-5)' }}>
          <OpenStatus big />
        </div>
      </PageHero>
      <section className="section">
        <div className="wrap visit">
          <div>
            <ul className="contact-cards" style={{ marginTop: 0 }}>
              <li>
                <a href={waLink('Hi Steff Store!')} target="_blank" rel="noopener">
                  <WhatsAppIcon />
                  <span>
                    <b>WhatsApp — fastest</b>
                    <span>{site.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={telLink}>
                  <Icon name="phone" />
                  <span>
                    <b>Call</b>
                    <span>{site.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={mailLink('Steff Store enquiry')}>
                  <Icon name="mail" />
                  <span>
                    <b>Email</b>
                    <span>{site.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={mapsLink} target="_blank" rel="noopener">
                  <Icon name="pin" />
                  <span>
                    <b>Visit the shop</b>
                    <span>
                      {site.address.street}, {site.address.locality}
                    </span>
                  </span>
                </a>
              </li>
            </ul>
            <table className="hours-table">
              <caption className="sr">Opening hours</caption>
              <tbody>
                {site.hours.map((h) => (
                  <tr key={h.days}>
                    <th scope="row">{h.days}</th>
                    <td>{h.close ? `${h.open} – ${h.close}` : h.open}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">WhatsApp</th>
                  <td>Replies 7 days a week</td>
                </tr>
              </tbody>
            </table>
          </div>
          <MapEmbed />
        </div>
      </section>
      <section className="section tint">
        <div className="wrap narrow">
          <WhatsAppForm
            title="Send us a message"
            intro="Fill this in and it opens WhatsApp with your message ready to send — no account or email needed."
            lead="Hi Steff Store, I have a question:"
            submit="Continue on WhatsApp"
            fields={[
              { name: 'name', label: 'Your name', required: true, half: true },
              { name: 'phone', label: 'Phone', type: 'tel', half: true, placeholder: '0712 345 678' },
              { name: 'topic', label: 'Topic', type: 'select', required: true, options: ['Help choosing a device', 'An existing order', 'Warranty or repair', 'Lipa Mdogo Mdogo', 'Trade-in', 'Business / bulk order', 'Something else'] },
              { name: 'message', label: 'Message', type: 'textarea', required: true },
            ]}
          />
        </div>
      </section>
    </>
  );
}
