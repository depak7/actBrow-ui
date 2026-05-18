import type { Tool } from '@/types';

function placeholderForSchemaType(t: string | undefined): unknown {
  switch (t) {
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'object':
      return {};
    default:
      return '';
  }
}

/** Builds a curl string compatible with `parseCurl`, to pre-fill the HTTP tools form. */
export function buildSyntheticCurlFromTool(tool: Tool): string {
  const meta = (tool.metadata ?? {}) as {
    method?: string;
    baseUrl?: string;
    path?: string;
    headers?: Record<string, string>;
  };
  const method = (meta.method ?? 'GET').toUpperCase();
  const baseUrl = meta.baseUrl ?? '';
  const path = meta.path ?? '/';
  const fullUrl = `${baseUrl}${path}`.trim() || 'https://example.invalid/';
  const headers =
    meta.headers && typeof meta.headers === 'object' && !Array.isArray(meta.headers)
      ? (meta.headers as Record<string, string>)
      : {};

  const props = (tool.inputSchema?.properties ?? {}) as Record<string, { type?: string }>;
  const defs = (tool.defaultArguments ?? {}) as Record<string, unknown>;
  const bodyObj: Record<string, unknown> = { ...defs };
  for (const key of Object.keys(props)) {
    if (!(key in bodyObj)) {
      bodyObj[key] = placeholderForSchemaType(props[key]?.type);
    }
  }

  const parts: string[] = ['curl'];
  if (method !== 'GET' && method !== 'HEAD') {
    parts.push('-X', method);
  }
  for (const [name, value] of Object.entries(headers)) {
    parts.push('-H', JSON.stringify(`${name}: ${value}`));
  }
  if (!['GET', 'HEAD'].includes(method) && Object.keys(bodyObj).length > 0) {
    parts.push('-d', JSON.stringify(JSON.stringify(bodyObj)));
  }
  parts.push(JSON.stringify(fullUrl));
  return parts.join(' ');
}
