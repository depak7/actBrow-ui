'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CodeLanguage = 'html' | 'json' | 'text';

type CodePanelProps = {
  code: string;
  filename?: string;
  language?: CodeLanguage;
  maxHeight?: string;
  copyLabel?: string;
  className?: string;
};

function highlightLine(line: string, language: CodeLanguage): ReactNode[] {
  if (language === 'json') {
    return highlightJsonLine(line);
  }
  if (language === 'html') {
    return highlightHtmlLine(line);
  }
  return [line];
}

function highlightJsonLine(line: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const keyMatch = line.match(/^(\s*)"([^"]+)":(.*)$/);
  if (keyMatch) {
    parts.push(keyMatch[1]);
    parts.push(<span key="k" className="text-teal-300">&quot;{keyMatch[2]}&quot;</span>);
    parts.push(':');
    const rest = keyMatch[3].trim();
    if (rest.startsWith('"')) {
      parts.push(<span key="v" className="text-emerald-300/90"> {rest}</span>);
    } else {
      parts.push(<span key="v" className="text-amber-200/80"> {rest}</span>);
    }
    return parts;
  }
  if (line.includes('"')) {
    return [<span key="s" className="text-emerald-300/90">{line}</span>];
  }
  return [line];
}

function highlightHtmlLine(line: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const tokenRe =
    /(<\/?script[^>]*>)|("(?:[^"\\]|\\.)*")|(\b(?:assistantId|baseUrl|apiKey|navigate|function|window)\b)/gi;
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRe.exec(line)) !== null) {
    if (match.index > last) {
      parts.push(line.slice(last, match.index));
    }
    const text = match[0];
    if (match[1]) {
      parts.push(
        <span key={key++} className="text-rose-300/90">
          {text}
        </span>,
      );
    } else if (match[2]) {
      parts.push(
        <span key={key++} className="text-emerald-300/90">
          {text}
        </span>,
      );
    } else {
      parts.push(
        <span key={key++} className="text-teal-300">
          {text}
        </span>,
      );
    }
    last = match.index + text.length;
  }

  if (last < line.length) {
    parts.push(line.slice(last));
  }

  return parts.length > 0 ? parts : [line];
}

export function CodePanel({
  code,
  filename = 'snippet.txt',
  language = 'text',
  maxHeight = 'max-h-[28rem]',
  copyLabel = 'Copy',
  className,
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => code.split('\n'), [code]);
  const lang: CodeLanguage =
    language === 'text' && (filename.endsWith('.html') || code.includes('<script'))
      ? 'html'
      : language;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable (insecure origin / older browser) — fail silently
    }
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-[#0d0d0d] overflow-hidden shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#161616] px-3 py-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex gap-1.5 shrink-0" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="truncate text-xs font-mono text-neutral-400">{filename}</span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 shrink-0 border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white text-xs"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="mr-1.5 h-3.5 w-3.5" />
          ) : (
            <Copy className="mr-1.5 h-3.5 w-3.5" />
          )}
          {copied ? 'Copied' : copyLabel}
        </Button>
      </div>
      <div className={cn('overflow-auto', maxHeight)}>
        <table className="w-full border-collapse font-mono text-xs md:text-[13px] leading-relaxed">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="group">
                <td
                  className="select-none w-10 pr-3 pl-3 py-0 text-right align-top text-neutral-600 border-r border-white/5 bg-[#0a0a0a] group-hover:text-neutral-500"
                  aria-hidden
                >
                  {i + 1}
                </td>
                <td className="py-0 pl-4 pr-4 text-neutral-300 whitespace-pre">
                  <code>{highlightLine(line, lang)}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
