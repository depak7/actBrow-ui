import Link from "next/link";
import {
  Boxes,
  Bot,
  ArrowRight,
  Play,
  Check,
  Navigation,
  Plus,
  Zap,
  Send,
  X,
  MessageSquare,
  CalendarDays,
  Clock,
  CalendarCheck,
  Users,
  LayoutGrid,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollLaunchBadge } from "@/components/landing/scrolllaunch-badge";

const CAL_NAV: { icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean }[] = [
  { icon: LayoutGrid, label: "Event Types", active: true },
  { icon: CalendarCheck, label: "Bookings" },
  { icon: Clock, label: "Availability" },
  { icon: Users, label: "Teams" },
];

const CAL_EVENTS: { title: string; slug: string; highlight?: boolean }[] = [
  { title: "15 Min Meeting", slug: "cal.com/you/15min" },
  { title: "30 Min Intro Call", slug: "cal.com/you/30min-intro", highlight: true },
  { title: "Secret Meeting", slug: "cal.com/you/secret" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-24 md:pt-32">
      {/* Ambient glow blobs */}
      <div
        aria-hidden
        className="animate-aurora pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-emerald-600/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-aurora pointer-events-none absolute left-1/4 top-1/3 -z-10 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-teal-600/10 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-aurora pointer-events-none absolute right-1/4 top-1/4 -z-10 h-[350px] w-[450px] rounded-full bg-teal-600/10 blur-3xl"
      />

      {/* ── Hero copy ── */}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow */}
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-neutral-300">
              <Boxes className="h-3.5 w-3.5 text-emerald-400" />
              Embed in any web app · Two script tags
            </span>
          </div>

          {/* H1 — must pass a 5-second test: what is this? */}
          <h1 className="animate-fade-in-up animate-fade-in-up-delay-1 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="text-gradient">Chat that finishes the work</span>
            <br />
            <span className="text-gradient-accent">inside your product.</span>
          </h1>

          {/* Subhead — who + how + vs status quo, one breath */}
          <p className="animate-fade-in-up animate-fade-in-up-delay-2 mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-400 md:text-lg">
            Users ask in plain English. ActBrow opens the right screen, calls
            your APIs, and completes the task — so they never open a ticket.
            Unlike Intercom or Zendesk, it acts inside your app.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up animate-fade-in-up-delay-2 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white font-medium text-neutral-900 hover:bg-white/90"
            >
              <Link href="/login" className="flex items-center gap-2">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border border-white/15 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="#demo" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Watch product demo
              </Link>
            </Button>
          </div>
          <p className="animate-fade-in-up animate-fade-in-up-delay-2 mt-4 text-sm text-neutral-500">
            Prefer a walkthrough?{' '}
            <Link href="/book-a-demo" className="text-neutral-300 underline underline-offset-2 hover:text-white">
              Book a demo
            </Link>
          </p>

          {/* Trust microcopy */}
          <p className="animate-fade-in-up animate-fade-in-up-delay-3 mt-5 text-xs text-neutral-500">
            Two script tags&nbsp;&nbsp;·&nbsp;&nbsp;No backend
            rewrite&nbsp;&nbsp;·&nbsp;&nbsp;Self-hostable
          </p>

          <div className="animate-fade-in-up animate-fade-in-up-delay-3 mt-6 flex justify-center">
            <ScrollLaunchBadge />
          </div>
        </div>

        {/* ── Product Mockup: ActBrow chat widget running inside Cal.com ── */}
        <div className="animate-fade-in-up-delay-3 relative mx-auto mt-20 max-w-6xl">
          {/* Glow behind the mockup */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-12 mx-auto h-[120px] w-3/4 rounded-full bg-emerald-500/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[80px] w-1/2 rounded-full bg-teal-500/20 blur-3xl"
          />

          {/* Browser frame */}
          <div className="card-sheen relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] bg-white/[0.04] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.04] px-3 py-1">
                <svg className="h-3 w-3 text-neutral-500" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1a7 7 0 100 14A7 7 0 008 1zM3.05 8.5H5.1a12.6 12.6 0 00.74 3.54A5.51 5.51 0 013.05 8.5zm0-1A5.51 5.51 0 015.84 3.96a12.6 12.6 0 00-.74 3.54H3.05zm2.06 0H7.5V4.01a11.6 11.6 0 00-2.39 3.49zm0 1A11.6 11.6 0 007.5 11.99V8.5H5.11zm2.39 3.49V8.5h2.39A11.6 11.6 0 018.5 11.99zm0-4.99V4.01A11.6 11.6 0 0110.89 7.5H8.5zm2.4 0h2.05a12.6 12.6 0 00-.74-3.54A5.51 5.51 0 0110.9 7.5zm0 1a5.51 5.51 0 01-2.79 3.54 12.6 12.6 0 00.74-3.54h2.05z"
                    fill="currentColor"
                  />
                </svg>
                <span className="font-mono text-[11px] text-neutral-400">app.cal.com/event-types</span>
              </div>
              <div className="w-16" />
            </div>

            {/* Body: faux Cal.com app + ActBrow chat widget */}
            <div className="relative min-h-[40rem]">
              {/* ── Faux Cal.com (dimmed background) ── */}
              <div className="pointer-events-none absolute inset-0 hidden opacity-[0.55] md:flex">
                {/* Sidebar */}
                <div className="flex w-[200px] shrink-0 flex-col border-r border-white/[0.06] px-3 py-4">
                  {/* Cal.com brand */}
                  <div className="mb-5 flex items-center gap-2 px-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-neutral-900">
                      <CalendarDays className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-neutral-200">Cal.com</span>
                  </div>
                  {/* Nav */}
                  <div className="flex flex-col gap-1">
                    {CAL_NAV.map(({ icon: Icon, label, active }) => (
                      <div
                        key={label}
                        className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 ${
                          active ? "bg-white/10 text-neutral-100" : "text-neutral-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Profile */}
                  <div className="mt-auto flex items-center gap-2 rounded-md px-2 py-1.5">
                    <div className="h-6 w-6 rounded-full bg-white/10" />
                    <span className="text-xs text-neutral-500">you@team.com</span>
                  </div>
                </div>

                {/* Main: Event Types */}
                <div className="flex-1 px-7 py-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-200">Event Types</h2>
                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        Create events to share for people to book on your calendar.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-[11px] font-medium text-neutral-200">
                      <Plus className="h-3.5 w-3.5" />
                      New
                    </div>
                  </div>

                  {/* Event type list */}
                  <div className="overflow-hidden rounded-lg border border-white/[0.06]">
                    {CAL_EVENTS.map((ev, i) => (
                      <div
                        key={ev.title}
                        className={`flex items-center justify-between border-b border-white/[0.04] px-4 py-3.5 last:border-0 ${
                          ev.highlight
                            ? "bg-emerald-500/[0.06] ring-1 ring-inset ring-emerald-500/25"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CalendarDays className="h-4 w-4 text-neutral-500" />
                          <div>
                            <p className="text-[13px] font-medium text-neutral-200">{ev.title}</p>
                            <p className="flex items-center gap-1 text-[11px] text-neutral-500">
                              <Link2 className="h-3 w-3" />
                              {ev.slug}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`h-4 w-7 rounded-full ${
                            i === 2 ? "bg-white/10" : "bg-emerald-500/60"
                          } relative`}
                        >
                          <span
                            className={`absolute top-0.5 h-3 w-3 rounded-full bg-white ${
                              i === 2 ? "left-0.5" : "right-0.5"
                            }`}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dim gradient so the widget pops */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 hidden bg-gradient-to-tl from-black/45 via-transparent to-transparent md:block"
              />

              {/* ── ActBrow chat widget panel (open) ── */}
              <div className="relative mx-auto my-6 w-full max-w-md px-4 md:absolute md:bottom-[5.5rem] md:right-6 md:my-0 md:w-[440px] md:px-0">
                <div className="flex h-[520px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161618] shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7)]">
                  {/* Header */}
                  <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
                      <Bot className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-white">
                          ActBrow Assistant
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-1.5 py-0.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_5px_1px_rgba(74,222,128,0.6)]" />
                          <span className="text-[9px] font-medium text-green-400">Live</span>
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-neutral-500">
                        Ask, navigate, and act inside this app
                      </p>
                    </div>
                    <button className="shrink-0 rounded-md px-2 py-1 text-[10px] text-neutral-500 hover:bg-white/5">
                      New chat
                    </button>
                    <button className="shrink-0 rounded-md p-1 text-neutral-500 hover:bg-white/5">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
                    {/* User */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-emerald-500/15 px-3.5 py-2.5">
                        <p className="text-xs leading-relaxed text-emerald-50">
                          Add a 30-minute intro call to my event types.
                        </p>
                      </div>
                    </div>

                    {/* Tool trace */}
                    <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <span className="text-[10px] font-medium text-neutral-400">Used 2 steps</span>
                      {[
                        { icon: Navigation, text: "Navigate", chip: "app.navigate → /event-types" },
                        { icon: Zap, text: "Create event type", chip: "POST /api/v2/event-types" },
                      ].map((step) => (
                        <div key={step.chip} className="flex items-center gap-2">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                            <Check className="h-2.5 w-2.5 text-emerald-400" />
                          </span>
                          <span className="text-[11px] text-neutral-300">{step.text}</span>
                          <span className="ml-auto rounded border border-white/[0.08] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[9px] text-neutral-400">
                            {step.chip}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Assistant reply */}
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                        <Bot className="h-3 w-3 text-emerald-400" />
                      </div>
                      <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.05] px-3.5 py-2.5">
                        <p className="text-xs leading-relaxed text-neutral-200">
                          Added{" "}
                          <span className="font-medium text-white">&ldquo;30 Min Intro Call&rdquo;</span>{" "}
                          — your booking link is{" "}
                          <span className="font-mono text-emerald-300">cal.com/you/30min-intro</span>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-white/10 px-3 pb-2.5 pt-3">
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                      <span className="flex-1 truncate text-[11px] text-neutral-600">
                        Ask me to navigate or help with what&apos;s on this page
                      </span>
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500">
                        <Send className="h-3 w-3 text-neutral-950" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1.5">
                      <Boxes className="h-2.5 w-2.5 text-neutral-600" />
                      <span className="text-[9px] text-neutral-600">Powered by ActBrow</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Launcher bubble ── */}
              <div className="absolute bottom-6 right-6 hidden md:block">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full ring-2 ring-emerald-400/40 animate-ping"
                  />
                  <MessageSquare className="h-6 w-6" />
                  <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Below-mockup muted line */}
          <p className="mt-5 text-center text-xs text-neutral-600">
            Works in any web app — React, Vue, Rails, or plain HTML.
          </p>
        </div>
      </div>
    </section>
  );
}
