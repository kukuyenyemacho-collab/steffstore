import type { ArtKind } from '@/lib/types';
import { hash } from '@/lib/format';

// Flat, on-brand product illustrations. Swap for real photography by adding `images` to a
// product later — every card already reserves a 4:3 frame, so photos drop in without layout work.

type Wallpaper = { from: string; to: string; sun: string };

const WALLPAPERS: Wallpaper[] = [
  { from: '#ff5b1f', to: '#7a2a08', sun: '#ffd2b8' },
  { from: '#a9ba68', to: '#2b3517', sun: '#f5f4f0' },
  { from: '#3d3d3a', to: '#0b0b0b', sun: '#ff5b1f' },
  { from: '#ffb37a', to: '#c2410c', sun: '#0b0b0b' },
  { from: '#6b7b3a', to: '#0b0b0b', sun: '#ff5b1f' },
];

const INK = '#0b0b0b';
const BEZEL = '#141413';

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 > 150;
}

export interface DeviceArtProps {
  kind: ArtKind;
  tone?: string;
  seed?: string;
  className?: string;
  label?: string;
}

export default function DeviceArt({ kind, tone, seed = kind, className, label }: DeviceArtProps) {
  const h = hash(seed);
  const wp = WALLPAPERS[h % WALLPAPERS.length];
  const id = `w${h.toString(36)}`;
  const body = tone ?? defaultTone(kind);
  const dark = shade(body, -28);
  const light = shade(body, 22);
  const line = isLight(body) ? 'rgba(11,11,11,.22)' : 'rgba(255,255,255,.12)';
  const screen = `url(#${id})`;

  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={wp.from} />
          <stop offset="1" stopColor={wp.to} />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="272" rx="150" ry="10" fill={INK} opacity=".09" />
      {draw(kind, { body, dark, light, line, screen, sun: wp.sun, h })}
    </svg>
  );
}

function defaultTone(kind: ArtKind) {
  switch (kind) {
    case 'tv':
    case 'monitor':
    case 'soundbar':
    case 'partybox':
    case 'xbox':
    case 'router':
    case 'switch':
    case 'ups':
    case 'camera':
    case 'actioncam':
    case 'gimbal':
    case 'tower':
      return '#232427';
    case 'console':
    case 'earbuds':
    case 'charger':
    case 'mesh':
    case 'controller':
      return '#f1f1ee';
    case 'printer':
      return '#3b3d40';
    case 'card':
      return '#c8322a';
    case 'gamecase':
      return '#1f4fa8';
    default:
      return '#8e8b85';
  }
}

interface P {
  body: string;
  dark: string;
  light: string;
  line: string;
  screen: string;
  sun: string;
  h: number;
}

function Wall({ x, y, w, h, r = 4, p }: { x: number; y: number; w: number; h: number; r?: number; p: P }) {
  // Screen: gradient + a soft "sun" and horizon so every screen reads as lit.
  const cx = x + w * (0.3 + ((p.h >>> 3) % 40) / 100);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={p.screen} />
      <circle cx={cx} cy={y + h * 0.42} r={Math.min(w, h) * 0.16} fill={p.sun} opacity=".85" />
      <path
        d={`M${x} ${y + h * 0.72} Q${x + w * 0.35} ${y + h * 0.58} ${x + w * 0.62} ${y + h * 0.7} T${x + w} ${y + h * 0.64} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} Z`}
        fill={INK}
        opacity=".35"
      />
    </g>
  );
}

