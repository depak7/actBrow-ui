'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

/** Suggested swatches offered under every colour control. */
export const SWATCHES = [
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f97316',
  '#eab308',
  '#14b8a6',
  '#ef4444',
  '#0f0f1a',
  '#1a1a1a',
  '#f8fafc',
  '#e5e5e5',
];

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isHex(value: string) {
  return HEX.test(value.trim());
}

/** Expands #abc to #aabbcc so <input type="color"> always receives a 6-digit value. */
export function normalizeHex(value: string, fallback: string) {
  const raw = value.trim();
  if (!isHex(raw)) return fallback;
  if (raw.length === 4) {
    return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`.toLowerCase();
  }
  return raw.toLowerCase();
}

interface ColorFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  /** Used by the native picker when the current value is not a plain hex (e.g. a gradient). */
  fallback?: string;
  className?: string;
}

/**
 * A colour input that stays usable for non-hex CSS values. The native picker and swatches write a
 * hex, while the text field accepts any CSS colour so existing themes (rgba, gradients, named
 * colours) are never silently rewritten just by opening this screen.
 */
export function ColorField({ label, hint, value, onChange, fallback = '#000000', className }: ColorFieldProps) {
  const id = useId();
  const pickerValue = normalizeHex(value, fallback);
  const valid = value.trim() === '' || isHex(value) || !value.trim().startsWith('#');

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-neutral-200">
          {label}
        </label>
        {hint ? <span className="text-xs text-neutral-500">{hint}</span> : null}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/15">
          {/* Checkerboard shows through translucent colours instead of faking an opaque swatch. */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(45deg,#333 25%,transparent 25%),linear-gradient(-45deg,#333 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#333 75%),linear-gradient(-45deg,transparent 75%,#333 75%)',
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0,0 4px,4px -4px,-4px 0px',
            }}
          />
          <div className="absolute inset-0" style={{ background: value || fallback }} />
          <input
            id={id}
            type="color"
            aria-label={`${label} colour picker`}
            value={pickerValue}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          aria-invalid={!valid}
          className={cn(
            'h-10 w-full rounded-lg border bg-white/5 px-3 font-mono text-sm text-white outline-none transition',
            'focus:border-white/30 focus:bg-white/10',
            valid ? 'border-white/10' : 'border-red-500/60',
          )}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {SWATCHES.map((swatch) => {
          const active = normalizeHex(value, '') === swatch;
          return (
            <button
              key={swatch}
              type="button"
              title={swatch}
              aria-label={`Set ${label} to ${swatch}`}
              onClick={() => onChange(swatch)}
              style={{ background: swatch }}
              className={cn(
                'h-6 w-6 rounded-md border transition hover:scale-110',
                active ? 'border-white ring-2 ring-white/40' : 'border-white/20',
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
