'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { insightsApi } from '@/lib/api';
import type { Insights } from '@/types';
import { areAssistantsResolved, getActiveAssistantId } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  RefreshCw,
  Timer,
  TrendingUp,
  Wrench,
  XCircle,
} from 'lucide-react';

const numberFormat = new Intl.NumberFormat();

function formatCount(value: number | undefined | null) {
  return numberFormat.format(Number.isFinite(value ?? NaN) ? Number(value) : 0);
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function StatCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  unit?: string;
  hint: string;
  icon: typeof MessageSquare;
  tone?: 'neutral' | 'positive' | 'negative';
}) {
  const valueTone =
    tone === 'positive' ? 'text-emerald-300' : tone === 'negative' ? 'text-rose-300' : 'text-white';
  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-neutral-400">{label}</CardTitle>
        <Icon className="h-4 w-4 shrink-0 text-neutral-500" />
      </CardHeader>
      <CardContent>
        <p className={`flex items-baseline gap-1 text-3xl font-semibold tabular-nums ${valueTone}`}>
          {value}
          {unit ? <span className="text-base font-normal text-neutral-500">{unit}</span> : null}
        </p>
        <p className="mt-1 text-xs text-neutral-500">{hint}</p>
      </CardContent>
    </Card>
  );
}

/** Ranked list row with a proportional bar so the shape of the distribution is readable. */
function RankedRow({
  rank,
  label,
  count,
  max,
  mono = false,
}: {
  rank: number;
  label: string;
  count: number;
  max: number;
  mono?: boolean;
}) {
  const width = max > 0 ? Math.max(4, Math.round((count / max) * 100)) : 0;
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="w-4 shrink-0 text-xs tabular-nums text-neutral-600">{rank}</span>
          <p className={`truncate text-sm text-neutral-200 ${mono ? 'font-mono' : ''}`} title={label}>
            {label}
          </p>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-neutral-400">
          {formatCount(count)}
          <span className="ml-1 text-neutral-600">{count === 1 ? 'time' : 'times'}</span>
        </span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full bg-white/25" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function InsightsSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="border-white/10 bg-white/5">
            <CardContent className="space-y-3 py-6">
              <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-8 w-20 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-32 animate-pulse rounded bg-white/5" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <Card key={i} className="border-white/10 bg-white/5">
            <CardContent className="space-y-3 py-6">
              <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
              {[0, 1, 2].map((row) => (
                <div key={row} className="h-10 animate-pulse rounded-lg bg-white/5" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const { toast } = useToast();
  const [assistantId, setAssistantId] = useState<string | null>(null);
  // False until the header selector has fetched the assistant list at least once.
  const [resolved, setResolved] = useState(false);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // The dashboard header owns assistant selection; mirror it instead of rendering a second picker.
  useEffect(() => {
    const sync = () => {
      setAssistantId(getActiveAssistantId());
      setResolved(areAssistantsResolved());
    };
    sync();
    window.addEventListener('actbrow-active-assistant-changed', sync);
    return () => window.removeEventListener('actbrow-active-assistant-changed', sync);
  }, []);

  const load = useCallback(async (id: string) => {
    setInsights(await insightsApi.get(id));
  }, []);

  useEffect(() => {
    // Wait for the header selector to report the list settled; null alone cannot tell
    // "still loading" apart from "this account has no assistants".
    if (!resolved) return;
    if (!assistantId) {
      setInsights(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    load(assistantId)
      .catch(() =>
        toast({ title: 'Error', description: 'Failed to load insights', variant: 'destructive' }),
      )
      .finally(() => setLoading(false));
  }, [assistantId, resolved, load, toast]);

  const refresh = async () => {
    if (!assistantId) return;
    setRefreshing(true);
    try {
      await load(assistantId);
    } catch {
      toast({ title: 'Error', description: 'Failed to refresh insights', variant: 'destructive' });
    } finally {
      setRefreshing(false);
    }
  };

  const topIntents = insights?.topIntents ?? [];
  const failedTools = insights?.failedTools ?? [];
  const recentFailures = insights?.recentFailures ?? [];
  const maxIntent = topIntents.reduce((m, i) => Math.max(m, i.count), 0);
  const maxTool = failedTools.reduce((m, i) => Math.max(m, i.count), 0);
  const hasActivity =
    !!insights && ((insights.runCount ?? 0) > 0 || (insights.conversationCount ?? 0) > 0);
  const successRate = Math.round(insights?.successRate ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">Insights</h2>
          <p className="mt-1 text-neutral-400">
            Runs, common asks, and tool failures for the active assistant.
          </p>
        </div>
        {/* TODO: add a time-range filter (last 24h / 7d / 30d) once the insights API accepts a range parameter. */}
        <Button
          variant="outline"
          className="gap-2 border-white/15 bg-transparent text-neutral-300 hover:bg-white/5 hover:text-white"
          disabled={!assistantId || loading || refreshing}
          onClick={() => void refresh()}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <InsightsSkeleton />
      ) : !assistantId || !insights ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <TrendingUp className="h-6 w-6 text-neutral-600" />
            <p className="text-neutral-300">No assistant selected</p>
            <p className="max-w-sm text-sm text-neutral-500">
              Create an assistant, then pick it in the header to see its conversations, runs, and tool
              failures.
            </p>
          </CardContent>
        </Card>
      ) : !hasActivity ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <MessageSquare className="h-6 w-6 text-neutral-600" />
            <p className="text-neutral-300">No activity yet</p>
            <p className="max-w-sm text-sm text-neutral-500">
              Once this assistant handles its first conversation, run volume, success rate, and common
              asks will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Conversations"
              value={formatCount(insights.conversationCount)}
              hint="Total threads started with this assistant"
              icon={MessageSquare}
            />
            <StatCard
              label="Runs"
              value={formatCount(insights.runCount)}
              hint={`${formatCount(insights.completedRuns)} completed · ${formatCount(
                insights.inProgressRuns,
              )} in progress`}
              icon={Timer}
            />
            <StatCard
              label="Success rate"
              value={String(successRate)}
              unit="%"
              hint={`${formatCount(insights.completedRuns)} of ${formatCount(
                insights.runCount,
              )} runs completed`}
              icon={CheckCircle2}
              tone={successRate >= 90 ? 'positive' : successRate < 60 ? 'negative' : 'neutral'}
            />
            <StatCard
              label="Failed runs"
              value={formatCount(insights.failedRuns)}
              hint={
                (insights.failedRuns ?? 0) === 0
                  ? 'No failures recorded'
                  : `${formatCount(failedTools.length)} distinct tool${
                      failedTools.length === 1 ? '' : 's'
                    } involved`
              }
              icon={XCircle}
              tone={(insights.failedRuns ?? 0) > 0 ? 'negative' : 'neutral'}
            />
          </div>

          {(insights.inProgressRuns ?? 0) > 0 ? (
            <p className="flex items-center gap-2 text-xs text-neutral-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {formatCount(insights.inProgressRuns)} run
              {insights.inProgressRuns === 1 ? ' is' : 's are'} still in progress — refresh for final
              numbers.
            </p>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base text-white">Top asks</CardTitle>
                <span className="text-xs text-neutral-500">
                  {topIntents.length} {topIntents.length === 1 ? 'phrase' : 'phrases'}
                </span>
              </CardHeader>
              <CardContent className="space-y-2">
                {topIntents.length === 0 ? (
                  <p className="py-4 text-sm text-neutral-500">
                    No user messages yet — asks show up once people start chatting.
                  </p>
                ) : (
                  topIntents.map((item, index) => (
                    <RankedRow
                      key={`${item.text}-${index}`}
                      rank={index + 1}
                      label={item.text}
                      count={item.count}
                      max={maxIntent}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base text-white">Failing tools</CardTitle>
                <Wrench className="h-4 w-4 text-neutral-500" />
              </CardHeader>
              <CardContent className="space-y-2">
                {failedTools.length === 0 ? (
                  <p className="py-4 text-sm text-neutral-500">No tool failures recorded.</p>
                ) : (
                  failedTools.map((item, index) => (
                    <RankedRow
                      key={`${item.toolKey}-${index}`}
                      rank={index + 1}
                      label={item.toolKey}
                      count={item.count}
                      max={maxTool}
                      mono
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/10 bg-white/5">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base text-white">Recent failures</CardTitle>
              <span className="text-xs text-neutral-500">
                {recentFailures.length} shown
              </span>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentFailures.length === 0 ? (
                <p className="py-4 text-sm text-neutral-500">
                  No failed runs — nothing to investigate.
                </p>
              ) : (
                recentFailures.map((item, index) => (
                  <div
                    key={item.runId || index}
                    className="rounded-lg border border-white/10 bg-black/20 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-400/80" />
                        <code className="truncate font-mono text-xs text-neutral-400" title={item.runId}>
                          {item.runId ? `run ${item.runId.slice(0, 8)}` : 'run —'}
                        </code>
                      </div>
                      <span className="shrink-0 text-xs text-neutral-500">
                        {item.createdAt ? formatTimestamp(item.createdAt) : 'unknown time'}
                      </span>
                    </div>
                    <p className="mt-1.5 break-words text-sm text-neutral-200">
                      {item.error?.trim() || 'No error message recorded.'}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
