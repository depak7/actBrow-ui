'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { assistantsApi, insightsApi } from '@/lib/api';
import type { Assistant, Insights } from '@/types';
import { getActiveAssistantId, readStoredUserId, setActiveAssistant } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';

export default function InsightsPage() {
  const { toast } = useToast();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantId, setAssistantId] = useState('');
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const userId = readStoredUserId();
    if (!userId) throw new Error('Missing user');
    const list = await assistantsApi.list(userId);
    setAssistants(list);
    const stored = getActiveAssistantId();
    const selected =
      (assistantId && list.some((a) => a.id === assistantId) && assistantId) ||
      (stored && list.some((a) => a.id === stored) && stored) ||
      list[0]?.id ||
      '';
    if (selected !== assistantId) setAssistantId(selected);
    if (!selected) {
      setInsights(null);
      return;
    }
    const assistant = list.find((a) => a.id === selected);
    if (assistant) setActiveAssistant(assistant);
    setInsights(await insightsApi.get(selected));
  }, [assistantId]);

  useEffect(() => {
    setLoading(true);
    load()
      .catch(() => toast({ title: 'Error', description: 'Failed to load insights', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [load, toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">Insights</h2>
          <p className="mt-1 text-neutral-400">Runs, common asks, and tool failures for one assistant.</p>
        </div>
        <Button
          variant="outline"
          className="border-white/10 text-white gap-2"
          disabled={!assistantId || loading}
          onClick={() => void load()}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {assistants.length > 0 ? (
        <select
          value={assistantId}
          onChange={(e) => setAssistantId(e.target.value)}
          className="flex h-10 w-full max-w-md rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
        >
          {assistants.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      ) : null}

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : !insights ? (
        <p className="text-neutral-500">Create an assistant to see insights.</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Conversations', value: insights.conversationCount },
              { label: 'Runs', value: insights.runCount },
              { label: 'Success rate', value: `${insights.successRate}%` },
              { label: 'Failed runs', value: insights.failedRuns },
            ].map((stat) => (
              <Card key={stat.label} className="border-white/10 bg-white/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-400">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {insights.completedRuns} completed · {insights.inProgressRuns} in progress
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Top asks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {insights.topIntents.length === 0 ? (
                  <p className="text-sm text-neutral-500">No user messages yet.</p>
                ) : (
                  insights.topIntents.map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                    >
                      <p className="truncate text-sm text-neutral-200">{item.text}</p>
                      <span className="shrink-0 text-xs text-neutral-500">{item.count}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Failed tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {insights.failedTools.length === 0 ? (
                  <p className="text-sm text-neutral-500">No tool failures recorded.</p>
                ) : (
                  insights.failedTools.map((item) => (
                    <div
                      key={item.toolKey}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                    >
                      <p className="truncate font-mono text-sm text-neutral-200">{item.toolKey}</p>
                      <span className="shrink-0 text-xs text-neutral-500">{item.count}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Recent failures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {insights.recentFailures.length === 0 ? (
                <p className="text-sm text-neutral-500">No failed runs.</p>
              ) : (
                insights.recentFailures.map((item) => (
                  <div key={item.runId} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <code className="text-xs text-neutral-400">{item.runId.slice(0, 8)}</code>
                      <span className="text-xs text-neutral-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-200">{item.error}</p>
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
