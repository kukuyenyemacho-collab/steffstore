'use client';

import { reopenConsent } from '@/lib/consent';

export default function CookieSettingsButton() {
  return (
    <button type="button" className="link-btn" style={{ textDecoration: 'none' }} onClick={() => reopenConsent()}>
      Cookie settings
    </button>
  );
}
