'use client';

import { FileClock } from 'lucide-react';
import type { RunTrace } from '@/types';
import { formatDuration } from './run-format';

function TraceField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-neutral-100">{value}</dd>
    </div>
  );
}

function orDash(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
}

export function RunTraceSummary({ trace }: { trace: RunTrace | null }) {
  if (!trace) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-white/10 px-4 py-3 text-xs text-neutral-500">
        <FileClock className="h-4 w-4 shrink-0" />
        The trace is written when the run finishes.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
        <FileClock className="h-4 w-4" />
        Trace summary
      </div>
      <dl className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        <TraceField label="Final outcome" value={orDash(trace.finalOutcome)} />
        <TraceField
          label="Latency"
          value={trace.latencyMs === null ? '—' : formatDuration(trace.latencyMs)}
        />
        <TraceField label="Execution attempts" value={orDash(trace.executionAttempts)} />
        <TraceField label="Tool calls" value={orDash(trace.toolCallCount)} />
        <TraceField label="Prompt version" value={orDash(trace.promptVersion)} />
        <TraceField label="Toolset version" value={orDash(trace.toolsetVersion)} />
      </dl>
    </div>
  );
}
