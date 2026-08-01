'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, Bot, MessageSquareText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { conversationsApi, runInspectionApi } from '@/lib/api';
import type { Conversation, ConversationMessage, RunInspection, RunSummary } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { RunList } from '@/components/runs/run-list';
import { RunTimeline, RunTimelineSkeleton } from '@/components/runs/run-timeline';

function formatDate(value?: string | null) {
  if (!value) return 'No messages yet';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function roleLabel(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

export default function ConversationsPage() {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [inspection, setInspection] = useState<RunInspection | null>(null);
  const [loadingInspection, setLoadingInspection] = useState(false);

  const groupedConversations = useMemo(() => {
    return conversations.reduce<Record<string, Conversation[]>>((groups, conversation) => {
      const key = conversation.assistantName || conversation.assistantId;
      groups[key] = groups[key] || [];
      groups[key].push(conversation);
      return groups;
    }, {});
  }, [conversations]);

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedConversationId) || null;

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const data = await conversationsApi.list();
      setConversations(data);
      setSelectedConversationId((current) => {
        if (current && data.some((conversation) => conversation.id === current)) {
          return current;
        }
        return data[0]?.id || null;
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load conversations', variant: 'destructive' });
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    void fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const data = await conversationsApi.getMessages(selectedConversationId);
        setMessages(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load conversation messages', variant: 'destructive' });
      } finally {
        setLoadingMessages(false);
      }
    };

    void fetchMessages();
  }, [selectedConversationId, toast]);

  const fetchRuns = useCallback(
    async (conversationId: string) => {
      try {
        setLoadingRuns(true);
        const data = await runInspectionApi.listForConversation(conversationId);
        setRuns(data);
        setSelectedRunId((current) => {
          if (current && data.some((run) => run.id === current)) {
            return current;
          }
          return data[0]?.id || null;
        });
      } catch (error) {
        setRuns([]);
        setSelectedRunId(null);
        toast({ title: 'Error', description: 'Failed to load runs for this conversation', variant: 'destructive' });
      } finally {
        setLoadingRuns(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!selectedConversationId) {
      setRuns([]);
      setSelectedRunId(null);
      return;
    }
    setSelectedRunId(null);
    void fetchRuns(selectedConversationId);
  }, [selectedConversationId, fetchRuns]);

  useEffect(() => {
    if (!selectedRunId) {
      setInspection(null);
      return;
    }

    let cancelled = false;

    const fetchInspection = async () => {
      try {
        setLoadingInspection(true);
        const data = await runInspectionApi.steps(selectedRunId);
        if (!cancelled) setInspection(data);
      } catch (error) {
        if (!cancelled) {
          setInspection(null);
          toast({ title: 'Error', description: 'Failed to load run steps', variant: 'destructive' });
        }
      } finally {
        if (!cancelled) setLoadingInspection(false);
      }
    };

    void fetchInspection();

    return () => {
      cancelled = true;
    };
  }, [selectedRunId, toast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">Conversations</h2>
          <p className="text-neutral-400">Review user conversations grouped by assistant</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-white/10 text-white gap-2"
          onClick={() => void fetchConversations()}
          disabled={loadingConversations}
        >
          <RefreshCw className={cn('h-4 w-4', loadingConversations && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Assistant conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {loadingConversations ? (
              <p className="text-sm text-neutral-500">Loading conversations...</p>
            ) : conversations.length === 0 ? (
              <p className="text-sm text-neutral-500">No conversations yet.</p>
            ) : (
              Object.entries(groupedConversations).map(([assistantName, assistantConversations]) => (
                <section key={assistantName} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium text-white truncate">{assistantName}</h3>
                    <span className="text-xs text-neutral-500">{assistantConversations.length}</span>
                  </div>
                  <div className="space-y-2">
                    {assistantConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() => setSelectedConversationId(conversation.id)}
                        className={cn(
                          'w-full rounded-lg border px-3 py-3 text-left transition-colors',
                          selectedConversationId === conversation.id
                            ? 'border-white/30 bg-white/15'
                            : 'border-white/10 bg-black/20 hover:bg-white/10'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono text-neutral-400">
                            {conversation.id.substring(0, 8)}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {formatDate(conversation.lastMessageAt || conversation.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-neutral-200">
                          {conversation.lastMessagePreview || 'No messages yet'}
                        </p>
                        <p className="mt-2 text-xs text-neutral-500">
                          {conversation.messageCount || 0} messages
                        </p>
                      </button>
                    ))}
                  </div>
                </section>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 min-h-[560px]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquareText className="h-5 w-5" />
              {selectedConversation ? selectedConversation.assistantName || 'Conversation' : 'Conversation'}
            </CardTitle>
            {selectedConversation ? (
              <p className="text-xs text-neutral-500">
                Conversation {selectedConversation.id} started {formatDate(selectedConversation.createdAt)}
              </p>
            ) : null}
          </CardHeader>
          <CardContent>
            {!selectedConversation ? (
              <div className="flex min-h-[380px] items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-neutral-500">
                Select a conversation to view messages.
              </div>
            ) : loadingMessages ? (
              <p className="text-sm text-neutral-500">Loading messages...</p>
            ) : messages.length === 0 ? (
              <div className="flex min-h-[380px] items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-neutral-500">
                This conversation does not have messages yet.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isUser = message.role === 'USER';
                  return (
                    <article
                      key={message.id}
                      className={cn(
                        'rounded-xl border p-4',
                        isUser ? 'border-white/15 bg-white/10' : 'border-white/10 bg-black/25'
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                          {roleLabel(message.role)}
                        </span>
                        <span className="text-xs text-neutral-500">{formatDate(message.createdAt)}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-100">{message.content}</p>
                    </article>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Run inspection
            </CardTitle>
            <p className="mt-1 text-xs text-neutral-400">
              Why the agent did what it did: plan, act and verify steps recorded for each run.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/10 text-white gap-2"
            onClick={() => selectedConversationId && void fetchRuns(selectedConversationId)}
            disabled={!selectedConversationId || loadingRuns}
          >
            <RefreshCw className={cn('h-4 w-4', loadingRuns && 'animate-spin')} />
            Refresh runs
          </Button>
        </CardHeader>
        <CardContent>
          {!selectedConversation ? (
            <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-neutral-500">
              Select a conversation to inspect its runs.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white">Runs</h3>
                <RunList
                  runs={runs}
                  selectedRunId={selectedRunId}
                  onSelect={setSelectedRunId}
                  loading={loadingRuns}
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white">Timeline</h3>
                {loadingInspection ? (
                  <RunTimelineSkeleton />
                ) : !selectedRunId || !inspection ? (
                  <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-neutral-500">
                    {runs.length === 0 && !loadingRuns
                      ? 'No runs for this conversation yet.'
                      : 'Select a run to see its steps.'}
                  </div>
                ) : (
                  <RunTimeline inspection={inspection} />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
