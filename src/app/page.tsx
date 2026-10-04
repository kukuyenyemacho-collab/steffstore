import Link from 'next/link';
import { categories } from '@/lib/categories';
import { brands } from '@/lib/brands';
import { brandCount, countIn, deals, inCategory, newArrivals, priceBands, productBySlug } from '@/lib/catalog';
import { money } from '@/lib/format';
import { mailLink, site, telLink, waLink } from '@/lib/site';
import { FREE_DELIVERY_OVER } from '@/lib/delivery';
import DeviceArt from '@/components/DeviceArt';
import ProductCard from '@/components/ProductCard';
import Countdown from '@/components/Countdown';
import MapEmbed from '@/components/MapEmbed';
import OpenStatus from '@/components/OpenStatus';
import { CtaBand, Faq, JsonLd, SecHead, SeeAll, faqSchema } from '@/components/Bits';
import { Icon, WhatsAppIcon } from '@/components/Icon';

const FAQ: [string, string][] = [
  [
    'Are your devices genuine?',
    'Yes. New devices arrive sealed in the box and carry the manufacturer warranty. Ex-UK laptops are clearly labelled, graded, tested and carry our own 6-month warranty.',
  ],
  [
    'How do I pay?',
    'Pay with M-Pesa (we send a prompt to your phone), by bank transfer, or cash/M-Pesa on delivery within Nakuru. Lipa Mdogo Mdogo is available on most items above KES 10,000.',
  ],
  [
    'How long does delivery take?',
    `Same day in Nakuru town for orders before 3pm, 1–2 working days to Nairobi and major towns, and 2–5 days elsewhere. Delivery is free on orders over KES ${FREE_DELIVERY_OVER.toLocaleString('en-KE')} (except remote counties).`,
  ],
  [
    'Can I inspect my order before paying?',
    'In Nakuru you can inspect and pay on delivery. For courier orders, open the parcel in front of the rider; if anything is wrong, refuse it and we will replace it.',
  ],
  [
    'What if my device develops a fault?',
    'Bring it to our Nakuru shop or send it through any courier. We handle the warranty claim with the manufacturer, so you deal with one Kenyan team, not an overseas helpline.',
  ],
  [
    'Can I trade in my old phone or laptop?',
    'Yes. Send us photos and details on WhatsApp, get an offer within the day, and put the value straight towards your new device.',
  ],
];

