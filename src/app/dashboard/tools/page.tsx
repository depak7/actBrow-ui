'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { assistantsApi, assistantToolsApi, toolsApi } from '@/lib/api';
import type { Assistant, Tool } from '@/types';
import { Plus, Trash2, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const APP_NAVIGATE_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    path: { type: 'string' },
    url: { type: 'string' },
  },
} as const;

// Client presets: navigation (app.navigate) only
const TOOL_TEMPLATES = {
  CLIENT: [
    {
      key: 'profile.my-profile',
      displayName: 'Open Profile Page',
      description: 'Open the my-profile page when user asked to open his profile page',
      executorRef: 'app.navigate',
      inputSchema: { ...APP_NAVIGATE_INPUT_SCHEMA },
      defaultArguments: { path: '/my-profile' },
    },
    {
      key: 'app.navigate.home',
      displayName: 'Navigate to Home',
      description: 'Navigate to the home page',
      executorRef: 'app.navigate',
      inputSchema: { ...APP_NAVIGATE_INPUT_SCHEMA },
      defaultArguments: { path: '/' },
    },
  ],
  SERVER_HTTP: [
    {
      key: 'api.get.users',
      displayName: 'Get Users',
      description: 'Fetch users from the API',
      executorRef: 'api.get',
      inputSchema: { type: 'object', properties: {} },
      metadata: { baseUrl: '' },
    },
    {
      key: 'api.post.create',
      displayName: 'Create Resource',
      description: 'Create a new resource via POST request',
      executorRef: 'api.post',
      inputSchema: { type: 'object', properties: { body: { type: 'object' } } },
      metadata: { baseUrl: '' },
    },
  ],
};

