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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { readStoredUserId, setActiveAssistant } from '@/lib/session';

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
      key: 'client:navigation',
      displayName: 'Navigation Tool',
      description: 'Create a page navigation tool for a route in your app.',
      executorRef: 'app.navigate',
      inputSchema: { ...APP_NAVIGATE_INPUT_SCHEMA },
    },
  ],
  SERVER_HTTP: [
    {
      key: 'server_http:get',
      displayName: 'Fetch Data',
      description: 'Read data from your backend or an external API.',
      executorRef: 'api.get',
      inputSchema: { type: 'object', properties: {} },
      metadata: { baseUrl: '' },
    },
    {
      key: 'server_http:post',
      displayName: 'Send Data',
      description: 'Send data to your backend or an external API.',
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

const emptyCustomNavigationState = () => ({
  displayName: '',
  description: '',
  path: '/',
  enabled: true,
});

const emptyServerHttpState = () => ({
  displayName: '',
  description: '',
  baseUrl: '',
  enabled: true,
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
  const [createMode, setCreateMode] = useState<'catalog' | 'customNavigation' | 'serverHttp'>('catalog');
  const [selectedServerTemplate, setSelectedServerTemplate] = useState<CatalogTemplate | null>(null);
  const [customNavigation, setCustomNavigation] = useState(emptyCustomNavigationState);
  const [serverHttpConfig, setServerHttpConfig] = useState(emptyServerHttpState);

  const resetCreateDialog = () => {
    setCreateMode('catalog');
    setSelectedServerTemplate(null);
    setCreateAssistantId('');
    setCustomNavigation(emptyCustomNavigationState());
    setServerHttpConfig(emptyServerHttpState());
  };

  useEffect(() => {
    const loadAssistants = async () => {
      try {
        const userId = readStoredUserId();
        if (!userId) {
          throw new Error('Missing user');
        }
        const assistantData = await assistantsApi.list(userId);
        setAssistants(assistantData);
        if (assistantData.length > 0) {
          setActiveAssistant(assistantData[0]);
          setPageAssistantId((current) => current || assistantData[0].id);
        }
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
        const assistant = assistants.find((a) => a.id === pageAssistantId);
        if (assistant) setActiveAssistant(assistant);
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

  const refreshTools = async () => {
    if (pageAssistantId) {
      const assistant = assistants.find((a) => a.id === pageAssistantId);
      if (assistant) setActiveAssistant(assistant);
      setTools(await assistantToolsApi.list(pageAssistantId));
    }
  };

  const ensureAssistantSelected = () => {
    if (!createAssistantId) {
      toast({ title: 'Choose an assistant', description: 'Tools are created and attached to one assistant.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleCustomNavigationCreate = async () => {
    if (!ensureAssistantSelected()) {
      return;
    }
    if (!customNavigation.displayName.trim()) {
      toast({ title: 'Name required', description: 'Enter a label like Open Orders.', variant: 'destructive' });
      return;
    }
    try {
      const assistant = assistants.find((a) => a.id === createAssistantId);
      if (assistant) setActiveAssistant(assistant);
      const path = customNavigation.path.trim() || '/';
      const description = customNavigation.description.trim() || `Use this when the user wants to open ${customNavigation.displayName.trim() || path}.`;
      await toolsApi.createAndAttach({
        assistantId: createAssistantId,
        displayName: customNavigation.displayName.trim(),
        description,
        type: 'CLIENT',
        version: '1',
        enabled: customNavigation.enabled,
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
      toast({ title: 'Created', description: `${customNavigation.displayName.trim()} attached to assistant` });
      setCreateDialogOpen(false);
      resetCreateDialog();
      await refreshTools();
    } catch (error: unknown) {
      const msg =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast({ title: 'Error', description: msg || 'Failed to create tool', variant: 'destructive' });
    }
  };

  const handleServerHttpCreate = async () => {
    if (!ensureAssistantSelected()) {
      return;
    }
    if (!selectedServerTemplate) {
      toast({ title: 'Choose a server template', variant: 'destructive' });
      return;
    }
    if (!serverHttpConfig.baseUrl.trim()) {
      toast({ title: 'Base URL required', description: 'Enter the API base URL for this tool.', variant: 'destructive' });
      return;
    }
    const displayName = serverHttpConfig.displayName.trim() || selectedServerTemplate.displayName;
    const description = serverHttpConfig.description.trim() || selectedServerTemplate.description;
    try {
      const assistant = assistants.find((a) => a.id === createAssistantId);
      if (assistant) setActiveAssistant(assistant);
      await toolsApi.createAndAttach({
        assistantId: createAssistantId,
        displayName,
        description,
        type: 'SERVER_HTTP',
        version: '1',
        enabled: serverHttpConfig.enabled,
        executorRef: selectedServerTemplate.executorRef,
        inputSchema: selectedServerTemplate.inputSchema as Record<string, unknown>,
        outputSchema: null,
        defaultArguments: null,
        metadata: { ...(selectedServerTemplate.metadata || {}), baseUrl: serverHttpConfig.baseUrl.trim() },
      });
      toast({ title: 'Created', description: `${displayName} attached to assistant` });
      setCreateDialogOpen(false);
      resetCreateDialog();
      await refreshTools();
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
      const assistant = assistants.find((a) => a.id === pageAssistantId);
      if (assistant) setActiveAssistant(assistant);
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
                  {a.name}
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
                  Choose an assistant, then create a navigation or server tool with the minimum required fields.
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
                    {a.name}
                    </option>
                  ))}
                </select>
                {assistants.length === 0 ? (
                  <p className="text-xs text-amber-200/90">Create an assistant first in the Assistants tab.</p>
                ) : null}
              </div>

              {createMode === 'catalog' ? (
                <div className="py-4">
                  <h3 className="text-white font-medium mb-1">Client · Navigation templates</h3>
                  <p className="text-xs text-neutral-500 mb-4">
                    Click a template to create it immediately for the selected assistant.
                  </p>
                  <div className="grid gap-3 mb-6">
                    {TOOL_TEMPLATES.CLIENT.map((template, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setCreateMode('customNavigation');
                          setCustomNavigation(emptyCustomNavigationState());
                        }}
                        className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/5 text-left transition hover:bg-white/10"
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
                        onClick={() => {
                          setSelectedServerTemplate(template);
                          setServerHttpConfig(emptyServerHttpState());
                          setCreateMode('serverHttp');
                        }}
                        className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/5 text-left transition hover:bg-white/10"
                      >
                        <div className="flex-1">
                          <div className="text-white font-medium">{template.displayName}</div>
                          <div className="text-sm text-neutral-400">{template.description}</div>
                          <div className="text-xs text-neutral-500 mt-1 font-mono">{template.executorRef}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Button
                      type="button"
                      onClick={() => {
                        setCreateMode('customNavigation');
                        setCustomNavigation(emptyCustomNavigationState());
                      }}
                      variant="outline"
                      className="w-full border-white/10 text-neutral-300 hover:bg-white/5"
                    >
                      Custom navigation tool
                    </Button>
                  </div>
                </div>
              ) : createMode === 'customNavigation' ? (
                <div className="grid gap-4 py-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setCreateMode('catalog');
                      setCustomNavigation(emptyCustomNavigationState());
                    }}
                    variant="outline"
                    className="border-white/10 text-neutral-300 w-fit"
                  >
                    ← Back to templates
                  </Button>
                  <p className="text-xs text-neutral-400">
                    Pick the name your operators will recognize and the app route this tool should always open.
                  </p>
                  <div className="grid gap-2">
                    <Label className="text-white">Name</Label>
                    <Input
                      value={customNavigation.displayName}
                      onChange={(e) => setCustomNavigation({ ...customNavigation, displayName: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                      placeholder="Open Orders"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white">Description</Label>
                    <Input
                      value={customNavigation.description}
                      onChange={(e) => setCustomNavigation({ ...customNavigation, description: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                      placeholder="Use this when the user asks to open the orders page."
                    />
                    <p className="text-xs text-neutral-500">
                      This helps the assistant decide when to use the tool.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white">Path</Label>
                    <Input
                      value={customNavigation.path}
                      onChange={(e) => setCustomNavigation({ ...customNavigation, path: e.target.value })}
                      className="border-white/10 bg-white/5 text-white font-mono text-sm"
                      placeholder="/orders"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="nav-tool-enabled"
                      checked={customNavigation.enabled}
                      onChange={(e) => setCustomNavigation({ ...customNavigation, enabled: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="nav-tool-enabled" className="text-white">
                      Enabled
                    </Label>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setCreateMode('catalog');
                      setSelectedServerTemplate(null);
                      setServerHttpConfig(emptyServerHttpState());
                    }}
                    variant="outline"
                    className="border-white/10 text-neutral-300 w-fit"
                  >
                    ← Back to templates
                  </Button>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-medium text-white">{selectedServerTemplate?.displayName}</p>
                    <p className="mt-1 text-xs text-neutral-400">{selectedServerTemplate?.description}</p>
                    <p className="mt-2 text-xs font-mono text-neutral-500">{selectedServerTemplate?.executorRef}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white">Name</Label>
                    <Input
                      value={serverHttpConfig.displayName}
                      onChange={(e) => setServerHttpConfig({ ...serverHttpConfig, displayName: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                      placeholder={selectedServerTemplate?.displayName}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white">Description</Label>
                    <Input
                      value={serverHttpConfig.description}
                      onChange={(e) => setServerHttpConfig({ ...serverHttpConfig, description: e.target.value })}
                      className="border-white/10 bg-white/5 text-white"
                      placeholder={selectedServerTemplate?.description}
                    />
                    <p className="text-xs text-neutral-500">
                      Describe what this tool does so the assistant can pick it correctly.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white">Base URL</Label>
                    <Input
                      value={serverHttpConfig.baseUrl}
                      onChange={(e) => setServerHttpConfig({ ...serverHttpConfig, baseUrl: e.target.value })}
                      className="border-white/10 bg-white/5 text-white font-mono text-sm"
                      placeholder="https://api.example.com"
                    />
                    <p className="text-xs text-neutral-500">
                      This should be the SaaS-specific API base for this tool. The request method comes from the template.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="server-tool-enabled"
                      checked={serverHttpConfig.enabled}
                      onChange={(e) => setServerHttpConfig({ ...serverHttpConfig, enabled: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="server-tool-enabled" className="text-white">
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
                {createMode === 'customNavigation' ? (
                  <Button
                    type="button"
                    onClick={handleCustomNavigationCreate}
                    className="bg-white text-neutral-900 hover:bg-white/90"
                  >
                    Create tool
                  </Button>
                ) : null}
                {createMode === 'serverHttp' ? (
                  <Button
                    type="button"
                    onClick={handleServerHttpCreate}
                    className="bg-white text-neutral-900 hover:bg-white/90"
                  >
                    Create tool
                  </Button>
                ) : null}
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
    </div>
  );
}
