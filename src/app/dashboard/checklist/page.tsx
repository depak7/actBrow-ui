'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Circle, ArrowRight, PlugZap, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CodePanel } from '@/components/code-panel';
import { activationApi, assistantsApi } from '@/lib/api';
import type { ActivationStatus, Assistant } from '@/types';
import { getActiveAssistantId, readStoredUserId, setActiveAssistant } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ChecklistPage() {
  const { toast } = useToast();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantId, setAssistantId] = useState('');
  const [status, setStatus] = useState<ActivationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const userId = readStoredUserId();
    if (!userId) throw new Error('Missing user');
    const list = await assistantsApi.list(userId);
    setAssistants(list);
    const stored = getActiveAssistantId();
    const selected =
      (assistantId && list.some((a) => a.id === assistantId) && assistantId) ||
      (stored && list.some((a) => a.id === stored) && stored) ||
      list[0]?.id ||
      '';
    if (selected !== assistantId) setAssistantId(selected);
    if (!selected) {
      setStatus(null);
      return;
    }
    const assistant = list.find((a) => a.id === selected);
    if (assistant) setActiveAssistant(assistant);
    setStatus(await activationApi.get(selected));
  }, [assistantId]);

  useEffect(() => {
    setLoading(true);
    load()
      .catch(() => toast({ title: 'Error', description: 'Failed to load activation status', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [load, toast]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-white">Getting started</h2>
        <p className="mt-1 text-neutral-400">
          Track the path from assistant → tools → embed → first successful run.
        </p>
      </div>

      {assistants.length > 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="pt-6">
            <select
              value={assistantId}
              onChange={(e) => setAssistantId(e.target.value)}
              className="flex h-10 w-full max-w-md rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
            >
              {assistants.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : assistants.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <PlugZap className="h-10 w-10 text-neutral-600" />
            <p className="text-lg font-medium text-white">Create an assistant first</p>
            <Button asChild className="bg-white text-neutral-900 hover:bg-white/90">
              <Link href="/dashboard/assistants">
                <Plus className="mr-2 h-4 w-4" />
                Create assistant
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : status ? (
        <>
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">
                {status.completedSteps}/{status.totalSteps} steps complete
                {status.ready ? ' — ready to embed' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {status.steps.map((step) => (
                <Link
                  key={step.id}
                  href={step.href}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border p-4 transition-colors',
                    step.done
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-white/10 bg-black/20 hover:bg-white/5'
                  )}
                >
                  {step.done ? (
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{step.title}</p>
                    <p className="mt-1 text-sm text-neutral-400">{step.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-neutral-500" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Magic link example</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-neutral-400">
                  Open the widget on a path with a prefilled ask. Add{' '}
                  <code className="text-neutral-200">actbrow_send=1</code> to auto-send.
                </p>
                <CodePanel
                  code={status.magicLinkExample}
                  filename="magic-link.txt"
                  language="text"
                  maxHeight="max-h-32"
                  copyLabel="Copy link"
                />
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Next actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button asChild className="bg-white text-neutral-900 hover:bg-white/90">
                  <Link href="/dashboard/connect">Open Connect</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/15 text-white hover:bg-white/5">
                  <Link href="/dashboard/integrations">Import OpenAPI</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/15 text-white hover:bg-white/5">
                  <Link href="/dashboard/mcp">Connect MCP</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