type CatalogTemplate = {
  displayName: string;
  description: string;
  executorRef: string;
  inputSchema: object;
  defaultArguments?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

const emptyNewToolState = () => ({
  displayName: '',
  description: '',
  type: 'CLIENT' as 'CLIENT' | 'SERVER_HTTP' | 'SERVER_BUILTIN',
  version: '1',
  enabled: true,
  executorRef: '',
  inputSchema: '{}',
  outputSchema: '{}',
  defaultArguments: '{}',
  metadata: '{}',
});

export default function ToolsPage() {
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [pageAssistantId, setPageAssistantId] = useState('');
  const [createAssistantId, setCreateAssistantId] = useState('');
  const [assistantsLoading, setAssistantsLoading] = useState(true);
  const [toolsLoading, setToolsLoading] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'CLIENT' | 'SERVER_BUILTIN' | 'SERVER_HTTP'>('ALL');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMode, setCustomMode] = useState(false);
  /** Navigation-only custom tool: path → defaultArguments */
  const [navPath, setNavPath] = useState('/');
  const [newTool, setNewTool] = useState(emptyNewToolState);

  const resetCreateDialog = () => {
    setCustomMode(false);
    setSelectedTemplate('');
    setCreateAssistantId('');
    setNavPath('/');
    setNewTool(emptyNewToolState());
  };

  useEffect(() => {
    const loadAssistants = async () => {
      try {
        const assistantData = await assistantsApi.list();
        setAssistants(assistantData);
      } catch {
        toast({ title: 'Error', description: 'Failed to load assistants', variant: 'destructive' });
      } finally {
        setAssistantsLoading(false);
      }
    };
    loadAssistants();
  }, []);

  useEffect(() => {
    if (!pageAssistantId) {
      setTools([]);
      return;
    }
    let cancelled = false;
    const loadTools = async () => {
      setToolsLoading(true);
      try {
        const data = await assistantToolsApi.list(pageAssistantId);
        if (!cancelled) setTools(data);
      } catch {
        if (!cancelled) {
          toast({ title: 'Error', description: 'Failed to load tools for this assistant', variant: 'destructive' });
          setTools([]);
        }
      } finally {
        if (!cancelled) setToolsLoading(false);
      }
    };
    loadTools();
    return () => {
      cancelled = true;
    };
  }, [pageAssistantId]);

  const filteredTools = filter === 'ALL' ? tools : tools.filter(t => t.type === filter);

  const handleTemplateSelect = (template: CatalogTemplate, templateId: string, event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    setSelectedTemplate(templateId);
    setNewTool({
      displayName: template.displayName,
      description: template.description,
      type: template.executorRef.startsWith('api.') ? 'SERVER_HTTP' : 'CLIENT',
      version: '1',
      enabled: true,
      executorRef: template.executorRef,
      inputSchema: JSON.stringify(template.inputSchema, null, 2),
      outputSchema: '{}',
      defaultArguments: JSON.stringify(template.defaultArguments || {}, null, 2),
      metadata: template.metadata ? JSON.stringify(template.metadata, null, 2) : '{}',
    });
  };

  const canSubmitCreate = Boolean(createAssistantId) && (customMode || Boolean(selectedTemplate));

  const handleCreate = async () => {
    if (!createAssistantId) {
      toast({ title: 'Choose an assistant', description: 'Tools are created and attached to one assistant.', variant: 'destructive' });
      return;
    }
    if (!canSubmitCreate) {
      toast({ title: 'Pick a template or custom navigation', variant: 'destructive' });
      return;
    }
    try {
      if (customMode) {
        const path = navPath.trim() || '/';
        if (!newTool.displayName.trim()) {
          toast({ title: 'Display name required', variant: 'destructive' });
          return;
        }
        await toolsApi.createAndAttach({
          assistantId: createAssistantId,
          displayName: newTool.displayName.trim(),
          description: newTool.description.trim(),
          type: 'CLIENT',
          version: newTool.version,
          enabled: newTool.enabled,
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
      } else {
        await toolsApi.createAndAttach({
          assistantId: createAssistantId,
          displayName: newTool.displayName.trim(),
          description: newTool.description.trim(),
          type: newTool.type,
          version: newTool.version,
          enabled: newTool.enabled,
          executorRef: newTool.executorRef || null,
          inputSchema: JSON.parse(newTool.inputSchema),
          outputSchema: newTool.outputSchema ? JSON.parse(newTool.outputSchema) : null,
          defaultArguments: newTool.defaultArguments ? JSON.parse(newTool.defaultArguments) : null,
          metadata: newTool.metadata && newTool.metadata !== '{}' ? JSON.parse(newTool.metadata) : null,
        });
      }
      toast({ title: 'Success', description: 'Tool created and attached to assistant' });
      setCreateDialogOpen(false);
      resetCreateDialog();
      if (pageAssistantId) {
        setTools(await assistantToolsApi.list(pageAssistantId));
      }
    } catch (error: unknown) {
      const msg =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast({ title: 'Error', description: msg || 'Failed to create tool', variant: 'destructive' });
    }
  };

  const handleDeleteTool = async (id: string, displayName: string) => {
    if (!confirm(`Delete "${displayName}"? This removes the tool from the catalog and all assistants.`)) return;
    try {
      await toolsApi.delete(id);
      toast({ title: 'Deleted', description: displayName });
      if (pageAssistantId) {
        setTools(await assistantToolsApi.list(pageAssistantId));
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete tool', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">Tools</h2>
          <p className="text-neutral-400">
            Custom tools you added for an assistant. Platform defaults (navigation, DOM, HTTP helpers) stay available to the model but are not listed here.
          </p>
          <div className="mt-3 max-w-md">
            <Label className="text-neutral-400 text-xs">Assistant</Label>
            <select
              value={pageAssistantId}
              onChange={(e) => setPageAssistantId(e.target.value)}
              disabled={assistantsLoading}
              className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white disabled:opacity-50"
            >
              <option value="">Select an assistant to view tools…</option>
              {assistants.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.key})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            disabled={!pageAssistantId}
            className="flex h-10 rounded-md border border-white/10 bg-white/5 text-white px-3 text-sm disabled:opacity-50"
          >
            <option value="ALL">All Types</option>
            <option value="CLIENT">Client</option>
            <option value="SERVER_BUILTIN">Server Built-in</option>
            <option value="SERVER_HTTP">Server HTTP</option>
          </select>
          <Button
            type="button"
            size="icon"
            disabled={!pageAssistantId}
            className="h-10 w-10 shrink-0 bg-white text-neutral-900 hover:bg-white/90 disabled:opacity-50"
            aria-label="Create tool"
            onClick={() => {
              if (!pageAssistantId) {
                toast({ title: 'Select an assistant', description: 'Choose an assistant above first.', variant: 'destructive' });
                return;
              }
              setCreateAssistantId(pageAssistantId);
              setCreateDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Dialog
            open={createDialogOpen}
            onOpenChange={(open) => {
              setCreateDialogOpen(open);
              if (open) {
                setCreateAssistantId(pageAssistantId || '');
              } else {
                resetCreateDialog();
              }
            }}
          >
            <DialogContent className="border-white/10 bg-neutral-900 max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Create Tool</DialogTitle>
                <DialogDescription className="text-neutral-400">
                  Pick an assistant, then a template or custom navigation. The tool is saved and attached to that assistant;
                  the server assigns a unique catalog key.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-2 py-2 border-b border-white/10">
                <Label className="text-neutral-400 text-xs">Assistant</Label>
                <select
                  value={createAssistantId}
                  onChange={(e) => setCreateAssistantId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
                >
                  <option value="">Select assistant…</option>
                  {assistants.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.key})
                    </option>
                  ))}
                </select>
                {assistants.length === 0 ? (
                  <p className="text-xs text-amber-200/90">Create an assistant first in the Assistants tab.</p>
                ) : null}
              </div>

              {!customMode ? (
                <div className="py-4">
                  <h3 className="text-white font-medium mb-1">Client · Navigation templates</h3>
                  <p className="text-xs text-neutral-500 mb-4">
                    Pick a starter below to load fields, then save to attach the tool to the assistant above.
                  </p>
                  <div className="grid gap-3 mb-6">
                    {TOOL_TEMPLATES.CLIENT.map((template, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={(e) => handleTemplateSelect(template, `CLIENT:${idx}`, e)}
                        className={`flex items-start gap-3 p-4 rounded-lg border text-left transition ${
                          selectedTemplate === `CLIENT:${idx}`
                            ? 'border-white/40 bg-white/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="text-white font-medium">{template.displayName}</div>
                          <div className="text-sm text-neutral-400">{template.description}</div>
                          <div className="text-xs text-neutral-500 mt-1 font-mono">{template.executorRef}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <h3 className="text-white font-medium mb-4">Server · HTTP templates</h3>
                  <div className="grid gap-3 mb-6">
                    {TOOL_TEMPLATES.SERVER_HTTP.map((template, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={(e) => handleTemplateSelect(template, `SERVER_HTTP:${idx}`, e)}
                        className={`flex items-start gap-3 p-4 rounded-lg border text-left transition ${
                          selectedTemplate === `SERVER_HTTP:${idx}`
                            ? 'border-white/40 bg-white/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="text-white font-medium">{template.displayName}</div>
                          <div className="text-sm text-neutral-400">{template.description}</div>
                          <div className="text-xs text-neutral-500 mt-1 font-mono">{template.executorRef}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedTemplate ? (
                    <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                      <p className="text-sm text-amber-100/90 font-medium">Review before saving</p>
                      <p className="text-xs text-neutral-400">
                        Edit the display name or description if you want, then use <span className="text-neutral-200">Save to catalog</span>{' '}
                        below.
                      </p>
                      <div className="grid gap-2">
                        <div>
                          <Label className="text-neutral-400 text-xs">Display name</Label>
                          <Input
                            value={newTool.displayName}
                            onChange={(e) => setNewTool({ ...newTool, displayName: e.target.value })}
                            className="mt-1 border-white/10 bg-white/5 text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="pt-4 border-t border-white/10">
                    <Button
                      type="button"
                      onClick={() => {
                        setCustomMode(true);
                        setSelectedTemplate('');
                        setNavPath('/');
                        setNewTool({
                          ...emptyNewToolState(),
                          type: 'CLIENT',
                          executorRef: 'app.navigate',
                          inputSchema: JSON.stringify(
                            { type: 'object', properties: { path: { type: 'string' }, url: { type: 'string' } } },
                            null,
                            2
                          ),
                          defaultArguments: JSON.stringify({ path: '/' }, null, 2),
                        });
                      }}
                      variant="outline"
                      className="w-full border-white/10 text-neutral-300 hover:bg-white/5"
                    >
                      Custom navigation tool
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <p className="text-xs text-neutral-400">
                    Creates a client tool with executor <span className="font-mono text-neutral-300">app.navigate</span>{' '}
                    and your path as the default argument.
                  </p>
                  <Button
                    type="button"
                    onClick={() => {
                      setCustomMode(false);
                      setSelectedTemplate('');
                      setNewTool(emptyNewToolState());
                    }}
                    variant="outline"
                    className="border-white/10 text-neutral-300 w-fit"
                  >
                    ← Back to templates
                  </Button>
                  <div className="grid gap-2">
                    <Label className="text-white">Display name</Label>
                    <Input
                      value={newTool.displayName}
                      onChange={(e) => setNewTool({ ...newTool, displayName: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                      placeholder="Open Orders"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white">Description</Label>
                    <Textarea
                      value={newTool.description}
                      onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white">Path</Label>
                    <Input
                      value={navPath}
                      onChange={(e) => setNavPath(e.target.value)}
                      className="border-white/10 bg-white/5 text-white font-mono text-sm"
                      placeholder="/orders"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="nav-tool-enabled"
                      checked={newTool.enabled}
                      onChange={(e) => setNewTool({ ...newTool, enabled: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="nav-tool-enabled" className="text-white">
                      Enabled
                    </Label>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  className="border-white/10 text-neutral-300"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCreate}
                  disabled={!canSubmitCreate}
                  className="bg-white text-neutral-900 hover:bg-white/90 disabled:opacity-50"
                >
                  Save to catalog
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">
            {pageAssistantId
              ? `Tools · ${assistants.find((a) => a.id === pageAssistantId)?.name ?? 'Assistant'}`
              : 'Tools'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-neutral-400">Name</TableHead>
                <TableHead className="text-neutral-400">Type</TableHead>
                <TableHead className="text-neutral-400">Description</TableHead>
                <TableHead className="text-neutral-400">Version</TableHead>
                <TableHead className="text-neutral-400">Enabled</TableHead>
                <TableHead className="text-right text-neutral-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!pageAssistantId ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                    Select an assistant to view custom tools attached to them.
                  </TableCell>
                </TableRow>
              ) : toolsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : filteredTools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                    No custom tools yet. Use + to add one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTools.map((tool) => (
                  <TableRow key={tool.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-neutral-300">{tool.displayName}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-neutral-300 border border-white/10">
                        {tool.type}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-md truncate text-sm text-neutral-500">{tool.description}</TableCell>
                    <TableCell className="text-sm text-neutral-300">{tool.version}</TableCell>
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
                        onClick={() => handleDeleteTool(tool.id, tool.displayName)}
                        aria-label={`Delete ${tool.displayName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Client Tools', desc: 'In-browser navigation via the Actbrow SDK', tools: ['app.navigate'] },
          { title: 'Server Built-in', desc: 'Java-based server logic', tools: ['Custom implementations', 'Service calls'] },
          { title: 'Server HTTP', desc: 'External API calls via HTTP', tools: ['api.get', 'api.post', 'api.put', 'api.delete'] },
        ].map((category, index) => (
          <Card key={index} className="border-white/10 bg-white/5">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Wrench className="h-5 w-5 text-white" />{category.title}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500 mb-4">{category.desc}</p>
              <ul className="space-y-2">{category.tools.map((tool, i) => (<li key={i} className="flex items-center gap-2 text-sm text-neutral-300"><div className="h-1.5 w-1.5 rounded-full bg-white" />{tool}</li>))}</ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
