'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { widgetThemeApi } from '@/lib/api';
import type { WidgetTheme } from '@/types';
import { getActiveAssistantId } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Check, Loader2, Lock, RotateCcw, Save } from 'lucide-react';
import { ColorField } from '@/components/theme/color-field';
import { WidgetPreview } from '@/components/theme/widget-preview';
import {
  BRAND_TITLE,
  DEFAULT_THEME,
  FONT_STACKS,
  PRESETS,
  contrastRatio,
  firstColorOf,
} from '@/components/theme/theme-presets';
import { cn } from '@/lib/utils';

export default function ThemePage() {
  const { toast } = useToast();
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [theme, setTheme] = useState<WidgetTheme>(DEFAULT_THEME);
  const [saved, setSaved] = useState<WidgetTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);

  // The dashboard header owns assistant selection; mirror it instead of rendering a second picker.
  useEffect(() => {
    const sync = () => setAssistantId(getActiveAssistantId());
    sync();
    window.addEventListener('actbrow-active-assistant-changed', sync);
    return () => window.removeEventListener('actbrow-active-assistant-changed', sync);
  }, []);

  const load = useCallback(async (id: string) => {
    const data = await widgetThemeApi.get(id);
    const merged = { ...DEFAULT_THEME, ...data.theme };
    setTheme(merged);
    setSaved(merged);
  }, []);

  useEffect(() => {
    if (assistantId === null) return;
    if (!assistantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    load(assistantId)
      .catch(() => toast({ title: 'Error', description: 'Failed to load theme', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [assistantId, load, toast]);

  const dirty = useMemo(
    () => JSON.stringify(theme) !== JSON.stringify(saved),
    [theme, saved],
  );

  const contrast = useMemo(() => {
    const ratio = contrastRatio(
      firstColorOf(String(theme.text || ''), '#e5e5e5'),
      firstColorOf(String(theme.panelBackground || theme.background || ''), '#0f0f1a'),
    );
    return ratio === null ? null : Math.round(ratio * 10) / 10;
  }, [theme]);

  const save = async () => {
    if (!assistantId) return;
    setSaving(true);
    try {
      const data = await widgetThemeApi.update(assistantId, theme);
      const merged = { ...DEFAULT_THEME, ...data.theme };
      setTheme(merged);
      setSaved(merged);
      toast({ title: 'Theme saved', description: 'Refresh the embed snippet to ship it.' });
    } catch {
      toast({ title: 'Save failed', description: 'Could not save the theme.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const setField = (key: keyof WidgetTheme, value: string) =>
    setTheme((prev) => ({ ...prev, [key]: value }));

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) setTheme((prev) => ({ ...prev, ...preset.theme }));
  };

  const activePreset = PRESETS.find(
    (p) =>
      p.theme.accent === theme.accent &&
      p.theme.text === theme.text &&
      p.theme.panelBackground === theme.panelBackground,
  )?.id;

  const fontIsCustom = !FONT_STACKS.some((f) => f.value === theme.fontFamily);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-white">Widget theme</h2>
          <p className="mt-1 text-neutral-400">
            Brand the launcher and chat panel. The theme is baked into the Connect embed snippet.
          </p>
        </div>
        {dirty ? (
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
            Unsaved changes
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading theme…
        </div>
      ) : !assistantId ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="py-10 text-center text-neutral-400">
            Create an assistant first, then pick it in the header to theme its widget.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white">Presets</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={cn(
                      'group relative overflow-hidden rounded-xl border p-2 text-left transition hover:border-white/30',
                      activePreset === preset.id ? 'border-white/50 ring-1 ring-white/30' : 'border-white/10',
                    )}
                  >
                    <div
                      className="h-12 w-full rounded-lg border border-white/10"
                      style={{ background: preset.theme.panelBackground }}
                    >
                      <div className="flex h-full items-end gap-1 p-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: preset.theme.accent }}
                        />
                        <span
                          className="h-1.5 w-8 rounded-full"
                          style={{ background: preset.theme.text, opacity: 0.5 }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-neutral-300">{preset.name}</span>
                      {activePreset === preset.id ? <Check className="h-3.5 w-3.5 text-white" /> : null}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white">Colours</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <ColorField
                  label="Accent"
                  hint="Buttons, highlights"
                  value={String(theme.accent || '')}
                  onChange={(v) => setField('accent', v)}
                  fallback="#10b981"
                />
                <ColorField
                  label="Text"
                  hint="Panel foreground"
                  value={String(theme.text || '')}
                  onChange={(v) => setField('text', v)}
                  fallback="#e5e5e5"
                />
                <ColorField
                  label="Launcher"
                  hint="Floating button"
                  value={String(theme.launcherBackground || '')}
                  onChange={(v) => setField('launcherBackground', v)}
                  fallback="#1a1a1a"
                />
                <ColorField
                  label="Background"
                  hint="Solid fallback"
                  value={String(theme.background || '')}
                  onChange={(v) => setField('background', v)}
                  fallback="#0f0f1a"
                />
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <label className="text-sm font-medium text-neutral-200">Panel background</label>
                    <span className="text-xs text-neutral-500">Any CSS colour or gradient</span>
                  </div>
                  <Input
                    value={String(theme.panelBackground || '')}
                    onChange={(e) => setField('panelBackground', e.target.value)}
                    spellCheck={false}
                    className="border-white/10 bg-white/5 font-mono text-sm text-white"
                  />
                  <div
                    className="h-8 rounded-lg border border-white/10"
                    style={{ background: String(theme.panelBackground || theme.background || '') }}
                  />
                </div>

                {contrast !== null ? (
                  <div
                    className={cn(
                      'flex items-start gap-2 rounded-lg border px-3 py-2 text-xs sm:col-span-2',
                      contrast >= 4.5
                        ? 'border-emerald-400/20 bg-emerald-400/5 text-emerald-300'
                        : 'border-amber-400/30 bg-amber-400/10 text-amber-300',
                    )}
                  >
                    {contrast >= 4.5 ? (
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>
                      Text/panel contrast is <strong>{contrast}:1</strong>.{' '}
                      {contrast >= 4.5
                        ? 'Meets WCAG AA for body text.'
                        : 'Below the 4.5:1 WCAG AA minimum — some users will struggle to read replies.'}
                    </span>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white">Content &amp; layout</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 text-sm text-neutral-300 sm:col-span-2">
                  <span>Title</span>
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3">
                    <Lock className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                    <span className="text-sm text-neutral-400">{BRAND_TITLE}</span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    The assistant name is part of the ActBrow brand and cannot be changed.
                  </p>
                </div>
                <label className="space-y-1.5 text-sm text-neutral-300 sm:col-span-2">
                  Subtitle
                  <Input
                    value={String(theme.subtitle || '')}
                    onChange={(e) => setField('subtitle', e.target.value)}
                    maxLength={90}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </label>

                <div className="space-y-1.5 text-sm text-neutral-300">
                  <span>Launcher position</span>
                  <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
                    {(['bottom-left', 'bottom-right'] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setField('launcherPosition', pos)}
                        className={cn(
                          'flex-1 rounded-md px-3 py-1.5 text-xs transition',
                          (theme.launcherPosition ?? 'bottom-right') === pos
                            ? 'bg-white text-neutral-900'
                            : 'text-neutral-400 hover:text-white',
                        )}
                      >
                        {pos === 'bottom-left' ? 'Left' : 'Right'}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="space-y-1.5 text-sm text-neutral-300">
                  Font
                  <select
                    value={fontIsCustom ? 'custom' : String(theme.fontFamily)}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') setField('fontFamily', e.target.value);
                    }}
                    className="flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white"
                  >
                    {FONT_STACKS.map((font) => (
                      <option key={font.value} value={font.value} className="bg-neutral-900">
                        {font.label}
                      </option>
                    ))}
                    {fontIsCustom ? (
                      <option value="custom" className="bg-neutral-900">
                        Custom
                      </option>
                    ) : null}
                  </select>
                </label>

                <label className="space-y-1.5 text-sm text-neutral-300 sm:col-span-2">
                  Font stack (advanced)
                  <Input
                    value={String(theme.fontFamily || '')}
                    onChange={(e) => setField('fontFamily', e.target.value)}
                    spellCheck={false}
                    className="border-white/10 bg-white/5 font-mono text-xs text-white"
                  />
                </label>
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base text-white">Live preview</CardTitle>
                <button
                  type="button"
                  onClick={() => setPreviewOpen((v) => !v)}
                  className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-neutral-300 transition hover:border-white/30 hover:text-white"
                >
                  {previewOpen ? 'Show closed' : 'Show open'}
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <WidgetPreview theme={theme} open={previewOpen} />

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="bg-white text-neutral-900 hover:bg-white/90"
                    disabled={saving || !dirty}
                    onClick={() => void save()}
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {dirty ? 'Save theme' : 'Saved'}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/15 bg-transparent text-neutral-300 hover:bg-white/5 hover:text-white"
                    disabled={saving}
                    onClick={() => setTheme(DEFAULT_THEME)}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to defaults
                  </Button>
                  {dirty ? (
                    <Button
                      variant="ghost"
                      className="text-neutral-400 hover:text-white"
                      disabled={saving}
                      onClick={() => setTheme(saved)}
                    >
                      Discard
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
