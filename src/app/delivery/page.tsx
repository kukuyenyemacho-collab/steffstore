import type { Metadata } from 'next';
import Link from 'next/link';
import { FREE_DELIVERY_OVER, counties, pickup, riderZone, zoneFor } from '@/lib/delivery';
import { money } from '@/lib/format';
import { site } from '@/lib/site';
import { PageHero, SecHead } from '@/components/Bits';

export const metadata: Metadata = {
  title: 'Delivery across Kenya',
  description: `Same-day delivery in Nakuru, 1–2 days to Nairobi and major towns, and delivery to all 47 counties. Free delivery over ${money(FREE_DELIVERY_OVER)}.`,
  alternates: { canonical: '/delivery' },
};

export default function DeliveryPage() {
  const grouped = new Map<string, string[]>();
  counties.forEach((c) => {
    if (c === 'Nakuru') return;
    const z = zoneFor(c);
    grouped.set(z.id, [...(grouped.get(z.id) ?? []), c]);
  });
  const zones = (['a', 'b', 'c'] as const).map((id) => ({ zone: zoneFor(grouped.get(id)![0]), list: grouped.get(id)! }));

  return (
    <>
      <PageHero
        crumbs={[['Delivery']]}
        eyebrow="Delivery"
        title="To your door, in all 47 counties."
        lede={`Same day in Nakuru. One to two working days to Nairobi and the major towns. Free courier delivery on orders over ${money(FREE_DELIVERY_OVER)} (excluding remote counties).`}
      />
      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="Options" title="Three ways to get it." />
          <div className="svc-grid">
            <div className="svc-card">
              <span className="svc-num">01</span>
              <h3>{pickup.name}</h3>
              <p>
                {pickup.detail}. {pickup.eta}. Try it before you take it home.
              </p>
              <span className="svc-foot">Free</span>
            </div>
            <div className="svc-card">
              <span className="svc-num">02</span>
              <h3>Nakuru same-day rider</h3>
              <p>{riderZone.eta}, anywhere in Nakuru town and environs. Pay on delivery available.</p>
              <span className="svc-foot">
                {money(riderZone.fee)} · free over {money(riderZone.freeOver!)}
              </span>
            </div>
            <div className="svc-card olive">
              <span className="svc-num">03</span>
              <h3>Courier countrywide</h3>
              <p>Insured courier with SMS tracking to your town or nearest pickup point. TVs travel upright in original packaging.</p>
              <span className="svc-foot">From {money(400)} · free over {money(FREE_DELIVERY_OVER)}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap">
          <SecHead eyebrow="Fees by county" title="What delivery costs." />
          <div className="compare-wrap" style={{ padding: 'var(--s-2) var(--s-5)', background: 'var(--bg)' }}>
            <table className="zone-table">
              <thead>
                <tr>
                  <th scope="col">Zone</th>
                  <th scope="col">Fee</th>
                  <th scope="col">Time</th>
                  <th scope="col">Counties</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Nakuru</b>
                  </td>
                  <td>
                    Free pickup · rider {money(riderZone.fee)}
                    <small>Rider free over {money(riderZone.freeOver!)}</small>
                  </td>
                  <td>Same day</td>
                  <td>Nakuru County (courier rates as Zone A outside town)</td>
                </tr>
                {zones.map(({ zone, list }) => (
                  <tr key={zone.id}>
                    <td>
                      <b>{zone.name.replace('Courier — ', '')}</b>
                    </td>
                    <td>
                      {money(zone.fee)}
                      <small>{zone.freeOver ? `Free over ${money(zone.freeOver)}` : 'No free-delivery threshold'}</small>
                    </td>
                    <td>{zone.eta}</td>
                    <td>{list.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Good to know</p>
            <h2>How delivery works.</h2>
          </div>
          <div className="prose">
            <ul>
              <li>Orders confirmed before 3pm on a working day leave Nakuru the same day.</li>
              <li>We share the rider’s number or courier tracking code on WhatsApp as soon as your order leaves.</li>
              <li>Open the parcel in front of the rider. If anything is damaged or wrong, refuse it — we replace it at our cost.</li>
              <li>Only pay to {site.legalName}’s official M-Pesa and bank details shown at checkout or in your order message.</li>
              <li>
                Large TVs and bulk business orders may need a scheduled delivery — we will call you. See also{' '}
                <Link href="/warranty-returns">warranty &amp; returns</Link>.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
