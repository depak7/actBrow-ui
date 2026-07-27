import type { Metadata } from 'next';
import Link from 'next/link';

import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms governing use of ActBrow, including early access, self-hosting, and acceptable use.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service — ActBrow',
    url: absoluteUrl('/terms'),
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <LandingHeader />
      <main className="border-b border-white/10">
        <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">
            Legal
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Terms of Service</h1>
          <p className="mt-4 text-sm text-neutral-500">Last updated: July 28, 2026</p>

          <div className="mt-10 space-y-8 text-base leading-relaxed text-neutral-300">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Agreement</h2>
              <p>
                By using ActBrow (the website, hosted product, SDK/widget, or related services),
                you agree to these Terms. If you do not agree, do not use ActBrow. Contact:{' '}
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
              <h2 className="text-xl font-semibold text-white">Early access</h2>
              <p>
                ActBrow is in early access. Features may change, break, or be removed. The
                service is provided &quot;as is&quot; without warranties of uninterrupted or
                error-free operation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Your account</h2>
              <p>
                You are responsible for activity under your account and for keeping credentials
                secure. Provide accurate information. Do not share API keys publicly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Acceptable use</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Do not use ActBrow for unlawful, harmful, or abusive activity</li>
                <li>Do not attempt to disrupt, reverse-engineer, or abuse the service</li>
                <li>Do not upload content you do not have rights to use</li>
                <li>Comply with laws and with third-party API / model provider terms you use</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Your content &amp; customer data</h2>
              <p>
                You retain ownership of content and data you submit. You grant us a limited
                license to host and process it solely to provide ActBrow. For self-hosted
                deployments, you control your infrastructure and data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Open source &amp; self-hosting</h2>
              <p>
                Portions of ActBrow may be available under open-source licenses (see the GitHub
                repository). Self-hosted use is subject to those licenses plus these Terms for
                any hosted services we provide.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Disclaimer &amp; liability</h2>
              <p>
                To the maximum extent permitted by law, ActBrow and its operator are not liable
                for indirect, incidental, special, consequential, or lost-profit damages, or for
                actions taken by the agent inside your application. Your use of model providers
                and downstream APIs is at your own risk.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Termination</h2>
              <p>
                We may suspend or terminate access for abuse, risk, or operational reasons. You
                may stop using ActBrow at any time and request account deletion by email.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Changes</h2>
              <p>
                We may update these Terms. Continued use after changes means you accept the
                updated Terms. The &quot;Last updated&quot; date will change when we revise them.
              </p>
            </section>

            <p className="pt-4 text-sm text-neutral-500">
              See also our{' '}
              <Link href="/privacy" className="text-neutral-300 underline underline-offset-2">
                Privacy Policy
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
