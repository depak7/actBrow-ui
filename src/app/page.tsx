import Link from 'next/link';
import { ArrowRight, Globe, Play, Terminal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CodePanel } from '@/components/code-panel';

import { LandingHeader } from '@/components/landing/landing-header';
import { Hero } from '@/components/landing/hero';
import { TrustSection } from '@/components/landing/trust-section';
import { ProblemSection } from '@/components/landing/problem-section';
import { SolutionSection } from '@/components/landing/solution-section';
import { ProductDemo } from '@/components/landing/product-demo';
import { Features } from '@/components/landing/features';
import { EnterpriseSection } from '@/components/landing/enterprise-section';
import { Integrations } from '@/components/landing/integrations';
import { FinalCta } from '@/components/landing/final-cta';
import { LandingFooter } from '@/components/landing/landing-footer';

/** YouTube/Vimeo embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID */
const DEMO_VIDEO_EMBED_URL = (process.env.NEXT_PUBLIC_DEMO_VIDEO_EMBED_URL || '').trim();
/** Direct MP4/WebM URL (used when embed URL is not set) */
const DEMO_VIDEO_FILE_URL = (process.env.NEXT_PUBLIC_PRODUCT_DEMO_VIDEO_URL || '').trim();

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://your-api.example.com'
).replace(/\/+$/, '');

const EMBED_SNIPPET = `<script src="${API_BASE_URL}/actbrow-sdk.js"></script>
<script>
window.ActbrowWidgetConfig = {
  assistantId: "YOUR_ASSISTANT_ID",
  baseUrl: "${API_BASE_URL}",
  apiKey: "wk_...",
  navigate: function (path) { window.location.assign(path); }
};
</script>
<script src="${API_BASE_URL}/actbrow-widget.js"></script>`;

const SETUP_STEPS: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Create an assistant',
    body: (
      <>
        Spin one up in the dashboard and open{' '}
        <strong className="font-medium text-white">Connect</strong>.
      </>
    ),
  },
  {
    title: 'Let your coding agent sync it',
    body: (
      <>
        Paste the setup prompt into Claude Code or Codex — it pushes tools and knowledge
        through the typed sync API.
      </>
    ),
  },
  {
    title: 'Drop in two script tags',
    body: (
      <>
        Add the embed snippet before{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-neutral-300">
          &lt;/body&gt;
        </code>{' '}
        and the agent goes live.
      </>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <LandingHeader />

      <main>
        <Hero />
        <TrustSection />
        <ProblemSection />
        <SolutionSection />
        <ProductDemo />

        {/* Product demo video (env-driven) */}
        <section id="demo" className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
            <div className="mx-auto max-w-2xl text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
                <Play className="h-3.5 w-3.5 text-brand-3" />
                Watch it run
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Two minutes, end to end
              </h2>
              <p className="text-lg leading-relaxed text-neutral-400">
                Create an assistant, sync tools with your coding agent, embed the widget, and
                watch the agent act inside a real app.
              </p>
            </div>

            <div className="mx-auto max-w-5xl">
              <div className="card-sheen relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-elevated">
                {DEMO_VIDEO_EMBED_URL ? (
                  <div className="relative aspect-video w-full">
                    <iframe
                      title="ActBrow product demo"
                      src={DEMO_VIDEO_EMBED_URL}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : DEMO_VIDEO_FILE_URL ? (
                  <video className="aspect-video w-full bg-black" controls playsInline preload="metadata">
                    <source src={DEMO_VIDEO_FILE_URL} type="video/mp4" />
                    Your browser does not support embedded video.
                  </video>
                ) : (
                  <div className="flex aspect-video flex-col items-center justify-center gap-4 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-6 py-16">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
                      <Play className="ml-1 h-8 w-8" fill="currentColor" />
                    </div>
                    <p className="text-lg font-medium text-white">Product demo video</p>
                    <p className="max-w-md text-center text-sm text-neutral-500">
                      Set{' '}
                      <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-neutral-300">
                        NEXT_PUBLIC_DEMO_VIDEO_EMBED_URL
                      </code>{' '}
                      (embed link) or{' '}
                      <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-neutral-300">
                        NEXT_PUBLIC_PRODUCT_DEMO_VIDEO_URL
                      </code>{' '}
                      (MP4 URL) in <span className="text-neutral-400">.env.local</span>, then restart
                      the dev server.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Features />

        {/* Integrate with a script (embed snippet) */}
        <section id="integrate" className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  <Terminal className="h-3.5 w-3.5 text-brand-3" />
                  Built for developers
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                  Integrate with a script, not a sprint
                </h2>
                <p className="text-lg leading-relaxed text-neutral-400">
                  No SDK gymnastics, no backend rewrite. Sign up, let your coding agent push config
                  through the sync API, then paste the embed snippet into your app.
                </p>

                <ol className="space-y-5">
                  {SETUP_STEPS.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-sm font-semibold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-white">{step.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-neutral-400">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Button asChild className="bg-white font-medium text-neutral-900 hover:bg-white/90">
                    <Link href="/login">
                      Get started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/15 bg-transparent text-white hover:bg-white/10"
                  >
                    <a href="#demo">
                      <Play className="mr-2 h-4 w-4" />
                      Watch demo
                    </a>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div
                  className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-brand-1/20 via-transparent to-brand-2/10 blur-3xl"
                  aria-hidden
                />
                <div className="relative">
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    <Globe className="h-3.5 w-3.5" />
                    Works in any web app
                  </div>
                  <CodePanel
                    code={EMBED_SNIPPET}
                    filename="index.html"
                    language="html"
                    maxHeight="max-h-[34rem]"
                    copyLabel="Copy embed snippet"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <EnterpriseSection />
        <Integrations />
        <FinalCta />
      </main>

      <LandingFooter />
    </div>
  );
}
