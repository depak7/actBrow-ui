'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { assistantToolsApi, assistantsApi, toolsApi } from '@/lib/api';
import type { Tool } from '@/types';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { readStoredUserId, setActiveAssistant } from '@/lib/session';

export default function AssistantToolsPage() {
  const params = useParams();
  const assistantId = params.assistantId as string;
  const { toast } = useToast();

  const [attached, setAttached] = useState<Tool[]>([]);
  const [catalog, setCatalog] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [addToolId, setAddToolId] = useState('');
  const [addArgsJson, setAddArgsJson] = useState('{\n  "path": "/my-profile"\n}');

  const [editOpen, setEditOpen] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [editArgsJson, setEditArgsJson] = useState('{}');

  const load = async () => {
    try {
      const userId = readStoredUserId();
      if (!userId) {
        throw new Error('Missing user');
      }
      const assistants = await assistantsApi.list(userId);
      const assistant = assistants.find((item) => item.id === assistantId);
      if (assistant) {
        setActiveAssistant(assistant);
      }
      const [a, c] = await Promise.all([assistantToolsApi.list(assistantId), toolsApi.list()]);
      setAttached(a);
      setCatalog(c);
    } catch {
      toast({ title: 'Error', description: 'Failed to load tools', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [assistantId]);

  const attachable = useMemo(() => {
    const ids = new Set(attached.map((t) => t.id));
    return catalog.filter((t) => t.type === 'CLIENT' && !ids.has(t.id));
  }, [attached, catalog]);

  const openEdit = (tool: Tool) => {
    setEditTool(tool);
    setEditArgsJson(JSON.stringify(tool.defaultArguments ?? {}, null, 2));
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editTool) return;
    try {
      const parsed = JSON.parse(editArgsJson || '{}') as Record<string, unknown>;
      await assistantToolsApi.updateBinding(assistantId, editTool.id, parsed);
      toast({ title: 'Saved', description: 'Tool parameters updated for this assistant.' });
      setEditOpen(false);
      load();
    } catch (e: unknown) {
      toast({
        title: 'Error',
        description: e instanceof SyntaxError ? 'Invalid JSON' : 'Could not save',
        variant: 'destructive',
      });
    }
  };

  const doAttach = async () => {
    if (!addToolId) {
      toast({ title: 'Pick a tool', variant: 'destructive' });
      return;
    }
    try {
      const parsed = JSON.parse(addArgsJson || '{}') as Record<string, unknown>;
      await assistantToolsApi.attach(assistantId, addToolId, parsed);
      toast({ title: 'Attached', description: 'Tool added to this assistant.' });
      setAddOpen(false);
      setAddToolId('');
      setAddArgsJson('{\n  "path": "/my-profile"\n}');
      load();
    } catch (e: unknown) {
      toast({
        title: 'Error',
        description: e instanceof SyntaxError ? 'Invalid JSON' : 'Attach failed (maybe already attached)',
        variant: 'destructive',
      });
    }
  };

  const doDetach = async (tool: Tool) => {
    if (!confirm(`Remove ${tool.key} from this assistant?`)) return;
    try {
      await assistantToolsApi.detach(assistantId, tool.id);
      toast({ title: 'Removed', description: tool.key });
      load();
    } catch {
      toast({ title: 'Error', description: 'Detach failed', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Button variant="ghost" asChild className="text-neutral-400 hover:text-white -ml-2 mb-2">
            <Link href="/dashboard/assistants">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Assistants
            </Link>
          </Button>
          <h2 className="text-3xl font-semibold text-white">Assistant tools</h2>
          <p className="text-neutral-400 text-sm max-w-2xl">
            Set default parameters per tool for this assistant (merged with what the model sends). For{' '}
            <code className="text-neutral-300">app.navigate</code>, use{' '}
            <code className="text-neutral-300">{`{"path":"/my-profile"}`}</code>. For{' '}
            <code className="text-neutral-300">dom.click</code>, use{' '}
            <code className="text-neutral-300">{`{"selector":"#submit"}`}</code>, and so on.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="bg-white text-neutral-900 hover:bg-white/90">
          <Plus className="h-4 w-4 mr-2" />
          Attach tool
        </Button>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Tools on this assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-neutral-400">Key</TableHead>
                <TableHead className="text-neutral-400">Name</TableHead>
                <TableHead className="text-neutral-400">Executor</TableHead>
                <TableHead className="text-neutral-400">Effective defaults</TableHead>
                <TableHead className="text-right text-neutral-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : attached.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                    No tools yet. Attach client tools and set paths or selectors here.
                  </TableCell>
                </TableRow>
              ) : (
                attached.map((tool) => (
                  <TableRow key={tool.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-mono text-sm text-white">{tool.key}</TableCell>
                    <TableCell className="text-neutral-300">{tool.displayName}</TableCell>
                    <TableCell className="text-xs text-neutral-500 font-mono">{tool.executorRef}</TableCell>
                    <TableCell className="max-w-md">
                      <pre className="text-[11px] text-neutral-400 whitespace-pre-wrap break-all font-mono bg-black/30 rounded p-2 border border-white/5">
                        {JSON.stringify(tool.defaultArguments ?? {}, null, 2)}
                      </pre>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="text-neutral-300" onClick={() => openEdit(tool)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-400" onClick={() => doDetach(tool)}>
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

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="border-white/10 bg-neutral-900 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Attach client tool</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Choose a tool from the catalog and set JSON default arguments for this assistant only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-white">Tool</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-white/5 text-white px-3 text-sm"
                value={addToolId}
                onChange={(e) => setAddToolId(e.target.value)}
              >
                <option value="">Select…</option>
                {attachable.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.key} — {t.displayName}
                  </option>
                ))}
              </select>
              {attachable.length === 0 && (
                <p className="text-xs text-neutral-500 mt-2">All client tools are already attached.</p>
              )}
            </div>
            <div>
              <Label className="text-white">Default arguments (JSON)</Label>
              <Textarea
                value={addArgsJson}
                onChange={(e) => setAddArgsJson(e.target.value)}
                className="mt-1 font-mono text-xs border-white/10 bg-black/30 text-neutral-200 min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} className="border-white/10 text-neutral-300">
              Cancel
            </Button>
            <Button onClick={doAttach} className="bg-white text-neutral-900">
              Attach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="border-white/10 bg-neutral-900 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Edit parameters</DialogTitle>
            <DialogDescription className="text-neutral-400">
              {editTool ? editTool.key : ''} — defaults merged for this assistant
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editArgsJson}
            onChange={(e) => setEditArgsJson(e.target.value)}
            className="font-mono text-xs border-white/10 bg-black/30 text-neutral-200 min-h-[160px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="border-white/10 text-neutral-300">
              Cancel
            </Button>
            <Button onClick={saveEdit} className="bg-white text-neutral-900">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
