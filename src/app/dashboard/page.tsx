'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { assistantsApi, flowsApi, toolsApi } from '@/lib/api';
import {
  copyStoredAccountApiKey,
  getStoredAccountApiKeyPreview,
  readStoredUserId,
  setActiveAssistant,
} from '@/lib/session';
import { Bot, Wrench, Workflow, ArrowRight, Key, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState({ assistants: 0, tools: 0, flows: 0 });
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [apiKeyPreview, setApiKeyPreview] = useState('');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  useEffect(() => {
    const syncKey = () => {
      setApiKeyPreview(getStoredAccountApiKeyPreview());
    };
    syncKey();
    window.addEventListener('actbrow-api-key-changed', syncKey);
    window.addEventListener('storage', syncKey);
    return () => {
      window.removeEventListener('actbrow-api-key-changed', syncKey);
      window.removeEventListener('storage', syncKey);
    };
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsError(null);
        const userId = readStoredUserId();
        if (!userId) {
          throw new Error('Missing signed-in user');
        }
        const assistants = await assistantsApi.list(userId);
        if (assistants.length === 0) {
          setStats({ assistants: 0, tools: 0, flows: 0 });
          return;
        }
        setActiveAssistant(assistants[0]);
        const tools = await toolsApi.list();
        const flowLists = await Promise.all(
          assistants.map((a) => flowsApi.list(a.id).catch(() => [])),
        );
        const flows = flowLists.reduce((sum, list) => sum + list.length, 0);
        setStats({ assistants: assistants.length, tools: tools.length, flows });
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to load dashboard';
        setStatsError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const copyApiKey = async () => {
    const result = await copyStoredAccountApiKey();
    if (result.ok) {
      setApiKeyCopied(true);
      toast({ title: 'Copied to clipboard' });
      setTimeout(() => setApiKeyCopied(false), 2000);
    } else {
      toast({
        title: 'Copy failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const statCards = [
    { title: 'My Assistants', value: stats.assistants, icon: Bot },
    { title: 'Available Tools', value: stats.tools, icon: Wrench },
    { title: 'Navigation Flows', value: stats.flows, icon: Workflow },
  ];

  const quickActions = [
    { label: 'Create Assistant', href: '/dashboard/assistants', icon: Bot },
    { label: 'Create Flow', href: '/dashboard/flows', icon: Workflow },
    { label: 'Create Tool', href: '/dashboard/tools', icon: Wrench },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-white">Dashboard</h2>
        <p className="text-neutral-400 mt-1">Manage your AI assistants and resources</p>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base font-medium">
            <Key className="h-4 w-4 text-neutral-400 shrink-0" aria-hidden />
            API key
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-0">
          {apiKeyPreview ? (
            <>
              <code
                className="text-sm text-neutral-300 font-mono break-all bg-black/30 rounded-md px-3 py-2 border border-white/10 flex-1 min-w-0"
                aria-label="API key preview"
              >
                {apiKeyPreview}
              </code>
              <Button
                type="button"
                variant="outline"
                className="shrink-0 border-white/10 text-white gap-2"
                onClick={() => void copyApiKey()}
                aria-label="Copy API key"
              >
                {apiKeyCopied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                Copy
              </Button>
            </>
          ) : (
            <p className="text-sm text-neutral-500">No key for this session. Sign in again.</p>
          )}
        </CardContent>
      </Card>

      {statsError ? (
        <div
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
          role="alert"
        >
          Could not load stats: {statsError}. Check your API key on{' '}
          <a href="/login" className="underline font-medium text-white">
            Login
          </a>
          .
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-white/10 bg-white/5 card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-neutral-400">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-white">{loading ? '-' : stat.value}</div>
              <p className="text-xs text-neutral-500 mt-1">Active resources</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle className="text-white">Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="flex items-center justify-between p-5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-lg bg-white/10 flex items-center justify-center">
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{action.label}</p>
                    <p className="text-xs text-neutral-500">Create new {action.label.toLowerCase()}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-neutral-500 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
