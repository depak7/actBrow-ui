import {
  Layers,
  Sparkles,
  Navigation,
  Zap,
  Workflow,
  BookOpen,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  outcome: string;
  wide?: boolean;
}

const features: FeatureCard[] = [
  {
    icon: Sparkles,
    title: "Agent-configured setup",
    description:
      "Open Connect, paste the setup prompt into Claude Code or Codex, and your agent pushes tools + knowledge through the sync API.",
    outcome: "No YAML. Integrated in an afternoon.",
    wide: true,
  },
  {
    icon: Navigation,
    title: "In-app navigation & context",
    description:
      "The agent navigates to any route and reads live page context, so it always knows where the user is.",
    outcome: "Grounded in the real page, not guesses.",
  },
  {
    icon: Zap,
    title: "HTTP & REST tools",
    description:
      "Turn any endpoint into a typed tool. Run same-origin in the browser or server-side.",
    outcome: "Reuse the APIs you already have.",
  },
  {
    icon: Workflow,
    title: "Navigation flows",
    description:
      "Define multi-step journeys triggered by a phrase to guide users through onboarding, setup, or recovery.",
    outcome: "Repetitive journeys run themselves.",
  },
  {
    icon: BookOpen,
    title: "Knowledge base",
    description:
      "Sync domain docs; the agent retrieves them on demand via knowledge.search instead of stuffing every prompt.",
    outcome: "Accurate answers, lower token cost.",
  },
  {
    icon: Boxes,
    title: "Model-flexible",
    description:
      "Point ActBrow at any OpenAI-compatible model endpoint and configure it in one place.",
    outcome: "No lock-in. Swap endpoints freely.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
            <Layers className="h-3.5 w-3.5" />
            Capabilities
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Everything an in-app agent needs
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            A complete runtime — setup, actions, tools, flows, and knowledge —
            that matches what actually ships.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={cn(
                "card-hover group relative rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors p-6 flex flex-col gap-4",
                feature.wide && "lg:col-span-2"
              )}
            >
              {/* Icon tile */}
              <div className="h-11 w-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <feature.icon className="h-5 w-5 text-neutral-300" />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-white font-semibold text-base tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed flex-1">
                  {feature.description}
                </p>
              </div>

              {/* Outcome */}
              <p className="text-neutral-300 text-xs font-medium border-t border-white/10 pt-4 mt-auto">
                {feature.outcome}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
