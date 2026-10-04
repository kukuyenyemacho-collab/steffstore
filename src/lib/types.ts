export type CategorySlug =
  | 'phones'
  | 'laptops'
  | 'tvs'
  | 'tablets'
  | 'audio'
  | 'gaming'
  | 'wearables'
  | 'monitors'
  | 'cameras'
  | 'printers'
  | 'networking'
  | 'accessories';

export type ArtKind =
  | 'phone'
  | 'laptop'
  | 'tv'
  | 'tablet'
  | 'headphones'
  | 'earbuds'
  | 'speaker'
  | 'partybox'
  | 'soundbar'
  | 'console'
  | 'xbox'
  | 'controller'
  | 'handheld'
  | 'gamecase'
  | 'watch'
  | 'band'
  | 'monitor'
  | 'desktop'
  | 'tower'
  | 'printer'
  | 'router'
  | 'mesh'
  | 'switch'
  | 'powerbank'
  | 'charger'
  | 'mouse'
  | 'keyboard'
  | 'ssd'
  | 'card'
  | 'camera'
  | 'actioncam'
  | 'gimbal'
  | 'ups';

export type Condition = 'new' | 'ex-uk' | 'refurbished';

export type Badge = 'new' | 'deal' | 'pick' | 'ex-uk';

export interface Colour {
  name: string;
  hex: string;
}

export interface Option {
  name: string;
  /** Price difference against the base price, in KES. */
  delta?: number;
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  /** Base price in KES, VAT inclusive where applicable. */
  price: number;
  /** Previous price — only set for a genuine, time-boxed deal. */
  compareAt?: number;
  condition: Condition;
  stock: number;
  tagline: string;
  /** Three key selling points — rule of three. */
  highlights: [string, string, string];
  description: string;
  specs: [string, string][];
  inBox: string[];
  warranty: string;
  colours?: Colour[];
  options?: { label: string; values: Option[] };
  art: ArtKind;
  badges?: Badge[];
  /** ISO date the product was listed. */
  added: string;
  /** Used for ordering on landing sections. Higher first. */
  rank?: number;
  /** Extra search terms (model numbers, nicknames, Swahili). */
  keywords?: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  art: ArtKind;
  blurb: string;
  intro: string;
  seoTitle: string;
}

export interface Brand {
  slug: string;
  name: string;
  blurb: string;
}

export interface CartLine {
  id: string;
  slug: string;
  qty: number;
  colour?: string;
  option?: string;
}
