'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { conversationsApi, runsApi } from '@/lib/api';
import { API_BASE_URL } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Loader2, RotateCcw, Send, Wrench } from 'lucide-react';

type Entry =
  | { kind: 'user'; text: string }
  | { kind: 'assistant'; text: string }
  | { kind: 'tool'; toolKey: string; detail: string; simulated: boolean }
  | { kind: 'error'; text: string };

interface ToolRequestedPayload {
  toolCallId: string;
  toolKey: string;
  executorKey?: string;
  type?: string;
  arguments?: Record<string, unknown>;
}

/**
 * Lets an operator try their assistant without embedding the widget in a real app.
 *
 * Client-side tools (navigation, browser HTTP) cannot genuinely run here — there is no host app to
 * navigate and no same-origin session to borrow — so they are answered with a clearly-labelled
 * simulated result. That still exercises the part worth testing (does the agent pick the right tool
 * with the right arguments) and, importantly, keeps the run moving instead of stalling until the
 * client-tool timeout and reporting a failure that is an artifact of the tester.
 */
export function AssistantTester({ assistantId }: { assistantId: string }) {
  const { toast } = useToast();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const sourceRef = useRef<EventSource | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const closeStream = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
  }, []);

  useEffect(() => closeStream, [closeStream]);
  // A different assistant means a different conversation; never continue the old thread.
  useEffect(() => {
    closeStream();
    setConversationId(null);
    setEntries([]);
    setRunning(false);
  }, [assistantId, closeStream]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  const push = (entry: Entry) => setEntries((prev) => [...prev, entry]);

  const simulateClientTool = async (runId: string, payload: ToolRequestedPayload) => {
    const key = payload.executorKey || payload.toolKey;
    const path = payload.arguments?.path ?? payload.arguments?.url;
    const detail =
      key === 'app.navigate' && path
        ? `would navigate to ${String(path)}`
        : `no browser handler in the tester`;
    push({ kind: 'tool', toolKey: payload.toolKey, detail, simulated: true });
    try {
      await runsApi.submitToolResult(runId, payload.toolCallId, {
        success: true,
        textSummary:
          `Simulated in the dashboard tester: ${detail}. Treat this as done and continue; ` +
          `do not describe page content, since nothing was actually observed.`,
      });
    } catch {
      // The run will time this call out on its own; surfacing a toast here would be noise.
    }
  };

  const streamRun = (runId: string) => {
    const apiKey = typeof window !== 'undefined' ? localStorage.getItem('actbrow_api_key') : null;
    // EventSource cannot set headers, so the API also accepts the key as a query param.
    const url =
      `${API_BASE_URL}/v1/runs/${runId}/events` + (apiKey ? `?apiKey=${encodeURIComponent(apiKey)}` : '');
    const source = new EventSource(url);
    sourceRef.current = source;

    const finish = () => {
      setRunning(false);
      closeStream();
    };

    source.addEventListener('tool.call.requested', (event) => {
      const payload = JSON.parse((event as MessageEvent).data).payload as ToolRequestedPayload;
      if (payload.type === 'CLIENT' || payload.type === 'BROWSER_HTTP') {
        void simulateClientTool(runId, payload);
        return;
      }
      const args = payload.arguments && Object.keys(payload.arguments).length
        ? JSON.stringify(payload.arguments)
        : 'no arguments';
      push({ kind: 'tool', toolKey: payload.toolKey, detail: args, simulated: false });
    });

    source.addEventListener('tool.call.completed', (event) => {
      const payload = JSON.parse((event as MessageEvent).data).payload as {
        success: boolean;
        error?: string | null;
      };
      if (!payload.success && payload.error) {
        push({ kind: 'error', text: payload.error });
      }
    });

    source.addEventListener('assistant.message.completed', (event) => {
      const payload = JSON.parse((event as MessageEvent).data).payload as { content?: string };
      push({ kind: 'assistant', text: payload.content || '(empty response)' });
      finish();
    });

    source.addEventListener('run.failed', (event) => {
      const payload = JSON.parse((event as MessageEvent).data).payload as { message?: string };
      push({ kind: 'error', text: payload.message || 'Run failed.' });
      finish();
    });

    source.addEventListener('run.cancelled', () => {
      push({ kind: 'error', text: 'Run cancelled.' });
      finish();
    });

    source.onerror = () => {
      // EventSource retries on its own; only give up once the run is no longer streaming.
      if (source.readyState === EventSource.CLOSED) finish();
    };
  };

  const send = async () => {
    const text = input.trim();
    if (!text || running) return;
    setRunning(true);
    setInput('');
    push({ kind: 'user', text });
    try {
      let id = conversationId;
      if (!id) {
        id = (await conversationsApi.create({ assistantId })).id;
        setConversationId(id);
      }
      const run = await runsApi.create(id, { content: text });
      streamRun(run.id);
    } catch {
      push({ kind: 'error', text: 'Could not start the run.' });
      setRunning(false);
      toast({ title: 'Test failed', description: 'Could not reach the assistant.', variant: 'destructive' });
    }
  };

  const reset = () => {
    closeStream();
    setConversationId(null);
    setEntries([]);
    setRunning(false);
  };

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base text-white">Test your assistant</CardTitle>
          <p className="mt-1 text-xs text-neutral-500">
            Runs against the real assistant. Navigation and browser tools are simulated here.
          </p>
        </div>
        {entries.length > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-400 hover:text-white"
            onClick={reset}
            disabled={running}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          ref={scrollRef}
          className="h-64 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-neutral-950/40 p-3"
        >
          {entries.length === 0 ? (
            <p className="py-20 text-center text-sm text-neutral-600">
              Ask something your users would ask.
            </p>
          ) : (
            entries.map((entry, index) => <EntryRow key={index} entry={entry} />)
          )}
          {running ? (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
            </div>
          ) : null}
        </div>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. take me to billing"
            disabled={running}
            className="border-white/10 bg-white/5 text-white"
          />
          <Button
            type="submit"
            disabled={running || !input.trim()}
            className="bg-white text-neutral-900 hover:bg-white/90"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EntryRow({ entry }: { entry: Entry }) {
  if (entry.kind === 'user') {
    return (
      <div className="flex justify-end">
        <span className="max-w-[85%] rounded-2xl bg-white px-3 py-1.5 text-sm text-neutral-900">
          {entry.text}
        </span>
      </div>
    );
  }
  if (entry.kind === 'assistant') {
    return (
      <div className="flex justify-start">
        <span className="max-w-[90%] whitespace-pre-wrap rounded-2xl bg-white/10 px-3 py-1.5 text-sm text-neutral-100">
          {entry.text}
        </span>
      </div>
    );
  }
  if (entry.kind === 'tool') {
    return (
      <div className="flex items-center gap-2 text-xs">
        <Wrench className="h-3 w-3 shrink-0 text-neutral-500" />
        <span className="font-mono text-neutral-300">{entry.toolKey}</span>
        <span className="truncate text-neutral-500">{entry.detail}</span>
        {entry.simulated ? (
          <span className="shrink-0 rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[10px] text-amber-300">
            simulated
          </span>
        ) : null}
      </div>
    );
  }
  return (
    <p className={cn('rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-300')}>
      {entry.text}
    </p>
  );
}
