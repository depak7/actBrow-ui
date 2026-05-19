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
  type: 'CLIENT' | 'BUILD_IN' | 'SERVER_BUILTIN' | 'SERVER_HTTP';
  version: string;
  enabled: boolean;
  executorRef: string | null;
  defaultArguments: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
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
