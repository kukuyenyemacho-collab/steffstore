'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useId, useMemo, useRef, useState } from 'react';
import { search } from '@/lib/catalog';
import { brandName } from '@/lib/brands';
import { money } from '@/lib/format';
import DeviceArt from './DeviceArt';
import { Icon } from './Icon';

export default function SearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const results = useMemo(() => (q.trim().length >= 2 ? search(q, 6) : []), [q]);
  const show = open && results.length > 0;

  function go(query: string) {
    setOpen(false);
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="search" role="search">
      <form
        action="/search"
        onSubmit={(e) => {
          e.preventDefault();
          if (active >= 0 && results[active]) {
            setOpen(false);
            router.push(`/product/${results[active].slug}`);
          } else go(q);
        }}
      >
        <Icon name="search" className="muted" />
        <label className="sr" htmlFor={`${listId}-q`}>
          Search products
        </label>
        <input
          id={`${listId}-q`}
          name="q"
          type="search"
          autoComplete="off"
          placeholder="Search laptops, TVs, iPhone, PS5…"
          value={q}
          role="combobox"
          aria-expanded={show}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 150);
          }}
          onKeyDown={(e) => {
            if (!show) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(results.length - 1, a + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(-1, a - 1));
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        />
        <button type="submit">
          <span>Search</span>
        </button>
      </form>
      {show && (
        <ul className="suggest" id={listId} role="listbox" onMouseDown={() => clearTimeout(blurTimer.current)}>
          {results.map((p, i) => (
            <li key={p.slug} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
              <Link href={`/product/${p.slug}`} onClick={() => setOpen(false)}>
                <span className="s-art">
                  <DeviceArt kind={p.art} tone={p.colours?.[0]?.hex} seed={p.slug} />
                </span>
                <span>
                  <b>{p.name}</b>
                  <small>{brandName(p.brand)}</small>
                </span>
                <span className="s-price">{money(p.price)}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link className="s-all" href={`/search?q=${encodeURIComponent(q.trim())}`} onClick={() => setOpen(false)}>
              See all results for “{q.trim()}”
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
