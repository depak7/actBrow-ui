'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Client cache for dashboard reads.
 *
 * <p>Without this every navigation refetched everything, and several pages fetched the same
 * assistant list the header had already loaded. A 30s stale window makes moving between pages
 * instant while still picking up changes made in another tab within half a minute.
 *
 * <p>The client is created in state rather than at module scope so it is per browser session
 * rather than shared across server renders.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            // The dashboard is behind auth and the data is not fast-moving; refetching on every
            // window focus produced a request storm when tabbing between the app and the docs.
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
