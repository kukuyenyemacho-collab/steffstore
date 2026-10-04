import Link from 'next/link';
import type { ReactNode } from 'react';
import { PageHero } from './Bits';

const PAGES: [string, string][] = [
  ['Privacy Policy', '/privacy-policy'],
  ['Terms of Sale', '/terms'],
  ['Cookie Policy', '/cookie-policy'],
  ['Warranty & returns', '/warranty-returns'],
  ['Delivery', '/delivery'],
];

export default function Legal({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHero crumbs={[[title]]} eyebrow="Legal" title={title} lede={`Last updated ${updated}.`} />
      <div className="wrap legal-layout">
        <nav className="legal-nav" aria-label="Policies">
          <ul>
            {PAGES.map(([n, h]) => (
              <li key={h}>
                <Link href={h} aria-current={h === path ? 'page' : undefined}>
                  {n}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="prose">{children}</article>
      </div>
    </>
  );
}
