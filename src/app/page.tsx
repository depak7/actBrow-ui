import Link from 'next/link';
import { ArrowRight, Globe, Play, Terminal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CodePanel } from '@/components/code-panel';

import { LandingHeader } from '@/components/landing/landing-header';
import { Hero } from '@/components/landing/hero';
import { ProductDemo } from '@/components/landing/product-demo';
import { DemoVideo } from '@/components/landing/demo-video';
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
    title: 'Sync tools from your coding agent',
    body: (
      <>
        Paste the setup prompt into Claude Code or Codex — it pushes tools and
        knowledge through the sync API.
      </>
    ),
  },
  {
    title: 'Paste two script tags',
    body: (
      <>
        Drop the embed before{' '}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-neutral-300">
          &lt;/body&gt;
        </code>{' '}
        — the chat goes live.
      </>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <LandingHeader />

      <main>
        {/* 1. What is it + proof visual */}
        <Hero />

        {/* 2. See it work (interactive) */}
        <ProductDemo />

        {/* 3. Watch it run (optional video) */}
        <section id="demo" className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
            <div className="mx-auto max-w-2xl text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
                <Play className="h-3.5 w-3.5 text-brand-3" />
                30-second walkthrough
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Watch a user finish a task without clicking
              </h2>
              <p className="text-lg leading-relaxed text-neutral-400">
                One ask in chat → navigate → API call → done. Same flow you embed
                in your own app.
              </p>
            </div>

            <div className="mx-auto max-w-5xl">
              <div className="card-sheen relative overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-elevated">
                <DemoVideo embedUrl={DEMO_VIDEO_EMBED_URL} fileUrl={DEMO_VIDEO_FILE_URL} />
              </div>
            </div>
          </div>
        </section>

        {/* 4. How to add it */}
        <section id="integrate" className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  <Terminal className="h-3.5 w-3.5 text-brand-3" />
                  Setup
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                  Live in your app in an afternoon
                </h2>
                <p className="text-lg leading-relaxed text-neutral-400">
                  No platform migration. No backend rewrite. Three steps, then
                  users chat and ActBrow does the click-work.
                </p>

                <ol className="space-y-5">
                  {SETUP_STEPS.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-sm font-semibold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-white">{step.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-neutral-400">
                          {step.body}
                        </p>
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

        <FinalCta />
      </main>

      <LandingFooter />
    </div>
  );
}
