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
  'Embed an AI agent that navigates your app — two script tags';

export const SITE_DESCRIPTION =
  'Drop in two script tags and ship an AI agent that navigates your app, calls your APIs, runs flows, and answers from your docs — inside your own product. No backend rewrite. Self-host with Docker.';

/** Absolute URL for a site-relative path (leading slash optional). */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
