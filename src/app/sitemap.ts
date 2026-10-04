import type { MetadataRoute } from 'next';
import { brands } from '@/lib/brands';
import { categories } from '@/lib/categories';
import { products } from '@/lib/catalog';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({ url: `${site.url}${path}`, lastModified: now, priority });
  return [
    page('', 1),
    page('/shop', 0.9),
    page('/deals', 0.9),
    ...categories.map((c) => page(`/category/${c.slug}`, 0.8)),
    ...products.map((p) => page(`/product/${p.slug}`, 0.7)),
    page('/brands', 0.6),
    ...brands.map((b) => page(`/brands/${b.slug}`, 0.5)),
    ...['/about', '/contact', '/faq', '/delivery', '/warranty-returns', '/lipa-mdogo-mdogo', '/trade-in', '/business', '/track-order'].map((p) => page(p, 0.5)),
    ...['/privacy-policy', '/terms', '/cookie-policy'].map((p) => page(p, 0.2)),
  ];
}
