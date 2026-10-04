import type { Metadata } from 'next';
import Link from 'next/link';
import { products } from '@/lib/catalog';
import { brands } from '@/lib/brands';
import { site, waLink } from '@/lib/site';
import { CtaBand, PageHero, SecHead } from '@/components/Bits';
import { Icon, WhatsAppIcon } from '@/components/Icon';

export const metadata: Metadata = {
  title: 'About Steff Store',
  description: 'Steff Store is the electronics store of Steff Cloud Limited, a Nakuru technology company. Genuine devices, honest prices and real people on WhatsApp.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[['About']]}
        eyebrow="About Steff Store"
        title="A device shop that runs like a serious business."
        lede={`Steff Store is the electronics store of ${site.legalName}, a technology company in Nakuru. We built it the way we build for our clients: clear systems, honest prices, and people who pick up the phone.`}
      />

      <section className="section">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Why we exist</p>
            <h2>Buying tech should not feel like a gamble.</h2>
          </div>
          <div className="statement">
            <p>
              Clones sold as originals. “Ex-UK” that means anything. Prices that change when you ask twice. We started Steff Store to be the
              opposite — <u>the shop we wanted to buy from</u>.
            </p>
            <dl className="facts">
              <div>
                <dt>47</dt>
                <dd>counties we deliver to</dd>
              </div>
              <div>
                <dt>{products.length}</dt>
                <dd>devices in the store today</dd>
              </div>
              <div>
                <dt>{brands.length}</dt>
                <dd>brands you already trust</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section inv">
        <div className="wrap">
          <SecHead eyebrow="How we work" title="Three promises, kept on every order." />
          <ol className="steps">
            <li>
              <span className="step-n">01</span>
              <h3>Genuine or nothing</h3>
              <p>New devices arrive sealed. Ex-UK machines are graded, tested and labelled as exactly what they are.</p>
            </li>
            <li>
              <span className="step-n">02</span>
              <h3>Honest pricing</h3>
              <p>The price on the page is the price you pay. Delivery shown before checkout. Deals show the old price and a real end date.</p>
            </li>
            <li>
              <span className="step-n">03</span>
              <h3>A person who answers</h3>
              <p>Questions, warranty claims and after-sales are handled by our own team in Nakuru — on WhatsApp, by phone or in the shop.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="Our values" title="The Steff Cloud way.">
            Steff Store runs on the same four values as everything {site.parent} builds.
          </SecHead>
          <div className="values-strip">
            {site.values.map((v) => (
              <div key={v}>{v}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Part of {site.parent}</p>
            <h2>{site.slogan}</h2>
            <p className="muted">
              {site.parent} is a Nakuru technology and digital services company. We build websites, business systems, AI automation and brands
              for Kenyan organisations — and we build and operate our own platforms, like this store. It is proof the work holds up when we are
              the ones depending on it.
            </p>
            <blockquote className="quote">
              <p style={{ margin: 0 }}>
                <b>Our mission:</b> {site.mission}
              </p>
            </blockquote>
            <div className="btns">
              <a className="btn btn-solid" href={site.parentUrl} rel="noopener">
                Visit steffcloud.co.ke <Icon name="arrow" />
              </a>
              <Link className="btn btn-line" href="/business">
                Devices for your business
              </Link>
            </div>
          </div>
          <div>
            <table className="details-table">
              <tbody>
                <tr>
                  <th scope="row">Registered name</th>
                  <td>{site.legalName}</td>
                </tr>
                <tr>
                  <th scope="row">Registration no.</th>
                  <td>{site.registrationNo}</td>
                </tr>
                <tr>
                  <th scope="row">Legal form</th>
                  <td>Private Company Limited by Shares</td>
                </tr>
                <tr>
                  <th scope="row">Founder &amp; CEO</th>
                  <td>{site.founder}</td>
                </tr>
                <tr>
                  <th scope="row">Shop</th>
                  <td>
                    {site.address.street}, {site.address.locality}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Hours</th>
                  <td>{site.hoursText}</td>
                </tr>
                <tr>
                  <th scope="row">Email</th>
                  <td>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CtaBand
        title="Come and see us in Nakuru."
        actions={
          <>
            <Link className="btn btn-accent btn-lg" href="/contact">
              Directions &amp; hours <Icon name="arrow" />
            </Link>
            <a className="btn btn-inv-line btn-lg" href={waLink('Hi Steff Store!')} target="_blank" rel="noopener">
              <WhatsAppIcon /> WhatsApp us
            </a>
          </>
        }
      >
        Try the keyboard, compare the screens, ask every question. No pressure, no hard sell.
      </CtaBand>
    </>
  );
}
