import type { WidgetTheme } from '@/types';

/**
 * Brand identifier shown in the widget header. Not operator-configurable — the dashboard never
 * offers the field and WidgetThemeService pins it on both read and write, so this constant only
 * needs to stay in sync for display purposes.
 */
export const BRAND_TITLE = 'ActBrow Assistant';

export const DEFAULT_THEME: WidgetTheme = {
  accent: '#10b981',
  background: '#0f0f1a',
  panelBackground: 'linear-gradient(180deg,#1a1a2e 0%,#0f0f1a 100%)',
  text: '#e5e5e5',
  launcherBackground: '#1a1a1a',
  launcherPosition: 'bottom-right',
  title: BRAND_TITLE,
  subtitle: 'Ask, navigate, and act inside this app',
  fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
};

export interface ThemePreset {
  id: string;
  name: string;
  /** Only the visual keys — title/subtitle/position are never overwritten by a preset. */
  theme: Pick<WidgetTheme, 'accent' | 'background' | 'panelBackground' | 'text' | 'launcherBackground'>;
}

export const PRESETS: ThemePreset[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    theme: {
      accent: '#10b981',
      background: '#0f0f1a',
      panelBackground: 'linear-gradient(180deg,#1a1a2e 0%,#0f0f1a 100%)',
      text: '#e5e5e5',
      launcherBackground: '#1a1a1a',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    theme: {
      accent: '#38bdf8',
      background: '#0b1220',
      panelBackground: 'linear-gradient(180deg,#14243d 0%,#0b1220 100%)',
      text: '#e2e8f0',
      launcherBackground: '#0f1b2d',
    },
  },
  {
    id: 'violet',
    name: 'Violet',
    theme: {
      accent: '#a78bfa',
      background: '#140f1f',
      panelBackground: 'linear-gradient(180deg,#241a38 0%,#140f1f 100%)',
      text: '#ede9fe',
      launcherBackground: '#1d1530',
    },
  },
  {
    id: 'ember',
    name: 'Ember',
    theme: {
      accent: '#fb923c',
      background: '#1a1110',
      panelBackground: 'linear-gradient(180deg,#2b1a16 0%,#1a1110 100%)',
      text: '#fdece0',
      launcherBackground: '#241614',
    },
  },
  {
    id: 'daylight',
    name: 'Daylight',
    theme: {
      accent: '#2563eb',
      background: '#ffffff',
      panelBackground: 'linear-gradient(180deg,#ffffff 0%,#f1f5f9 100%)',
      text: '#0f172a',
      launcherBackground: '#ffffff',
    },
  },
  {
    id: 'sand',
    name: 'Sand',
    theme: {
      accent: '#b45309',
      background: '#faf7f2',
      panelBackground: 'linear-gradient(180deg,#faf7f2 0%,#efe7db 100%)',
      text: '#2b2118',
      launcherBackground: '#fffdf9',
    },
  },
];

export const FONT_STACKS: { label: string; value: string }[] = [
  { label: 'Inter (default)', value: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" },
  { label: 'System UI', value: "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" },
  { label: 'Geist', value: "'Geist','Inter',system-ui,sans-serif" },
  { label: 'Serif', value: "Georgia,'Times New Roman',serif" },
  { label: 'Rounded', value: "'Nunito','Quicksand',system-ui,sans-serif" },
  { label: 'Monospace', value: "'JetBrains Mono','SF Mono',Menlo,monospace" },
];

/** First solid colour in a value, so a gradient can still be contrast-checked. */
export function firstColorOf(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const match = value.match(/#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/i);
  return match ? match[0] : (value.trim().startsWith('#') ? value.trim() : fallback);
}

function channel(component: number): number {
  const c = component / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number | null {
  let raw = hex.trim().replace('#', '');
  if (raw.length === 3) raw = raw.split('').map((c) => c + c).join('');
  if (raw.length !== 6 || !/^[0-9a-f]{6}$/i.test(raw)) return null;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * WCAG 2.1 contrast ratio, or null when either colour is not a resolvable hex. Used to warn before
 * an operator ships a widget whose text is unreadable on its own panel.
 */
export function contrastRatio(foreground: string, background: string): number | null {
  const fg = luminance(foreground);
  const bg = luminance(background);
  if (fg === null || bg === null) return null;
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}
