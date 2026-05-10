'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const sections = [
  {
    title: '1. Assistant Setup',
    items: [
      'Create an assistant and store your account API key in your operator environment, not in client code.',
      'Create one assistant per product surface or user workflow.',
      'Add a focused system prompt before enabling flows or knowledge.',
    ],
  },
  {
    title: '2. Browser Integration',
    items: [
      'Load `actbrow-sdk.js` before `actbrow-widget.js` on the host page.',
      'Pass `assistantId`, `baseUrl`, and an API key using script attributes or `ActbrowWidgetConfig`.',
      'For SPAs, pass your router callback as `navigate` so SDK navigation does not hard-refresh the app.',
      'Leave page context enabled unless the page contains sensitive fields you explicitly need to suppress.',
    ],
  },
  {
    title: '3. Tools And Flows',
    items: [
      'Create dedicated `app.navigate` client tools for the exact destinations you want the model to use.',
      'Attach tools per assistant and verify the default arguments are locked to real app paths or selectors.',
      'Only create flows after the underlying tools work on the live page.',
    ],
  },
  {
    title: '4. Knowledge',
    items: [
      'Add concise documents under Knowledge for policies, product facts, and domain instructions.',
      'Keep each document narrowly scoped so retrieval can match user intent reliably.',
      'Prefer operational facts and support playbooks over long marketing copy.',
    ],
  },
  {
    title: '5. Production Readiness',
    items: [
      'Rotate API keys when operators leave or environments are copied.',
      'Verify dashboard login and account API key usage remain separate concerns.',
      'Run an end-to-end smoke test covering assistant response, flow execution, and a client tool callback.',
    ],
  },
];

export default function ChecklistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-white">Integrator Checklist</h2>
        <p className="mt-1 text-neutral-400">
          Operator checklist for embedding the SDK, wiring assistants, and shipping safely.
        </p>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Before You Go Live</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {sections.map((section) => (
            <div key={section.title} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-base font-medium text-white">{section.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
