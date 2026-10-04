'use client';

import { useSyncExternalStore } from 'react';
import { site } from './site';

/** Re-render every `ms` milliseconds. Returns 0 during SSR and hydration so markup matches. */
export function useTick(ms: number) {
  return useSyncExternalStore(
    (cb) => {
      const t = setInterval(cb, ms);
      return () => clearInterval(t);
    },
    () => Math.floor(Date.now() / ms),
    () => 0,
  );
}

/** Whether the shop is open right now in Nairobi time. null until the client knows. */
export function useOpenNow(): boolean | null {
  const tick = useTick(60_000);
  if (!tick) return null;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: site.timezone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date());
  const wd = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd);
  const slot = site.openingSchedule[day];
  if (!slot) return false;
  const t = hour + minute / 60;
  return t >= slot[0] && t < slot[1];
}
