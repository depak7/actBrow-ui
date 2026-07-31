const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;

export const API_BASE_URL =
  configuredApiUrl && !/^https?:\/\//.test(configuredApiUrl) ? configuredApiUrl : '/api';

export interface Assistant {
  id: string;
  key: string;
  name: string;
  systemPrompt: string | null;
  model: string;
  usePredefinedFlows: boolean;
  userId: string;
  createdAt: string;
}

export interface AssistantConnect {
  assistantId: string;
  assistantName: string;
  baseUrl: string;
  setupKey: string;
  widgetKey: string;
  setupPrompt: string;
  lastSyncedAt: string | null;
  lastSyncSummary: Record<string, unknown>;
  allowedOrigins: string[];
  embedSnippet: string | null;
}

export interface NavigationFlow {
  id: string;
  assistantId: string;
  name: string;
  triggerPhrase: string;
  steps: FlowStep[];
  enabled: boolean;
  createdAt: string;
}

export interface FlowStep {
  action: string;
  target: string;
  description: string | null;
}

export interface Tool {
  id: string;
  key: string;
  displayName: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown> | null;
  type: 'CLIENT' | 'BUILD_IN' | 'SERVER_BUILTIN' | 'SERVER_HTTP' | 'MCP';
  version: string;
  enabled: boolean;
  executorRef: string | null;
  defaultArguments: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface ApiIntegration {
  id: string;
  assistantId: string;
  name: string;
  baseUrl: string | null;
  allowCrossOrigin: boolean;
  toolKeys: string[];
  createdAt: string;
  updatedAt: string | null;
}

export interface ImportApiSpecResult {
  integrationId: string;
  name: string;
  created: number;
  updated: number;
  removed: number;
  toolKeys: string[];
}

export interface KnowledgeDocument {
  id: string;
  assistantId: string;
  title: string;
  content: string;
  source: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  assistantId: string;
  assistantName?: string;
  createdAt: string;
  lastMessageAt?: string | null;
  messageCount?: number;
  lastMessageRole?: string | null;
  lastMessagePreview?: string;
}

export interface ConversationMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'TOOL';
  content: string;
  createdAt: string;
}

export interface Run {
  id: string;
  conversationId: string;
  assistantId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'WAITING_FOR_CLIENT_TOOL';
  stepCount: number;
  lastError: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface ActivationStatus {
  assistantId: string;
  assistantName: string;
  completedSteps: number;
  totalSteps: number;
  ready: boolean;
  steps: {
    id: string;
    title: string;
    description: string;
    done: boolean;
    href: string;
  }[];
  embedSnippet: string | null;
  magicLinkExample: string;
}

export interface Insights {
  assistantId: string;
  conversationCount: number;
  runCount: number;
  completedRuns: number;
  failedRuns: number;
  inProgressRuns: number;
  successRate: number;
  topIntents: { text: string; count: number }[];
  failedTools: { toolKey: string; count: number }[];
  recentFailures: { runId: string; error: string; createdAt: string }[];
}

export interface McpServer {
  id: string;
  assistantId: string;
  name: string;
  serverUrl: string;
  /** Redacted metadata only (`configured`, `headerNames`) — never secret values. */
  authHeaders: { configured?: boolean; headerNames?: string[] } | Record<string, unknown>;
  enabled: boolean;
  toolKeys: string[];
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface WidgetTheme {
  accent?: string;
  background?: string;
  panelBackground?: string;
  text?: string;
  launcherBackground?: string;
  launcherPosition?: 'bottom-right' | 'bottom-left';
  title?: string;
  subtitle?: string;
  fontFamily?: string;
  [key: string]: unknown;
}
