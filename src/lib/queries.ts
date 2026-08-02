'use client';

import { useQuery } from '@tanstack/react-query';
import { activationApi, assistantsApi, flowsApi, toolsApi } from '@/lib/api';
import { readStoredUserId } from '@/lib/session';
import type { Assistant } from '@/types';

/**
 * Shared query keys. Centralised so an invalidation after a mutation cannot miss a consumer by
 * spelling the key slightly differently.
 */
export const queryKeys = {
  assistants: (userId: string) => ['assistants', userId] as const,
  tools: () => ['tools'] as const,
  flows: (assistantId: string) => ['flows', assistantId] as const,
  activation: (assistantId: string) => ['activation', assistantId] as const,
};

/**
 * The assistant list, fetched once per stale window no matter how many components ask.
 *
 * <p>Eleven call sites previously fetched this independently, so the header selector and whichever
 * page you opened issued the same request concurrently on every navigation.
 */
export function useAssistants() {
  const userId = typeof window === 'undefined' ? null : readStoredUserId();
  return useQuery({
    queryKey: queryKeys.assistants(userId ?? 'anonymous'),
    queryFn: () => assistantsApi.list(userId as string),
    enabled: !!userId,
  });
}

export function useTools(enabled = true) {
  return useQuery({
    queryKey: queryKeys.tools(),
    queryFn: () => toolsApi.list(),
    enabled,
  });
}

/**
 * Flow counts for every assistant, as one query rather than one per assistant held in component
 * state. Individual failures resolve to an empty list so one broken assistant cannot blank the
 * whole dashboard.
 */
export function useFlowCounts(assistants: Assistant[] | undefined) {
  const ids = (assistants ?? []).map((assistant) => assistant.id);
  return useQuery({
    queryKey: ['flow-counts', ...ids],
    queryFn: async () => {
      const lists = await Promise.all(ids.map((id) => flowsApi.list(id).catch(() => [])));
      return lists.reduce((sum, list) => sum + list.length, 0);
    },
    enabled: ids.length > 0,
  });
}

export function useActivation(assistantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.activation(assistantId ?? 'none'),
    queryFn: () => activationApi.get(assistantId as string).catch(() => null),
    enabled: !!assistantId,
  });
}
