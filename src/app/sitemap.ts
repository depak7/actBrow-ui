import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

/**
 * sitemap.xml — lists the public, indexable marketing + docs surface. Submit this to
 * Google Search Console. Excludes the app (dashboard/login) which is disallowed in robots.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/docs', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/examples/react', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/examples/vue', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/self-hosting', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/book-a-demo', priority: 0.6, changeFrequency: 'monthly' },
  ];

  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
