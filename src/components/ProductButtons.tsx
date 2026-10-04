'use client';

import type { Product } from '@/lib/types';
import { actions, useStore } from '@/lib/store';
import { Icon } from './Icon';

export function WishButton({ slug, name, className = 'icon-btn', withLabel = false }: { slug: string; name: string; className?: string; withLabel?: boolean }) {
  const { wishlist } = useStore();
  const on = wishlist.includes(slug);
  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={() => actions.toggleWish(slug, name)}
    >
      <Icon name="heart" />
      {withLabel && (on ? 'Saved' : 'Save')}
    </button>
  );
}

export function CompareButton({ slug, name, className = 'icon-btn', withLabel = false }: { slug: string; name: string; className?: string; withLabel?: boolean }) {
  const { compare } = useStore();
  const on = compare.includes(slug);
  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from compare` : `Add ${name} to compare`}
      onClick={() => actions.toggleCompare(slug, name)}
    >
      <Icon name="compare" />
      {withLabel && (on ? 'In compare' : 'Compare')}
    </button>
  );
}

export function QuickAdd({ p }: { p: Product }) {
  const out = p.stock <= 0;
  return (
    <button
      type="button"
      className="icon-btn pc-add"
      disabled={out}
      aria-label={out ? `${p.name} is out of stock` : `Add ${p.name} to cart`}
      onClick={() =>
        actions.add(p.slug, { option: p.options?.values[0]?.name, colour: p.colours?.[0]?.name, name: p.name })
      }
    >
      <Icon name={out ? 'close' : 'plus'} />
    </button>
  );
}
