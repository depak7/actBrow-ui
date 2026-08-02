'use client';

import { useEffect, useState } from 'react';
import { useAssistants } from '@/lib/queries';
import type { Assistant } from '@/types';
import {
  getActiveAssistantId,
  markAssistantsResolved,
  readStoredUserId,
  setActiveAssistant,
} from '@/lib/session';

export function ActiveAssistantSelect({ className = '' }: { className?: string }) {
  // Shares the cached query with whichever page is open, instead of issuing a second identical
  // request for the same list on every navigation.
  const { data, isSuccess, isError } = useAssistants();
  const assistants: Assistant[] = data ?? [];
  const [selectedId, setSelectedId] = useState('');
  // The query is disabled when there is no signed-in user, in which case it never settles.
  const noUser = typeof window !== 'undefined' && !readStoredUserId();

  useEffect(() => {
    // Announce that the list settled — including the empty, failed and no-user cases. Pages key
    // their "create an assistant first" empty state off this; without it an account with no
    // assistants would wait on a loading skeleton that never resolves.
    if (noUser) {
      markAssistantsResolved();
      return;
    }
    if (!isSuccess && !isError) return;
    const list = data ?? [];
    const stored = getActiveAssistantId();
    const next = (stored && list.some((a) => a.id === stored) && stored) || list[0]?.id || '';
    setSelectedId(next);
    if (next && next !== stored) {
      const assistant = list.find((a) => a.id === next);
      if (assistant) setActiveAssistant(assistant);
    }
    if (stored && list.length > 0 && !list.some((a) => a.id === stored)) {
      clearOrSetFirst(list);
    }
    markAssistantsResolved();
  }, [data, isSuccess, isError, noUser]);

  useEffect(() => {
    const onChange = () => {
      const stored = getActiveAssistantId();
      if (stored) setSelectedId(stored);
    };
    window.addEventListener('actbrow-active-assistant-changed', onChange);
    return () => window.removeEventListener('actbrow-active-assistant-changed', onChange);
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
