import type { RunStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<RunStatus, string> = {
  COMPLETED: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  FAILED: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  CANCELLED: 'border-neutral-500/30 bg-neutral-500/10 text-neutral-300',
  IN_PROGRESS: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  WAITING_FOR_CLIENT_TOOL: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  PENDING: 'border-neutral-500/30 bg-neutral-500/10 text-neutral-300',
};

const STATUS_LABELS: Record<RunStatus, string> = {
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
  IN_PROGRESS: 'In progress',
  WAITING_FOR_CLIENT_TOOL: 'Waiting on client tool',
  PENDING: 'Pending',
};

export function RunStatusBadge({ status, className }: { status: RunStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4',
        STATUS_STYLES[status] ?? STATUS_STYLES.PENDING,
        className
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
