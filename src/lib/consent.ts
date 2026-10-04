'use client';

import { useSyncExternalStore } from 'react';

// Cookie consent, Kenya Data Protection Act 2019 style: nothing optional loads until the visitor agrees.
export type Consent = 'all' | 'essential' | 'unset';

const KEY = 'steffstore:consent';
const EVT = 'steffstore:consent';

function read(): Consent {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'all' || v === 'essential' ? v : 'unset';
  } catch {
    return 'unset';
  }
}

let reopen = false;

export function setConsent(v: Exclude<Consent, 'unset'>) {
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* ignore */
  }
  reopen = false;
  window.dispatchEvent(new Event(EVT));
}

export function reopenConsent() {
  reopen = true;
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener('storage', cb);
  };
}

/** 'server' during SSR/hydration so nothing consent-dependent renders until the client knows. */
export function useConsent(): Consent | 'server' {
  return useSyncExternalStore(subscribe, read, () => 'server');
}

export function useConsentOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => reopen || read() === 'unset',
    () => false,
  );
}
