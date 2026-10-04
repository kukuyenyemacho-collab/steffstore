'use client';

// Client-side store for cart, wishlist, compare and recently viewed.
// Persisted to localStorage (wrapped in try/catch — private windows can throw) and shared
// across tabs via the storage event. useSyncExternalStore keeps SSR and hydration consistent.

import { useSyncExternalStore } from 'react';
import type { CartLine } from './types';
import { lineId } from './catalog';

export interface StoreState {
  cart: CartLine[];
  wishlist: string[];
  compare: string[];
  recent: string[];
  toast: { id: number; text: string; href?: string; cta?: string } | null;
}

const KEY = 'steffstore:v1';
const EMPTY: StoreState = { cart: [], wishlist: [], compare: [], recent: [], toast: null };
export const COMPARE_MAX = 4;

let state: StoreState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): StoreState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
      compare: Array.isArray(parsed.compare) ? parsed.compare : [],
      recent: Array.isArray(parsed.recent) ? parsed.recent : [],
      toast: null,
    };
  } catch {
    return EMPTY;
  }
}

function ensureLoaded() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  state = read();
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    state = { ...read(), toast: state.toast };
    listeners.forEach((l) => l());
  });
}

function commit(next: StoreState) {
  state = next;
  try {
    const { cart, wishlist, compare, recent } = next;
    window.localStorage.setItem(KEY, JSON.stringify({ cart, wishlist, compare, recent }));
  } catch {
    /* storage unavailable — keep in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  ensureLoaded();
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  ensureLoaded();
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
function toast(text: string, href?: string, cta?: string) {
  clearTimeout(toastTimer);
  commit({ ...state, toast: { id: Date.now(), text, href, cta } });
  toastTimer = setTimeout(() => commit({ ...state, toast: null }), 3600);
}

const toggle = (list: string[], slug: string) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]);

export const actions = {
  add(slug: string, opts: { qty?: number; option?: string; colour?: string; name?: string; silent?: boolean } = {}) {
    ensureLoaded();
    const id = lineId(slug, opts.option, opts.colour);
    const qty = opts.qty ?? 1;
    const existing = state.cart.find((l) => l.id === id);
    const cart = existing
      ? state.cart.map((l) => (l.id === id ? { ...l, qty: Math.min(10, l.qty + qty) } : l))
      : [...state.cart, { id, slug, qty: Math.min(10, qty), option: opts.option, colour: opts.colour }];
    commit({ ...state, cart });
    if (!opts.silent) toast(`${opts.name ?? 'Item'} added to cart`, '/cart', 'View cart');
  },
  addMany(items: { slug: string; option?: string; colour?: string }[]) {
    ensureLoaded();
    let cart = state.cart;
    for (const it of items) {
      const id = lineId(it.slug, it.option, it.colour);
      cart = cart.some((l) => l.id === id)
        ? cart.map((l) => (l.id === id ? { ...l, qty: Math.min(10, l.qty + 1) } : l))
        : [...cart, { id, slug: it.slug, qty: 1, option: it.option, colour: it.colour }];
    }
    commit({ ...state, cart });
    toast(`${items.length} ${items.length === 1 ? 'item' : 'items'} added to cart`, '/cart', 'View cart');
  },
  setQty(id: string, qty: number) {
    const cart = qty <= 0 ? state.cart.filter((l) => l.id !== id) : state.cart.map((l) => (l.id === id ? { ...l, qty: Math.min(10, qty) } : l));
    commit({ ...state, cart });
  },
  remove(id: string) {
    commit({ ...state, cart: state.cart.filter((l) => l.id !== id) });
  },
  clearCart() {
    commit({ ...state, cart: [] });
  },
  toggleWish(slug: string, name?: string) {
    ensureLoaded();
    const on = !state.wishlist.includes(slug);
    commit({ ...state, wishlist: toggle(state.wishlist, slug) });
    toast(on ? `${name ?? 'Item'} saved to wishlist` : 'Removed from wishlist', on ? '/wishlist' : undefined, on ? 'View' : undefined);
  },
  toggleCompare(slug: string, name?: string) {
    ensureLoaded();
    const on = !state.compare.includes(slug);
    if (on && state.compare.length >= COMPARE_MAX) {
      toast(`Compare holds ${COMPARE_MAX} items — remove one first`, '/compare', 'Open compare');
      return;
    }
    commit({ ...state, compare: toggle(state.compare, slug) });
    toast(on ? `${name ?? 'Item'} added to compare` : 'Removed from compare', on ? '/compare' : undefined, on ? 'Compare' : undefined);
  },
  viewed(slug: string) {
    ensureLoaded();
    if (state.recent[0] === slug) return;
    commit({ ...state, recent: [slug, ...state.recent.filter((s) => s !== slug)].slice(0, 12) });
  },
  dismissToast() {
    commit({ ...state, toast: null });
  },
};

export const cartCount = (s: StoreState) => s.cart.reduce((n, l) => n + l.qty, 0);
