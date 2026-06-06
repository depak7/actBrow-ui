<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the ActBrow dashboard. PostHog is initialized via a client-side provider (`src/app/posthog-provider.tsx`) that wraps the entire app in `src/app/layout.tsx`. A reverse proxy routes PostHog traffic through `/ingest/*` in `next.config.js` to improve reliability against ad blockers. User identification fires at Google OAuth login, linking all subsequent events to a known user.

16 events are now tracked across 8 files, covering the full user journey from waitlist signup through login, assistant creation, tool configuration, and deployment via the Connect page.

| Event | Description | File |
|-------|-------------|------|
| `waitlist_form_submitted` | User successfully submits the waitlist signup form | `src/app/waitlist/page.tsx` |
| `user_signed_in` | User successfully signs in with Google OAuth | `src/app/login/page.tsx` |
| `user_sign_in_failed` | User attempted to sign in but authentication failed | `src/app/login/page.tsx` |
| `assistant_created` | User creates a new AI assistant | `src/app/dashboard/assistants/page.tsx` |
| `assistant_updated` | User updates an existing AI assistant configuration | `src/app/dashboard/assistants/page.tsx` |
| `assistant_deleted` | User deletes an AI assistant | `src/app/dashboard/assistants/page.tsx` |
| `tool_created` | User creates a new HTTP tool and attaches it to an assistant | `src/app/dashboard/tools/page.tsx` |
| `tool_updated` | User updates an existing HTTP tool | `src/app/dashboard/tools/page.tsx` |
| `tool_deleted` | User deletes an HTTP tool from the catalog | `src/app/dashboard/tools/page.tsx` |
| `flow_created` | User creates a new navigation flow for an assistant | `src/app/dashboard/flows/page.tsx` |
| `flow_deleted` | User deletes a navigation flow | `src/app/dashboard/flows/page.tsx` |
| `knowledge_document_created` | User adds a new knowledge document to an assistant | `src/app/dashboard/knowledge/page.tsx` |
| `knowledge_document_deleted` | User deletes a knowledge document from an assistant | `src/app/dashboard/knowledge/page.tsx` |
| `api_integration_imported` | User imports an OpenAPI/Swagger spec to generate tools | `src/app/dashboard/integrations/page.tsx` |
| `api_integration_deleted` | User deletes an API integration and its generated tools | `src/app/dashboard/integrations/page.tsx` |
| `connect_setup_viewed` | User views the Connect page setup prompt (activation milestone) | `src/app/dashboard/connect/page.tsx` |

## Next steps

We've built a dashboard and five insights to monitor user behavior and business health:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/457195/dashboard/1678119)
- [Waitlist signups & logins](https://us.posthog.com/project/457195/insights/fMjfyRhz) — Daily trend of new signups and returning logins
- [Onboarding funnel: waitlist → sign-in → assistant](https://us.posthog.com/project/457195/insights/ICyhIAJH) — Top-of-funnel conversion from marketing interest to first assistant
- [Activation funnel: sign-in → connect setup](https://us.posthog.com/project/457195/insights/zGdEoOTx) — How many users reach the Connect page after creating an assistant
- [Platform resource creation](https://us.posthog.com/project/457195/insights/MR8kcI6h) — Weekly bar chart of all resource types being created
- [Sign-in failures](https://us.posthog.com/project/457195/insights/OMVNW1nc) — Auth failure trend for monitoring Google OAuth health

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
