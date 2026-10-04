'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';
import { categories } from '@/lib/categories';
import { site, telLink } from '@/lib/site';
import { cartCount, useStore } from '@/lib/store';
import { Icon } from './Icon';
import SearchBox from './SearchBox';

function ThemeToggle() {
  return (
    <button
      className="icon-btn theme-btn"
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => {
        const root = document.documentElement;
        const current =
          root.dataset.theme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        const next = current === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        try {
          localStorage.setItem('theme', next);
        } catch {
          /* ignore */
        }
      }}
    >
      <Icon name="moon" className="i-moon" />
      <Icon name="sun" className="i-sun" />
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();
  const store = useStore();
  const [menuFor, setMenuFor] = useState<string | null>(null);
  // The menu closes itself on navigation because it is keyed to the path it was opened on.
  const menu = menuFor === pathname;
  const count = cartCount(store);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="topbar">
        <div className="wrap">
          <span className="tb-side tb-left">
            <a href={telLink}>
              <Icon name="phone" />
              {site.phone}
            </a>
          </span>
          <span className="dot" aria-hidden="true" />
          <span className="tb-long">{site.topbar.text}</span>
          <span className="tb-short">{site.dealsName} are live</span>
          <Link href={site.topbar.href}>
            {site.topbar.cta} <Icon name="arrow" />
          </Link>
          <span className="tb-side tb-right">
            <span>
              <Icon name="truck" /> Delivery to all 47 counties
            </span>
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap hdr-row">
          <Link className="brand" href="/" aria-label="Steff Store, home">
            <span className="brand-mark" />
            <span className="brand-tag" aria-hidden="true">
              device
              <br />
              store
            </span>
          </Link>
          <Suspense fallback={<div className="search" />}>
            <SearchBox />
          </Suspense>
          <div className="hdr-actions">
            <ThemeToggle />
            <Link className="icon-btn hide-sm" href="/compare" aria-label={`Compare (${store.compare.length})`}>
              <Icon name="compare" />
              {store.compare.length > 0 && <span className="count">{store.compare.length}</span>}
            </Link>
            <Link className="icon-btn hide-sm" href="/wishlist" aria-label={`Wishlist (${store.wishlist.length})`}>
              <Icon name="heart" />
              {store.wishlist.length > 0 && <span className="count">{store.wishlist.length}</span>}
            </Link>
            <Link className="icon-btn" href="/cart" aria-label={`Cart (${count} items)`}>
              <Icon name="bag" />
              {count > 0 && <span className="count">{count}</span>}
            </Link>
            <button
              className="icon-btn menu-btn"
              type="button"
              aria-label={menu ? 'Close menu' : 'Open menu'}
              aria-expanded={menu}
              aria-controls="mobile-nav"
              onClick={() => setMenuFor(menu ? null : pathname)}
            >
              <Icon name={menu ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
        <nav className="cat-nav" aria-label="Categories">
          <div className="wrap">
            <ul>
              <li>
                <Link href="/shop" aria-current={pathname === '/shop' ? 'page' : undefined}>
                  All devices
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    aria-current={pathname === `/category/${c.slug}` ? 'page' : undefined}
                  >
                    {c.short}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="deal-link" href="/deals" aria-current={pathname === '/deals' ? 'page' : undefined}>
                  Deals
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        {menu && (
          <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile">
            <ul>
              <li>
                <Link href="/deals">
                  Deals <Icon name="tag" />
                </Link>
              </li>
              <li>
                <Link href="/shop">
                  All devices <Icon name="grid" />
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug} className="sub">
                  <Link href={`/category/${c.slug}`}>
                    {c.name} <Icon name="chevron" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/brands">Brands</Link>
              </li>
              <li>
                <Link href="/lipa-mdogo-mdogo">Lipa Mdogo Mdogo</Link>
              </li>
              <li>
                <Link href="/trade-in">Trade-in</Link>
              </li>
              <li>
                <Link href="/business">Business &amp; schools</Link>
              </li>
              <li className="sub">
                <Link href="/wishlist">Wishlist ({store.wishlist.length})</Link>
              </li>
              <li className="sub">
                <Link href="/compare">Compare ({store.compare.length})</Link>
              </li>
              <li className="sub">
                <Link href="/track-order">Track an order</Link>
              </li>
              <li className="sub">
                <Link href="/contact">Contact &amp; visit</Link>
              </li>
            </ul>
            <ThemeToggle />
          </nav>
        )}
      </header>
    </>
  );
}
