'use client';

import Link from 'next/link';
import Script from 'next/script';
import { setConsent, useConsent, useConsentOpen } from '@/lib/consent';
import { site } from '@/lib/site';

export function CookieBanner() {
  const open = useConsentOpen();
  if (!open) return null;
  return (
    <div className="cookie" role="region" aria-label="Cookie consent">
      <p className="cookie-h">Your privacy, your choice</p>
      <p>
        We use essential storage to keep your cart and preferences. With your permission we also use analytics and
        marketing cookies to improve the store and measure our ads. Read the <Link href="/cookie-policy">Cookie Policy</Link>.
      </p>
      <div className="cookie-btns">
        <button className="btn btn-inv btn-sm" type="button" onClick={() => setConsent('all')}>
          Accept all
        </button>
        <button className="btn btn-inv-line btn-sm" type="button" onClick={() => setConsent('essential')}>
          Essential only
        </button>
      </div>
    </div>
  );
}

/** Loads GA4, Meta Pixel and TikTok Pixel only after consent, and only if their IDs are configured. */
export function Analytics() {
  const consent = useConsent();
  if (consent !== 'all') return null;
  const { ga4, metaPixel, tiktokPixel } = site.analytics;
  return (
    <>
      {ga4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {metaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixel}');fbq('track','PageView');`}
        </Script>
      )}
      {tiktokPixel && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=n;var o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=n+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${tiktokPixel}');ttq.page();}(window,document,'ttq');`}
        </Script>
      )}
    </>
  );
}
