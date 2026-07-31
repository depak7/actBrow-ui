import api from './api-client';
import type {
  Assistant,
  NavigationFlow,
  Tool,
  Conversation,
  ConversationMessage,
  Run,
  KnowledgeDocument,
  AssistantConnect,
  ApiIntegration,
  ImportApiSpecResult,
  ActivationStatus,
  Insights,
  McpServer,
  WidgetTheme,
} from '@/types';

export const assistantsApi = {
  list: (userId?: string) => {
    const params = userId ? { userId } : {};
    return api.get<Assistant[]>('/v1/assistants', { params }).then((res) => res.data);
  },
  create: (data: { name: string; systemPrompt?: string; model?: string; usePredefinedFlows: boolean; userId: string }) =>
    api.post<Assistant>('/v1/assistants', data).then((res) => res.data),
  update: (id: string, data: { name: string; systemPrompt?: string; model?: string; usePredefinedFlows: boolean; userId: string }) =>
    api.put<Assistant>(`/v1/assistants/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/v1/assistants/${id}`),
};

export const connectApi = {
  get: (assistantId: string) =>
    api.get<AssistantConnect>(`/v1/assistants/${assistantId}/connect`).then((res) => res.data),
};

export const flowsApi = {
  list: (assistantId: string) => api.get<NavigationFlow[]>(`/v1/assistants/${assistantId}/flows`).then((res) => res.data),
  listEnabled: (assistantId: string) => api.get<NavigationFlow[]>(`/v1/assistants/${assistantId}/flows/enabled`).then((res) => res.data),
  create: (assistantId: string, data: { name: string; triggerPhrase: string; steps: { action: string; target: string; description?: string }[]; enabled: boolean }) =>
    api.post<NavigationFlow>(`/v1/assistants/${assistantId}/flows`, data).then((res) => res.data),
  update: (assistantId: string, flowId: string, data: { name: string; triggerPhrase: string; steps: { action: string; target: string; description?: string }[]; enabled: boolean }) =>
    api.put<NavigationFlow>(`/v1/assistants/${assistantId}/flows/${flowId}`, data).then((res) => res.data),
  delete: (assistantId: string, flowId: string) => api.delete(`/v1/assistants/${assistantId}/flows/${flowId}`),
};

/** Body for POST /v1/tools/attach — key is optional; server generates one when omitted. */
export type CreateAssistantToolPayload = {
  assistantId: string;
  key?: string;
  displayName: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown> | null;
  type: Tool['type'];
  version: string;
  enabled: boolean;
  executorRef?: string | null;
  defaultArguments?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
};

export const toolsApi = {
  list: () => api.get<Tool[]>('/v1/tools').then((res) => res.data),
  create: (data: Partial<Tool>) => api.post<Tool>('/v1/tools', data).then((res) => res.data),
  createAndAttach: (data: CreateAssistantToolPayload) =>
    api.post<Tool>('/v1/tools/attach', data).then((res) => res.data),
  update: (
    id: string,
    data: {
      key?: string | null;
      displayName: string;
      description: string;
      inputSchema: Record<string, unknown>;
      outputSchema?: Record<string, unknown> | null;
      type: Tool['type'];
      version: string;
      enabled: boolean;
      executorRef: string | null;
      defaultArguments?: Record<string, unknown> | null;
      metadata?: Record<string, unknown> | null;
    }
  ) => api.put<Tool>(`/v1/tools/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/v1/tools/${id}`),
};

export const assistantToolsApi = {
  list: (assistantId: string) => api.get<Tool[]>(`/v1/assistants/${assistantId}/tools`).then((res) => res.data),
  attach: (assistantId: string, toolId: string, defaultArguments?: Record<string, unknown>) =>
    api.post(`/v1/assistants/${assistantId}/tools`, {
      toolId,
      defaultArguments: defaultArguments && Object.keys(defaultArguments).length > 0 ? defaultArguments : {},
    }),
  updateBinding: (assistantId: string, toolId: string, defaultArguments: Record<string, unknown>) =>
    api.put(`/v1/assistants/${assistantId}/tools/${toolId}`, { defaultArguments }),
  detach: (assistantId: string, toolId: string) =>
    api.delete(`/v1/assistants/${assistantId}/tools/${toolId}`),
};

