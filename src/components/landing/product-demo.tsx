'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Navigation,
  Zap,
  Workflow,
  BookOpen,
  Check,
  X,
  Send,
  Bot,
  ArrowRight,
  FileText,
  CalendarDays,
  LayoutGrid,
  CalendarCheck,
  Clock,
  Users,
  ToggleRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ToolStep {
  label: string;
  chip?: string;
}

interface Tab {
  id: number;
  icon: React.ElementType;
  label: string;
  caption: string;
  conversation: ConversationConfig;
}

interface ConversationConfig {
  userMessage: string;
  steps: ToolStep[];
  assistantMessage: React.ReactNode;
  /** Optional suggestion chips shown before the user sends (tab 3 only) */
  suggestionChips?: string[];
  /** Optional inline source card inside assistant bubble (tab 4 only) */
  sourceCard?: { title: string; relevance: string };
}

// ─── Shared widget chrome ─────────────────────────────────────────────────────

function WidgetHeader() {
  return (
    <div className="flex items-center gap-2.5 border-b border-white/10 px-3.5 py-3">
      {/* Icon tile — 9×9 / rounded-lg */}
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
        <Bot className="h-4 w-4 text-emerald-400" />
      </div>

      {/* Title row + subtitle — flexible middle column */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {/* Row 1: title + live badge */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="truncate text-sm font-semibold text-white">ActBrow Assistant</span>
          <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-1.5 py-0.5">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400 shadow-[0_0_4px_rgba(74,222,128,0.8)]" />
            <span className="text-[9px] font-medium text-green-400">Live</span>
          </span>
        </div>
        {/* Row 2: subtitle */}
        <span className="truncate text-[11px] leading-none text-neutral-500">
          Ask, navigate, and act inside this app
        </span>
      </div>

      {/* Right actions — single line, no wrap */}
      <div className="flex flex-shrink-0 items-center gap-2.5">
        <button className="whitespace-nowrap text-[10px] text-neutral-500 transition-colors hover:text-neutral-300">
          New chat
        </button>
        <X className="h-4 w-4 text-neutral-500" />
      </div>
    </div>
  );
}

function WidgetFooter({ placeholder }: { placeholder?: string }) {
  return (
    <div className="border-t border-white/10 px-3 py-3">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="flex-1 text-[11px] text-neutral-600">
          {placeholder ?? "Ask me to navigate or help with what's on this page"}
        </span>
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
          <Send className="h-3 w-3 text-emerald-400" />
        </div>
      </div>
      <p className="mt-2 text-center text-[9px] text-neutral-600">
        <MessageSquare className="mr-0.5 inline h-2.5 w-2.5" />
        Powered by ActBrow
      </p>
    </div>
  );
}

function ToolTraceCard({ steps }: { steps: ToolStep[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="mb-2 text-[10px] text-neutral-400">
        Used {steps.length} step{steps.length !== 1 ? 's' : ''}
      </p>
      <div className="flex flex-col gap-1.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
              <Check className="h-2.5 w-2.5 text-emerald-400" />
            </div>
            <span className="text-[10px] text-neutral-300">{step.label}</span>
            {step.chip && (
              <span className="ml-auto rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[9px] text-neutral-400">
                {step.chip}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Widget panel — renders conversation per tab ───────────────────────────────

function ChatWidgetPanel({ conv }: { conv: ConversationConfig }) {
  return (
    <div className="flex h-[520px] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1e] shadow-elevated">
      <WidgetHeader />

      {/* Messages area */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">

        {/* Suggestion chips (tab 3 only — shown before conversation) */}
        {conv.suggestionChips && (
          <div className="flex flex-wrap gap-2 pb-1">
            {conv.suggestionChips.map((chip) => (
              <button
                key={chip}
                className={cn(
                  'rounded-xl border px-3 py-1.5 text-[11px] transition-colors',
                  chip === 'Set up my availability'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/10 bg-white/[0.03] text-neutral-400 hover:text-neutral-200',
                )}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-500/15 px-3.5 py-2.5">
            <p className="text-[11px] leading-relaxed text-emerald-50">{conv.userMessage}</p>
          </div>
        </div>

        {/* Tool trace card */}
        <ToolTraceCard steps={conv.steps} />

        {/* Assistant message */}
        <div className="flex items-start gap-2">
          {/* Avatar */}
          <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
            <Bot className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.05] px-3.5 py-3">
            <p className="text-[11px] leading-relaxed text-neutral-200">{conv.assistantMessage}</p>
            {/* Inline source card (tab 4) */}
            {conv.sourceCard && (
              <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                <FileText className="h-3.5 w-3.5 flex-shrink-0 text-neutral-500" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[10px] font-semibold text-neutral-300">
                    {conv.sourceCard.title}
                  </span>
                  <span className="text-[9px] text-neutral-600">Source</span>
                </div>
                <span className="whitespace-nowrap rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                  {conv.sourceCard.relevance}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <WidgetFooter />
    </div>
  );
}

// ─── Faux Cal.com host-page background ────────────────────────────────────────

const CAL_NAV_ITEMS = [
  { icon: LayoutGrid, label: 'Event Types', active: true },
  { icon: CalendarCheck, label: 'Bookings', active: false },
  { icon: Clock, label: 'Availability', active: false },
  { icon: Users, label: 'Teams', active: false },
];

const CAL_EVENT_TYPES = [
  { title: '15 Min Meeting', url: 'cal.com/you/15min', highlight: false },
  { title: '30 Min Intro Call', url: 'cal.com/you/30min-intro', highlight: true },
  { title: 'Secret Meeting', url: 'cal.com/you/secret', highlight: false },
];

function FauxHostPage() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex overflow-hidden opacity-50"
      aria-hidden
    >
      {/* Sidebar */}
      <div className="flex w-44 flex-shrink-0 flex-col gap-1 border-r border-white/[0.07] bg-white/[0.015] px-3 py-4">
        {/* Wordmark */}
        <div className="mb-4 flex items-center gap-2 px-1">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-white/10">
            <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <span className="text-[11px] font-semibold text-neutral-400">Cal.com</span>
        </div>
        {CAL_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                'flex items-center gap-2 rounded-lg px-2 py-1.5',
                item.active ? 'bg-white/[0.07] text-neutral-200' : 'text-neutral-500',
              )}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="text-[10px]">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-5 py-5">
        {/* URL pill */}
        <div className="mb-1 flex items-center gap-1.5">
          <div className="rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-0.5">
            <span className="text-[9px] text-neutral-600">app.cal.com/event-types</span>
          </div>
        </div>

        {/* Page title */}
        <div className="mb-1 h-3 w-24 rounded bg-white/[0.07]" />

        {/* Event type rows */}
        {CAL_EVENT_TYPES.map((ev) => (
          <div
            key={ev.title}
            className={cn(
              'flex items-center justify-between rounded-xl border px-4 py-3',
              ev.highlight
                ? 'border-emerald-500/30 bg-emerald-500/[0.07]'
                : 'border-white/[0.06] bg-white/[0.025]',
            )}
          >
            <div className="flex flex-col gap-0.5">
              <span className={cn('text-[11px] font-medium', ev.highlight ? 'text-emerald-200' : 'text-neutral-300')}>
                {ev.title}
              </span>
              <span className="text-[9px] text-neutral-600">{ev.url}</span>
            </div>
            <ToggleRight
              className={cn('h-4 w-4 flex-shrink-0', ev.highlight ? 'text-emerald-400' : 'text-neutral-600')}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab viewport wrapper ──────────────────────────────────────────────────────

function TabViewport({ conv }: { conv: ConversationConfig }) {
  return (
    <div className="relative flex min-h-[37rem] items-center justify-center p-4 md:justify-end md:p-8">
      {/* Cal.com host-page backdrop */}
      <FauxHostPage />

      {/* Chat panel */}
      <div className="relative z-10 w-full max-w-md md:w-[440px]">
        <ChatWidgetPanel conv={conv} />
      </div>

      {/* Launcher bubble hint */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-elevated md:bottom-6 md:right-6"
      >
        <MessageSquare className="h-5 w-5 text-neutral-900" />
      </div>
    </div>
  );
}

// ─── Tab configurations ────────────────────────────────────────────────────────

const TABS: Tab[] = [
  {
    id: 0,
    icon: Navigation,
    label: 'Navigates your app',
    caption: 'Reads page context and navigates to the right place.',
    conversation: {
      userMessage: 'Take me to my upcoming bookings.',
      steps: [
        { label: 'Navigate', chip: 'app.navigate → /bookings' },
        { label: 'Locate booking', chip: 'path.find' },
      ],
      assistantMessage: "You're on Bookings — your Thursday calls are highlighted.",
    },
  },
  {
    id: 1,
    icon: Zap,
    label: 'Calls your APIs',
    caption: 'Any REST endpoint becomes a typed tool — server-side or same-origin.',
    conversation: {
      userMessage: 'Book a 30-min intro call with Maya on Thursday at 2pm.',
      steps: [{ label: 'Create booking', chip: 'POST /api/v2/bookings' }],
      assistantMessage: 'Booked — 30-min intro call with Maya, Thursday 2:00 PM. Confirmation sent.',
    },
  },
  {
    id: 2,
    icon: Workflow,
    label: 'Follows flows',
    caption: 'Phrase-triggered flows run multiple steps in order.',
    conversation: {
      userMessage: 'Set up my availability',
      suggestionChips: ['Set up my availability', 'Create an event type', 'Connect my calendar'],
      steps: [
        { label: 'Navigate', chip: 'app.navigate → /availability' },
        { label: 'Navigate', chip: 'app.navigate → /event-types' },
        { label: 'Open guide', chip: 'knowledge.search' },
      ],
      assistantMessage:
        "Your weekly hours are set. Want me to create a 30-min intro call event next?",
    },
  },
  {
    id: 3,
    icon: BookOpen,
    label: 'Knows your docs',
    caption: 'Retrieves the most relevant docs on demand — keyword-scored.',
    conversation: {
      userMessage: 'How do I add a buffer between meetings?',
      steps: [{ label: 'Search knowledge', chip: 'knowledge.search' }],
      assistantMessage:
        'Go to Availability → Edit schedule → scroll to Event buffers. Set a before or after buffer for any event type. Changes apply to new bookings immediately.',
      sourceCard: { title: 'Availability → Buffers', relevance: 'score 0.92' },
    },
  },
];

// ─── Main component ────────────────────────────────────────────────────────────

export function ProductDemo() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <section id="product" className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">

        {/* ── Section header ── */}
        <div className="mx-auto max-w-2xl text-center">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-400">
            <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
            See it work
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            One ask. Navigate. Done.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-neutral-400">
            This is the widget your users get. Click a tab to see navigating,
            calling an API, running a flow, or answering from docs.
          </p>
        </div>

        {/* ── Tab bar ── */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'border border-white/15 bg-white/10 text-white shadow-sm'
                    : 'border border-transparent text-neutral-400 hover:bg-white/[0.05] hover:text-white',
                )}
              >
                <Icon
                  className={cn('h-4 w-4', isActive ? 'text-emerald-400' : 'text-neutral-500')}
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Viewport panel ── */}
        <div className="relative mt-6">
          {/* Emerald glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-8 mx-auto h-32 w-2/3 rounded-full bg-emerald-600/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-24 w-1/2 rounded-full bg-teal-600/15 blur-3xl"
          />

          {/* Outer panel */}
          <div className="card-sheen relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-elevated">
            {/* Tab content — keyed on activeTab so animate-fade-in-up replays */}
            <div key={activeTab} className="animate-fade-in-up">
              <TabViewport conv={TABS[activeTab].conversation} />
            </div>

            {/* Caption bar */}
            <div className="flex items-center gap-2 border-t border-white/[0.06] bg-white/[0.015] px-5 py-3">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)]" />
              <p className="text-[11px] text-neutral-500">{TABS[activeTab].caption}</p>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="bg-white font-medium text-neutral-900 hover:bg-white/90">
            <a href="/book-a-demo" className="inline-flex items-center gap-2">
              Book a demo
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
}
