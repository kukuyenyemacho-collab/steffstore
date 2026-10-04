import Link from 'next/link';
import { categories } from '@/lib/categories';
import { mailLink, site, telLink, waLink } from '@/lib/site';
import { Icon } from './Icon';
import OpenStatus from './OpenStatus';
import CookieSettingsButton from './CookieSettingsButton';

// One-line footer name, sized so the text fills the width with the logo's full stop in orange.
const FNAME_H = 54;
const FNAME_Y = 51;
const FNAME_DOT = 8;
const FNAME_W = 1000 - FNAME_DOT * 2 - 8;

function Col({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="f-col">
      <p className="f-h">{title}</p>
      <ul>
        {items.map(([n, h]) => (
          <li key={h}>
            <Link href={h}>{n}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="f-top">
          <div className="f-grid">
            <div className="f-brand">
              <span className="logo-mark" role="img" aria-label="Steff Cloud, established 2026" />
              <p>
                Steff Store is the device shop of {site.legalName} — genuine tech, honest prices and real people on
                WhatsApp. Based in Nakuru, delivering across Kenya.
              </p>
              <OpenStatus />
              <ul className="f-contact">
                <li>
                  <Icon name="phone" />
                  <a href={telLink}>{site.phone}</a>
                </li>
                <li>
                  <Icon name="mail" />
                  <a href={mailLink()}>{site.email}</a>
                </li>
                <li>
                  <Icon name="pin" />
                  <span>
                    {site.address.street}, {site.address.locality}
                  </span>
                </li>
              </ul>
              <ul className="socials">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} rel="noopener me" target="_blank">
                      {s.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={site.whatsappCatalogue} rel="noopener" target="_blank">
                    WhatsApp catalogue
                  </a>
                </li>
              </ul>
            </div>
            <Col
              title="Shop"
              items={[
                ['All devices', '/shop'],
                ...categories.slice(0, 7).map((c): [string, string] => [c.name, `/category/${c.slug}`]),
                ['Deals', '/deals'],
                ['Brands', '/brands'],
              ]}
            />
            <Col
              title="Buy with confidence"
              items={[
                ['Lipa Mdogo Mdogo', '/lipa-mdogo-mdogo'],
                ['Trade in your device', '/trade-in'],
                ['Business & schools', '/business'],
                ['Delivery', '/delivery'],
                ['Warranty & returns', '/warranty-returns'],
                ['Track an order', '/track-order'],
              ]}
            />
            <Col
              title="Company"
              items={[
                ['About Steff Store', '/about'],
                ['Contact & visit', '/contact'],
                ['FAQ', '/faq'],
                ['Compare devices', '/compare'],
                ['Wishlist', '/wishlist'],
              ]}
            />
            <div className="f-col">
              <p className="f-h">Legal</p>
              <ul>
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Sale</Link>
                </li>
                <li>
                  <Link href="/cookie-policy">Cookie Policy</Link>
                </li>
                <li>
                  <CookieSettingsButton />
                </li>
                <li>
                  <a href={site.parentUrl} rel="noopener">
                    Steff Cloud main site
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <p className="f-jp" lang="ja" aria-label={`${site.japaneseName}: Steff Cloud in Japanese`}>
            {site.japaneseName}
          </p>
        </div>
        <div className="pay-row" aria-label="Payment methods">
          <span>Pay with</span>
          <span className="pill mpesa">M-PESA</span>
          <span className="pill">Pay on delivery · Nakuru</span>
          <span className="pill">Lipa Mdogo Mdogo</span>
          <span className="pill">Bank transfer</span>
          <a className="pill" href={waLink('Hi Steff Store, I have a question about an order.')} target="_blank" rel="noopener">
            Order on WhatsApp
          </a>
        </div>
        <svg className="f-name" viewBox={`0 0 1000 ${FNAME_H}`} role="img" aria-label="STEFF STORE">
          <text x="0" y={FNAME_Y} textLength={FNAME_W} lengthAdjust="spacingAndGlyphs">
            STEFF STORE
          </text>
          <circle className="f-dot" cx={1000 - FNAME_DOT} cy={FNAME_Y - FNAME_DOT} r={FNAME_DOT} />
        </svg>
        <div className="f-bottom">
          <p>
            © {new Date().getFullYear()} {site.legalName} · Reg. {site.registrationNo}
          </p>
          <p>{site.slogan} Made with intent in Nakuru, Kenya.</p>
        </div>
      </div>
    </footer>
  );
}
