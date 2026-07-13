import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingFooter } from '@/components/landing/landing-footer';

/**
 * Server-rendered shell for the indexable proof pages (/docs, /examples/*, /self-hosting).
 * Code blocks are plain <pre> markup so the snippets ship in static HTML — an SEO asset and
 * a GEO asset, since AI answer engines quote code blocks verbatim.
 */
export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <pre
      className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-neutral-200"
      data-lang={lang}
    >
      <code className="font-mono">{code}</code>
    </pre>
  );
}

export function DocShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <LandingHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-400">{intro}</p>
        <div className="mt-10 space-y-10">{children}</div>
        <div className="mt-16 border-t border-white/10 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

export function DocSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{heading}</h2>
      {children}
    </section>
  );
}
