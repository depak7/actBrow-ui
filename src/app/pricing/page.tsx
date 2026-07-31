import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Cloud, KeyRound, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';
import { absoluteUrl, GITHUB_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Pricing — ActBrow early access',
  description:
    'Hosted ActBrow is free during early access. Self-host with your own model key at no software cost. Book a demo for founding production support — no checkout yet.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing — ActBrow early access',
    description:
      'Free hosted early access, free self-host with your keys, or book a demo for a founding production plan. No self-serve checkout yet.',
    url: absoluteUrl('/pricing'),
  },
};

const HOSTED_INCLUDES = [
  'Hosted dashboard and in-product chat runtime',
  'Two-script embed (SDK + widget)',
  'Navigate screens, call APIs, run flows, answer from docs',
  'Model usage covered by ActBrow during early access (fair-use limits)',
  'React & Vue examples in the docs',
] as const;

const SELF_HOST_INCLUDES = [
  'Same runtime on your Docker + Postgres stack',
  'Bring your own model key (OpenRouter, OpenAI-compatible, or local proxy)',
  'You pay only infra + model provider — no ActBrow software fee',
  'Full control of data, keys, and network boundary',
  'Open source on GitHub',
] as const;

const PARTNER_INCLUDES = [
  'Founding price locked after a short walkthrough',
  'Help wiring tools, OpenAPI, and in-app navigation',
  'Guidance on auth, limits, and production rollout',
  'Direct line to the founder — not a ticket queue',
  'No self-serve checkout — invoice when we agree on a plan',
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
                Free to try. Free to self-host. Paid when you go live with us.
              </h1>
              <p className="text-lg leading-relaxed text-neutral-400">
                Three clear options. No card required. No self-serve checkout yet —
                early teams use ActBrow free, or book a demo for a founding plan.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
              {/* Hosted early access */}
              <div className="relative flex flex-col rounded-2xl border border-white/15 bg-white/[0.04] p-8 md:p-9">
                <div className="space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Cloud className="h-5 w-5 text-brand-3" />
                  </div>
                  <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-brand-3">
                    Hosted
                  </p>
                  <h2 className="text-2xl font-semibold text-white">Early access</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Embed on our cloud. Best for trying ActBrow in a real product fast.
                  </p>
                </div>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-white">$0</span>
                  <span className="text-neutral-500">during early access</span>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  We cover model cost under fair-use limits. No credit card.
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {HOSTED_INCLUDES.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-col gap-3">
                  <Button asChild className="bg-white font-medium text-neutral-900 hover:bg-white/90">
                    <Link href="/login">
                      Get started free
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

              {/* Self-host BYOK */}
              <div className="relative flex flex-col rounded-2xl border border-white/10 bg-black/30 p-8 md:p-9">
                <div className="space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <KeyRound className="h-5 w-5 text-white" />
                  </div>
                  <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Self-host
                  </p>
                  <h2 className="text-2xl font-semibold text-white">Your keys, your cost</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Run ActBrow on your infra. You own the stack and the model bill.
                  </p>
                </div>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-white">$0</span>
                  <span className="text-neutral-500">software</span>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  You pay Postgres hosting + your model provider. Bring your own key.
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {SELF_HOST_INCLUDES.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-col gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
                  >
                    <Link href="/self-hosting">
                      Self-hosting guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white"
                  >
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </div>

              {/* Design partner */}
              <div className="relative flex flex-col rounded-2xl border border-white/10 bg-black/30 p-8 md:p-9">
                <div className="space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Production
                  </p>
                  <h2 className="text-2xl font-semibold text-white">Design partner</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Live for real users, with help going to production.
                  </p>
                </div>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-white">Custom</span>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  Founding price after a walkthrough — invoice only, no checkout yet.
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {PARTNER_INCLUDES.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <Button asChild className="w-full bg-white font-medium text-neutral-900 hover:bg-white/90">
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
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.04] text-neutral-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Who pays what</th>
                    <th className="px-5 py-3 font-medium">ActBrow software</th>
                    <th className="px-5 py-3 font-medium">Model / infra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-neutral-300">
                  <tr>
                    <td className="px-5 py-4 font-medium text-white">Hosted early access</td>
                    <td className="px-5 py-4">$0</td>
                    <td className="px-5 py-4">Covered by ActBrow (fair use)</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 font-medium text-white">Self-host (BYOK)</td>
                    <td className="px-5 py-4">$0</td>
                    <td className="px-5 py-4">You — your key, your cloud</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 font-medium text-white">Design partner</td>
                    <td className="px-5 py-4">Founding / custom</td>
                    <td className="px-5 py-4">Agreed on the call</td>
                  </tr>
                </tbody>
              </table>
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
                  <dt className="font-medium text-white">Do I need a credit card?</dt>
                  <dd className="text-sm leading-relaxed text-neutral-400">
                    No. Hosted early access and self-hosting need no payment. Design partner
                    plans are agreed on a call and invoiced — there is no self-serve checkout yet.
                  </dd>
                </div>
                <div className="space-y-2">
                  <dt className="font-medium text-white">Who pays for the AI model?</dt>
                  <dd className="text-sm leading-relaxed text-neutral-400">
                    On hosted early access, ActBrow covers model usage under fair-use limits. On
                    self-host, you bring your own key and pay your provider directly. Design
                    partner setups are decided together.
                  </dd>
                </div>
                <div className="space-y-2">
                  <dt className="font-medium text-white">Will early access stay free forever?</dt>
                  <dd className="text-sm leading-relaxed text-neutral-400">
                    No. It&apos;s free so we can learn with real products. We&apos;ll publish clear
                    paid plans before anything changes — and give early teams fair notice. Self-host
                    software stays free; you still pay your own infra and model.
                  </dd>
                </div>
                <div className="space-y-2">
                  <dt className="font-medium text-white">How do I self-host with my own key?</dt>
                  <dd className="text-sm leading-relaxed text-neutral-400">
                    Follow the{' '}
                    <Link href="/self-hosting" className="underline hover:text-white">
                      self-hosting guide
                    </Link>
                    . Point the stack at your Postgres and set your OpenAI-compatible API key /
                    base URL. Same embed — your bill.
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
