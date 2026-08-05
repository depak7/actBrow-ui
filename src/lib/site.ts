/**
 * Canonical site metadata used for SEO/GEO plumbing: metadataBase, robots.txt,
 * sitemap.xml, JSON-LD structured data, and Open Graph tags. Override via env in
 * production so absolute URLs (og:url, sitemap entries, schema @id) resolve correctly.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://actbrow.depak.dev'
).replace(/\/+$/, '');

export const GITHUB_URL = (
  process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/depak7/actBrow'
).replace(/\/+$/, '');

export const SITE_NAME = 'ActBrow';

export const SITE_TAGLINE =
  'Chat that finishes the work inside your product';

export const SITE_DESCRIPTION =
  'When users do not know how, they stall or leave. ActBrow finishes the task inside your product: they ask in plain English, it navigates to the right screen, calls your APIs, and the work is done.';

/** Absolute URL for a site-relative path (leading slash optional). */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
