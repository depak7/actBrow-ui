import { Sparkles, X, Check } from "lucide-react";

interface ListItem {
  text: string;
}

const beforeItems: ListItem[] = [
  { text: "Weeks of glue code for every in-app helper" },
  { text: "Chatbots that only answer, never act" },
  { text: "Support headcount scales with usage" },
  { text: "Users abandon multi-step flows" },
];

const afterItems: ListItem[] = [
  { text: "One embed, agent live in an afternoon" },
  { text: "An agent that navigates your app and calls your APIs" },
  { text: "Answers from your docs, retrieved on demand" },
  { text: "Multi-step flows run on a trigger phrase" },
];

interface Metric {
  value: string;
  label: string;
}

const metrics: Metric[] = [
  { value: "2 scripts", label: "to embed it in your app" },
  { value: "1 prompt", label: "your coding agent syncs the setup" },
  { value: "Any REST API", label: "becomes a typed tool" },
];

export function SolutionSection() {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        {/* Eyebrow */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
            <Sparkles className="h-3.5 w-3.5 text-brand-1" />
            The shift
          </span>
        </div>

        {/* Heading block */}
        <div className="mb-14 max-w-3xl animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Stop describing the work. Ship an agent that does it.
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl">
            ActBrow turns the same workflows into one embed — an agent that acts
            inside your product instead of pointing at it.
          </p>
        </div>

        {/* Before / After */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* BEFORE card */}
          <div className="rounded-xl border border-rose-500/20 bg-white/[0.03] hover:bg-white/[0.06] transition-colors p-6">
            {/* Card header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-500/25 bg-rose-500/[0.08]">
                <X className="h-4 w-4 text-rose-400" />
              </div>
              <span className="text-sm font-semibold text-neutral-300 tracking-tight">
                Before ActBrow
              </span>
            </div>

            {/* Items */}
            <ul className="space-y-3.5">
              {beforeItems.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    <X className="h-3.5 w-3.5 text-rose-400/70" />
                  </span>
                  <span className="text-neutral-400 text-sm leading-relaxed">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* AFTER card */}
          <div className="card-sheen glow-accent rounded-xl border border-emerald-500/25 bg-white/[0.05] hover:bg-white/[0.08] transition-colors p-6 relative">
            {/* Card header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/[0.10]">
                <Check className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-white tracking-tight">
                With ActBrow
              </span>
            </div>

            {/* Items */}
            <ul className="space-y-3.5">
              {afterItems.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  </span>
                  <span className="text-neutral-300 text-sm leading-relaxed">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Outcome metrics */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="grid sm:grid-cols-3">
            {metrics.map((metric, index) => (
              <div
                key={metric.value}
                className={[
                  "px-8 py-10 flex flex-col items-center text-center",
                  index < metrics.length - 1
                    ? "border-b sm:border-b-0 sm:border-r border-white/10"
                    : "",
                ].join(" ")}
              >
                <span className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {metric.value}
                </span>
                <span className="text-neutral-400 text-sm leading-snug max-w-[160px]">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
