'use client';

import { AlertTriangle, Layers, Timer, Wrench } from 'lucide-react';
import type { RunSummary } from '@/types';
import { cn } from '@/lib/utils';
import { RunStatusBadge } from './run-status-badge';
import { formatDuration, formatRelativeTime } from './run-format';

interface RunListProps {
  runs: RunSummary[];
  selectedRunId: string | null;
  onSelect: (runId: string) => void;
  loading: boolean;
}

function RunListSkeleton() {
  return (
    <div className="space-y-2" aria-hidden>
      {[0, 1, 2].map((index) => (
        <div key={index} className="animate-pulse rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="h-3 w-16 rounded bg-white/10" />
          </div>
          <div className="mt-3 h-3 w-2/3 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export function RunList({ runs, selectedRunId, onSelect, loading }: RunListProps) {
  if (loading) {
    return <RunListSkeleton />;
  }

  if (runs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-neutral-500">
        No runs for this conversation yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {runs.map((run) => {
        const isSelected = run.id === selectedRunId;
        return (
          <button
            key={run.id}
            type="button"
            onClick={() => onSelect(run.id)}
            aria-pressed={isSelected}
            className={cn(
              'w-full rounded-lg border px-3 py-3 text-left transition-colors',
              isSelected ? 'border-white/30 bg-white/15' : 'border-white/10 bg-black/20 hover:bg-white/10'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <RunStatusBadge status={run.status} />
              <span className="text-xs text-neutral-500">{formatRelativeTime(run.createdAt)}</span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                {run.stepCount} {run.stepCount === 1 ? 'step' : 'steps'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Wrench className="h-3.5 w-3.5" />
                {run.toolCallCount} {run.toolCallCount === 1 ? 'tool call' : 'tool calls'}
                {run.failedToolCount > 0 ? (
                  <span className="text-rose-300">({run.failedToolCount} failed)</span>
                ) : null}
              </span>
              <span className="inline-flex items-center gap-1">
                <Timer className="h-3.5 w-3.5" />
                {formatDuration(run.durationMs)}
              </span>
            </div>

            <p className="mt-2 font-mono text-[11px] text-neutral-500">{run.id}</p>

            {run.lastError ? (
              <p className="mt-2 flex items-start gap-1.5 rounded-md border border-rose-500/20 bg-rose-500/5 px-2 py-1.5 text-xs text-rose-300">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-3 break-words">{run.lastError}</span>
              </p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
