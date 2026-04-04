'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { assistantsApi } from '@/lib/api';
import type { Assistant } from '@/types';
import Link from 'next/link';
import { Plus, Trash2, Copy, Check, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AssistantsPage() {
  const { toast } = useToast();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newAssistant, setNewAssistant] = useState({ key: '', name: '', systemPrompt: '', model: 'groq:llama-3.3-70b-versatile', usePredefinedFlows: true });

  const fetchAssistants = async () => { 
    try { 
      const data = await assistantsApi.list(); 
      setAssistants(data); 
    } catch (error) { 
      toast({ title: 'Error', description: 'Failed to load assistants', variant: 'destructive' }); 
    } finally { 
      setLoading(false); 
    } 
  };
  
  useEffect(() => { fetchAssistants(); }, []);

  const handleCreate = async () => {
    try {
      await assistantsApi.create(newAssistant);
      toast({ title: 'Success', description: 'Assistant created successfully' });
      setCreateDialogOpen(false); 
      setNewAssistant({ key: '', name: '', systemPrompt: '', model: 'groq:llama-3.3-70b-versatile', usePredefinedFlows: true }); 
      fetchAssistants();
    } catch (error: any) { 
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to create assistant', variant: 'destructive' }); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try { 
      await assistantsApi.delete(id); 
      toast({ title: 'Success', description: 'Assistant deleted' }); 
      fetchAssistants(); 
    } catch (error) { 
      toast({ title: 'Error', description: 'Failed to delete assistant', variant: 'destructive' }); 
    }
  };

  const copyAssistantId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast({ title: 'Copied!', description: 'Assistant ID copied to clipboard' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-3xl font-semibold text-white">Assistants</h2><p className="text-neutral-400">Manage your AI assistants</p></div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild><Button className="bg-white text-neutral-900 hover:bg-white/90"><Plus className="h-4 w-4 mr-2" />Create Assistant</Button></DialogTrigger>
          <DialogContent className="border-white/10 bg-neutral-900">
            <DialogHeader><DialogTitle className="text-white">Create Assistant</DialogTitle><DialogDescription className="text-neutral-400">Configure your AI assistant</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><label className="text-sm font-medium text-white">Key</label><Input value={newAssistant.key} onChange={(e) => setNewAssistant({ ...newAssistant, key: e.target.value })} className="border-white/10 bg-white/5 text-white" /></div>
              <div className="grid gap-2"><label className="text-sm font-medium text-white">Name</label><Input value={newAssistant.name} onChange={(e) => setNewAssistant({ ...newAssistant, name: e.target.value })} className="border-white/10 bg-white/5 text-white" /></div>
              <div className="grid gap-2"><label className="text-sm font-medium text-white">Model</label><select value={newAssistant.model} onChange={(e) => setNewAssistant({ ...newAssistant, model: e.target.value })} className="flex h-10 rounded-md border border-white/10 bg-white/5 text-white px-3"><option value="groq:llama-3.3-70b-versatile">Llama 3.3 70B</option><option value="gemini:gemini-2.5-flash">Gemini 2.5 Flash</option></select></div>
              <div className="grid gap-2"><label className="text-sm font-medium text-white">System Prompt</label><textarea value={newAssistant.systemPrompt} onChange={(e) => setNewAssistant({ ...newAssistant, systemPrompt: e.target.value })} className="flex min-h-[80px] rounded-md border border-white/10 bg-white/5 text-white px-3" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="usePredefinedFlows" checked={newAssistant.usePredefinedFlows} onChange={(e) => setNewAssistant({ ...newAssistant, usePredefinedFlows: e.target.checked })} className="h-4 w-4" /><label htmlFor="usePredefinedFlows" className="text-sm font-medium text-white">Use Predefined Flows</label></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-white/10 text-neutral-300">Cancel</Button><Button onClick={handleCreate} className="bg-white text-neutral-900 hover:bg-white/90">Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle className="text-white">Your Assistants</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="border-white/10"><TableHead className="text-neutral-400">Key</TableHead><TableHead className="text-neutral-400">Name</TableHead><TableHead className="text-neutral-400">Model</TableHead><TableHead className="text-neutral-400">Flows</TableHead><TableHead className="text-neutral-400">Assistant ID</TableHead><TableHead className="text-neutral-400">Tools</TableHead><TableHead className="text-right text-neutral-400">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {loading ? (<TableRow><TableCell colSpan={7} className="text-center py-8 text-neutral-500">Loading...</TableCell></TableRow>) : assistants.length === 0 ? (<TableRow><TableCell colSpan={7} className="text-center py-8 text-neutral-500">No assistants yet. Create your first assistant to get started.</TableCell></TableRow>) : (
                assistants.map((assistant) => (
                  <TableRow key={assistant.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{assistant.key}</TableCell>
                    <TableCell className="text-neutral-300">{assistant.name}</TableCell>
                    <TableCell className="text-sm text-neutral-300">{assistant.model}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${assistant.usePredefinedFlows ? 'bg-white/20 text-white border border-white/30' : 'bg-white/5 text-neutral-500 border border-white/10'}`}>{assistant.usePredefinedFlows ? 'Yes' : 'No'}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-white/5 px-2 py-1 rounded text-neutral-400 font-mono">{assistant.id.substring(0, 8)}...</code>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-400 hover:text-white" onClick={() => copyAssistantId(assistant.id)}>
                          {copiedId === assistant.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild className="border-white/10 text-neutral-200 h-8">
                        <Link href={`/dashboard/assistants/${assistant.id}/tools`}>
                          <Wrench className="h-3.5 w-3.5 mr-1" />
                          Tools
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleDelete(assistant.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></Button></TableCell>
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
