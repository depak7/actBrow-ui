import type { Metadata } from 'next';
import { DocShell, DocSection, CodeBlock } from '@/components/docs/doc-shell';
import { absoluteUrl, SITE_DESCRIPTION } from '@/lib/site';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://your-api.example.com').replace(/\/+$/, '');

const EMBED_SNIPPET = `<script src="${API_BASE_URL}/actbrow-sdk.js"></script>
<script>
window.ActbrowWidgetConfig = {
  assistantId: "YOUR_ASSISTANT_ID",
  baseUrl: "${API_BASE_URL}",
  apiKey: "wk_...",
  navigate: function (path) { window.location.assign(path); }
};
</script>
<script src="${API_BASE_URL}/actbrow-widget.js"></script>`;

const TOOL_SNIPPET = `POST /v1/runs/{runId}/tool-results
Content-Type: application/json

{
  "toolCallId": "call_123",
  "success": true,
  "structuredOutput": "{\\"order\\":\\"shipped\\"}",
  "textSummary": "Order #4021 is shipped"
}`;

export const metadata: Metadata = {
  title: 'Docs — embed an AI agent in your app with two script tags',
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/docs' },
  openGraph: {
    title: 'ActBrow Docs — embed an AI agent with two script tags',
    description: SITE_DESCRIPTION,
    url: absoluteUrl('/docs'),
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: 'How do I embed an AI agent in my web app?',
    a: 'Add two script tags before the closing body tag: actbrow-sdk.js, a small ActbrowWidgetConfig object with your assistant id and API key, and actbrow-widget.js. The agent goes live with no backend rewrite.',
  },
  {
    q: 'Does ActBrow require a backend rewrite?',
    a: 'No. ActBrow runs as a two-script embed on top of your existing app. Tools are executed over REST, so you expose the endpoints you already have instead of rebuilding your backend.',
  },
  {
    q: 'Can I self-host ActBrow?',
    a: 'Yes. ActBrow ships as a Docker image you can run on your own infrastructure. See the self-hosting guide for docker-compose and environment configuration.',
  },
  {
    q: 'Which frameworks does the embed work with?',
    a: 'Any web app — the embed is framework-agnostic. There are first-class examples for React and Vue, and the same two script tags work in plain HTML.',
  },
];

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function DocsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <DocShell
        eyebrow="Documentation"
        title="Embed an AI agent in your app — two script tags"
        intro="ActBrow is an in-app AI agent runtime. It navigates your app, calls your APIs over REST, runs flows, and answers from your docs — added with two script tags and no backend rewrite."
      >
        <DocSection heading="1. Add the embed snippet">
          <p className="text-neutral-400">
            Paste this before the closing <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">&lt;/body&gt;</code> tag.
            Create an assistant in the dashboard to get your <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">assistantId</code> and API key.
          </p>
          <CodeBlock code={EMBED_SNIPPET} lang="html" />
        </DocSection>

        <DocSection heading="2. Execute tools over REST">
          <p className="text-neutral-400">
            When the agent calls a client tool, your app posts the result back over REST. No SDK-specific
            plumbing — just HTTP.
          </p>
          <CodeBlock code={TOOL_SNIPPET} lang="http" />
        </DocSection>

        <DocSection heading="Framework guides">
          <ul className="list-inside list-disc space-y-2 text-neutral-300">
            <li><a className="underline hover:text-white" href="/examples/react">Embed in a React app</a></li>
            <li><a className="underline hover:text-white" href="/examples/vue">Embed in a Vue app</a></li>
            <li><a className="underline hover:text-white" href="/self-hosting">Self-host with Docker</a></li>
          </ul>
        </DocSection>

        <DocSection heading="FAQ">
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q}>
                <h3 className="font-medium text-white">{item.q}</h3>
                <p className="mt-1 text-neutral-400">{item.a}</p>
              </div>
            ))}
          </div>
        </DocSection>
      </DocShell>
    </>
  );
}
