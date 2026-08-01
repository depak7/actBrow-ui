'use client';

import { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { RunInspection, RunStep } from '@/types';
import { RunStatusBadge } from './run-status-badge';
import { RunStepEntry } from './run-step-entry';
import { RunTraceSummary } from './run-trace-summary';
import { formatAbsoluteTime, formatDuration } from './run-format';

const STEP_TYPE_ORDER = [
  'MODEL_DECISION',
  'TOOL_CALL',
  'TOOL_RESULT',
  'VERIFIER_DECISION',
  'POLICY_DECISION',
  'FINAL_RESPONSE',
];

function groupByStepIndex(steps: RunStep[]): Array<{ stepIndex: number; steps: RunStep[] }> {
  const buckets = new Map<number, RunStep[]>();
  steps.forEach((step) => {
    const bucket = buckets.get(step.stepIndex);
    if (bucket) {
      bucket.push(step);
    } else {
      buckets.set(step.stepIndex, [step]);
    }
  });

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([stepIndex, bucketSteps]) => ({
      stepIndex,
      steps: [...bucketSteps].sort((a, b) => {
        const typeDelta = STEP_TYPE_ORDER.indexOf(a.type) - STEP_TYPE_ORDER.indexOf(b.type);
        if (typeDelta !== 0) return typeDelta;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }),
    }));
}

export function RunTimelineSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-20 animate-pulse rounded-xl border border-white/10 bg-white/5" />
      {[0, 1, 2].map((index) => (
        <div key={index} className="space-y-2 pl-9">
          <div className="h-12 animate-pulse rounded-lg border border-white/10 bg-black/20" />
          <div className="h-12 animate-pulse rounded-lg border border-white/10 bg-black/20" />
        </div>
      ))}
    </div>
  );
}

export function RunTimeline({ inspection }: { inspection: RunInspection }) {
  const groups = useMemo(() => groupByStepIndex(inspection.steps), [inspection.steps]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <RunStatusBadge status={inspection.status} />
        <span className="text-xs text-neutral-400">
          {inspection.stepCount} {inspection.stepCount === 1 ? 'step' : 'steps'}
        </span>
        <span className="text-xs text-neutral-400">{formatDuration(inspection.durationMs)}</span>
        <span className="text-xs text-neutral-500">started {formatAbsoluteTime(inspection.createdAt)}</span>
        <span className="font-mono text-[11px] text-neutral-600">{inspection.runId}</span>
      </div>

      {inspection.lastError ? (
        <p className="flex items-start gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs text-rose-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="break-words">{inspection.lastError}</span>
        </p>
      ) : null}

      <RunTraceSummary trace={inspection.trace} />

      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-neutral-500">
          This run has not recorded any steps.
        </div>
      ) : (
        <ol className="space-y-5">
          {groups.map((group) => (
            <li key={group.stepIndex}>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-neutral-300">
                  Step {group.stepIndex}
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <ol className="relative space-y-2 before:absolute before:bottom-2 before:left-3 before:top-2 before:w-px before:bg-white/10">
                {group.steps.map((step) => (
                  <RunStepEntry key={step.id} step={step} />
                ))}
              </ol>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
