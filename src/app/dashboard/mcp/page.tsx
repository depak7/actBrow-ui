'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mcpServersApi } from '@/lib/api';
import type { McpServer } from '@/types';
import { areAssistantsResolved, getActiveAssistantId } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react';

export default function McpPage() {
  const { toast } = useToast();
  const [assistantId, setAssistantId] = useState<string | null>(null);
  // False until the header selector has fetched the assistant list at least once.
  const [resolved, setResolved] = useState(false);
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', serverUrl: '', authHeader: '' });

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

  const load = useCallback(async () => {
    const id = getActiveAssistantId();
    if (!id) {
      setServers([]);
      return;
    }
    setServers(await mcpServersApi.list(id));
  }, []);

  useEffect(() => {
    // Wait for the header selector to report the list settled; null alone cannot tell
    // "still loading" apart from "this account has no assistants".
    if (!resolved) return;
    if (!assistantId) {
      setServers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    load()
      .catch(() => toast({ title: 'Error', description: 'Failed to load MCP servers', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [assistantId, resolved, load, toast]);

  const createServer = async () => {
    if (!assistantId || !form.name.trim() || !form.serverUrl.trim()) {
      toast({ title: 'Name and server URL required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const authHeaders: Record<string, string> = {};
      if (form.authHeader.trim()) {
        authHeaders.Authorization = form.authHeader.trim();
      }
      await mcpServersApi.create(assistantId, {
        name: form.name.trim(),
        serverUrl: form.serverUrl.trim(),
        authHeaders,
        enabled: true,
      });
      setForm({ name: '', serverUrl: '', authHeader: '' });
      toast({ title: 'MCP server added' });
      await load();
    } catch (error: unknown) {
      const msg =
        typeof error === 'object' && error && 'response' in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message || 'Failed to add server'
          : 'Failed to add server';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const syncServer = async (serverId: string) => {
    if (!assistantId) return;
    setSyncingId(serverId);
    try {
      const result = await mcpServersApi.sync(assistantId, serverId);
      toast({
        title: 'Tools synced',
        description: `${result.created} created, ${result.updated} updated, ${result.removed} removed`,
      });
      await load();
    } catch (error: unknown) {
      const msg =
        typeof error === 'object' && error && 'response' in error
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as any).response?.data?.message || 'Sync failed'
          : 'Sync failed';
      toast({ title: 'Sync failed', description: String(msg), variant: 'destructive' });
    } finally {
      setSyncingId(null);
    }
  };

  const deleteServer = async (server: McpServer) => {
    if (!assistantId || !confirm(`Delete MCP server "${server.name}" and its tools?`)) return;
    try {
      await mcpServersApi.delete(assistantId, server.id);
      toast({ title: 'Deleted' });
      await load();
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-white">MCP servers</h2>
        <p className="mt-1 text-neutral-400">
          Connect an HTTP MCP server, sync its tools, and let the agent call them.
        </p>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Add MCP server</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Name (e.g. Linear)"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="border-white/10 bg-white/5 text-white"
          />
          <Input
            placeholder="Server URL (JSON-RPC HTTP endpoint)"
            value={form.serverUrl}
            onChange={(e) => setForm((f) => ({ ...f, serverUrl: e.target.value }))}
            className="border-white/10 bg-white/5 text-white"
          />
          <Input
            placeholder="Optional Authorization header value"
            value={form.authHeader}
            onChange={(e) => setForm((f) => ({ ...f, authHeader: e.target.value }))}
            className="border-white/10 bg-white/5 text-white md:col-span-2"
          />
          <Button
            className="bg-white text-neutral-900 hover:bg-white/90 md:col-span-2 sm:w-fit"
            disabled={!assistantId || saving}
            onClick={() => void createServer()}
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add server
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : servers.length === 0 ? (
        <p className="text-neutral-500">No MCP servers connected yet.</p>
      ) : (
        <div className="space-y-3">
          {servers.map((server) => (
            <Card key={server.id} className="border-white/10 bg-white/5">
              <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-white">{server.name}</p>
                  <p className="mt-1 truncate font-mono text-xs text-neutral-400">{server.serverUrl}</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    {server.toolKeys.length} tools
                    {server.authHeaders && (server.authHeaders as { configured?: boolean }).configured
                      ? ` · auth: ${((server.authHeaders as { headerNames?: string[] }).headerNames || []).join(', ') || 'configured'}`
                      : ' · no auth headers'}
                    {server.lastSyncedAt
                      ? ` · last sync ${new Date(server.lastSyncedAt).toLocaleString()}`
                      : ' · not synced'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="border-white/15 text-white hover:bg-white/5"
                    disabled={syncingId === server.id}
                    onClick={() => void syncServer(server.id)}
                  >
                    {syncingId === server.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Sync tools
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/15 text-white hover:bg-white/5"
                    onClick={() => void deleteServer(server)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