export const apiIntegrationsApi = {
  list: (assistantId: string) =>
    api.get<ApiIntegration[]>(`/v1/assistants/${assistantId}/api-integrations`).then((res) => res.data),
  import: (
    assistantId: string,
    data: { name: string; specContent: string; baseUrlOverride?: string | null; allowCrossOrigin?: boolean }
  ) =>
    api
      .post<ImportApiSpecResult>(`/v1/assistants/${assistantId}/api-integrations/import`, data)
      .then((res) => res.data),
  delete: (assistantId: string, integrationId: string) =>
    api.delete(`/v1/assistants/${assistantId}/api-integrations/${integrationId}`),
};

export const knowledgeApi = {
  list: (assistantId: string) =>
    api.get<KnowledgeDocument[]>(`/v1/assistants/${assistantId}/knowledge`).then((res) => res.data),
  create: (
    assistantId: string,
    data: { title: string; content: string; source?: string | null; enabled: boolean }
  ) => api.post<KnowledgeDocument>(`/v1/assistants/${assistantId}/knowledge`, data).then((res) => res.data),
  delete: (assistantId: string, knowledgeId: string) =>
    api.delete(`/v1/assistants/${assistantId}/knowledge/${knowledgeId}`),
};

export const conversationsApi = {
  list: () => api.get<Conversation[]>('/v1/conversations').then((res) => res.data),
  create: (data: { assistantId: string }) => api.post<Conversation>('/v1/conversations', data).then((res) => res.data),
  delete: (id: string) => api.delete(`/v1/conversations/${id}`),
  getMessages: (id: string) => api.get<ConversationMessage[]>(`/v1/conversations/${id}/messages`).then((res) => res.data),
};

export const runsApi = {
  create: (conversationId: string, data: { userContent: string }) =>
    api.post<Run>(`/v1/conversations/${conversationId}/runs`, data).then((res) => res.data),
  get: (id: string) => api.get<Run>(`/v1/runs/${id}`).then((res) => res.data),
  submitToolResult: (runId: string, toolCallId: string, data: { success: boolean; textSummary?: string; structuredOutput?: unknown; error?: string }) =>
    api.post(`/v1/runs/${runId}/tool-results`, { ...data, toolCallId }),
};

export const activationApi = {
  get: (assistantId: string) =>
    api.get<ActivationStatus>(`/v1/assistants/${assistantId}/activation`).then((res) => res.data),
};

export const insightsApi = {
  get: (assistantId: string) =>
    api.get<Insights>(`/v1/assistants/${assistantId}/insights`).then((res) => res.data),
};

export const mcpServersApi = {
  list: (assistantId: string) =>
    api.get<McpServer[]>(`/v1/assistants/${assistantId}/mcp-servers`).then((res) => res.data),
  create: (
    assistantId: string,
    data: { name: string; serverUrl: string; authHeaders?: Record<string, string>; enabled?: boolean }
  ) => api.post<McpServer>(`/v1/assistants/${assistantId}/mcp-servers`, data).then((res) => res.data),
  update: (
    assistantId: string,
    serverId: string,
    data: { name: string; serverUrl: string; authHeaders?: Record<string, string>; enabled?: boolean }
  ) =>
    api.put<McpServer>(`/v1/assistants/${assistantId}/mcp-servers/${serverId}`, data).then((res) => res.data),
  sync: (assistantId: string, serverId: string) =>
    api
      .post<{ serverId: string; name: string; created: number; updated: number; removed: number; toolKeys: string[] }>(
        `/v1/assistants/${assistantId}/mcp-servers/${serverId}/sync`
      )
      .then((res) => res.data),
  delete: (assistantId: string, serverId: string) =>
    api.delete(`/v1/assistants/${assistantId}/mcp-servers/${serverId}`),
};

export const widgetThemeApi = {
  get: (assistantId: string) =>
    api.get<{ assistantId: string; theme: WidgetTheme }>(`/v1/assistants/${assistantId}/widget-theme`).then((res) => res.data),
  update: (assistantId: string, theme: WidgetTheme) =>
    api
      .put<{ assistantId: string; theme: WidgetTheme }>(`/v1/assistants/${assistantId}/widget-theme`, { theme })
      .then((res) => res.data),
};
