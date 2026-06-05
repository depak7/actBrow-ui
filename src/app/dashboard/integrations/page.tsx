'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiIntegrationsApi, assistantsApi } from '@/lib/api';
import type { ApiIntegration, Assistant } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Webhook, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { readStoredUserId, setActiveAssistant } from '@/lib/session';

const emptyDraft = {
  name: '',
  baseUrlOverride: '',
  allowCrossOrigin: true,
  specContent: '',
};

export default function IntegrationsPage() {
  const { toast } = useToast();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantId, setAssistantId] = useState('');
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  const loadAssistants = async () => {
    try {
      const userId = readStoredUserId();
      if (!userId) {
        throw new Error('Missing user');
      }
      const data = await assistantsApi.list(userId);
      setAssistants(data);
      if (!assistantId && data.length > 0) {
        setActiveAssistant(data[0]);
        setAssistantId(data[0].id);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load assistants', variant: 'destructive' });
    }
  };

  const loadIntegrations = async (currentAssistantId: string) => {
    if (!currentAssistantId) {
      setIntegrations([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const assistant = assistants.find((a) => a.id === currentAssistantId);
      if (assistant) setActiveAssistant(assistant);
      setIntegrations(await apiIntegrationsApi.list(currentAssistantId));
    } catch {
      toast({ title: 'Error', description: 'Failed to load integrations', variant: 'destructive' });
      setIntegrations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssistants();
  }, []);

  useEffect(() => {
    loadIntegrations(assistantId);
  }, [assistantId]);

  const importSpec = async () => {
    if (!assistantId) {
      toast({ title: 'Choose an assistant', variant: 'destructive' });
      return;
    }
    if (!draft.name.trim() || !draft.specContent.trim()) {
      toast({ title: 'Name and spec content required', variant: 'destructive' });
      return;
    }
    setImporting(true);
    try {
      const result = await apiIntegrationsApi.import(assistantId, {
        name: draft.name.trim(),
        specContent: draft.specContent,
        baseUrlOverride: draft.baseUrlOverride.trim() || null,
        allowCrossOrigin: draft.allowCrossOrigin,
      });
      setDialogOpen(false);
      setDraft(emptyDraft);
      await loadIntegrations(assistantId);
      toast({
        title: 'Imported',
        description: `${result.created} created, ${result.updated} updated${result.removed ? `, ${result.removed} removed` : ''} · ${result.toolKeys.length} tools total.`,
      });
    } catch (e) {
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to parse or import the spec. Check that it is valid OpenAPI/Swagger.';
      toast({ title: 'Import failed', description: message, variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  const deleteIntegration = async (integration: ApiIntegration) => {
    if (!assistantId) return;
    if (!confirm(`Delete "${integration.name}" and its ${integration.toolKeys.length} generated tool(s)?`)) {
      return;
    }
    try {
      await apiIntegrationsApi.delete(assistantId, integration.id);
      await loadIntegrations(assistantId);
      toast({ title: 'Deleted', description: integration.name });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete integration', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">API Integrations</h2>
          <p className="mt-1 text-neutral-400">
            Paste a Swagger/OpenAPI spec to auto-generate one tool per endpoint. Tools run in the
            user&apos;s browser, so their existing cookies handle auth. Generated tools also appear on the
            Tools page.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-neutral-900 hover:bg-white/90">
              <Plus className="mr-2 h-4 w-4" />
              Import spec
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-neutral-900 sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Import OpenAPI / Swagger spec</DialogTitle>
              <DialogDescription className="text-neutral-400">
                JSON or YAML, Swagger 2.0 or OpenAPI 3.x. Re-importing with the same name updates the
                existing integration and prunes endpoints that were removed.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label className="text-white">Name</Label>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="petstore"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-white">Base URL override (optional)</Label>
                <Input
                  value={draft.baseUrlOverride}
                  onChange={(e) => setDraft({ ...draft, baseUrlOverride: e.target.value })}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="https://api.example.com/v1"
                />
                <p className="text-xs text-neutral-500">
                  Leave blank to use the spec&apos;s first server URL. Must be an absolute http(s) URL.
                </p>
              </div>
              <div className="grid gap-2">
                <Label className="text-white">Spec content</Label>
                <Textarea
                  value={draft.specContent}
                  onChange={(e) => setDraft({ ...draft, specContent: e.target.value })}
                  className="min-h-[260px] border-white/10 bg-white/5 font-mono text-xs text-white"
                  placeholder="Paste the full OpenAPI/Swagger JSON or YAML here."
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={draft.allowCrossOrigin}
                  onChange={(e) => setDraft({ ...draft, allowCrossOrigin: e.target.checked })}
                  className="h-4 w-4"
                />
                Allow cross-origin calls (needed when the API host differs from the embed page)
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-white/10 text-neutral-300">
                Cancel
              </Button>
              <Button onClick={importSpec} disabled={importing} className="bg-white text-neutral-900 hover:bg-white/90">
                {importing ? 'Importing…' : 'Import'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Assistant</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="py-8 text-center text-neutral-500">Loading…</p>
          ) : !assistantId ? (
            <p className="py-8 text-center text-neutral-500">Select an assistant to manage integrations.</p>
          ) : integrations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
              <Webhook className="mx-auto h-10 w-10 text-neutral-500" />
              <p className="mt-3 text-sm text-neutral-400">
                No integrations yet. Import an OpenAPI/Swagger spec to generate tools from an existing API.
              </p>
            </div>
          ) : (
            integrations.map((integration) => (
              <div key={integration.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-medium text-white">{integration.name}</h3>
                      <span className="rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-[11px] text-white">
                        {integration.toolKeys.length} tools
                      </span>
                      {integration.allowCrossOrigin ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-neutral-400">
                          cross-origin
                        </span>
                      ) : null}
                    </div>
                    {integration.baseUrl ? (
                      <p className="mt-1 truncate text-xs text-neutral-500">{integration.baseUrl}</p>
                    ) : null}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => deleteIntegration(integration)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {integration.toolKeys.length > 0 ? (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs text-neutral-400 hover:text-white">
                      Show generated tool keys
                    </summary>
                    <ul className="mt-2 space-y-1">
                      {integration.toolKeys.map((key) => (
                        <li key={key} className="break-all font-mono text-[11px] text-neutral-400">
                          {key}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
