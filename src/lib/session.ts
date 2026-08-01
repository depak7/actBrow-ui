import type { Assistant } from '@/types';

export type StoredUser = {
  id?: string;
  email?: string;
  fullName?: string;
  pictureUrl?: string;
  apiKey?: string;
};

const USER_KEY = 'actbrow_user';
const ACTIVE_ASSISTANT_ID_KEY = 'actbrow_active_assistant_id';
const ACTIVE_ASSISTANT_API_KEY = 'actbrow_api_key';

function hasStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readStoredUser(): StoredUser | null {
  if (!hasStorage()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function readStoredUserId() {
  return readStoredUser()?.id || null;
}

export function setStoredUser(user: StoredUser) {
  if (!hasStorage()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (user.apiKey) {
    localStorage.setItem(ACTIVE_ASSISTANT_API_KEY, user.apiKey);
  }
  window.dispatchEvent(new Event('actbrow-api-key-changed'));
}

export function getStoredAccountApiKey(): string | null {
  if (!hasStorage()) return null;
  return localStorage.getItem(ACTIVE_ASSISTANT_API_KEY);
}

/** Masked value for UI only; never the full secret. */
export function getStoredAccountApiKeyPreview(): string {
  const k = getStoredAccountApiKey();
  if (!k) return '';
  return k.length > 12 ? `${k.slice(0, 8)}…${k.slice(-4)}` : k;
}

/** Copies the account API key from localStorage to the clipboard. */
export async function copyStoredAccountApiKey(): Promise<{ ok: boolean; error?: string }> {
  const k = getStoredAccountApiKey();
  if (!k) {
    return { ok: false, error: 'No key in this session. Sign in again.' };
  }
  try {
    await navigator.clipboard.writeText(k);
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Clipboard unavailable';
    return { ok: false, error: message };
  }
}

export function setActiveAssistant(assistant: Pick<Assistant, 'id'> | null | undefined) {
  if (!hasStorage() || !assistant?.id) return;
  localStorage.setItem(ACTIVE_ASSISTANT_ID_KEY, assistant.id);
  window.dispatchEvent(new Event('actbrow-active-assistant-changed'));
}

export function clearActiveAssistant() {
  if (!hasStorage()) return;
  localStorage.removeItem(ACTIVE_ASSISTANT_ID_KEY);
  window.dispatchEvent(new Event('actbrow-active-assistant-changed'));
}

export function getActiveAssistantId(): string | null {
  if (!hasStorage()) return null;
  return localStorage.getItem(ACTIVE_ASSISTANT_ID_KEY);
}

/**
 * Whether the assistant list has been fetched at least once this page load.
 *
 * getActiveAssistantId() returns null both while the list is still loading AND when the account
 * genuinely has no assistants. Without this flag a brand-new user — the case that matters most —
 * sits on a loading skeleton forever instead of reaching the "create an assistant" empty state.
 */
let assistantsResolved = false;

export function markAssistantsResolved() {
  assistantsResolved = true;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('actbrow-active-assistant-changed'));
  }
}

export function areAssistantsResolved() {
  return assistantsResolved;
}

export function clearSession() {
  if (!hasStorage()) return;
  clearActiveAssistant();
  localStorage.removeItem(ACTIVE_ASSISTANT_API_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('actbrow-api-key-changed'));
}
