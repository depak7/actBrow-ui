import type { RunStatus, RunStepType } from '@/types';

/** Compact relative time, e.g. "just now", "4m ago", "3d ago". */
export function formatRelativeTime(value?: string | null): string {
  if (!value) return 'unknown time';
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return 'unknown time';

  const diffSeconds = Math.round((Date.now() - then) / 1000);
  const absolute = Math.abs(diffSeconds);

  if (absolute < 45) return 'just now';
  if (absolute < 3600) return `${Math.round(absolute / 60)}m ago`;
  if (absolute < 86400) return `${Math.round(absolute / 3600)}h ago`;
  if (absolute < 2592000) return `${Math.round(absolute / 86400)}d ago`;

  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value));
}

export function formatAbsoluteTime(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

/** Durations arrive in milliseconds and are null while a run is still active. */
export function formatDuration(ms?: number | null): string {
  if (ms === null || ms === undefined) return 'running';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export function isTerminalStatus(status: RunStatus): boolean {
  return status === 'COMPLETED' || status === 'FAILED' || status === 'CANCELLED';
}

export function humanizeStepType(type: RunStepType): string {
  return type
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Payloads are stored as opaque strings. Pretty-print them when they happen to be
 * JSON so the timeline is readable; otherwise fall through to the raw text.
 */
export function prettyPayload(payload: string): string {
  const trimmed = (payload ?? '').trim();
  if (!trimmed) return '';
  const first = trimmed[0];
  if (first !== '{' && first !== '[') return trimmed;
  try {
    return JSON.stringify(JSON.parse(trimmed), null, 2);
  } catch {
    return trimmed;
  }
}
