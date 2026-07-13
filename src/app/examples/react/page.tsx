import type { Metadata } from 'next';
import { DocShell, DocSection, CodeBlock } from '@/components/docs/doc-shell';
import { absoluteUrl } from '@/lib/site';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://your-api.example.com').replace(/\/+$/, '');

const REACT_SNIPPET = `// components/ActbrowWidget.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BASE_URL = '${API_BASE_URL}';

export function ActbrowWidget() {
  const router = useRouter();

  useEffect(() => {
    // Hand the agent your client-side router so it can navigate your SPA.
    window.ActbrowWidgetConfig = {
      assistantId: 'YOUR_ASSISTANT_ID',
      baseUrl: BASE_URL,
      apiKey: 'wk_...',
      navigate: (path) => router.push(path),
    };

    const sdk = document.createElement('script');
    sdk.src = BASE_URL + '/actbrow-sdk.js';
    sdk.onload = () => {
      const widget = document.createElement('script');
      widget.src = BASE_URL + '/actbrow-widget.js';
      document.body.appendChild(widget);
    };
    document.body.appendChild(sdk);
  }, [router]);

  return null;
}`;

export const metadata: Metadata = {
  title: 'Embed an AI agent in a React app — two script tags',
  description:
    'Add an in-app AI agent to your React or Next.js app with two script tags. Hand the agent your router so it navigates your SPA and calls your APIs over REST — no backend rewrite.',
  alternates: { canonical: '/examples/react' },
  openGraph: {
    title: 'Embed an AI agent in a React app — ActBrow',
    description:
      'Add an in-app AI agent to your React or Next.js app with two script tags. No backend rewrite.',
    url: absoluteUrl('/examples/react'),
  },
};

export default function ReactExamplePage() {
  return (
    <DocShell
      eyebrow="Example · React"
      title="Embed an AI agent in a React app"
      intro="Drop the ActBrow agent into any React or Next.js app. Mount one component, hand it your router, and the agent can navigate your SPA and call your APIs — added with two script tags and no backend rewrite."
    >
      <DocSection heading="Mount the widget">
        <p className="text-neutral-400">
          Create a client component that injects the two scripts and passes your router to the agent,
          then render <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">&lt;ActbrowWidget /&gt;</code> in your root layout.
        </p>
        <CodeBlock code={REACT_SNIPPET} lang="tsx" />
      </DocSection>

      <DocSection heading="Next steps">
        <ul className="list-inside list-disc space-y-2 text-neutral-300">
          <li><a className="underline hover:text-white" href="/docs">Full docs & REST tool execution</a></li>
          <li><a className="underline hover:text-white" href="/examples/vue">Vue example</a></li>
          <li><a className="underline hover:text-white" href="/self-hosting">Self-host with Docker</a></li>
        </ul>
      </DocSection>
    </DocShell>
  );
}
