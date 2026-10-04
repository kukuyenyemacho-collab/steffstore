import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MobileBar, Toast, WhatsAppFloat } from '@/components/Chrome';
import { Analytics, CookieBanner } from '@/components/Consent';
import { site } from '@/lib/site';
import './globals.css';

// Self-hosted brand faces, copied from the Steff Cloud web identity (SIL OFL 1.1 — see fonts/FONTS-LICENSE.txt).
const display = localFont({
  src: './fonts/unbounded-latin.woff2',
  weight: '200 900',
  variable: '--font-display',
  display: 'swap',
  fallback: ['Arial Black', 'Arial', 'system-ui', 'sans-serif'],
});
const body = localFont({
  src: './fonts/inter-latin.woff2',
  weight: '100 900',
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
});
const jp = localFont({
  src: './fonts/delagothic-steffcloud.woff2',
  weight: '400',
  variable: '--font-jp',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Steff Store — Genuine laptops, TVs & phones delivered across Kenya',
    template: '%s | Steff Store',
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_KE',
    title: 'Steff Store — Genuine devices. Honest prices. Delivered.',
    description: site.description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Steff Store by Steff Cloud' }],
  },
  twitter: { card: 'summary_large_image', site: '@cloud_steff' },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: '/brand/apple-touch-icon.png',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f4f0' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0e0d' },
  ],
};

// Apply a saved theme before first paint, so dark-mode visitors never see a light flash.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${display.variable} ${body.variable} ${jp.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <MobileBar />
        <Toast />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
