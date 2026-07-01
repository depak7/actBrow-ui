'use client';

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { flowsApi, assistantsApi, assistantToolsApi } from '@/lib/api';
import type { NavigationFlow, Assistant, Tool } from '@/types';
import { Plus, Trash2, Workflow } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { readStoredUserId, setActiveAssistant } from '@/lib/session';

// Stable per-step id so React keys survive removing a middle step (index keys mis-associate
// the <select> value with the wrong row).
let stepIdCounter = 0;
const nextStepId = () => `step-${stepIdCounter++}`;

export default function FlowsPage() {
  const { toast } = useToast();
  const [flows, setFlows] = useState<NavigationFlow[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<string>('');
  const [assistantNavigateTools, setAssistantNavigateTools] = useState<Tool[]>([]);
  const [newFlow, setNewFlow] = useState({
    name: '',
    triggerPhrase: '',
    enabled: true,
    steps: [{ id: nextStepId(), toolId: '' }],
  });

  const activateSelectedAssistant = () => {
    const assistant = assistants.find((a) => a.id === selectedAssistant);
    if (assistant) setActiveAssistant(assistant);
  };
  const selectedAssistantName = assistants.find((a) => a.id === selectedAssistant)?.name || '';
  const fetchFlows = async () => { if (!selectedAssistant) { setFlows([]); setLoading(false); return; } try { activateSelectedAssistant(); const data = await flowsApi.list(selectedAssistant); setFlows(data); } catch (error) { toast({ title: 'Error', description: 'Failed', variant: 'destructive' }); } finally { setLoading(false); } };
  const fetchAssistants = async () => { try { const userId = readStoredUserId(); if (!userId) throw new Error('Missing user'); const data = await assistantsApi.list(userId); setAssistants(data); if (data.length > 0) { setActiveAssistant(data[0]); setSelectedAssistant(data[0].id); } else { setLoading(false); } } catch (error) { console.error(error); setLoading(false); } };
  const fetchAssistantNavigateTools = async () => {
    if (!selectedAssistant) {
      setAssistantNavigateTools([]);
      return;
    }
    try {
      activateSelectedAssistant();
      const tools = await assistantToolsApi.list(selectedAssistant);
      setAssistantNavigateTools(
        tools.filter((t) => t.type === 'CLIENT' && t.executorRef === 'app.navigate' && t.enabled)
      );
    } catch {
      setAssistantNavigateTools([]);
      toast({ title: 'Error', description: 'Could not load assistant tools', variant: 'destructive' });
    }
  };

  useEffect(() => { fetchAssistants(); }, []);
  useEffect(() => { if (selectedAssistant) fetchFlows(); }, [selectedAssistant]);
  useEffect(() => {
    if (selectedAssistant) fetchAssistantNavigateTools();
  }, [selectedAssistant]);

  const handleCreate = async () => {
    if (!selectedAssistant) { toast({ title: 'Error', description: 'Select assistant', variant: 'destructive' }); return; }
    const missingTool = newFlow.steps.some((s) => !s.toolId);
    if (missingTool) {
      toast({ title: 'Steps incomplete', description: 'Pick an existing navigation tool for every step.', variant: 'destructive' });
      return;
    }
    const steps = newFlow.steps.map((s) => {
      const tool = assistantNavigateTools.find((t) => t.id === s.toolId)!;
      return {
        action: tool.executorRef || 'app.navigate',
        target: tool.key,
        description: tool.displayName,
      };
    });
    try {
      await flowsApi.create(selectedAssistant, {
        name: newFlow.name,
        triggerPhrase: newFlow.triggerPhrase,
        enabled: newFlow.enabled,
        steps,
      });
      posthog.capture('flow_created', {
        assistant_id: selectedAssistant,
        step_count: steps.length,
        enabled: newFlow.enabled,
      });
      toast({ title: 'Success', description: 'Created' });
      setCreateDialogOpen(false);
      setNewFlow({ name: '', triggerPhrase: '', enabled: true, steps: [{ id: nextStepId(), toolId: '' }] });
      fetchFlows();
    }
    catch (error: unknown) {
      const msg =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast({ title: 'Error', description: msg || 'Failed to create flow', variant: 'destructive' });
    }
  };

  const handleDelete = async (flowId: string) => {
    if (!selectedAssistant) return;
    if (!confirm('Are you sure?')) return;
    try {
      await flowsApi.delete(selectedAssistant, flowId);
      posthog.capture('flow_deleted', { flow_id: flowId, assistant_id: selectedAssistant });
      toast({ title: 'Success', description: 'Deleted' });
      fetchFlows();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed', variant: 'destructive' });
    }
  };

  const addStep = () => setNewFlow({ ...newFlow, steps: [...newFlow.steps, { id: nextStepId(), toolId: '' }] });
  const removeStep = (index: number) => setNewFlow({ ...newFlow, steps: newFlow.steps.filter((_, i) => i !== index) });
  const updateStep = (index: number, value: string) => {
    const newSteps = [...newFlow.steps];
    newSteps[index] = { ...newSteps[index], toolId: value };
    setNewFlow({ ...newFlow, steps: newSteps });
  };

  const flowCreateDisabled =
    assistantNavigateTools.length === 0 ||
    !newFlow.name.trim() ||
    !newFlow.triggerPhrase.trim() ||
    newFlow.steps.some((s) => !s.toolId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-3xl font-semibold text-white">Navigation Flows</h2><p className="text-neutral-400">Create automated workflows{selectedAssistantName ? ` for ${selectedAssistantName}` : ''}</p></div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild><Button disabled={!selectedAssistant} className="bg-white text-neutral-900 hover:bg-white/90"><Plus className="h-4 w-4 mr-2" />Create Flow</Button></DialogTrigger>
          <DialogContent className="max-w-2xl border-white/10 bg-neutral-900">
            <DialogHeader><DialogTitle className="text-white">Create Flow</DialogTitle><DialogDescription className="text-neutral-400">Define step-by-step automation</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><label className="text-sm font-medium text-white">Name</label><Input value={newFlow.name} onChange={(e) => setNewFlow({ ...newFlow, name: e.target.value })} className="border-white/10 bg-white/5 text-white" /></div>
              <div className="grid gap-2"><label className="text-sm font-medium text-white">Trigger Phrase</label><Input value={newFlow.triggerPhrase} onChange={(e) => setNewFlow({ ...newFlow, triggerPhrase: e.target.value })} placeholder="go to folders|open folders" className="border-white/10 bg-white/5 text-white" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="enabled" checked={newFlow.enabled} onChange={(e) => setNewFlow({ ...newFlow, enabled: e.target.checked })} className="h-4 w-4" /><label htmlFor="enabled" className="text-sm font-medium text-white">Enabled</label></div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="text-sm font-medium text-white">Steps · navigation tools</label>
                  <Button type="button" variant="outline" size="sm" onClick={addStep} disabled={assistantNavigateTools.length === 0} className="border-white/10 text-neutral-300 disabled:opacity-40">
                    Add step
                  </Button>
                </div>
                {assistantNavigateTools.length === 0 ? (
                  <p className="text-sm text-amber-200/90 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                    Attach at least one <span className="font-mono">app.navigate</span> client tool to this assistant (Dashboard → Assistants → Tools), then create a flow.
                  </p>
                ) : null}
                {newFlow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2 p-3 border border-white/10 rounded-lg bg-white/5">
                    <span className="text-sm font-medium text-neutral-400 shrink-0">{index + 1}.</span>
                    <select
                      value={step.toolId}
                      onChange={(e) => updateStep(index, e.target.value)}
                      className="flex h-9 flex-1 rounded-md border border-white/10 bg-white/5 text-white px-2 text-sm"
                    >
                      <option value="">Select tool…</option>
                      {assistantNavigateTools.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.displayName} ({t.key})
                        </option>
                      ))}
                    </select>
                    {newFlow.steps.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeStep(index)} className="text-red-400 shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-white/10 text-neutral-300">Cancel</Button>
              <Button type="button" onClick={handleCreate} disabled={flowCreateDisabled} className="bg-white text-neutral-900 hover:bg-white/90 disabled:opacity-50">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle className="text-white">Assistant</CardTitle></CardHeader>
        <CardContent>
          {assistants.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-6">
              <p className="text-sm font-medium text-white">No assistants yet</p>
              <p className="mt-1 text-sm text-neutral-400">Create an assistant first, then come back to add navigation flows.</p>
            </div>
          ) : (
            <select value={selectedAssistant} onChange={(e) => setSelectedAssistant(e.target.value)} className="flex h-10 rounded-md border border-white/10 bg-white/5 text-white px-3 text-sm">
              {assistants.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}
            </select>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle className="text-white">Configured Flows</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="border-white/10"><TableHead className="text-neutral-400">Name</TableHead><TableHead className="text-neutral-400">Trigger</TableHead><TableHead className="text-neutral-400">Steps</TableHead><TableHead className="text-neutral-400">Enabled</TableHead><TableHead className="text-right text-neutral-400">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {loading ? (<TableRow><TableCell colSpan={5} className="text-center py-8 text-neutral-500">Loading...</TableCell></TableRow>) : flows.length === 0 ? (<TableRow><TableCell colSpan={5} className="text-center py-8 text-neutral-500">{selectedAssistant ? 'No flows' : 'Select assistant'}</TableCell></TableRow>) : (
                flows.map((flow) => (
                  <TableRow key={flow.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{flow.name}</TableCell>
                    <TableCell className="font-mono text-sm text-neutral-300">{flow.triggerPhrase}</TableCell>
                    <TableCell><div className="flex items-center gap-2"><Workflow className="h-4 w-4 text-white" /><span className="text-sm text-neutral-300">{flow.steps.length}</span></div></TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${flow.enabled ? 'bg-white/20 text-white border border-white/30' : 'bg-white/5 text-neutral-500 border border-white/10'}`}>{flow.enabled ? 'Yes' : 'No'}</span></TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleDelete(flow.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></Button></TableCell>
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
