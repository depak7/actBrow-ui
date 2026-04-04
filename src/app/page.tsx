'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';
import productShot from '@/assets/second.png';
import {
  Shield,
  Workflow,
  Zap,
  ArrowRight,
  Github,
  Code2,
  Book,
  Server,
  ChevronDown,
  Layers,
  Cpu,
  Play,
} from 'lucide-react';

/** YouTube/Vimeo embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID */
const DEMO_VIDEO_EMBED_URL = (process.env.NEXT_PUBLIC_DEMO_VIDEO_EMBED_URL || '').trim();
/** Direct MP4/WebM URL (used when embed URL is not set) */
const DEMO_VIDEO_FILE_URL = (process.env.NEXT_PUBLIC_PRODUCT_DEMO_VIDEO_URL || '').trim();

export default function LandingPage() {
  const router = useRouter();

  const productHighlight = {
    title: 'Assistants that act inside your product',
    description:
      'Multi-model routing (Gemini, Groq, and more), browser automation with structured page understanding, HTTP tools, and navigation flows — so the model can navigate, click, and type with reliable tool execution instead of guesswork.',
  };

  const additionalFeatures = [
    {
      icon: Shield,
      title: 'Multi-Tenant Architecture',
      description: 'API key authentication, tenant isolation, and enterprise-grade security.',
    },
    {
      icon: Workflow,
      title: 'Navigation Flows',
      description: 'Define step-by-step automation sequences for complex workflows.',
    },
    {
      icon: Code2,
      title: 'Browser Automation',
      description: 'Full DOM control with click, type, navigate, and read capabilities.',
    },
    {
      icon: Server,
      title: 'Server Tools',
      description: 'Built-in HTTP tools for REST API integration and custom Java logic.',
    },
    {
      icon: Book,
      title: 'Knowledge Base',
      description: 'Add custom prompts and domain-specific knowledge.',
    },
    {
      icon: Cpu,
      title: 'Real-time Processing',
      description: 'SSE streaming for live tool calls and run status updates.',
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
      <section className="container max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white animate-fade-in-up">
            Build Intelligent{' '}
            <span className="text-neutral-400">AI Assistants</span>
          </h1>
          
          <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed animate-fade-in-up-delay-1">
          Turn user intent into real actions inside your application.
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full max-w-2xl mx-auto sm:w-auto animate-fade-in-up-delay-2">
            <Button 
              size="lg" 
              onClick={() => router.push('/waitlist')}
              className="bg-white text-neutral-900 hover:bg-white/90 h-12 px-8 text-base font-medium"
            >
              Join Waitlist
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

          <ChevronDown className="h-6 w-6 text-neutral-500 animate-bounce mt-8" />
        </div>
      </section>

      {/* Main product highlight + screenshot */}
      <section id="features" className="container max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32">
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
      <section id="demo" className="container max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-28 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 md:mb-14">
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

      {/* Additional Features Grid */}
      <section className="container max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32 border-t border-white/10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            And Much More
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Additional features to power your AI assistants
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

      {/* SDK Section - Coming Soon */}
      <section id="sdk" className="container max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32 border-t border-white/10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center">
                <Code2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Developer Tools
                </h2>
                <p className="text-sm text-neutral-500 mt-1">Coming Soon</p>
              </div>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed">
              We're building comprehensive SDKs and developer tools to make integration 
              seamless. Join our waitlist to get early access when we launch.
            </p>
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <p className="text-sm text-neutral-400 mb-4">What you'll get:</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span>SDKs for JavaScript, Python, and Java</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span>Comprehensive API documentation</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span>Code examples and tutorials</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span>Early access to new features</span>
                </li>
              </ul>
            </div>
            <Button 
              className="bg-white text-neutral-900 hover:bg-white/90"
              onClick={() => router.push('/waitlist')}
            >
              Join Waitlist for Early Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-8 opacity-50">
              <div className="h-full flex flex-col justify-center items-center space-y-6">
                <Code2 className="h-24 w-24 text-neutral-600" />
                <p className="text-xl font-semibold text-neutral-500">Developer Tools Coming Soon</p>
                <p className="text-sm text-neutral-600 text-center max-w-xs">
                  We're working hard to bring you the best developer experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge Base Section */}
      <section className="container max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-xl bg-white/10 flex items-center justify-center">
              <Book className="h-7 w-7 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Knowledge Base
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Enhance your AI assistants with custom knowledge. Add prompts, documentation,
            and domain-specific context to improve response accuracy. Manage knowledge
            bases per assistant or share across your organization.
          </p>
          <ul className="space-y-4 text-left max-w-md mx-auto">
            {[
              'Custom system prompts per assistant',
              'Upload documentation and guides',
              'Domain-specific training data',
              'Version control for knowledge updates',
              'Search and retrieval optimization',
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-neutral-300">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32 border-t border-white/10">
        <div className="border border-white/10 rounded-2xl p-12 md:p-16 text-center space-y-6 bg-white/5">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Join hundreds of companies building intelligent assistants with ActBrow.
          </p>
          <Button 
            size="lg" 
            onClick={() => router.push('/login')}
            className="bg-white text-neutral-900 hover:bg-white/90 h-12 px-8 font-medium"
          >
            Start Building Free
          </Button>
        </div>
      </section>

    </div>
  );
}
