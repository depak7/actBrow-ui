'use client';

import { useEffect, useMemo, useState } from 'react';
import posthog from 'posthog-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { assistantsApi, assistantToolsApi, toolsApi } from '@/lib/api';
import type { Assistant, Tool } from '@/types';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { getActiveAssistantId, readStoredUserId, setActiveAssistant } from '@/lib/session';
import { parseCurl, type ParsedCurl } from '@/lib/curl-parser';
import { buildSyntheticCurlFromTool } from '@/lib/curl-from-tool';

type FormState = {
  curl: string;
  parsed: ParsedCurl | null;
  parseError: string | null;
  displayName: string;
  description: string;
  paramKeys: Set<string>;
  execution: 'server' | 'browser';
  enabled: boolean;
};

const emptyForm = (): FormState => ({
  curl: '',
  parsed: null,
  parseError: null,
  displayName: '',
  description: '',
  paramKeys: new Set(),
  execution: 'server',
  enabled: true,
});

function buildHttpToolPayload(form: FormState, parsed: ParsedCurl) {
  const bodyObject = (parsed.body && typeof parsed.body === 'object' && !Array.isArray(parsed.body))
    ? (parsed.body as Record<string, unknown>)
    : {};

  const inputProps: Record<string, { type: string }> = {};
  const required: string[] = [];
  const defaults: Record<string, unknown> = {};
  for (const key of parsed.bodyKeys) {
    if (form.paramKeys.has(key)) {
      const sample = bodyObject[key];
      const t = sample === null ? 'string'
        : Array.isArray(sample) ? 'array'
        : typeof sample === 'number' ? 'number'
        : typeof sample === 'boolean' ? 'boolean'
        : typeof sample === 'object' ? 'object'
        : 'string';
      inputProps[key] = { type: t };
      required.push(key);
    } else {
      defaults[key] = bodyObject[key];
    }
  }

  const inputSchema = {
    type: 'object',
    properties: inputProps,
    ...(required.length ? { required } : {}),
  };
  const description = form.description.trim()
    || `${parsed.method} ${parsed.url}`;

  const metadata: Record<string, unknown> = {
    method: parsed.method,
    baseUrl: parsed.baseUrl,
    path: parsed.path,
    headers: parsed.headers,
    execution: form.execution,
    ...(form.execution === 'browser' ? { credentials: 'include' } : {}),
  };

  return {
    description,
    inputSchema,
    defaultArguments: Object.keys(defaults).length ? defaults : null,
    metadata,
  };
}

