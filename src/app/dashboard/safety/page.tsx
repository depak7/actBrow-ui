'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { safetyApi } from '@/lib/api';
import type { CircuitStatus, SafetyStatus } from '@/types';
import { areAssistantsResolved, getActiveAssistantId } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RotateCcw, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

function Toggle({
  checked,
  disabled,
  onClick,
  label,
  tone = 'emerald',
}: {
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  tone?: 'emerald' | 'amber';
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950',
        disabled && 'cursor-not-allowed opacity-50',
        checked
          ? tone === 'amber'
            ? 'border-amber-400/40 bg-amber-400/70'
            : 'border-emerald-400/40 bg-emerald-500/70'
          : 'border-white/15 bg-white/10',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );
}

export default function SafetyPage() {
  const { toast } = useToast();
  const [assistantId, setAssistantId] = useState<string | null>(null);
  // False until the header selector has fetched the assistant list at least once.
  const [resolved, setResolved] = useState(false);
  const [status, setStatus] = useState<SafetyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<'toolsEnabled' | 'shadowMode' | null>(null);
  const [resettingTool, setResettingTool] = useState<string | null>(null);
  const [confirmDisable, setConfirmDisable] = useState(false);

  // The dashboard header owns assistant selection; mirror it instead of rendering a second picker.
  useEffect(() => {
    const sync = () => {
      setAssistantId(getActiveAssistantId());
      setResolved(areAssistantsResolved());
    };
    sync();
    window.addEventListener('actbrow-active-assistant-changed', sync);
    return () => window.removeEventListener('actbrow-active-assistant-changed', sync);
  }, []);

  const load = useCallback(async (id: string) => {
    setStatus(await safetyApi.get(id));
  }, []);

  useEffect(() => {
    // Wait for the header selector to report the list settled; null alone cannot tell
    // "still loading" apart from "this account has no assistants".
    if (!resolved) return;
    if (!assistantId) {
      setStatus(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setConfirmDisable(false);
    load(assistantId)
      .catch(() =>
        toast({ title: 'Error', description: 'Failed to load safety status', variant: 'destructive' }),
      )
      .finally(() => setLoading(false));
  }, [assistantId, resolved, load, toast]);

  const patch = async (key: 'toolsEnabled' | 'shadowMode', value: boolean) => {
    if (!assistantId || !status) return;
    const previous = status;
    setStatus({ ...status, [key]: value });
    setSavingKey(key);
    try {
      // Always reconcile with what the server actually applied.
      setStatus(await safetyApi.update(assistantId, { [key]: value }));
    } catch {
      setStatus(previous);
      toast({
        title: 'Update failed',
        description:
          key === 'toolsEnabled'
            ? 'Could not change tool execution. Tools are unchanged.'
            : 'Could not change shadow mode.',
        variant: 'destructive',
      });
    } finally {
      setSavingKey(null);
    }
  };

  const resetCircuit = async (toolKey: string) => {
    if (!assistantId || !status) return;
    const previous = status;
    setStatus({
      ...status,
      circuits: status.circuits.map((c) => (c.toolKey === toolKey ? { ...c, open: false } : c)),
    });
    setResettingTool(toolKey);
    try {
      setStatus(await safetyApi.resetCircuit(assistantId, toolKey));
      toast({ title: 'Circuit reset', description: `${toolKey} can be called again.` });
    } catch {
      setStatus(previous);
      toast({
        title: 'Reset failed',
        description: `Could not reset the circuit for ${toolKey}.`,
        variant: 'destructive',
      });
    } finally {
      setResettingTool(null);
    }
  };

  const circuits = useMemo<CircuitStatus[]>(() => {
    if (!status) return [];
    // Open circuits first; the API already orders this way but do not depend on it.
    return [...status.circuits].sort((a, b) => Number(b.open) - Number(a.open));
  }, [status]);

  const toolsEnabled = status?.toolsEnabled ?? true;

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h2 className="text-3xl font-semibold text-white">Safety controls</h2>
        <p className="mt-1 text-neutral-400">
          Runtime overrides for incident response — stop tool execution, run write tools in shadow
          mode, and clear tripped circuit breakers.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading safety status…
        </div>
      ) : !assistantId || !status ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="py-10 text-center text-neutral-400">
            Create an assistant first, then pick it in the header to manage its safety controls.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Kill switch */}
          <Card
            className={cn(
              'transition',
              toolsEnabled ? 'border-white/10 bg-white/5' : 'border-rose-500/40 bg-rose-500/10',
            )}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                {toolsEnabled ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
                ) : (
                  <ShieldAlert className="h-4 w-4 text-rose-400" aria-hidden />
                )}
                Tool execution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className={cn('text-sm font-medium', toolsEnabled ? 'text-white' : 'text-rose-200')}>
                    {toolsEnabled
                      ? 'Tools are enabled — the assistant can call tools.'
                      : 'Tools are DISABLED for this assistant. No tool will run.'}
                  </p>
                  <p className={cn('text-sm', toolsEnabled ? 'text-neutral-400' : 'text-rose-300/80')}>
                    {toolsEnabled
                      ? 'Turn this off to stop every tool call immediately — the kill switch for this assistant.'
                      : 'Runs continue but every tool call is refused. Turn this back on when the incident is over.'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {savingKey === 'toolsEnabled' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-400" aria-hidden />
                  ) : null}
                  <Toggle
                    label="Tool execution"
                    checked={toolsEnabled}
                    disabled={savingKey !== null}
                    onClick={() => {
                      if (toolsEnabled) {
                        // Disabling stops all actions — confirm first.
                        setConfirmDisable(true);
                      } else {
                        setConfirmDisable(false);
                        void patch('toolsEnabled', true);
                      }
                    }}
                  />
                </div>
              </div>

              {confirmDisable && toolsEnabled ? (
                <div className="space-y-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3">
                  <p className="text-sm text-rose-100">
                    Disable tool execution for this assistant? This stops <strong>all</strong> actions
                    immediately — in-flight and future runs will be unable to call any tool.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      className="bg-rose-500 text-white hover:bg-rose-500/90"
                      disabled={savingKey !== null}
                      onClick={() => {
                        setConfirmDisable(false);
                        void patch('toolsEnabled', false);
                      }}
                    >
                      <ShieldAlert className="mr-2 h-4 w-4" aria-hidden />
                      Yes, disable tools
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-neutral-300 hover:text-white"
                      onClick={() => setConfirmDisable(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Shadow mode */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-white">
                <Zap className="h-4 w-4 text-amber-300" aria-hidden />
                Shadow mode
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <p className="text-sm text-neutral-200">
                  {status.shadowMode ? 'Shadow mode is on.' : 'Shadow mode is off.'}
                </p>
                <p className="text-sm text-neutral-400">
                  Write tools are recorded but not executed. Read-only tools still run normally, so
                  you can watch what the assistant <em>would</em> have done without it changing
                  anything.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {savingKey === 'shadowMode' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-400" aria-hidden />
                ) : null}
                <Toggle
                  label="Shadow mode"
                  tone="amber"
                  checked={status.shadowMode}
                  disabled={savingKey !== null}
                  onClick={() => void patch('shadowMode', !status.shadowMode)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Circuit breakers */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white">Circuit breakers</CardTitle>
            </CardHeader>
            <CardContent>
              {circuits.length === 0 ? (
                <p className="py-6 text-center text-sm text-neutral-400">
                  No tool failures recorded this process.
                </p>
              ) : (
                <ul className="divide-y divide-white/5">
                  {circuits.map((circuit) => (
                    <li
                      key={circuit.toolKey}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <code className="truncate font-mono text-sm text-neutral-200">
                          {circuit.toolKey}
                        </code>
                        {circuit.open ? (
                          <span className="shrink-0 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-xs text-rose-300">
                            Open
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-neutral-400">
                            Closed
                          </span>
                        )}
                      </div>
                      {circuit.open ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/15 bg-transparent text-neutral-300 hover:bg-white/5 hover:text-white"
                          disabled={resettingTool !== null}
                          onClick={() => void resetCircuit(circuit.toolKey)}
                        >
                          {resettingTool === circuit.toolKey ? (
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" aria-hidden />
                          ) : (
                            <RotateCcw className="mr-2 h-3.5 w-3.5" aria-hidden />
                          )}
                          Reset
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
