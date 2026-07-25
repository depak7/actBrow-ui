import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, MessageSquare, Server } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { absoluteUrl, GITHUB_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Pricing — ActBrow early access',
  description:
    'ActBrow is free during early access. Embed chat that finishes work inside your product — two script tags, self-host with Docker, or book a demo for a founding production plan.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing — ActBrow early access',
    description:
      'Free while we ship with early teams. Paid plans come later — talk to us if you need production support now.',
    url: absoluteUrl('/pricing'),
  },
};

const EARLY_ACCESS_INCLUDES = [
  'Hosted dashboard and in-product chat runtime',
  'Two-script embed (SDK + widget)',
  'Navigate screens, call APIs, run flows, answer from docs',
  'React & Vue examples in the docs',
  'Self-host with Docker when you want the stack on your infra',
] as const;

const PRODUCTION_INCLUDES = [
  'Founding pricing locked for early design partners',
  'Help wiring tools, OpenAPI, and in-app navigation',
  'Guidance on auth, limits, and production rollout',
  'Direct line to the founder — not a ticket queue',
] as const;

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <LandingHeader />

      <main>
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
            <div className="mx-auto max-w-2xl text-center space-y-5">
              <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">
                Pricing
              </p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Free while we find the right plan with you
              </h1>
              <p className="text-lg leading-relaxed text-neutral-400">
                ActBrow is in early access — no published tiers yet. Use it free to embed
                chat that finishes work in your product, self-host if you prefer, and talk
                to us when you want a production partnership.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2">
              {/* Early access */}
              <div className="relative flex flex-col rounded-2xl border border-white/15 bg-white/[0.04] p-8 md:p-10">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-3">
                    Early access
                  </p>
                  <h2 className="text-2xl font-semibold text-white">Build and embed</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    For founders and engineers trying ActBrow in a real product.
                  </p>
                </div>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-white">$0</span>
                  <span className="text-neutral-500">during early access</span>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {EARLY_ACCESS_INCLUDES.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="bg-white font-medium text-neutral-900 hover:bg-white/90">
                    <Link href="/login">
                      Get started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
                  >
                    <Link href="/docs">Read the docs</Link>
                  </Button>
                </div>
              </div>

              {/* Production / custom */}
              <div className="relative flex flex-col rounded-2xl border border-white/10 bg-black/30 p-8 md:p-10">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Production
                  </p>
                  <h2 className="text-2xl font-semibold text-white">Design partner</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    When you need ActBrow live for real users and want a human in the loop.
                  </p>
                </div>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-white">Custom</span>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  Founding price after a short walkthrough — no self-serve checkout yet.
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {PRODUCTION_INCLUDES.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <Button asChild className="w-full bg-white font-medium text-neutral-900 hover:bg-white/90 sm:w-auto">
                    <Link href="/book-a-demo">
                      Book a demo
                      <MessageSquare className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20">
            <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
              <div className="space-y-4">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Server className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Prefer to own the stack?
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  Self-host ActBrow with Docker and Postgres. Same embed, your infra, your model
                  key. Open source on GitHub.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
                >
                  <Link href="/self-hosting">Self-hosting guide</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
                >
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                FAQ
              </h2>
              <dl className="space-y-6 text-left">
                <div className="space-y-2">
                  <dt className="font-medium text-white">Will early access stay free forever?</dt>
                  <dd className="text-sm leading-relaxed text-neutral-400">
                    No. Early access is free so we can learn with real products. We&apos;ll publish
                    clear paid plans before anything changes — and give early teams fair notice.
                  </dd>
                </div>
                <div className="space-y-2">
                  <dt className="font-medium text-white">What will paid plans look like?</dt>
                  <dd className="text-sm leading-relaxed text-neutral-400">
                    Likely a simple hosted plan (usage or assistants) plus custom for teams that
                    need help going live. We&apos;re not inventing three fake tiers before we have
                    customers.
                  </dd>
                </div>
                <div className="space-y-2">
                  <dt className="font-medium text-white">Is self-hosting free?</dt>
                  <dd className="text-sm leading-relaxed text-neutral-400">
                    Yes — you run the image, pay your own Postgres and model provider. See the{' '}
                    <Link href="/self-hosting" className="underline hover:text-white">
                      self-hosting guide
                    </Link>
                    .
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
