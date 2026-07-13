import type { Metadata } from 'next';
import { DocShell, DocSection, CodeBlock } from '@/components/docs/doc-shell';
import { absoluteUrl, GITHUB_URL } from '@/lib/site';

const COMPOSE_SNIPPET = `# docker-compose.yml
services:
  actbrow:
    image: actbrow/actbrow:latest
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/actbrow
      SPRING_DATASOURCE_USERNAME: actbrow
      SPRING_DATASOURCE_PASSWORD: change-me
      ACTBROW_MODEL_API_KEY: sk-...
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: actbrow
      POSTGRES_USER: actbrow
      POSTGRES_PASSWORD: change-me
    volumes:
      - actbrow-db:/var/lib/postgresql/data

volumes:
  actbrow-db:`;

const RUN_SNIPPET = `docker compose up -d

# ActBrow now serves the SDK and widget scripts at:
#   http://localhost:8080/actbrow-sdk.js
#   http://localhost:8080/actbrow-widget.js`;

export const metadata: Metadata = {
  title: 'Self-host ActBrow with Docker — run the AI agent on your own infra',
  description:
    'Run the ActBrow in-app AI agent runtime on your own infrastructure with Docker and Postgres. A docker-compose file, your model API key, and you own the whole stack.',
  alternates: { canonical: '/self-hosting' },
  openGraph: {
    title: 'Self-host ActBrow with Docker',
    description:
      'Run the ActBrow in-app AI agent runtime on your own infrastructure with Docker and Postgres.',
    url: absoluteUrl('/self-hosting'),
  },
};

export default function SelfHostingPage() {
  return (
    <DocShell
      eyebrow="Guide · Self-hosting"
      title="Self-host ActBrow with Docker"
      intro="ActBrow ships as a Docker image. Run it next to a Postgres database and you own the entire stack — the agent runtime, the tool execution, and the SDK/widget scripts your app embeds."
    >
      <DocSection heading="1. Compose file">
        <p className="text-neutral-400">
          ActBrow needs a Postgres database and your model provider API key. This compose file brings
          up both.
        </p>
        <CodeBlock code={COMPOSE_SNIPPET} lang="yaml" />
      </DocSection>

      <DocSection heading="2. Start it">
        <CodeBlock code={RUN_SNIPPET} lang="bash" />
        <p className="text-neutral-400">
          Point the two embed script tags at your own <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">baseUrl</code> and the agent
          runs entirely on your infrastructure.
        </p>
      </DocSection>

      <DocSection heading="Next steps">
        <ul className="list-inside list-disc space-y-2 text-neutral-300">
          <li><a className="underline hover:text-white" href="/docs">Full docs & embed snippet</a></li>
          <li><a className="underline hover:text-white" href={GITHUB_URL}>Source on GitHub</a></li>
        </ul>
      </DocSection>
    </DocShell>
  );
}
