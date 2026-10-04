'use client';

import { useTick } from '@/lib/hooks';

const pad = (n: number) => String(n).padStart(2, '0');

/** Counts down to a real end date. Renders nothing once the date has passed. */
export default function Countdown({ to, label = 'Ends in' }: { to: string; label?: string }) {
  const tick = useTick(1000);
  const end = new Date(to).getTime();
  const left = tick ? Math.max(0, Math.floor((end - tick * 1000) / 1000)) : null;
  if (left === 0) return null;
  const d = left === null ? null : Math.floor(left / 86400);
  const h = left === null ? null : Math.floor((left % 86400) / 3600);
  const m = left === null ? null : Math.floor((left % 3600) / 60);
  const s = left === null ? null : left % 60;
  const units: [string, number | null][] = [
    ['days', d],
    ['hrs', h],
    ['min', m],
    ['sec', s],
  ];
  return (
    <div className="countdown" role="timer" aria-label={`${label} ${d ?? ''} days ${h ?? ''} hours`}>
      <span className="cd-label">{label}</span>
      {units.map(([u, v]) => (
        <span className="cd-unit" key={u}>
          <b>{v === null ? '--' : pad(v)}</b>
          <small>{u}</small>
        </span>
      ))}
    </div>
  );
}
