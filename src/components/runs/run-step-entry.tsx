'use client';

import { useState } from 'react';
import {
  Brain,
  CheckCheck,
  ChevronDown,
  CornerDownRight,
  MessageSquare,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { RunStep, RunStepType } from '@/types';
import { cn } from '@/lib/utils';
import { formatAbsoluteTime, humanizeStepType, prettyPayload } from './run-format';

interface StepTypeStyle {
  icon: LucideIcon;
  dot: string;
  label: string;
}

const STEP_TYPE_STYLES: Record<RunStepType, StepTypeStyle> = {
  MODEL_DECISION: {
    icon: Brain,
    dot: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
    label: 'text-sky-300',
  },
  TOOL_CALL: {
    icon: Wrench,
    dot: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
    label: 'text-violet-300',
  },
  TOOL_RESULT: {
    icon: CornerDownRight,
    dot: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    label: 'text-amber-300',
  },
  VERIFIER_DECISION: {
    icon: CheckCheck,
    dot: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    label: 'text-emerald-300',
  },
  POLICY_DECISION: {
    icon: ShieldCheck,
    dot: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    label: 'text-rose-300',
  },
  FINAL_RESPONSE: {
    icon: MessageSquare,
    dot: 'border-white/25 bg-white/10 text-neutral-100',
    label: 'text-neutral-100',
  },
};

const FALLBACK_STYLE: StepTypeStyle = {
  icon: MessageSquare,
  dot: 'border-white/20 bg-white/5 text-neutral-300',
  label: 'text-neutral-300',
};

export function RunStepEntry({ step }: { step: RunStep }) {
  const [expanded, setExpanded] = useState(false);
  const style = STEP_TYPE_STYLES[step.type] ?? FALLBACK_STYLE;
  const Icon = style.icon;
  const payload = prettyPayload(step.payload);
  const hasPayload = payload.length > 0;

  return (
    <li className="relative pl-9">
      <span
        className={cn(
          'absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border',
          style.dot
        )}
        aria-hidden
      >
        <Icon className="h-3.5 w-3.5" />
      </span>

      <div className="rounded-lg border border-white/10 bg-black/20">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          disabled={!hasPayload}
          aria-expanded={hasPayload ? expanded : undefined}
          className={cn(
            'flex w-full items-center justify-between gap-3 px-3 py-2 text-left',
            hasPayload && 'transition-colors hover:bg-white/5'
          )}
        >
          <span className="flex min-w-0 flex-col">
            <span className={cn('text-xs font-semibold uppercase tracking-wide', style.label)}>
              {humanizeStepType(step.type)}
            </span>
            <span className="text-[11px] text-neutral-500">{formatAbsoluteTime(step.createdAt)}</span>
          </span>
          {hasPayload ? (
            <span className="flex shrink-0 items-center gap-1 text-[11px] text-neutral-500">
              {expanded ? 'Hide' : 'Show'} payload
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} />
            </span>
          ) : (
            <span className="shrink-0 text-[11px] text-neutral-600">No payload</span>
          )}
        </button>

        {hasPayload && expanded ? (
          <pre className="max-h-96 overflow-x-auto overflow-y-auto border-t border-white/10 px-3 py-2 text-xs leading-5 text-neutral-300">
            {payload}
          </pre>
        ) : null}
      </div>
    </li>
  );
}
