import Link from "next/link";
import {
  Building2,
  TrendingDown,
  Rocket,
  Users,
  GaugeCircle,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ValueProp {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface SecurityControl {
  label: string;
}

const valueProps: ValueProp[] = [
  {
    icon: TrendingDown,
    title: "Cut operational cost",
    description:
      "Deflect repetitive support and manual ops to an agent that works 24/7.",
  },
  {
    icon: Rocket,
    title: "Ship faster",
    description:
      "Automate a workflow in minutes instead of a sprint of custom UI work.",
  },
  {
    icon: Users,
    title: "Multiply your team",
    description:
      "One agent covers journeys that would take a team of operators to staff.",
  },
  {
    icon: GaugeCircle,
    title: "Scale with demand",
    description:
      "Handle usage spikes without proportional headcount growth.",
  },
];

const securityControls: SecurityControl[] = [
  { label: "Scoped widget & setup keys" },
  { label: "Per-user assistant ownership" },
  { label: "Server-side secret storage" },
  { label: "Browser or server tool execution" },
  { label: "Typed sync API" },
  { label: "OpenAPI tool import" },
  { label: "Conversation history" },
  { label: "Self-host with Docker" },
];

export function EnterpriseSection() {
  return (
    <section id="enterprise" className="border-t border-white/10 relative overflow-hidden">
      {/* Subtle dot background accent */}
      <div
        aria-hidden
        className="bg-dots pointer-events-none absolute inset-0 opacity-30"
      />
      {/* Faint ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-700/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
            <Building2 className="h-3.5 w-3.5" />
            For engineering &amp; ops leaders
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto mb-4">
            Scale operations without scaling headcount
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Give every team an agent that executes inside the product — and keep
            full control of your data, keys, and stack.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* LEFT: value props */}
          <div className="flex flex-col gap-8">
            {valueProps.map((prop) => (
              <div key={prop.title} className="flex items-start gap-4">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <prop.icon className="h-5 w-5 text-neutral-300" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base tracking-tight mb-1">
                    {prop.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: security card */}
          <div className="glass card-sheen rounded-2xl border border-white/10 p-8">
            {/* Card header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-11 w-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-brand-1" />
              </div>
              <h3 className="text-white font-semibold text-lg tracking-tight">
                What you control
              </h3>
            </div>

            {/* Controls grid */}
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
              {securityControls.map((control) => (
                <li key={control.label} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-brand-1" />
                  <span className="text-neutral-300 text-sm">{control.label}</span>
                </li>
              ))}
            </ul>

            {/* Footer note */}
            <p className="text-neutral-500 text-xs border-t border-white/10 pt-4">
              Self-host to keep data in your own infrastructure.
            </p>
          </div>
        </div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="min-w-[160px]">
            <Link href="/book-a-demo">Book a demo</Link>
          </Button>
          <a
            href="mailto:deepakfordev@gmail.com"
            className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors underline underline-offset-4"
          >
            Talk to the team
          </a>
        </div>
      </div>
    </section>
  );
}
