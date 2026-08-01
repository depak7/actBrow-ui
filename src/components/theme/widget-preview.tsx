'use client';

import type { WidgetTheme } from '@/types';
import { BRAND_TITLE, DEFAULT_THEME } from './theme-presets';

/**
 * Mirrors the real widget's structure (launcher, header, message rows, composer) so operators judge
 * a theme against what actually ships rather than an abstract swatch board.
 */
export function WidgetPreview({ theme, open }: { theme: WidgetTheme; open: boolean }) {
  const accent = String(theme.accent || DEFAULT_THEME.accent);
  const panel = String(theme.panelBackground || theme.background || DEFAULT_THEME.panelBackground);
  const text = String(theme.text || DEFAULT_THEME.text);
  const launcher = String(theme.launcherBackground || DEFAULT_THEME.launcherBackground);
  const font = String(theme.fontFamily || DEFAULT_THEME.fontFamily);
  const left = theme.launcherPosition === 'bottom-left';

  return (
    <div className="relative h-[26rem] overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,#2a2a3a_0%,#141420_60%)]">
      {/* Stand-in for the host page the widget is embedded into. */}
      <div className="space-y-2 p-4 opacity-40" aria-hidden>
        <div className="h-2.5 w-24 rounded bg-white/25" />
        <div className="h-2 w-40 rounded bg-white/15" />
        <div className="mt-4 h-16 rounded-lg bg-white/10" />
        <div className="h-2 w-32 rounded bg-white/15" />
      </div>

      {open ? (
        <div
          className="absolute bottom-20 w-64 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
          style={{
            background: panel,
            color: text,
            fontFamily: font,
            left: left ? 16 : 'auto',
            right: left ? 'auto' : 16,
          }}
        >
          <div className="flex items-center gap-2 border-b px-3 py-2.5" style={{ borderColor: `${text}1a` }}>
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: accent, color: panel.startsWith('#') ? panel : '#0f0f1a' }}
            >
              A
            </div>
            <div className="min-w-0 flex-1">
              {/* Brand, not configuration — never rendered from the editable theme. */}
              <p className="truncate text-[12px] font-semibold leading-tight">{BRAND_TITLE}</p>
              <p className="truncate text-[10px] leading-tight" style={{ color: `${text}99` }}>
                {String(theme.subtitle || '')}
              </p>
            </div>
            <span className="text-[13px] leading-none" style={{ color: `${text}66` }}>
              ×
            </span>
          </div>

          <div className="space-y-2 px-3 py-3">
            <div className="flex justify-end">
              <div
                className="max-w-[80%] rounded-2xl px-2.5 py-1.5 text-[11px]"
                style={{ background: accent, color: '#fff' }}
              >
                Take me to billing
              </div>
            </div>
            <div className="flex justify-start">
              <div
                className="max-w-[85%] rounded-2xl px-2.5 py-1.5 text-[11px]"
                style={{ background: `${text}14` }}
              >
                You&apos;re on Billing now — invoices are under the History tab.
              </div>
            </div>
          </div>

          <div className="px-3 pb-3">
            <div
              className="flex items-center gap-2 rounded-xl border px-2.5 py-1.5"
              style={{ borderColor: `${text}26`, background: `${text}0d` }}
            >
              <span className="flex-1 text-[10px]" style={{ color: `${text}80` }}>
                Ask anything…
              </span>
              <span
                className="flex h-5 w-5 items-center justify-center rounded-lg text-[10px] font-bold"
                style={{ background: accent, color: '#fff' }}
              >
                ↑
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className="absolute bottom-4 flex h-12 w-12 items-center justify-center rounded-full shadow-xl transition"
        style={{
          background: launcher,
          border: `1px solid ${accent}`,
          left: left ? 16 : 'auto',
          right: left ? 'auto' : 16,
        }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" style={{ fill: accent }} aria-hidden>
          <path d="M12 2l1.9 5.8L20 9.7l-5.1 3.1L16 19l-4-3.2L8 19l1.1-6.2L4 9.7l6.1-1.9L12 2z" />
        </svg>
      </div>
    </div>
  );
}
