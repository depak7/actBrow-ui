'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { assistantsApi, connectApi } from '@/lib/api';
import type { Assistant, AssistantConnect } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, RefreshCw, PlugZap } from 'lucide-react';
import { readStoredUserId, setActiveAssistant } from '@/lib/session';

export default function ConnectPage() {
  const { toast } = useToast();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantId, setAssistantId] = useState('');
  const [connect, setConnect] = useState<AssistantConnect | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const loadAssistants = useCallback(async () => {
    const userId = readStoredUserId();
    if (!userId) {
      throw new Error('Missing user');
    }
    const data = await assistantsApi.list(userId);
    setAssistants(data);
    if (!assistantId && data.length > 0) {
      setAssistantId(data[0].id);
      setActiveAssistant(data[0]);
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
      const assistant = assistants.find((a) => a.id === currentAssistantId);
      if (assistant) setActiveAssistant(assistant);
      setConnect(await connectApi.get(currentAssistantId));
    } catch {
      toast({ title: 'Error', description: 'Failed to load connect setup', variant: 'destructive' });
      setConnect(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [assistants, toast]);

  useEffect(() => {
    loadAssistants().catch(() => {
      toast({ title: 'Error', description: 'Failed to load assistants', variant: 'destructive' });
      setLoading(false);
    });
  }, [loadAssistants, toast]);

  useEffect(() => {
    if (assistantId) {
      loadConnect(assistantId);
    }
  }, [assistantId, loadConnect]);

  const copyText = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(label);
    toast({ title: 'Copied', description: label });
    setTimeout(() => setCopiedField(null), 2000);
  };

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

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : !assistantId || !connect ? (
        <p className="text-neutral-500">Select an assistant to get the setup prompt.</p>
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
              <div className="relative">
                <pre className="max-h-[420px] overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-neutral-200 whitespace-pre-wrap">
                  {connect.setupPrompt}
                </pre>
                <Button
                  size="sm"
                  className="absolute right-3 top-3 bg-white text-neutral-900 hover:bg-white/90"
                  onClick={() => copyText('Setup prompt', connect.setupPrompt)}
                >
                  {copiedField === 'Setup prompt' ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  Copy prompt
                </Button>
              </div>
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
                <pre className="overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-neutral-400">
                  {syncSummaryText}
                </pre>
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
                  <>
                    <pre className="max-h-64 overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-neutral-300 whitespace-pre-wrap">
                      {connect.embedSnippet}
                    </pre>
                    <Button
                      variant="outline"
                      className="border-white/10 text-neutral-200"
                      onClick={() => copyText('Embed snippet', connect.embedSnippet || '')}
                    >
                      {copiedField === 'Embed snippet' ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      Copy embed snippet
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-neutral-500">Available after the first successful sync.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
