import Link from 'next/link';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';
import { Icon } from './Icon';

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function Crumbs({ items }: { items: [string, string?][] }) {
  const all: [string, string?][] = [['Home', '/'], ...items];
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {all.map(([name, href], i) => (
            <li key={`${name}-${i}`}>
              {href && i < all.length - 1 ? <Link href={href}>{name}</Link> : <span aria-current="page">{name}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map(([name, href], i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name,
            ...(href ? { item: `${site.url}${href}` } : {}),
          })),
        }}
      />
    </>
  );
}

export function SecHead({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}) {
  if (action)
    return (
      <div className="sec-head row">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
          {children && <p>{children}</p>}
        </div>
        {action}
      </div>
    );
  return (
    <div className="sec-head">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export function SeeAll({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="see-all" href={href}>
      {children} <Icon name="arrow" />
    </Link>
  );
}

export function Faq({ items }: { items: [string, ReactNode][] }) {
  return (
    <div className="faq">
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <Icon name="plus" />
          </summary>
          <div className="faq-a">{typeof a === 'string' ? <p>{a}</p> : a}</div>
        </details>
      ))}
    </div>
  );
}

export function faqSchema(items: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

export function PageHero({
  crumbs,
  eyebrow,
  title,
  lede,
  children,
  art,
}: {
  crumbs: [string, string?][];
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  art?: ReactNode;
}) {
  return (
    <section className={`page-hero${art ? ' split' : ''}`}>
      <div className="wrap">
        <div>
          <Crumbs items={crumbs} />
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {lede && <p className="lede">{lede}</p>}
          {children}
        </div>
        {art && <div className="ph-art">{art}</div>}
      </div>
    </section>
  );
}

export function CtaBand({ title, children, actions }: { title: ReactNode; children?: ReactNode; actions: ReactNode }) {
  return (
    <section className="cta-band">
      <div className="wrap">
        <h2>{title}</h2>
        {children && <p>{children}</p>}
        <div className="btns">{actions}</div>
      </div>
    </section>
  );
}
