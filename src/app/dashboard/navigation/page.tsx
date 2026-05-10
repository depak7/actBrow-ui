'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { assistantsApi, assistantToolsApi, toolsApi } from '@/lib/api';
import type { Assistant, Tool } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { readStoredUserId, setActiveAssistant } from '@/lib/session';

const emptyState = () => ({
  displayName: '',
  description: '',
  path: '/',
  enabled: true,
});

export default function NavigationPage() {
  const { toast } = useToast();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [pageAssistantId, setPageAssistantId] = useState('');
  const [assistantsLoading, setAssistantsLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  const [toolsLoading, setToolsLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyState);

  useEffect(() => {
    const load = async () => {
      try {
        const userId = readStoredUserId();
        if (!userId) throw new Error('Missing user');
        const list = await assistantsApi.list(userId);
        setAssistants(list);
        if (list.length > 0) {
          setActiveAssistant(list[0]);
          setPageAssistantId((cur) => cur || list[0].id);
        }
      } catch {
        toast({ title: 'Error', description: 'Failed to load assistants', variant: 'destructive' });
      } finally {
        setAssistantsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!pageAssistantId) {
      setTools([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setToolsLoading(true);
      try {
        const assistant = assistants.find((a) => a.id === pageAssistantId);
        if (assistant) setActiveAssistant(assistant);
        const data = await assistantToolsApi.list(pageAssistantId);
        if (!cancelled) setTools(data.filter((t) => t.type === 'CLIENT' && t.executorRef === 'app.navigate'));
      } catch {
        if (!cancelled) {
          toast({ title: 'Error', description: 'Failed to load navigation tools', variant: 'destructive' });
          setTools([]);
        }
      } finally {
        if (!cancelled) setToolsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [pageAssistantId]);

  const refresh = async () => {
    if (!pageAssistantId) return;
    const data = await assistantToolsApi.list(pageAssistantId);
    setTools(data.filter((t) => t.type === 'CLIENT' && t.executorRef === 'app.navigate'));
  };

  const handleCreate = async () => {
    if (!pageAssistantId) {
      toast({ title: 'Choose an assistant', variant: 'destructive' });
      return;
    }
    if (!form.displayName.trim()) {
      toast({ title: 'Name required', description: 'Enter a label like Open Orders.', variant: 'destructive' });
      return;
    }
    const path = form.path.trim() || '/';
    const description = form.description.trim()
      || `Use this when the user wants to open ${form.displayName.trim() || path}.`;
    try {
      await toolsApi.createAndAttach({
        assistantId: pageAssistantId,
        displayName: form.displayName.trim(),
        description,
        type: 'CLIENT',
        version: '1',
        enabled: form.enabled,
        executorRef: 'app.navigate',
        inputSchema: {
          type: 'object',
          properties: {
            path: { type: 'string' },
            url: { type: 'string' },
          },
        },
        outputSchema: null,
        defaultArguments: { path },
        metadata: null,
      });
      toast({ title: 'Created', description: `${form.displayName.trim()} attached` });
      setCreateOpen(false);
      setForm(emptyState());
      await refresh();
    } catch (error: unknown) {
      const msg =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast({ title: 'Error', description: msg || 'Failed to create navigation tool', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This removes the tool from the catalog and all assistants.`)) return;
    try {
      await toolsApi.delete(id);
      toast({ title: 'Deleted', description: name });
      await refresh();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete tool', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">Navigation</h2>
          <p className="text-neutral-400">
            Routes the assistant is allowed to take the user to. Each tool is one destination — name it after what the user asks for, point it at a path in your app.
          </p>
          <div className="mt-3 max-w-md">
            <Label className="text-neutral-400 text-xs">Assistant</Label>
            <select
              value={pageAssistantId}
              onChange={(e) => setPageAssistantId(e.target.value)}
              disabled={assistantsLoading}
              className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white disabled:opacity-50"
            >
              <option value="">Select an assistant…</option>
              {assistants.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            type="button"
            disabled={!pageAssistantId}
            className="bg-white text-neutral-900 hover:bg-white/90 disabled:opacity-50"
            onClick={() => {
              setForm(emptyState());
              setCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add navigation
          </Button>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-white/10 bg-neutral-900">
          <DialogHeader>
            <DialogTitle className="text-white">Add navigation</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Bind a name the assistant can call to a fixed route in your app.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label className="text-white">Name</Label>
              <Input
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="border-white/10 bg-white/5 text-white"
                placeholder="Open Orders"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-white">Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border-white/10 bg-white/5 text-white"
                placeholder="Use this when the user asks to open the orders page."
              />
              <p className="text-xs text-neutral-500">
                Helps the assistant pick this tool for the right request.
              </p>
            </div>
            <div className="grid gap-2">
              <Label className="text-white">Path</Label>
              <Input
                value={form.path}
                onChange={(e) => setForm({ ...form, path: e.target.value })}
                className="border-white/10 bg-white/5 text-white font-mono text-sm"
                placeholder="/orders"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="nav-enabled"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="nav-enabled" className="text-white">Enabled</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
              className="border-white/10 text-neutral-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              className="bg-white text-neutral-900 hover:bg-white/90"
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">
            {pageAssistantId
              ? `Navigation · ${assistants.find((a) => a.id === pageAssistantId)?.name ?? 'Assistant'}`
              : 'Navigation'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-neutral-400">Name</TableHead>
                <TableHead className="text-neutral-400">Path</TableHead>
                <TableHead className="text-neutral-400">Description</TableHead>
                <TableHead className="text-neutral-400">Enabled</TableHead>
                <TableHead className="text-right text-neutral-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!pageAssistantId ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                    Select an assistant above to view its navigation tools.
                  </TableCell>
                </TableRow>
              ) : toolsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-neutral-500">Loading…</TableCell>
                </TableRow>
              ) : tools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                    No navigation tools yet. Use “Add navigation” to define one.
                  </TableCell>
                </TableRow>
              ) : (
                tools.map((tool) => {
                  const path = (tool.defaultArguments as { path?: string } | null)?.path
                    ?? (tool.defaultArguments as { url?: string } | null)?.url
                    ?? '—';
                  return (
                    <TableRow key={tool.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-neutral-300">{tool.displayName}</TableCell>
                      <TableCell className="text-sm font-mono text-neutral-400">{path}</TableCell>
                      <TableCell className="max-w-md truncate text-sm text-neutral-500">{tool.description}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tool.enabled
                              ? 'bg-white/20 text-white border border-white/30'
                              : 'bg-white/5 text-neutral-500 border border-white/10'
                          }`}
                        >
                          {tool.enabled ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(tool.id, tool.displayName)}
                          aria-label={`Delete ${tool.displayName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
