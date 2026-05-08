import api from './api-client';
import type { Assistant, NavigationFlow, Tool, Conversation, Run, KnowledgeDocument } from '@/types';

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
  update: (id: string, data: Partial<Tool>) => api.put<Tool>(`/v1/tools/${id}`, data).then((res) => res.data),
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
  getMessages: (id: string) => api.get(`/v1/conversations/${id}/messages`).then((res) => res.data),
};

export const runsApi = {
  create: (conversationId: string, data: { userContent: string }) =>
    api.post<Run>(`/v1/conversations/${conversationId}/runs`, data).then((res) => res.data),
  get: (id: string) => api.get<Run>(`/v1/runs/${id}`).then((res) => res.data),
  submitToolResult: (runId: string, toolCallId: string, data: { success: boolean; textSummary?: string; structuredOutput?: unknown; error?: string }) =>
    api.post(`/v1/runs/${runId}/tool-results`, { ...data, toolCallId }),
};
