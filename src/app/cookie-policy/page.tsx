import type { Metadata } from 'next';
import Legal from '@/components/Legal';
import CookieSettingsButton from '@/components/CookieSettingsButton';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Steff Store uses browser storage and optional analytics and marketing cookies, and how to change your choice.',
  alternates: { canonical: '/cookie-policy' },
};

export default function CookiePage() {
  return (
    <Legal title="Cookie Policy" path="/cookie-policy" updated="4 October 2026">
      <p>This policy explains how Steff Store uses cookies and similar browser storage, and how you can control them.</p>
      <h2>Essential storage (always on)</h2>
      <p>
        We store your cart, wishlist, compare list, recently viewed items, theme and cookie choice in your browser’s local storage so the store
        works. This information stays on your device.
      </p>
      <h2>Optional analytics and marketing (only with consent)</h2>
      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google Analytics 4</td>
            <td>Understand which pages help shoppers most. IP addresses are anonymised.</td>
          </tr>
          <tr>
            <td>Meta Pixel</td>
            <td>Measure Facebook and Instagram ads and show relevant offers.</td>
          </tr>
          <tr>
            <td>TikTok Pixel</td>
            <td>Measure TikTok ads.</td>
          </tr>
        </tbody>
      </table>
      <p>None of these load until you choose “Accept all”. The map on our contact page loads from Google only when you click “Show map”.</p>
      <h2>Change your choice</h2>
      <p>
        You can change your choice at any time: <CookieSettingsButton />.
      </p>
    </Legal>
  );
}
