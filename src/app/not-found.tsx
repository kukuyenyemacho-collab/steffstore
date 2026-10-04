import Link from 'next/link';
import { Icon } from '@/components/Icon';

export default function NotFound() {
  return (
    <section className="wrap not-found">
      <p className="nf-code" aria-hidden="true">
        404
      </p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>This page is out of stock.</h1>
      <p className="lede" style={{ marginInline: 'auto' }}>
        The link may be old, or the product may have moved. Try the search bar above, or start from a category.
      </p>
      <div className="btns center">
        <Link className="btn btn-accent" href="/shop">
          Shop all devices <Icon name="arrow" />
        </Link>
        <Link className="btn btn-line" href="/">
          Home
        </Link>
      </div>
    </section>
  );
}
