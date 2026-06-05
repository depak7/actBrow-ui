import { AlertTriangle, MousePointer2, Workflow, Code2, MessageSquareOff } from "lucide-react";

interface PainCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const painCards: PainCard[] = [
  {
    icon: <MousePointer2 className="h-5 w-5 text-rose-400" />,
    title: "Users get lost in the UI",
    description:
      "They open support tickets asking where to click instead of finishing the task themselves.",
  },
  {
    icon: <Workflow className="h-5 w-5 text-rose-400" />,
    title: "Manual, multi-tab workflows",
    description:
      "Refunds, onboarding, config changes — repetitive journeys that nobody automated because it was never worth a sprint.",
  },
  {
    icon: <Code2 className="h-5 w-5 text-rose-400" />,
    title: "Every helper is a custom build",
    description:
      "In-app guides and copilots get hand-coded, then rot. A permanent maintenance tax on your roadmap.",
  },
  {
    icon: <MessageSquareOff className="h-5 w-5 text-rose-400" />,
    title: "Chatbots that can't actually do anything",
    description:
      "Bolt-on assistants answer questions but can't navigate your app or call your APIs. Users still do the work.",
  },
];

export function ProblemSection() {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        {/* Eyebrow */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            The status quo
          </span>
        </div>

        {/* Heading block */}
        <div className="mb-14 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Your users are stuck. Your engineers are buried.
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl">
            Every product accumulates the same tax: workflows that humans have
            to babysit and features only engineering can build.
          </p>
        </div>

        {/* Pain cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {painCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors p-6 flex gap-4"
            >
              {/* Icon tile */}
              <div className="shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/[0.07]">
                {card.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-white font-semibold tracking-tight mb-1.5">
                  {card.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing line */}
        <p className="mt-12 text-center text-neutral-500 text-sm max-w-xl mx-auto">
          The result: rising support costs, slower execution, and an engineering
          backlog that never clears.
        </p>
      </div>
    </section>
  );
}
