import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-t border-white/10 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Main panel */}
        <div className="relative rounded-3xl border border-white/10 overflow-hidden card-sheen px-6 py-16 md:px-16 md:py-24 text-center">

          {/* Background: layered aurora glow blobs */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {/* Indigo blob — top-left */}
            <div
              className="animate-aurora absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-emerald-600/25 blur-[120px]"
              style={{ animationDelay: "0s" }}
            />
            {/* Violet blob — bottom-right */}
            <div
              className="animate-aurora absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-teal-600/20 blur-[140px]"
              style={{ animationDelay: "2s" }}
            />
            {/* Sky accent — center */}
            <div
              className="animate-aurora absolute top-1/2 left-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[100px]"
              style={{ animationDelay: "4s" }}
            />

            {/* Grid overlay with radial fade mask */}
            <div
              className="bg-grid absolute inset-0 opacity-[0.18]"
              style={{
                maskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
              }}
            />
          </div>

          {/* Content — sits above background layers */}
          <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in-up">

            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-sm text-neutral-400">
              <Sparkles className="h-3.5 w-3.5 text-brand-1" aria-hidden="true" />
              Ready when you are
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-[1.1]">
              Stop shipping help articles.
              <br />
              <span className="text-gradient-accent">
                Ship an agent that does the work.
              </span>
            </h2>

            {/* Subhead */}
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Create an assistant, let your coding agent sync the tools, and embed the widget.
              Your users get an agent that acts — in an afternoon.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-neutral-900 hover:bg-white/90 font-medium"
              >
                <Link href="/book-a-demo">
                  Book a demo
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                className="border border-white/15 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/login">Start building</Link>
              </Button>
            </div>

            {/* Trust line */}
            <p className="text-sm text-neutral-500">
              Two script tags · No backend rewrite · Self-hostable
            </p>

            {/* Contact line */}
            <p className="text-xs text-neutral-600 flex items-center gap-2">
              <a
                href="mailto:deepakfordev@gmail.com"
                className="hover:text-neutral-400 transition-colors duration-200"
              >
                deepakfordev@gmail.com
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://x.com/depak_7"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-400 transition-colors duration-200"
              >
                @depak_7
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
