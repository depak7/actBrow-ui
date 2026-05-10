'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { assistantsApi, knowledgeApi } from '@/lib/api';
import type { Assistant, KnowledgeDocument } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { BookOpenCheck, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { readStoredUserId, setActiveAssistant } from '@/lib/session';

const emptyDraft = {
  title: '',
  source: '',
  content: '',
  enabled: true,
};

export default function KnowledgePage() {
  const { toast } = useToast();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantId, setAssistantId] = useState('');
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const loadDocuments = async (currentAssistantId: string) => {
    if (!currentAssistantId) {
      setDocuments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const assistant = assistants.find((a) => a.id === currentAssistantId);
      if (assistant) setActiveAssistant(assistant);
      setDocuments(await knowledgeApi.list(currentAssistantId));
    } catch {
      toast({ title: 'Error', description: 'Failed to load knowledge', variant: 'destructive' });
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssistants();
  }, []);

  useEffect(() => {
    loadDocuments(assistantId);
  }, [assistantId]);

  const createDocument = async () => {
    if (!assistantId) {
      toast({ title: 'Choose an assistant', variant: 'destructive' });
      return;
    }
    if (!draft.title.trim() || !draft.content.trim()) {
      toast({ title: 'Title and content required', variant: 'destructive' });
      return;
    }
    try {
      await knowledgeApi.create(assistantId, {
        title: draft.title.trim(),
        source: draft.source.trim() || null,
        content: draft.content.trim(),
        enabled: draft.enabled,
      });
      setDialogOpen(false);
      setDraft(emptyDraft);
      await loadDocuments(assistantId);
      toast({ title: 'Saved', description: 'Knowledge document added to this assistant.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save knowledge', variant: 'destructive' });
    }
  };

  const deleteDocument = async (doc: KnowledgeDocument) => {
    if (!assistantId || !confirm(`Delete "${doc.title}"?`)) {
      return;
    }
    try {
      await knowledgeApi.delete(assistantId, doc.id);
      await loadDocuments(assistantId);
      toast({ title: 'Deleted', description: doc.title });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete document', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">Knowledge</h2>
          <p className="mt-1 text-neutral-400">
            Add assistant-specific facts, playbooks, and product context for lightweight retrieval.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-neutral-900 hover:bg-white/90">
              <Plus className="mr-2 h-4 w-4" />
              Add document
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-neutral-900 sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Add Knowledge Document</DialogTitle>
              <DialogDescription className="text-neutral-400">
                Keep documents focused. Retrieval works better with short operational notes than giant dumps.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label className="text-white">Title</Label>
                <Input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="Refund policy"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-white">Source</Label>
                <Input
                  value={draft.source}
                  onChange={(e) => setDraft({ ...draft, source: e.target.value })}
                  className="border-white/10 bg-white/5 text-white"
                  placeholder="Internal SOP · March 2026"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-white">Content</Label>
                <Textarea
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  className="min-h-[220px] border-white/10 bg-white/5 text-white"
                  placeholder="Write the facts and rules the assistant should rely on."
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={draft.enabled}
                  onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
                  className="h-4 w-4"
                />
                Enabled for retrieval
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-white/10 text-neutral-300">
                Cancel
              </Button>
              <Button onClick={createDocument} className="bg-white text-neutral-900 hover:bg-white/90">
                Save
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
          <CardTitle className="text-white">Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="py-8 text-center text-neutral-500">Loading…</p>
          ) : !assistantId ? (
            <p className="py-8 text-center text-neutral-500">Select an assistant to manage knowledge.</p>
          ) : documents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
              <BookOpenCheck className="mx-auto h-10 w-10 text-neutral-500" />
              <p className="mt-3 text-sm text-neutral-400">
                No knowledge documents yet. Add one for pricing rules, troubleshooting steps, or product facts.
              </p>
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-medium text-white">{doc.title}</h3>
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] ${doc.enabled ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-neutral-500'}`}>
                        {doc.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    {doc.source ? <p className="mt-1 text-xs text-neutral-500">{doc.source}</p> : null}
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => deleteDocument(doc)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-neutral-300">{doc.content}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
