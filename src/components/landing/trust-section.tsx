import { Check, Code2, KeyRound, Plug, Server } from "lucide-react";
import type { FC, ReactNode } from "react";

interface StatCard {
  icon: ReactNode;
  metric: string;
  description: string;
}

const STAT_CARDS: StatCard[] = [
  {
    icon: <Code2 className="h-5 w-5 text-neutral-400" />,
    metric: "Two scripts",
    description: "Embed with actbrow-sdk.js + actbrow-widget.js. No backend rewrite.",
  },
  {
    icon: <Plug className="h-5 w-5 text-neutral-400" />,
    metric: "API-first",
    description: "Tools, flows, and knowledge sync over one typed sync API.",
  },
  {
    icon: <KeyRound className="h-5 w-5 text-neutral-400" />,
    metric: "Scoped keys",
    description: "Separate setup and widget keys, scoped per assistant.",
  },
  {
    icon: <Server className="h-5 w-5 text-neutral-400" />,
    metric: "Self-host",
    description: "Run the whole stack with Docker. Bring any OpenAI-compatible model.",
  },
];

const TRUST_PILLS: string[] = [
  "Navigation flows",
  "HTTP & REST tools",
  "OpenAPI import",
  "Knowledge retrieval",
  "Conversation history",
  "Per-user assistants",
];

export function TrustSection(): ReturnType<FC> {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">

        {/* Heading block */}
        <div className="animate-fade-in-up mb-14 md:mb-16">
          {/* Eyebrow */}
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
              <Server className="h-3.5 w-3.5" />
              Built to drop in
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            A small runtime, not a platform to migrate to.
          </h2>

          <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
            ActBrow embeds with two script tags and configures over a typed API.
            Self-host it, point it at your own model, and keep your stack.
          </p>
        </div>

        {/* 4-up stat grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {STAT_CARDS.map((card) => (
            <div
              key={card.metric}
              className="group bg-white/[0.03] hover:bg-white/[0.06] transition-colors rounded-xl border border-white/10 p-6"
            >
              {/* Icon tile */}
              <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                {card.icon}
              </div>

              {/* Metric */}
              <p className="text-2xl font-bold text-white tracking-tight mb-1.5">
                {card.metric}
              </p>

              {/* Description */}
              <p className="text-sm text-neutral-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Secondary pill row */}
        <div className="flex flex-wrap gap-2.5">
          {TRUST_PILLS.map((pill) => (
            <span
              key={pill}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-400"
            >
              <Check className="h-3 w-3 text-emerald-400 shrink-0" />
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
