import type { Metadata } from 'next';
import Link from 'next/link';

import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How ActBrow collects, uses, and protects information when you use the product, website, and demo request form.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy — ActBrow',
    url: absoluteUrl('/privacy'),
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <LandingHeader />
      <main className="border-b border-white/10">
        <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">
            Legal
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Privacy Policy</h1>
          <p className="mt-4 text-sm text-neutral-500">Last updated: July 28, 2026</p>

          <div className="prose-invert mt-10 space-y-8 text-base leading-relaxed text-neutral-300">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Who we are</h2>
              <p>
                ActBrow (&quot;we&quot;, &quot;us&quot;) provides an in-app AI agent runtime and
                related website at{' '}
                <a href="https://actbrow.depak.dev" className="text-white underline underline-offset-2">
                  actbrow.depak.dev
                </a>
                . Contact:{' '}
                <a
                  href="mailto:deepakfordev@gmail.com"
                  className="text-white underline underline-offset-2"
                >
                  deepakfordev@gmail.com
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Information we collect</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="text-white">Account data</span> — name, email, and profile
                  details from Google Sign-In when you create an account.
                </li>
                <li>
                  <span className="text-white">Demo / contact requests</span> — name, email,
                  company, and use case you submit on the book-a-demo form.
                </li>
                <li>
                  <span className="text-white">Product data</span> — assistants, tools, flows,
                  knowledge, and conversation content you configure or generate while using
                  ActBrow.
                </li>
                <li>
                  <span className="text-white">Usage analytics</span> — anonymized or
                  pseudonymous product analytics (e.g. PostHog, Vercel Analytics) such as page
                  views and feature usage.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">How we use information</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Provide, operate, and improve ActBrow</li>
                <li>Respond to demo requests and support questions</li>
                <li>Secure accounts and prevent abuse</li>
                <li>Understand product usage and fix bugs</li>
              </ul>
              <p>We do not sell your personal information.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Sharing</h2>
              <p>
                We use trusted processors (hosting, email, analytics, model providers you
                configure) only as needed to run the service. Self-hosted deployments keep data
                on infrastructure you control.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Retention &amp; deletion</h2>
              <p>
                We keep account and product data while your account is active. Demo requests are
                kept so we can follow up. Email{' '}
                <a
                  href="mailto:deepakfordev@gmail.com"
                  className="text-white underline underline-offset-2"
                >
                  deepakfordev@gmail.com
                </a>{' '}
                to request access, correction, or deletion.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Cookies</h2>
              <p>
                We use cookies and similar technologies for authentication, security, and
                analytics. You can block non-essential cookies in your browser; some features may
                not work without them.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Changes</h2>
              <p>
                We may update this policy. Material changes will be reflected by the &quot;Last
                updated&quot; date on this page.
              </p>
            </section>

            <p className="pt-4 text-sm text-neutral-500">
              See also our{' '}
              <Link href="/terms" className="text-neutral-300 underline underline-offset-2">
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
}