function draw(kind: ArtKind, p: P) {
  switch (kind) {
    case 'phone':
      return (
        <g>
          {/* back of a second phone with camera module */}
          <g transform="rotate(-9 150 150)">
            <rect x="108" y="46" width="104" height="206" rx="20" fill={p.dark} />
            <rect x="118" y="58" width="50" height="58" rx="14" fill={p.light} stroke={p.line} />
            <circle cx="133" cy="73" r="10" fill={INK} />
            <circle cx="133" cy="73" r="5" fill="#2c3440" />
            <circle cx="153" cy="99" r="10" fill={INK} />
            <circle cx="153" cy="99" r="5" fill="#2c3440" />
            <circle cx="153" cy="73" r="4" fill="#f5f4f0" opacity=".7" />
          </g>
          {/* front */}
          <rect x="192" y="34" width="108" height="222" rx="22" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="198" y="40" width="96" height="210" rx="17" fill={BEZEL} />
          <Wall x={202} y={44} w={88} h={202} r={14} p={p} />
          <rect x="231" y="52" width="30" height="9" rx="4.5" fill={INK} />
          <rect x="300" y="92" width="3" height="30" rx="1.5" fill={p.dark} />
        </g>
      );
    case 'laptop':
      return (
        <g>
          <rect x="84" y="40" width="232" height="158" rx="12" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="90" y="46" width="220" height="146" rx="8" fill={BEZEL} />
          <Wall x={96} y={52} w={208} h={134} r={3} p={p} />
          <rect x="190" y="47" width="20" height="4" rx="2" fill={INK} />
          <path d="M52 200 H348 L366 226 Q368 234 360 234 H40 Q32 234 34 226 Z" fill={p.body} stroke={p.line} strokeWidth="2" />
          <path d="M60 204 H340 L350 220 H50 Z" fill={p.dark} opacity=".35" />
          <rect x="170" y="225" width="60" height="5" rx="2.5" fill={p.dark} />
        </g>
      );
    case 'tv':
      return (
        <g>
          <rect x="30" y="34" width="340" height="196" rx="6" fill={BEZEL} />
          <Wall x={36} y={40} w={328} h={184} r={2} p={p} />
          <rect x="190" y="230" width="20" height="6" fill={BEZEL} />
          <path d="M96 230 L80 262 H92 L106 230 Z M304 230 L320 262 H308 L294 230 Z" fill={p.body} />
          <rect x="188" y="226" width="24" height="3" rx="1.5" fill="#ff5b1f" opacity=".9" />
        </g>
      );
    case 'monitor':
      return (
        <g>
          <rect x="56" y="34" width="288" height="172" rx="8" fill={BEZEL} />
          <Wall x={62} y={40} w={276} h={156} r={3} p={p} />
          <rect x="62" y="196" width="276" height="6" fill={p.body} />
          <path d="M186 206 H214 L222 250 H178 Z" fill={p.body} />
          <rect x="132" y="248" width="136" height="12" rx="6" fill={p.body} />
        </g>
      );
    case 'desktop':
      return (
        <g>
          <rect x="66" y="26" width="268" height="206" rx="14" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="74" y="34" width="252" height="158" rx="6" fill={BEZEL} />
          <Wall x={80} y={40} w={240} h={146} r={3} p={p} />
          <path d="M176 232 H224 L232 262 H168 Z" fill={p.dark} />
          <rect x="150" y="258" width="100" height="8" rx="4" fill={p.dark} />
        </g>
      );
    case 'tower':
      return (
        <g>
          <rect x="70" y="80" width="190" height="150" rx="10" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="84" y="96" width="70" height="8" rx="4" fill={p.light} />
          <circle cx="232" cy="104" r="9" fill="#ff5b1f" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={86 + i * 22} y="190" width="14" height="22" rx="3" fill={p.dark} />
          ))}
          <rect x="250" y="150" width="96" height="70" rx="6" fill={BEZEL} />
          <Wall x={254} y={154} w={88} h={58} r={3} p={p} />
          <rect x="290" y="220" width="16" height="22" fill={BEZEL} />
          <rect x="270" y="240" width="56" height="6" rx="3" fill={BEZEL} />
        </g>
      );
    case 'tablet':
      return (
        <g>
          <rect x="70" y="56" width="260" height="184" rx="18" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="76" y="62" width="248" height="172" rx="13" fill={BEZEL} />
          <Wall x={84} y={70} w={232} h={156} r={8} p={p} />
          <g transform="rotate(-24 330 160)">
            <rect x="300" y="90" width="10" height="160" rx="5" fill="#f5f4f0" stroke="rgba(11,11,11,.2)" />
            <path d="M300 250 L305 266 L310 250 Z" fill="#3d3d3a" />
          </g>
        </g>
      );
    case 'headphones':
      return (
        <g>
          <path d="M112 180 C108 70 292 70 288 180" fill="none" stroke={p.dark} strokeWidth="18" strokeLinecap="round" />
          <path d="M126 160 C128 92 272 92 274 160" fill="none" stroke={p.light} strokeWidth="6" strokeLinecap="round" opacity=".6" />
          <rect x="84" y="150" width="62" height="98" rx="28" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="254" y="150" width="62" height="98" rx="28" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="134" y="162" width="20" height="74" rx="10" fill={p.dark} />
          <rect x="246" y="162" width="20" height="74" rx="10" fill={p.dark} />
          <circle cx="300" cy="226" r="3" fill="#ff5b1f" />
        </g>
      );
    case 'earbuds':
      return (
        <g>
          <rect x="128" y="132" width="144" height="112" rx="46" fill={p.body} stroke={p.line} strokeWidth="2" />
          <path d="M132 168 H268" stroke={p.line} strokeWidth="2" />
          <circle cx="200" cy="206" r="4" fill="#a9ba68" />
          <g>
            <path d="M138 76 q-22 2 -20 26 q2 22 26 20 l10 -4 l8 44 q2 10 12 8 q8 -2 6 -12 l-12 -60 q-8 -24 -30 -22 Z" fill={p.body} stroke={p.line} strokeWidth="2" />
            <circle cx="140" cy="100" r="9" fill={p.dark} />
          </g>
          <g transform="translate(400 0) scale(-1 1)">
            <path d="M138 76 q-22 2 -20 26 q2 22 26 20 l10 -4 l8 44 q2 10 12 8 q8 -2 6 -12 l-12 -60 q-8 -24 -30 -22 Z" fill={p.body} stroke={p.line} strokeWidth="2" />
            <circle cx="140" cy="100" r="9" fill={p.dark} />
          </g>
        </g>
      );
    case 'speaker':
      return (
        <g>
          <rect x="70" y="118" width="260" height="112" rx="56" fill={p.body} stroke={p.line} strokeWidth="2" />
          {Array.from({ length: 9 }).map((_, r) =>
            Array.from({ length: 22 }).map((__, c) => (
              <circle key={`${r}-${c}`} cx={104 + c * 9 + (r % 2) * 4.5} cy={132 + r * 10} r="2" fill={p.dark} opacity=".55" />
            )),
          )}
          <rect x="60" y="130" width="22" height="88" rx="11" fill={p.dark} />
          <rect x="318" y="130" width="22" height="88" rx="11" fill={p.dark} />
          <rect x="166" y="166" width="68" height="18" rx="9" fill="#ff5b1f" />
          <rect x="70" y="228" width="260" height="6" rx="3" fill={INK} opacity=".25" />
        </g>
      );
    case 'partybox':
      return (
        <g>
          <rect x="110" y="30" width="180" height="230" rx="18" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="150" y="22" width="100" height="16" rx="8" fill={p.dark} />
          <circle cx="200" cy="112" r="54" fill={p.dark} />
          <circle cx="200" cy="112" r="56" fill="none" stroke="#ff5b1f" strokeWidth="5" />
          <circle cx="200" cy="112" r="20" fill={INK} />
          <circle cx="200" cy="208" r="34" fill={p.dark} />
          <circle cx="200" cy="208" r="36" fill="none" stroke="#a9ba68" strokeWidth="4" />
          <circle cx="200" cy="208" r="12" fill={INK} />
        </g>
      );
    case 'soundbar':
      return (
        <g>
          <rect x="22" y="182" width="252" height="40" rx="16" fill={p.body} stroke={p.line} strokeWidth="2" />
          {Array.from({ length: 30 }).map((_, i) => (
            <rect key={i} x={36 + i * 8} y="192" width="3" height="20" rx="1.5" fill={p.dark} opacity=".6" />
          ))}
          <circle cx="262" cy="202" r="3" fill="#ff5b1f" />
          <rect x="288" y="98" width="92" height="160" rx="12" fill={p.body} stroke={p.line} strokeWidth="2" />
          <circle cx="334" cy="178" r="32" fill={p.dark} />
          <circle cx="334" cy="178" r="12" fill={INK} />
        </g>
      );
    case 'console':
      return (
        <g>
          <path d="M150 34 Q200 22 210 40 V258 H160 Q140 150 150 34 Z" fill={p.body} stroke={p.line} strokeWidth="2" />
          <path d="M250 34 Q200 22 190 40 V258 H240 Q260 150 250 34 Z" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="186" y="34" width="28" height="224" rx="6" fill={INK} />
          <rect x="196" y="60" width="8" height="40" rx="4" fill="#2f5f9e" opacity=".9" />
          <rect x="168" y="258" width="64" height="8" rx="4" fill={INK} />
        </g>
      );
    case 'xbox':
      return (
        <g>
          <rect x="138" y="40" width="124" height="220" rx="10" fill={p.body} stroke={p.line} strokeWidth="2" />
          <ellipse cx="200" cy="58" rx="46" ry="10" fill={INK} />
          <ellipse cx="200" cy="58" rx="36" ry="6" fill="#a9ba68" opacity=".55" />
          <circle cx="160" cy="232" r="5" fill="#f5f4f0" opacity=".6" />
        </g>
      );
    case 'controller':
      return (
        <g>
          <path
            d="M120 120 Q130 92 170 96 H230 Q270 92 280 120 L312 210 Q322 246 292 248 Q274 250 262 228 L246 200 H154 L138 228 Q126 250 108 248 Q78 246 88 210 Z"
            fill={p.body}
            stroke={p.line}
            strokeWidth="2"
          />
          <rect x="172" y="104" width="56" height="34" rx="8" fill={p.dark} opacity=".5" />
          <path d="M132 146 h12 v-12 h10 v12 h12 v10 h-12 v12 h-10 v-12 h-12 Z" fill={INK} opacity=".75" />
          <circle cx="262" cy="134" r="6" fill={INK} opacity=".7" />
          <circle cx="278" cy="150" r="6" fill={INK} opacity=".7" />
          <circle cx="246" cy="150" r="6" fill={INK} opacity=".7" />
          <circle cx="262" cy="166" r="6" fill="#ff5b1f" />
          <circle cx="172" cy="186" r="15" fill={INK} />
          <circle cx="228" cy="186" r="15" fill={INK} />
          <circle cx="172" cy="186" r="8" fill="#3d3d3a" />
          <circle cx="228" cy="186" r="8" fill="#3d3d3a" />
        </g>
      );
    case 'handheld':
      return (
        <g>
          <rect x="44" y="92" width="62" height="130" rx="30" fill="#2f5f9e" />
          <rect x="294" y="92" width="62" height="130" rx="30" fill="#c8322a" />
          <rect x="96" y="92" width="208" height="130" rx="10" fill={BEZEL} />
          <Wall x={106} y={100} w={188} h={114} r={4} p={p} />
          <circle cx="75" cy="130" r="12" fill={INK} />
          <circle cx="325" cy="180" r="12" fill={INK} />
          <circle cx="75" cy="178" r="4" fill={INK} />
          <circle cx="325" cy="130" r="4" fill={INK} />
        </g>
      );
    case 'gamecase':
      return (
        <g>
          <rect x="136" y="28" width="128" height="236" rx="8" fill="#e8e6df" stroke="rgba(11,11,11,.18)" strokeWidth="2" />
          <rect x="136" y="28" width="128" height="30" rx="8" fill={p.body} />
          <rect x="146" y="38" width="40" height="8" rx="2" fill="#f5f4f0" />
          <Wall x={146} y={66} w={108} h={186} r={3} p={p} />
          <text x="200" y="232" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="900" fontSize="22" fill="#f5f4f0">
            FC
          </text>
        </g>
      );
    case 'watch':
      return (
        <g>
          <rect x="166" y="16" width="68" height="270" rx="24" fill={p.dark} />
          <rect x="140" y="76" width="120" height="146" rx="38" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="150" y="86" width="100" height="126" rx="30" fill={INK} />
          <text x="200" y="146" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="800" fontSize="30" fill="#f5f4f0">
            10:09
          </text>
          <circle cx="178" cy="178" r="12" fill="none" stroke="#ff5b1f" strokeWidth="5" />
          <circle cx="222" cy="178" r="12" fill="none" stroke="#a9ba68" strokeWidth="5" />
          <rect x="258" y="118" width="9" height="26" rx="4" fill={p.dark} />
        </g>
      );
    case 'band':
      return (
        <g>
          <rect x="176" y="16" width="48" height="270" rx="20" fill={p.dark} />
          <rect x="160" y="66" width="80" height="166" rx="34" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="168" y="76" width="64" height="146" rx="26" fill={INK} />
          <text x="200" y="140" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="800" fontSize="22" fill="#f5f4f0">
            8,412
          </text>
          <rect x="182" y="156" width="36" height="6" rx="3" fill="#ff5b1f" />
          <rect x="182" y="170" width="24" height="6" rx="3" fill="#a9ba68" />
        </g>
      );
    case 'printer':
      return (
        <g>
          <rect x="140" y="40" width="120" height="70" rx="2" fill="#fbfaf7" stroke="rgba(11,11,11,.15)" />
          <path d="M150 58 H232 M150 70 H250 M150 82 H220" stroke="rgba(11,11,11,.25)" strokeWidth="4" strokeLinecap="round" />
          <rect x="70" y="92" width="260" height="34" rx="12" fill={p.dark} />
          <rect x="70" y="118" width="260" height="110" rx="14" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="250" y="134" width="60" height="24" rx="5" fill={INK} />
          <circle cx="262" cy="146" r="3" fill="#a9ba68" />
          <rect x="114" y="196" width="172" height="12" rx="4" fill={INK} opacity=".55" />
          <rect x="86" y="140" width="9" height="40" rx="3" fill="#2aa7c9" />
          <rect x="98" y="140" width="9" height="40" rx="3" fill="#c8327a" />
          <rect x="110" y="140" width="9" height="40" rx="3" fill="#e9c83a" />
          <rect x="122" y="140" width="9" height="40" rx="3" fill={INK} />
        </g>
      );
    case 'router':
      return (
        <g>
          <rect x="92" y="78" width="10" height="110" rx="5" fill={p.dark} transform="rotate(-12 97 188)" />
          <rect x="298" y="78" width="10" height="110" rx="5" fill={p.dark} transform="rotate(12 303 188)" />
          <rect x="160" y="70" width="10" height="110" rx="5" fill={p.dark} />
          <rect x="230" y="70" width="10" height="110" rx="5" fill={p.dark} />
          <rect x="72" y="172" width="256" height="64" rx="16" fill={p.body} stroke={p.line} strokeWidth="2" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={110 + i * 22} cy="204" r="4" fill={i === 0 ? '#ff5b1f' : '#a9ba68'} opacity={i > 3 ? 0.35 : 1} />
          ))}
        </g>
      );
    case 'mesh':
      return (
        <g>
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${i * 130} ${i * 18})`}>
              <rect x="94" y="70" width="96" height="170" rx="26" fill={p.body} stroke={p.line} strokeWidth="2" />
              <rect x="94" y="70" width="96" height="30" rx="15" fill={p.dark} opacity=".25" />
              <circle cx="142" cy="220" r="3.5" fill="#a9ba68" />
            </g>
          ))}
        </g>
      );
    case 'switch':
      return (
        <g>
          <rect x="40" y="146" width="320" height="58" rx="10" fill={p.body} stroke={p.line} strokeWidth="2" />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <rect x={106 + i * 28} y="164" width="20" height="18" rx="2" fill={INK} />
              <circle cx={116 + i * 28} cy="192" r="2.5" fill="#a9ba68" />
            </g>
          ))}
          <circle cx="66" cy="175" r="5" fill="#ff5b1f" />
        </g>
      );
    case 'powerbank':
      return (
        <g>
          <rect x="112" y="64" width="176" height="186" rx="26" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="132" y="84" width="136" height="146" rx="16" fill={p.light} opacity=".35" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={170 + i * 20} cy="214" r="5" fill={i < 3 ? '#a9ba68' : INK} opacity={i < 3 ? 1 : 0.3} />
          ))}
          <rect x="176" y="58" width="48" height="10" rx="4" fill={INK} />
          <path d="M200 58 V30 Q200 18 214 18 H290" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
          <rect x="182" y="132" width="36" height="20" rx="4" fill="#ff5b1f" />
        </g>
      );
    case 'charger':
      return (
        <g>
          <rect x="168" y="44" width="10" height="34" rx="2" fill="#5b5d61" />
          <rect x="222" y="44" width="10" height="34" rx="2" fill="#5b5d61" />
          <rect x="195" y="30" width="10" height="34" rx="2" fill="#5b5d61" />
          <rect x="140" y="70" width="120" height="112" rx="20" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="186" y="164" width="28" height="10" rx="5" fill={INK} />
          <path d="M200 182 V214 Q200 246 236 246 H300" fill="none" stroke={p.body} strokeWidth="8" strokeLinecap="round" />
          <path d="M200 182 V214 Q200 246 236 246 H300" fill="none" stroke={p.line} strokeWidth="1" />
          <rect x="296" y="236" width="40" height="20" rx="8" fill={p.body} stroke={p.line} strokeWidth="2" />
        </g>
      );
    case 'mouse':
      return (
        <g>
          <path d="M200 40 C262 40 276 104 274 160 C272 220 244 260 200 260 C156 260 128 220 126 160 C124 104 138 40 200 40 Z" fill={p.body} stroke={p.line} strokeWidth="2" />
          <path d="M200 40 V128" stroke={p.dark} strokeWidth="3" />
          <rect x="192" y="74" width="16" height="34" rx="8" fill={INK} />
          <path d="M130 140 Q200 158 270 140" fill="none" stroke={p.line} strokeWidth="2" />
        </g>
      );
    case 'keyboard':
      return (
        <g>
          <rect x="36" y="112" width="328" height="126" rx="22" fill={p.body} stroke={p.line} strokeWidth="2" />
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 11 }).map((__, c) => (
              <circle key={`${r}-${c}`} cx={66 + c * 27} cy={140 + r * 24} r="10" fill={p.dark} opacity=".55" />
            )),
          )}
          <rect x="120" y="212" width="160" height="16" rx="8" fill={p.dark} opacity=".55" />
          <circle cx="66" cy="140" r="10" fill="#ff5b1f" opacity=".9" />
        </g>
      );
    case 'ssd':
      return (
        <g>
          <rect x="132" y="56" width="136" height="196" rx="18" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="132" y="56" width="136" height="44" rx="18" fill={p.dark} />
          <rect x="132" y="84" width="136" height="16" fill={p.dark} />
          <text x="200" y="190" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="900" fontSize="34" fill="#f5f4f0" opacity=".9">
            1TB
          </text>
          <rect x="188" y="246" width="24" height="8" rx="3" fill={INK} />
        </g>
      );
    case 'card':
      return (
        <g>
          <path d="M150 60 H240 L270 90 V250 Q270 260 260 260 H150 Q140 260 140 250 V70 Q140 60 150 60 Z" fill={p.body} stroke="rgba(11,11,11,.2)" strokeWidth="2" />
          <path d="M140 140 H150 V160 H140 Z" fill="#f5f4f0" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={156 + i * 13} y="70" width="8" height="26" rx="2" fill="#d6b45a" />
          ))}
          <text x="205" y="200" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="900" fontSize="30" fill="#f5f4f0">
            128
          </text>
          <text x="205" y="224" textAnchor="middle" fontFamily="var(--font-body), sans-serif" fontWeight="700" fontSize="14" fill="#f5f4f0" opacity=".8">
            GB
          </text>
        </g>
      );
    case 'camera':
      return (
        <g>
          <path d="M70 110 H150 L166 86 H234 L250 110 H330 Q346 110 346 126 V226 Q346 242 330 242 H70 Q54 242 54 226 V126 Q54 110 70 110 Z" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="54" y="122" width="46" height="120" rx="16" fill={p.dark} />
          <circle cx="214" cy="176" r="60" fill={p.dark} />
          <circle cx="214" cy="176" r="46" fill={INK} />
          <circle cx="214" cy="176" r="30" fill="#2c3440" />
          <circle cx="200" cy="162" r="9" fill="#f5f4f0" opacity=".35" />
          <circle cx="306" cy="98" r="10" fill="#ff5b1f" />
          <rect x="174" y="92" width="52" height="10" rx="3" fill={INK} opacity=".5" />
        </g>
      );
    case 'actioncam':
      return (
        <g>
          <rect x="120" y="86" width="160" height="136" rx="20" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="140" y="104" width="60" height="44" rx="6" fill={BEZEL} />
          <Wall x={144} y={108} w={52} h={36} r={3} p={p} />
          <rect x="204" y="100" width="64" height="64" rx="14" fill={p.dark} />
          <circle cx="236" cy="132" r="22" fill={INK} />
          <circle cx="236" cy="132" r="12" fill="#2f5f9e" opacity=".8" />
          <rect x="228" y="76" width="34" height="12" rx="4" fill="#ff5b1f" />
          <text x="144" y="198" fontFamily="var(--font-display), sans-serif" fontWeight="900" fontSize="18" fill="#f5f4f0" opacity=".85">
            13
          </text>
        </g>
      );
    case 'gimbal':
      return (
        <g>
          <rect x="174" y="118" width="54" height="146" rx="24" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="182" y="132" width="38" height="52" rx="6" fill={BEZEL} />
          <Wall x={185} y={135} w={32} h={46} r={3} p={p} />
          <circle cx="201" cy="208" r="9" fill={p.dark} />
          <circle cx="201" cy="234" r="6" fill="#ff5b1f" />
          <rect x="190" y="88" width="22" height="34" rx="6" fill={p.dark} />
          <rect x="164" y="40" width="74" height="56" rx="20" fill={p.body} stroke={p.line} strokeWidth="2" />
          <circle cx="201" cy="68" r="18" fill={INK} />
          <circle cx="201" cy="68" r="9" fill="#2c3440" />
        </g>
      );
    case 'ups':
      return (
        <g>
          <rect x="138" y="44" width="124" height="214" rx="12" fill={p.body} stroke={p.line} strokeWidth="2" />
          <rect x="152" y="62" width="96" height="60" rx="8" fill={p.dark} />
          <circle cx="200" cy="92" r="16" fill="none" stroke="#ff5b1f" strokeWidth="4" />
          <path d="M200 78 V92" stroke="#ff5b1f" strokeWidth="4" strokeLinecap="round" />
          <circle cx="170" cy="146" r="4" fill="#a9ba68" />
          <circle cx="186" cy="146" r="4" fill="#e9c83a" opacity=".4" />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x="156" y={168 + i * 10} width="88" height="4" rx="2" fill={p.dark} opacity=".6" />
          ))}
        </g>
      );
    default:
      return <rect x="100" y="60" width="200" height="180" rx="20" fill={p.body} />;
  }
}
