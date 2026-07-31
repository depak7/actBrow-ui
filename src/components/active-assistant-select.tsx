'use client';

import { useEffect, useState } from 'react';
import { assistantsApi } from '@/lib/api';
import type { Assistant } from '@/types';
import { getActiveAssistantId, readStoredUserId, setActiveAssistant } from '@/lib/session';

export function ActiveAssistantSelect({ className = '' }: { className?: string }) {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const userId = readStoredUserId();
        if (!userId) return;
        const list = await assistantsApi.list(userId);
        if (cancelled) return;
        setAssistants(list);
        const stored = getActiveAssistantId();
        const next =
          (stored && list.some((a) => a.id === stored) && stored) ||
          list[0]?.id ||
          '';
        setSelectedId(next);
        if (next && next !== stored) {
          const assistant = list.find((a) => a.id === next);
          if (assistant) setActiveAssistant(assistant);
        }
        if (stored && list.length > 0 && !list.some((a) => a.id === stored)) {
          clearOrSetFirst(list);
        }
      } catch {
        // layout can show empty selector
      }
    };
    void load();
    const onChange = () => {
      const stored = getActiveAssistantId();
      if (stored) setSelectedId(stored);
    };
    window.addEventListener('actbrow-active-assistant-changed', onChange);
    return () => {
      cancelled = true;
      window.removeEventListener('actbrow-active-assistant-changed', onChange);
    };
  }, []);

  const clearOrSetFirst = (list: Assistant[]) => {
    if (list[0]) {
      setActiveAssistant(list[0]);
      setSelectedId(list[0].id);
    }
  };

  if (assistants.length === 0) {
    return null;
  }

  return (
    <label className={`flex items-center gap-2 text-sm text-neutral-400 ${className}`}>
      <span className="shrink-0">Active assistant</span>
      <select
        className="rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-white text-sm max-w-[220px]"
        value={selectedId}
        onChange={(e) => {
          const id = e.target.value;
          setSelectedId(id);
          const assistant = assistants.find((a) => a.id === id);
          if (assistant) setActiveAssistant(assistant);
        }}
        aria-label="Active assistant"
      >
        {assistants.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
    </label>
  );
}
