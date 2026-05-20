'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';
import { CodePanel } from '@/components/code-panel';
import productShot from '@/assets/second.png';
import {
  Workflow,
  Zap,
  ArrowRight,
  Github,
  Code2,
  Book,
  Server,
  ChevronDown,
  Layers,
  Play,
  Mail,
  Sparkles,
  Globe,
} from 'lucide-react';

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

const CONTACT_EMAIL = 'deepakfordev@gmail.com';
const CONTACT_X_URL = 'https://x.com/depak_7';

export default function LandingPage() {
  const router = useRouter();

  const productHighlight = {
    title: 'Assistants that act inside your product',
    description:
      'Create an assistant in the dashboard, paste the Connect setup prompt into Codex or Claude Code, and your agent pushes navigation tools, HTTP tools, and knowledge via the sync API — then drop a two-script embed into your app.',
  };

  const additionalFeatures = [
    {
      icon: Sparkles,
      title: 'Agent setup',
      description:
        'Dashboard Connect page + sync API — your coding agent configures tools and knowledge, not manual YAML.',
    },
    {
      icon: Layers,
      title: 'Embed widget',
      description: 'Two-script snippet: actbrow-sdk.js and actbrow-widget.js with a navigate hook for your SPA.',
    },
    {
      icon: Code2,
      title: 'Browser automation',
      description: 'Click, type, navigate, and read structured page context inside the host application.',
    },
    {
      icon: Server,
      title: 'HTTP tools',
      description: 'Call REST endpoints from the dashboard or agent sync — same-origin browser or server execution.',
    },
    {
      icon: Workflow,
      title: 'Navigation flows',
      description: 'Multi-step workflows triggered by phrase — navigate users through common journeys.',
    },
    {
      icon: Book,
      title: 'Knowledge base',
      description: 'Domain docs synced by your agent; retrieved on demand via knowledge.search, not injected every turn.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark bg-grid">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <BrandLogo
            priority
            heightClassName="h-10 sm:h-16"
            widthClassName="w-10 sm:w-12"
          />
          <nav className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <Button
              onClick={() => router.push('/login')}
              className="bg-white text-neutral-900 hover:bg-white/90 font-medium"
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white animate-fade-in-up">
            Build Intelligent{' '}
            <span className="text-neutral-400">AI Assistants</span>
          </h1>

          <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed animate-fade-in-up-delay-1">
            Drop a script into your app. Your assistant navigates pages, calls HTTP tools, and answers from your knowledge base.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full max-w-2xl mx-auto sm:w-auto animate-fade-in-up-delay-2">
            <Button
              size="lg"
              onClick={() => router.push('/login')}
              className="bg-white text-neutral-900 hover:bg-white/90 h-12 px-8 text-base font-medium"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 h-12 px-8 text-base"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 h-12 px-8 text-base"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Watch demo
            </Button>
          </div>

          <ChevronDown className="h-6 w-6 text-neutral-500 animate-bounce mt-4" />
        </div>
      </section>

      {/* Main product highlight + screenshot */}
      <section id="features" className="container max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 animate-slide-in-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
              <Zap className="h-3.5 w-3.5 text-white" />
              Platform overview
            </div>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Layers className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
                {productHighlight.title}
              </h3>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed max-w-xl">
              {productHighlight.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => router.push('/login')}
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch demo
              </Button>
            </div>
          </div>

          <div className="relative animate-slide-in-right">
            <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-white/10 via-transparent to-white/[0.02] blur-2xl opacity-60 pointer-events-none" aria-hidden />
            <div className="relative aspect-[4/3] w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
              <Image
                src={productShot}
                alt="ActBrow dashboard and assistant experience"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[hsl(150_10%_8%)]/95 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Product demo video */}
      <section id="demo" className="container max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">See it in action</h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            A short walkthrough of how ActBrow ties together assistants, tools, and in-app automation.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-[0_32px_90px_-24px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
            {DEMO_VIDEO_EMBED_URL ? (
              <div className="relative w-full aspect-video">
                <iframe
                  title="ActBrow product demo"
                  src={DEMO_VIDEO_EMBED_URL}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : DEMO_VIDEO_FILE_URL ? (
              <video
                className="w-full aspect-video bg-black"
                controls
                playsInline
                preload="metadata"
              >
                <source src={DEMO_VIDEO_FILE_URL} type="video/mp4" />
                Your browser does not support embedded video.
              </video>
            ) : (
              <div className="aspect-video flex flex-col items-center justify-center gap-4 px-6 py-16 bg-gradient-to-b from-white/[0.06] to-white/[0.02]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
                  <Play className="h-8 w-8 ml-1" fill="currentColor" />
                </div>
                <p className="text-white font-medium text-lg">Product demo video</p>
                <p className="text-neutral-500 text-sm text-center max-w-md">
                  Set <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-neutral-300">NEXT_PUBLIC_DEMO_VIDEO_EMBED_URL</code>{' '}
                  (embed link) or <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-neutral-300">NEXT_PUBLIC_PRODUCT_DEMO_VIDEO_URL</code>{' '}
                  (MP4 URL) in <span className="text-neutral-400">.env.local</span>, then restart the dev server.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="container max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 border-t border-white/10">
        <div className="text-center mb-10 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Everything you need to ship
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Agent-driven setup, in-app automation, and tools that match what ships today
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Integrate section */}
      <section id="integrate" className="container max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 border-t border-white/10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Integrate with a script
              </h2>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Sign up, let your coding agent push config via the sync API, then paste the embed snippet into your app.
            </p>
            <ol className="space-y-4 text-neutral-300">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white">1</span>
                <span>
                  Create an assistant and open <strong className="text-white font-medium">Connect</strong> in the dashboard
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white">2</span>
                <span>
                  Paste the setup prompt into Codex or Claude Code — it pushes config via the sync API
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white">3</span>
                <span>
                  Paste the embed snippet into your app layout (before <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs text-neutral-300">&lt;/body&gt;</code>)
                </span>
              </li>
            </ol>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                className="bg-white text-neutral-900 hover:bg-white/90"
                onClick={() => router.push('/login')}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Watch demo
              </Button>
            </div>
          </div>

          <CodePanel
            code={EMBED_SNIPPET}
            filename="embed.html"
            language="html"
            maxHeight="max-h-[38rem]"
            copyLabel="Copy embed snippet"
          />
        </div>
      </section>

      {/* Reach out */}
      <section id="contact" className="container max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Need help connecting Actbrow?
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Reach out — we&apos;ll help you wire the embed and agent setup.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email us
            </a>
            <a
              href={CONTACT_X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
            >
              @depak_7
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 border-t border-white/10">
        <div className="border border-white/10 rounded-2xl p-8 md:p-12 text-center space-y-6 bg-white/5">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to get started?
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Create an assistant, sync tools with your coding agent, and embed the widget in minutes.
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/login')}
            className="bg-white text-neutral-900 hover:bg-white/90 h-12 px-8 font-medium"
          >
            Start Building
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-sm text-neutral-500">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hover:text-white transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
            <span className="hidden sm:inline text-neutral-700">·</span>
            <a
              href={CONTACT_X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              @depak_7 on X
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