export default function Home() {
  const dealList = deals().slice(0, 8);
  const arrivals = newArrivals(8);
  const phones = inCategory('phones').slice(0, 4);
  const tvs = inCategory('tvs').slice(0, 4);
  const mac = productBySlug('macbook-air-13-m4')!;
  const tv = productBySlug('samsung-55-crystal-uhd-du7000')!;
  const phone = productBySlug('samsung-galaxy-a56-5g')!;
  const topBrands = brands.slice(0, 12);

  const uses = [
    {
      tag: '01',
      title: 'For students',
      text: 'Light, reliable laptops for assignments, Zoom and Netflix — including tested ex-UK machines from KES 30K.',
      art: <DeviceArt kind="laptop" tone="#c9cbce" seed="students" />,
      from: 29999,
      href: '/category/laptops?price=15-50',
    },
    {
      tag: '02',
      title: 'For business',
      text: 'EliteBook, Latitude and ThinkPad with Windows 11 Pro, warranty and invoices your accountant will like.',
      art: <DeviceArt kind="laptop" tone="#3b3d40" seed="business" />,
      from: 84999,
      href: '/category/laptops?price=50-100',
    },
    {
      tag: '03',
      title: 'For creators & gamers',
      text: 'MacBook for editing, RTX laptops for gaming and rendering, and the cameras that make content look pro.',
      art: <DeviceArt kind="laptop" tone="#2e3641" seed="creators" />,
      from: 154999,
      href: '/category/laptops?price=100-200',
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ElectronicsStore',
          name: site.name,
          url: site.url,
          image: `${site.url}/og.png`,
          logo: `${site.url}/brand/icon-512.png`,
          telephone: site.phoneE164,
          email: site.email,
          priceRange: 'KES 1,500 – 330,000',
          address: {
            '@type': 'PostalAddress',
            streetAddress: site.address.street,
            addressLocality: site.address.locality,
            addressRegion: site.address.region,
            postalCode: site.address.postalCode,
            addressCountry: site.address.country,
          },
          geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
          openingHours: site.hoursSchema,
          areaServed: 'KE',
          currenciesAccepted: 'KES',
          paymentAccepted: 'M-Pesa, Cash, Bank transfer',
          parentOrganization: { '@type': 'Organization', name: site.legalName, url: site.parentUrl },
          sameAs: site.socials.map((s) => s.url),
        }}
      />
      <JsonLd data={faqSchema(FAQ)} />

      {/* Hero */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="kicker">Nakuru · Delivering to all 47 counties</p>
            <h1>
              <span>Genuine devices.</span> <span>Honest prices.</span>{' '}
              <span>
                <em>Delivered.</em>
              </span>
            </h1>
            <p className="lede">
              Laptops, TVs, phones and the tech that runs your home and business — sealed, warranty-backed and paid for
              with M-Pesa. Real people on WhatsApp to help you choose.
            </p>
            <div className="btns">
              <Link className="btn btn-accent btn-lg" href="/shop">
                Shop all devices <Icon name="arrow" />
              </Link>
              <a
                className="btn btn-line btn-lg"
                href={waLink('Hi Steff Store, can you help me choose a device?')}
                target="_blank"
                rel="noopener"
              >
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
            </div>
            <ul className="trust">
              <li>
                <Icon name="shield" /> Genuine &amp; warranty-backed
              </li>
              <li>
                <Icon name="wallet" /> Pay with M-Pesa
              </li>
              <li>
                <Icon name="truck" /> Delivery countrywide
              </li>
            </ul>
          </div>
          <div className="hero-stage" aria-label="Featured devices">
            <div className="hs-a">
              <DeviceArt kind="laptop" tone={mac.colours?.[0]?.hex} seed="hero-mac" label={mac.name} />
            </div>
            <div className="hs-b">
              <DeviceArt kind="phone" tone={phone.colours?.[1]?.hex} seed="hero-phone" label={phone.name} />
            </div>
            <div className="hs-c">
              <DeviceArt kind="tv" seed="hero-tv" label={tv.name} />
            </div>
            <Link className="price-chip c1" href={`/product/${mac.slug}`}>
              <span className="tag-mini">Staff pick</span>
              <span>{mac.name}</span>
              <b>{money(mac.price)}</b>
            </Link>
            <Link className="price-chip c2" href={`/product/${tv.slug}`}>
              <span className="tag-mini">Deal</span>
              <span>Samsung 55&quot; 4K</span>
              <b>{money(tv.price)}</b>
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-clip" aria-hidden="true">
        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((k) =>
              ['Laptops', 'Smart TVs', 'Smartphones', 'Audio', 'PS5 & Xbox', 'Smartwatches', 'Monitors', 'Printers', 'Wi‑Fi', 'Power banks'].map(
                (w) => (
                  <span key={`${k}-${w}`}>
                    {w} <i>✱</i>
                  </span>
                ),
              ),
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="Shop by category" title="Everything with a plug, a battery or a screen." action={<SeeAll href="/shop">All devices</SeeAll>}>
            Twelve departments, one standard: genuine stock, clear prices and someone in Nakuru who answers.
          </SecHead>
          <div className="cat-grid">
            {categories.map((c, i) => (
              <Link key={c.slug} className="cat-card" href={`/category/${c.slug}`}>
                <span className="cc-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="cc-art">
                  <DeviceArt kind={c.art} seed={`cat-${c.slug}`} />
                </span>
                <span className="cc-body">
                  <span>
                    <h3>{c.name}</h3>
                    <small>
                      {countIn(c.slug)} products · {c.blurb}
                    </small>
                  </span>
                  <span className="cc-go">
                    <Icon name="arrow" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <ul className="chips" aria-label="Shop by budget">
            {priceBands.map((b) => (
              <li key={b.id}>
                <Link href={`/shop?price=${b.id}`}>{b.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Deals */}
      <section className="section tint">
        <div className="wrap">
          <SecHead eyebrow={site.dealsName} title="Real discounts. A real end date." action={<Countdown to={site.dealsEndAt} />}>
            Every deal shows the price it was and when it ends. No fake timers that reset at midnight.
          </SecHead>
          <div className="p-grid">
            {dealList.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
          <div className="btns center">
            <Link className="btn btn-solid" href="/deals">
              See all {deals().length} deals <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* Use cases — rule of three */}
      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="Laptops, chosen for you" title="Tell us what it’s for. We’ll narrow it to three.">
            The right laptop depends on the work. Start from the job, not the spec sheet.
          </SecHead>
          <div className="uses">
            {uses.map((u) => (
              <article className="use" key={u.title}>
                <span className="use-tag">{u.tag}</span>
                <div className="use-art">{u.art}</div>
                <h3>{u.title}</h3>
                <p>{u.text}</p>
                <div className="use-row">
                  <span className="muted">
                    From <b className="tnum">{money(u.from)}</b>
                  </span>
                  <Link href={u.href}>
                    Shop <Icon name="arrow" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section inv">
        <div className="wrap">
          <SecHead eyebrow="How buying works" title="Three steps. No surprises.">
            Built for how Kenya actually shops — mobile money, WhatsApp and inspecting before you sign.
          </SecHead>
          <ol className="steps">
            <li>
              <span className="step-n">01</span>
              <h3>Choose</h3>
              <p>Browse the store or send us a WhatsApp with your budget. We reply with three honest options.</p>
            </li>
            <li>
              <span className="step-n">02</span>
              <h3>Pay with M-Pesa</h3>
              <p>Get an M-Pesa prompt on your phone, pay by bank, or pay on delivery within Nakuru.</p>
            </li>
            <li>
              <span className="step-n">03</span>
              <h3>Receive &amp; inspect</h3>
              <p>Same day in Nakuru, 1–3 days to most of Kenya. Check it works before the rider leaves.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* Phones rail */}
      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="Smartphones" title="From KES 13K to the latest iPhone." action={<SeeAll href="/category/phones">All phones</SeeAll>} />
          <div className="p-grid">
            {phones.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Services — rule of three */}
      <section className="section tint">
        <div className="wrap">
          <SecHead eyebrow="More ways to buy" title="Spread it, swap it, or buy for the whole team." />
          <div className="svc-grid">
            <Link className="svc-card olive" href="/lipa-mdogo-mdogo">
              <span className="svc-num">01</span>
              <Icon name="wallet" className="svc-ic" />
              <h3>Lipa Mdogo Mdogo</h3>
              <p>Take your device home with a deposit and pay the balance in monthly M-Pesa instalments.</p>
              <span className="svc-foot">
                See how it works <Icon name="arrow" />
              </span>
            </Link>
            <Link className="svc-card" href="/trade-in">
              <span className="svc-num">02</span>
              <Icon name="refresh" className="svc-ic" />
              <h3>Trade in</h3>
              <p>Send photos of your old phone or laptop on WhatsApp, get an offer the same day, and pay less.</p>
              <span className="svc-foot">
                Get an offer <Icon name="arrow" />
              </span>
            </Link>
            <Link className="svc-card" href="/business">
              <span className="svc-num">03</span>
              <Icon name="briefcase" className="svc-ic" />
              <h3>Business &amp; schools</h3>
              <p>Bulk pricing, pro-forma invoices and set-up for offices, saccos, schools and county teams.</p>
              <span className="svc-foot">
                Request a quote <Icon name="arrow" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* TVs */}
      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="Smart TVs" title="Bigger screens for match day." action={<SeeAll href="/category/tvs">All TVs</SeeAll>}>
            Delivered upright, insured, and set up with your apps if you are in Nakuru.
          </SecHead>
          <div className="p-grid">
            {tvs.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="section tint">
        <div className="wrap">
          <SecHead eyebrow="Shop by brand" title="The names you trust." action={<SeeAll href="/brands">All {brands.length} brands</SeeAll>} />
          <div className="brand-grid">
            {topBrands.map((b) => (
              <Link key={b.slug} href={`/brands/${b.slug}`}>
                <span>
                  {b.name}
                  <small>{brandCount(b.slug)} products</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="Just landed" title="New in the store." action={<SeeAll href="/shop?sort=newest">See newest</SeeAll>} />
          <div className="p-rail">
            {arrivals.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="section inv">
        <div className="wrap">
          <SecHead eyebrow="Our promise" title="What you get with every order.">
            Steff Store runs on the Steff Cloud values: systems over chaos, honesty in pricing, quality before speed.
          </SecHead>
          <ul className="promises">
            <li>
              <Icon name="check" />
              <div>
                <b>Genuine, sealed stock</b>
                <span>No clones, no grey refurbishes sold as new. Ex-UK is always labelled.</span>
              </div>
            </li>
            <li>
              <Icon name="check" />
              <div>
                <b>Warranty you can actually use</b>
                <span>Claims handled in Nakuru — you deal with us, not an overseas helpline.</span>
              </div>
            </li>
            <li>
              <Icon name="check" />
              <div>
                <b>Honest pricing</b>
                <span>The price you see is the price you pay. Delivery fees shown before checkout.</span>
              </div>
            </li>
            <li>
              <Icon name="check" />
              <div>
                <b>M-Pesa first</b>
                <span>Pay with an M-Pesa prompt, bank transfer, or on delivery in Nakuru.</span>
              </div>
            </li>
            <li>
              <Icon name="check" />
              <div>
                <b>Inspect before you sign</b>
                <span>Open it in front of the rider. If it is not right, it goes back with them.</span>
              </div>
            </li>
            <li>
              <Icon name="check" />
              <div>
                <b>A person on WhatsApp</b>
                <span>Real answers from the team, seven days a week.</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ + visit */}
      <section className="section">
        <div className="wrap two-col">
          <div>
            <p className="eyebrow">Questions</p>
            <h2>Asked before you buy.</h2>
            <p className="muted">Still unsure? We answer on WhatsApp, usually within minutes during opening hours.</p>
            <div className="btns">
              <Link className="btn btn-line" href="/faq">
                All FAQs <Icon name="arrow" />
              </Link>
            </div>
          </div>
          <Faq items={FAQ} />
        </div>
      </section>

      <section className="section tint">
        <div className="wrap visit">
          <div>
            <p className="eyebrow">Visit the shop</p>
            <h2>See it, hold it, then decide.</h2>
            <p className="muted">
              Our Nakuru shop is on the {site.address.street}. Come and try a laptop keyboard or compare TVs side by side.
            </p>
            <OpenStatus big />
            <ul className="contact-cards">
              <li>
                <a href={waLink('Hi Steff Store, I would like to visit the shop.')} target="_blank" rel="noopener">
                  <WhatsAppIcon />
                  <span>
                    <b>WhatsApp</b>
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
            </ul>
          </div>
          <MapEmbed />
        </div>
      </section>

      <CtaBand
        title="Not sure which one? Ask a real person."
        actions={
          <>
            <a className="btn btn-accent btn-lg" href={waLink('Hi Steff Store, can you help me choose?')} target="_blank" rel="noopener">
              <WhatsAppIcon /> Chat on WhatsApp
            </a>
            <a className="btn btn-inv-line btn-lg" href={telLink}>
              <Icon name="phone" /> {site.phone}
            </a>
          </>
        }
      >
        Tell us your budget and what it is for. We will reply with three honest options — and tell you if you do not need
        to spend more.
      </CtaBand>
    </>
  );
}
