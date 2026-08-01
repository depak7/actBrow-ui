'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import posthog from 'posthog-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { assistantsApi, connectApi } from '@/lib/api';
import type { Assistant, AssistantConnect } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, PlugZap, Plus } from 'lucide-react';
import { CodePanel } from '@/components/code-panel';
import { AssistantTester } from '@/components/connect/assistant-tester';
import { getActiveAssistantId, readStoredUserId, setActiveAssistant } from '@/lib/session';
import Link from 'next/link';

export default function ConnectPage() {
  const { toast } = useToast();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantId, setAssistantId] = useState('');
  const [connect, setConnect] = useState<AssistantConnect | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Mirror assistants into a ref so loadConnect need not depend on it (avoids effect churn /
  // duplicate fetches + analytics events every time the assistants list settles).
  const assistantsRef = useRef<Assistant[]>([]);
  useEffect(() => {
    assistantsRef.current = assistants;
  }, [assistants]);

  const loadAssistants = useCallback(async () => {
    const userId = readStoredUserId();
    if (!userId) {
      throw new Error('Missing user');
    }
    const data = await assistantsApi.list(userId);
    setAssistants(data);
    if (!assistantId && data.length > 0) {
      const stored = getActiveAssistantId();
      const next = (stored && data.some((a) => a.id === stored) && stored) || data[0].id;
      const assistant = data.find((a) => a.id === next) || data[0];
      setAssistantId(next);
      setActiveAssistant(assistant);
    } else if (data.length === 0) {
      // No assistants yet — nothing to connect, so stop the spinner.
      setLoading(false);
    }
  }, [assistantId]);

  const loadConnect = useCallback(async (currentAssistantId: string) => {
    if (!currentAssistantId) {
      setConnect(null);
      setLoading(false);
      return;
    }
    setRefreshing(true);
    try {
      const assistant = assistantsRef.current.find((a) => a.id === currentAssistantId);
      if (assistant) setActiveAssistant(assistant);
      const connectData = await connectApi.get(currentAssistantId);
      setConnect(connectData);
      posthog.capture('connect_setup_viewed', {
        assistant_id: currentAssistantId,
        has_synced: !!connectData.lastSyncedAt,
      });
    } catch {
      toast({ title: 'Error', description: 'Failed to load connect setup', variant: 'destructive' });
      setConnect(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAssistants().catch(() => {
      toast({ title: 'Error', description: 'Failed to load assistants', variant: 'destructive' });
      setLoading(false);
    });
  }, [loadAssistants, toast]);

  useEffect(() => {
    // Call unconditionally: loadConnect('') clears the stale card and resolves loading when the
    // user picks the empty "Select assistant…" option.
    loadConnect(assistantId);
  }, [assistantId, loadConnect]);

  const syncSummaryText = connect?.lastSyncSummary
    ? JSON.stringify(connect.lastSyncSummary, null, 2)
    : 'No sync yet — paste the setup prompt in Claude Code or Codex in your app repo.';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-white">Connect</h2>
        <p className="mt-1 text-neutral-400">
          Copy the setup prompt into Claude Code or Codex. Your coding agent analyzes the repo and pushes tools, routes, and knowledge live via the sync API.
        </p>
      </div>

      {!loading && assistants.length > 0 && (
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <select
              value={assistantId}
              onChange={(e) => setAssistantId(e.target.value)}
              className="flex h-10 w-full max-w-md rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
            >
              <option value="">Select assistant…</option>
              {assistants.map((assistant) => (
                <option key={assistant.id} value={assistant.id}>
                  {assistant.name}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              className="border-white/10 text-neutral-200"
              disabled={!assistantId || refreshing}
              onClick={() => loadConnect(assistantId)}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh status
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="py-12 text-center text-neutral-500">Loading…</CardContent>
        </Card>
      ) : assistants.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <PlugZap className="h-10 w-10 text-neutral-600" />
            <div>
              <p className="text-lg font-medium text-white">No assistants yet</p>
              <p className="mt-1 text-sm text-neutral-400">
                Create your first assistant to get a setup prompt and connect your app.
              </p>
            </div>
            <Button asChild className="bg-white text-neutral-900 hover:bg-white/90">
              <Link href="/dashboard/assistants">
                <Plus className="mr-2 h-4 w-4" />
                Create assistant
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : !assistantId || !connect ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="py-12 text-center text-neutral-500">
            Select an assistant to get the setup prompt.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <PlugZap className="h-5 w-5 text-emerald-400" />
                Setup prompt — paste in your coding agent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-neutral-300">
                Open your app repository in Claude Code, Codex, or Cursor. Paste this entire prompt. The agent will scan routes, APIs, and docs, then push configuration to Actbrow.
              </p>
              <CodePanel
                code={connect.setupPrompt}
                filename="actbrow-setup.md"
                language="text"
                maxHeight="max-h-[460px]"
                copyLabel="Copy prompt"
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Sync status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-neutral-300">
                <p>
                  Last synced:{' '}
                  <span className="text-white">
                    {connect.lastSyncedAt ? new Date(connect.lastSyncedAt).toLocaleString() : 'Not yet'}
                  </span>
                </p>
                <CodePanel
                  code={syncSummaryText}
                  filename="sync-status.json"
                  language="json"
                  maxHeight="max-h-56"
                  copyLabel="Copy status"
                />
                <p className="text-neutral-500">
                  Review pushed config under Navigation, Tools, Flows, and Knowledge in this dashboard.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Embed snippet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {connect.embedSnippet ? (
                  <CodePanel
                    code={connect.embedSnippet}
                    filename="embed.html"
                    language="html"
                    maxHeight="max-h-72"
                    copyLabel="Copy embed snippet"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">
                    Widget key is created when you open Connect — copy the snippet below once available,
                    or refresh status.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Sits right after the embed snippet: the moment setup is done is the moment you
                want to confirm the assistant actually answers. */}
            <AssistantTester assistantId={assistantId} />
          </div>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Magic link / deep-link prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-neutral-300">
                Append query params on any page where the widget is embedded to open chat with a
                prefilled ask. Use <code className="text-neutral-100">actbrow_send=1</code> to send
                automatically.
              </p>
              <CodePanel
                code={`https://your-app.example.com/settings?actbrow_open=1&actbrow_prompt=${encodeURIComponent('Help me set up SSO')}&actbrow_send=1`}
                filename="magic-link.txt"
                language="text"
                maxHeight="max-h-28"
                copyLabel="Copy example"
              />
              <p className="text-xs text-neutral-500">
                Also available in JS: <code className="text-neutral-300">ActbrowWidget.ask(&quot;…&quot;, &#123; send: true &#125;)</code>
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
