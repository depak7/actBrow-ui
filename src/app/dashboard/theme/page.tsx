'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { assistantsApi, widgetThemeApi } from '@/lib/api';
import type { Assistant, WidgetTheme } from '@/types';
import { getActiveAssistantId, readStoredUserId, setActiveAssistant } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

const DEFAULT_THEME: WidgetTheme = {
  accent: '#10b981',
  background: '#0f0f1a',
  panelBackground: 'linear-gradient(180deg,#1a1a2e 0%,#0f0f1a 100%)',
  text: '#e5e5e5',
  launcherBackground: '#1a1a1a',
  launcherPosition: 'bottom-right',
  title: 'ActBrow Assistant',
  subtitle: 'Ask, navigate, and act inside this app',
  fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

export default function ThemePage() {
  const { toast } = useToast();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantId, setAssistantId] = useState('');
  const [theme, setTheme] = useState<WidgetTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      setTheme(DEFAULT_THEME);
      return;
    }
    const assistant = list.find((a) => a.id === selected);
    if (assistant) setActiveAssistant(assistant);
    const data = await widgetThemeApi.get(selected);
    setTheme({ ...DEFAULT_THEME, ...data.theme });
  }, [assistantId]);

  useEffect(() => {
    setLoading(true);
    load()
      .catch(() => toast({ title: 'Error', description: 'Failed to load theme', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [load, toast]);

  const save = async () => {
    if (!assistantId) return;
    setSaving(true);
    try {
      const data = await widgetThemeApi.update(assistantId, theme);
      setTheme({ ...DEFAULT_THEME, ...data.theme });
      toast({ title: 'Theme saved', description: 'Reconnect / refresh embed snippet to ship it.' });
    } catch {
      toast({ title: 'Save failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const setField = (key: keyof WidgetTheme, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-white">Widget theme</h2>
        <p className="mt-1 text-neutral-400">
          Brand the launcher and chat panel. Theme is baked into the Connect embed snippet.
        </p>
      </div>

      {assistants.length > 0 ? (
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
      ) : null}

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : !assistantId ? (
        <p className="text-neutral-500">Create an assistant first.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Theme settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-neutral-400 sm:col-span-2">
                Title
                <Input
                  value={String(theme.title || '')}
                  onChange={(e) => setField('title', e.target.value)}
                  className="border-white/10 bg-white/5 text-white"
                />
              </label>
              <label className="space-y-1 text-sm text-neutral-400 sm:col-span-2">
                Subtitle
                <Input
                  value={String(theme.subtitle || '')}
                  onChange={(e) => setField('subtitle', e.target.value)}
                  className="border-white/10 bg-white/5 text-white"
                />
              </label>
              <label className="space-y-1 text-sm text-neutral-400">
                Accent
                <Input
                  value={String(theme.accent || '')}
                  onChange={(e) => setField('accent', e.target.value)}
                  className="border-white/10 bg-white/5 text-white"
                />
              </label>
              <label className="space-y-1 text-sm text-neutral-400">
                Launcher background
                <Input
                  value={String(theme.launcherBackground || '')}
                  onChange={(e) => setField('launcherBackground', e.target.value)}
                  className="border-white/10 bg-white/5 text-white"
                />
              </label>
              <label className="space-y-1 text-sm text-neutral-400 sm:col-span-2">
                Panel background
                <Input
                  value={String(theme.panelBackground || theme.background || '')}
                  onChange={(e) => setField('panelBackground', e.target.value)}
                  className="border-white/10 bg-white/5 text-white"
                />
              </label>
              <label className="space-y-1 text-sm text-neutral-400">
                Text color
                <Input
                  value={String(theme.text || '')}
                  onChange={(e) => setField('text', e.target.value)}
                  className="border-white/10 bg-white/5 text-white"
                />
              </label>
              <label className="space-y-1 text-sm text-neutral-400">
                Launcher position
                <select
                  value={theme.launcherPosition === 'bottom-left' ? 'bottom-left' : 'bottom-right'}
                  onChange={(e) => setField('launcherPosition', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white"
                >
                  <option value="bottom-right">Bottom right</option>
                  <option value="bottom-left">Bottom left</option>
                </select>
              </label>
              <label className="space-y-1 text-sm text-neutral-400 sm:col-span-2">
                Font family
                <Input
                  value={String(theme.fontFamily || '')}
                  onChange={(e) => setField('fontFamily', e.target.value)}
                  className="border-white/10 bg-white/5 text-white"
                />
              </label>
              <Button
                className="bg-white text-neutral-900 hover:bg-white/90 sm:col-span-2 sm:w-fit"
                disabled={saving}
                onClick={() => void save()}
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save theme
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-72 rounded-xl border border-white/10 bg-neutral-900/80">
                <div
                  className="absolute bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
                  style={{
                    background: String(theme.launcherBackground || '#1a1a1a'),
                    border: `1px solid ${String(theme.accent || '#10b981')}`,
                    left: theme.launcherPosition === 'bottom-left' ? 16 : 'auto',
                    right: theme.launcherPosition === 'bottom-left' ? 'auto' : 16,
                  }}
                />
                <div
                  className="absolute bottom-20 w-56 rounded-2xl border border-white/10 p-4 shadow-xl"
                  style={{
                    background: String(theme.panelBackground || theme.background || '#0f0f1a'),
                    color: String(theme.text || '#e5e5e5'),
                    fontFamily: String(theme.fontFamily || 'inherit'),
                    left: theme.launcherPosition === 'bottom-left' ? 16 : 'auto',
                    right: theme.launcherPosition === 'bottom-left' ? 'auto' : 16,
                  }}
                >
                  <p className="text-sm font-semibold">{String(theme.title || 'ActBrow Assistant')}</p>
                  <p className="mt-1 text-xs opacity-70">{String(theme.subtitle || '')}</p>
                  <div
                    className="mt-4 h-8 rounded-lg"
                    style={{ background: String(theme.accent || '#10b981'), opacity: 0.25 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
