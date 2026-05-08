# ActBrow UI

Next.js frontend for ActBrow - Embedded AI Assistant Platform.

## Quick Start

### 1. Install Dependencies

```bash
cd ui
npm install
```

### 2. Configure Backend URL

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

- **Landing** (`/`) - Marketing page with features
- **Login** (`/login`) - Google sign-in
- **Dashboard** (`/dashboard`) - Overview & stats
- **Assistants** (`/dashboard/assistants`) - AI assistant configuration
- **Navigation Flows** (`/dashboard/flows`) - Step-by-step automation
- **Tools** (`/dashboard/tools`) - Client & server tools

## Login

Sign in with Google, then create an assistant. Each assistant has its own API key for SDK and tool access.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Forms:** React Hook Form (ready for integration)
- **Validation:** Zod (ready for integration)

## Project Structure

```
ui/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (landing)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── assistants/
│   │       ├── flows/
│   │       └── tools/
│   ├── components/
│   │   └── ui/ (shadcn components)
│   ├── lib/
│   │   ├── api.ts (API functions)
│   │   ├── api-client.ts (Axios instance)
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       └── use-toast.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## API Integration

All API calls are in `src/lib/api.ts`:

```typescript
import { assistantsApi, flowsApi, toolsApi } from '@/lib/api';

// List assistants owned by a signed-in user
const assistants = await assistantsApi.list(userId);

// Create assistant
await assistantsApi.create({
  key: 'my-bot',
  name: 'My Bot',
  model: 'groq:qwen-2.5-coder-32b',
  usePredefinedFlows: true,
  userId,
});
```

## Authentication

- Signed-in user stored in `localStorage` as `actbrow_user`
- Active assistant API key stored in `localStorage` as `actbrow_api_key`
- The active assistant key is automatically added to protected API requests

## Build for Production

```bash
npm run build
npm run start
```

## Features

✅ Landing page with features
✅ Google sign-in
✅ Dashboard with stats
✅ Assistant management (CRUD)
✅ Navigation flows (create with multi-step editor)
✅ Tools listing with type filtering
✅ Responsive design (mobile + desktop)
✅ Toast notifications
✅ Loading states
✅ Error handling

## Backend Must Be Running

Ensure Spring Boot backend is running on `http://localhost:8080` before using the UI.
