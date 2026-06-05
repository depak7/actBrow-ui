import { Plug, Zap, FileCode, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CapabilityCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const capabilities: CapabilityCard[] = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: "HTTP & REST tools",
    description:
      "Point a tool at any endpoint. Typed inputs and outputs, run server-side or same-origin in the browser.",
  },
  {
    icon: <FileCode className="h-5 w-5" />,
    title: "Import an OpenAPI spec",
    description:
      "Paste a Swagger / OpenAPI v3 spec and ActBrow generates one typed tool per operation, grouped as an integration.",
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Incremental re-sync",
    description:
      "Re-import any time. ActBrow diffs the spec and adds or removes tools to match — no manual cleanup.",
  },
];

const codeLines: { token: string; color: string }[][] = [
  [{ token: "{", color: "text-neutral-400" }],
  [
    { token: '  "key":', color: "text-emerald-400" },
    { token: ' "', color: "text-neutral-400" },
    { token: "orders.refund", color: "text-teal-300" },
    { token: '",', color: "text-neutral-400" },
  ],
  [
    { token: '  "type":', color: "text-emerald-400" },
    { token: ' "', color: "text-neutral-400" },
    { token: "SERVER_HTTP", color: "text-amber-300" },
    { token: '",', color: "text-neutral-400" },
  ],
  [
    { token: '  "method":', color: "text-emerald-400" },
    { token: ' "', color: "text-neutral-400" },
    { token: "POST", color: "text-teal-300" },
    { token: '",', color: "text-neutral-400" },
  ],
  [
    { token: '  "path":', color: "text-emerald-400" },
    { token: ' "', color: "text-neutral-400" },
    { token: "/api/refunds", color: "text-amber-300" },
    { token: '",', color: "text-neutral-400" },
  ],
  [
    { token: '  "execution":', color: "text-emerald-400" },
    { token: ' "', color: "text-neutral-400" },
    { token: "server", color: "text-teal-300" },
    { token: '"', color: "text-neutral-400" },
  ],
  [{ token: "}", color: "text-neutral-400" }],
];

export function Integrations() {
  return (
    <section id="integrations" className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
        {/* Eyebrow */}
        <div className="flex flex-col items-start gap-6 md:items-center md:text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
            <Plug className="h-3.5 w-3.5" />
            Connect anything
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Connect the APIs you{" "}
            <span className="text-gradient-accent">already run on</span>
          </h2>

          <p className="text-neutral-400 text-lg max-w-2xl">
            ActBrow doesn&rsquo;t lock you into a fixed list of connectors. Turn
            any REST endpoint into a tool, or import an OpenAPI spec and generate
            them all at once.
          </p>
        </div>

        {/* Capability cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {capabilities.map((card) => (
            <div
              key={card.title}
              className={cn(
                "card-hover group",
                "rounded-2xl border border-white/10 bg-white/[0.03]",
                "hover:bg-white/[0.06] transition-all duration-200",
                "p-6 flex flex-col gap-4"
              )}
            >
              {/* Icon tile */}
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 transition-colors duration-200 group-hover:bg-emerald-500/15">
                {card.icon}
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-semibold text-white">
                  {card.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Code preview card */}
        <div className="mt-10 mx-auto max-w-lg">
          <div className="rounded-xl border border-white/10 bg-[#0d0d0d] overflow-hidden shadow-xl">
            {/* Filename header bar */}
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              {/* Traffic-light dots */}
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
              <span className="ml-3 text-xs font-mono text-neutral-500">
                tool.json
              </span>
            </div>

            {/* Code body */}
            <div className="px-5 py-5">
              <pre className="font-mono text-sm leading-6" aria-label="Example tool definition">
                {codeLines.map((line, lineIdx) => (
                  <div key={lineIdx}>
                    {line.map((token, tokenIdx) => (
                      <span key={tokenIdx} className={token.color}>
                        {token.token}
                      </span>
                    ))}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>

        {/* Closing CTA card */}
        <div className="mt-8">
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-3 text-center",
              "rounded-2xl border border-dashed border-white/15",
              "bg-white/[0.02] px-6 py-10",
              "transition-colors hover:bg-white/[0.04]"
            )}
          >
            <FileCode className="h-6 w-6 text-emerald-500/70" />
            <p className="text-sm text-neutral-400 max-w-md">
              Have an OpenAPI spec?{" "}
              <span className="text-neutral-200 font-medium">
                Import it and your whole API becomes agent-ready in one step.
              </span>
            </p>
            <p className="text-xs text-neutral-500 max-w-sm">
              Or hand the sync API to Claude Code / Codex and let your coding
              agent wire the tools automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
