import type { Metadata } from 'next';
import { DocShell, DocSection, CodeBlock } from '@/components/docs/doc-shell';
import { absoluteUrl } from '@/lib/site';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://your-api.example.com').replace(/\/+$/, '');

const VUE_SNIPPET = `<!-- components/ActbrowWidget.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const BASE_URL = '${API_BASE_URL}';
const router = useRouter();

onMounted(() => {
  // Hand the agent your Vue Router so it can navigate your SPA.
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
});
</script>

<template><!-- widget mounts itself --></template>`;

export const metadata: Metadata = {
  title: 'Embed an AI agent in a Vue app — two script tags',
  description:
    'Add an in-app AI agent to your Vue app with two script tags. Hand the agent your Vue Router so it navigates your SPA and calls your APIs over REST — no backend rewrite.',
  alternates: { canonical: '/examples/vue' },
  openGraph: {
    title: 'Embed an AI agent in a Vue app — ActBrow',
    description:
      'Add an in-app AI agent to your Vue app with two script tags. No backend rewrite.',
    url: absoluteUrl('/examples/vue'),
  },
};

export default function VueExamplePage() {
  return (
    <DocShell
      eyebrow="Example · Vue"
      title="Embed an AI agent in a Vue app"
      intro="Drop the ActBrow agent into any Vue app. Register one component, hand it your Vue Router, and the agent can navigate your SPA and call your APIs — added with two script tags and no backend rewrite."
    >
      <DocSection heading="Register the widget">
        <p className="text-neutral-400">
          Create a single-file component that injects the two scripts and passes your router to the
          agent, then mount it once in your root <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">App.vue</code>.
        </p>
        <CodeBlock code={VUE_SNIPPET} lang="vue" />
      </DocSection>

      <DocSection heading="Next steps">
        <ul className="list-inside list-disc space-y-2 text-neutral-300">
          <li><a className="underline hover:text-white" href="/docs">Full docs & REST tool execution</a></li>
          <li><a className="underline hover:text-white" href="/examples/react">React example</a></li>
          <li><a className="underline hover:text-white" href="/self-hosting">Self-host with Docker</a></li>
        </ul>
      </DocSection>
    </DocShell>
  );
}