export default function ToolsPage() {
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [pageAssistantId, setPageAssistantId] = useState('');
  const [assistantsLoading, setAssistantsLoading] = useState(true);
  const [toolsLoading, setToolsLoading] = useState(false);
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    const load = async () => {
      try {
        const userId = readStoredUserId();
        if (!userId) throw new Error('Missing user');
        const list = await assistantsApi.list(userId);
        setAssistants(list);
        if (list.length > 0) {
          const stored = getActiveAssistantId();
          const next = (stored && list.some((a) => a.id === stored) && stored) || list[0].id;
          const assistant = list.find((a) => a.id === next) || list[0];
          setActiveAssistant(assistant);
          setPageAssistantId((cur) => cur || next);
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
        if (!cancelled) setTools(data.filter((t) => t.type === 'SERVER_HTTP' || t.type === 'MCP'));
      } catch {
        if (!cancelled) {
          toast({ title: 'Error', description: 'Failed to load tools for this assistant', variant: 'destructive' });
          setTools([]);
        }
      } finally {
        if (!cancelled) setToolsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [pageAssistantId]);

  const refresh = async () => {
    if (!pageAssistantId) return;
    const data = await assistantToolsApi.list(pageAssistantId);
    setTools(data.filter((t) => t.type === 'SERVER_HTTP' || t.type === 'MCP'));
  };

  const onCurlChange = (curl: string) => {
    setForm((f) => {
      const next: FormState = { ...f, curl };
      if (!curl.trim()) {
        next.parsed = null;
        next.parseError = null;
        next.paramKeys = new Set();
        return next;
      }
      try {
        const parsed = parseCurl(curl);
        next.parsed = parsed;
        next.parseError = null;
        // Default: every body key starts as a parameter (operator can uncheck to bake-in).
        next.paramKeys = new Set(parsed.bodyKeys);
      } catch (error) {
        next.parsed = null;
        next.parseError = error instanceof Error ? error.message : String(error);
        next.paramKeys = new Set();
      }
      return next;
    });
  };

  const togglePart = (key: string) => {
    setForm((f) => {
      const next = new Set(f.paramKeys);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...f, paramKeys: next };
    });
  };

  const openCreateDialog = () => {
    setEditingTool(null);
    setForm(emptyForm());
    setToolDialogOpen(true);
  };

  const openEditDialog = (tool: Tool) => {
    try {
      const curl = buildSyntheticCurlFromTool(tool);
      const parsed = parseCurl(curl);
      const paramKeys = new Set(Object.keys((tool.inputSchema?.properties ?? {}) as Record<string, unknown>));
      const meta = (tool.metadata ?? {}) as { execution?: string };
      setEditingTool(tool);
      setForm({
        curl,
        parsed,
        parseError: null,
        displayName: tool.displayName,
        description: tool.description ?? '',
        paramKeys,
        execution: meta.execution === 'browser' ? 'browser' : 'server',
        enabled: tool.enabled,
      });
      setToolDialogOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast({
        title: 'Could not open editor',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handleSaveTool = async () => {
    if (!form.parsed) {
      toast({ title: 'Paste a curl command', description: form.parseError ?? 'Nothing to parse yet.', variant: 'destructive' });
      return;
    }
    if (!form.displayName.trim()) {
      toast({ title: 'Tool name required', description: 'e.g. createUser, listOrders.', variant: 'destructive' });
      return;
    }
    if (!editingTool && !pageAssistantId) {
      toast({ title: 'Choose an assistant', variant: 'destructive' });
      return;
    }
    const parsed = form.parsed;
    const { description, inputSchema, defaultArguments, metadata } = buildHttpToolPayload(form, parsed);
    const displayName = form.displayName.trim();

    try {
      if (editingTool) {
        await toolsApi.update(editingTool.id, {
          key: editingTool.key,
          displayName,
          description,
          type: 'SERVER_HTTP',
          version: editingTool.version,
          enabled: form.enabled,
          executorRef: displayName,
          inputSchema,
          outputSchema: editingTool.outputSchema,
          defaultArguments,
          metadata,
        });
        posthog.capture('tool_updated', {
          tool_id: editingTool.id,
          tool_name: displayName,
          execution: form.execution,
          param_count: form.paramKeys.size,
        });
        toast({ title: 'Saved', description: `${displayName} updated` });
      } else {
        await toolsApi.createAndAttach({
          assistantId: pageAssistantId,
          displayName,
          description,
          type: 'SERVER_HTTP',
          version: '1',
          enabled: form.enabled,
          executorRef: displayName,
          inputSchema,
          outputSchema: null,
          defaultArguments,
          metadata,
        });
        posthog.capture('tool_created', {
          assistant_id: pageAssistantId,
          tool_name: displayName,
          execution: form.execution,
          param_count: form.paramKeys.size,
        });
        toast({ title: 'Created', description: `${displayName} attached` });
      }
      setToolDialogOpen(false);
      setEditingTool(null);
      setForm(emptyForm());
      await refresh();
    } catch (error: unknown) {
      const msg =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast({
        title: 'Error',
        description: msg || (editingTool ? 'Failed to update tool' : 'Failed to create tool'),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This removes the tool from the catalog and all assistants.`)) return;
    try {
      await toolsApi.delete(id);
      posthog.capture('tool_deleted', { tool_id: id, tool_name: name });
      toast({ title: 'Deleted', description: name });
      await refresh();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete tool', variant: 'destructive' });
    }
  };

  const headerCount = useMemo(() => Object.keys(form.parsed?.headers ?? {}).length, [form.parsed]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">Tools</h2>
          <p className="text-neutral-400">
            HTTP actions the assistant can perform on behalf of the user. Paste a curl, mark which body fields the model should fill in, and ship.
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
            onClick={openCreateDialog}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add HTTP tool
          </Button>
        </div>
      </div>

      <Dialog
        open={toolDialogOpen}
        onOpenChange={(open) => {
          setToolDialogOpen(open);
          if (!open) {
            setEditingTool(null);
            setForm(emptyForm());
          }
        }}
      >
        <DialogContent className="border-white/10 bg-neutral-900 max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{editingTool ? 'Edit HTTP tool' : 'Add HTTP tool'}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {editingTool
                ? 'Adjust the curl, body field bindings, or metadata. Saving updates this tool for every assistant that uses it.'
                : 'Paste a curl command. We extract the method, URL, headers, and body. Mark the body fields you want the model to fill at call time.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label className="text-white">curl command</Label>
              <Textarea
                value={form.curl}
                onChange={(e) => onCurlChange(e.target.value)}
                rows={6}
                className="border-white/10 bg-white/5 text-white font-mono text-xs"
                placeholder={"curl -X POST https://api.example.com/users \\\n  -H 'Authorization: Bearer ...' \\\n  -d '{\"name\":\"Alice\",\"email\":\"a@x.com\"}'"}
              />
              {form.parseError ? (
                <p className="text-xs text-red-400">{form.parseError}</p>
              ) : null}
            </div>

            {form.parsed ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="grid grid-cols-[80px_1fr] gap-2 text-sm">
                  <span className="text-neutral-500">Method</span>
                  <span className="font-mono text-white">{form.parsed.method}</span>
                  <span className="text-neutral-500">Base URL</span>
                  <span className="font-mono text-white break-all">{form.parsed.baseUrl || '—'}</span>
                  <span className="text-neutral-500">Path</span>
                  <span className="font-mono text-white break-all">{form.parsed.path}</span>
                  <span className="text-neutral-500">Headers</span>
                  <span className="font-mono text-white">{headerCount}</span>
                </div>

                {form.parsed.bodyKeys.length > 0 ? (
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Body fields</Label>
                    <p className="text-xs text-neutral-500">
                      Checked = the model fills it at call time. Unchecked = baked into the tool as a constant.
                    </p>
                    <div className="grid gap-1">
                      {form.parsed.bodyKeys.map((key) => (
                        <label key={key} className="flex items-center gap-2 text-sm text-neutral-300">
                          <input
                            type="checkbox"
                            checked={form.paramKeys.has(key)}
                            onChange={() => togglePart(key)}
                            className="h-4 w-4"
                          />
                          <code className="font-mono text-white">{key}</code>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : form.parsed.bodyRaw ? (
                  <p className="text-xs text-amber-300/80">
                    Body wasn&apos;t JSON — it will be sent verbatim with no parameters.
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="grid gap-2">
              <Label className="text-white">Tool name</Label>
              <Input
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="border-white/10 bg-white/5 text-white"
                placeholder="createUser"
              />
              <p className="text-xs text-neutral-500">
                A short, descriptive name. The model picks the tool by this name, so make it action-shaped.
              </p>
            </div>

            <div className="grid gap-2">
              <Label className="text-white">Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border-white/10 bg-white/5 text-white"
                placeholder="Create a new user with the given name and email."
              />
              <p className="text-xs text-neutral-500">
                What this tool does, in one sentence. The model uses this to decide when to call it.
              </p>
            </div>

            <div className="grid gap-2">
              <Label className="text-white">Executor</Label>
              <select
                value={form.execution}
                onChange={(e) => {
                  const execution = e.target.value as FormState['execution'];
                  setForm({
                    ...form,
                    execution,
                  });
                }}
                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
              >
                <option value="server">ActBrow backend</option>
                <option value="browser">Browser</option>
              </select>
              <p className="text-xs text-neutral-500">
                Browser only runs the request inside the ActBrow browser tab. Backend runs from our servers with no tab context.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="http-tool-enabled"
                checked={form.enabled}
                onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="http-tool-enabled" className="text-white">Enabled</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setToolDialogOpen(false)}
              className="border-white/10 text-neutral-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveTool}
              disabled={!form.parsed}
              className="bg-white text-neutral-900 hover:bg-white/90 disabled:opacity-50"
            >
              {editingTool ? 'Save changes' : 'Create tool'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">
            {pageAssistantId
              ? `HTTP tools · ${assistants.find((a) => a.id === pageAssistantId)?.name ?? 'Assistant'}`
              : 'HTTP tools'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-neutral-400">Name</TableHead>
                <TableHead className="text-neutral-400">Method</TableHead>
                <TableHead className="text-neutral-400">Runs in</TableHead>
                <TableHead className="text-neutral-400">Endpoint</TableHead>
                <TableHead className="text-neutral-400">Description</TableHead>
                <TableHead className="text-neutral-400">Enabled</TableHead>
                <TableHead className="text-right text-neutral-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!pageAssistantId ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                    Select an assistant above to view its HTTP tools.
                  </TableCell>
                </TableRow>
              ) : toolsLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-neutral-500">Loading…</TableCell>
                </TableRow>
              ) : tools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-neutral-500">
                    No HTTP tools yet. Use “Add HTTP tool” and paste a curl.
                  </TableCell>
                </TableRow>
              ) : (
                tools.map((tool) => {
                  const meta = (tool.metadata ?? {}) as { method?: string; baseUrl?: string; path?: string; execution?: string };
                  const endpoint = `${meta.baseUrl ?? ''}${meta.path ?? ''}` || '—';
                  return (
                    <TableRow key={tool.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-neutral-300">{tool.displayName}</TableCell>
                      <TableCell className="text-sm font-mono text-neutral-400">{meta.method ?? '—'}</TableCell>
                      <TableCell className="text-sm text-neutral-400">
                        {meta.execution === 'browser' ? 'Browser' : 'Backend'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm font-mono text-neutral-400">{endpoint}</TableCell>
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
                        <div className="inline-flex justify-end gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-neutral-300 hover:text-white"
                            onClick={() => openEditDialog(tool)}
                            aria-label={`Edit ${tool.displayName}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleDelete(tool.id, tool.displayName)}
                            aria-label={`Delete ${tool.displayName}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
