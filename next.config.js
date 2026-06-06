/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiTarget =
      process.env.NEXT_PUBLIC_API_PROXY_TARGET ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:8080';

    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/:path*`,
      },
      // Proxy OAuth2 and login endpoints
      {
        source: '/oauth2/:path*',
        destination: `${apiTarget}/oauth2/:path*`,
      },
      // PostHog reverse proxy
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/array/:path*',
        destination: 'https://us-assets.i.posthog.com/array/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
