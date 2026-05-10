export type ParsedCurl = {
  method: string;
  url: string;
  baseUrl: string;
  path: string;
  headers: Record<string, string>;
  body: unknown | null;
  bodyRaw: string | null;
  bodyKeys: string[];
};

/**
 * Tokenize a shell-style command string. Honors single quotes (no escapes), double
 * quotes (with backslash escapes for ", \\, $), and line continuations (backslash + newline).
 * Designed for typical curl commands, not full POSIX correctness.
 */
function tokenize(input: string): string[] {
  const stripped = input.replace(/\\\r?\n/g, ' ');
  const tokens: string[] = [];
  let buf = '';
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  while (i < stripped.length) {
    const ch = stripped[i];
    if (inSingle) {
      if (ch === "'") {
        inSingle = false;
      } else {
        buf += ch;
      }
      i += 1;
      continue;
    }
    if (inDouble) {
      if (ch === '\\' && i + 1 < stripped.length) {
        const next = stripped[i + 1];
        if (next === '"' || next === '\\' || next === '$' || next === '`') {
          buf += next;
          i += 2;
          continue;
        }
        buf += ch;
        i += 1;
        continue;
      }
      if (ch === '"') {
        inDouble = false;
      } else {
        buf += ch;
      }
      i += 1;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      i += 1;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      i += 1;
      continue;
    }
    if (ch === '\\' && i + 1 < stripped.length) {
      buf += stripped[i + 1];
      i += 2;
      continue;
    }
    if (/\s/.test(ch)) {
      if (buf.length > 0) {
        tokens.push(buf);
        buf = '';
      }
      i += 1;
      continue;
    }
    buf += ch;
    i += 1;
  }
  if (buf.length > 0) {
    tokens.push(buf);
  }
  return tokens;
}

const HEADERLIKE = new Set(['-H', '--header']);
const DATA_FLAGS = new Set(['-d', '--data', '--data-raw', '--data-binary', '--data-ascii']);
const METHOD_FLAGS = new Set(['-X', '--request']);
const URL_FLAGS = new Set(['--url']);

function splitUrl(rawUrl: string): { baseUrl: string; path: string } {
  try {
    const u = new URL(rawUrl);
    return {
      baseUrl: `${u.protocol}//${u.host}`,
      path: `${u.pathname}${u.search}` || '/',
    };
  } catch {
    return { baseUrl: '', path: rawUrl };
  }
}

function tryParseJson(raw: string): unknown | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed[0] !== '{' && trimmed[0] !== '[') return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

export function parseCurl(input: string): ParsedCurl {
  const tokens = tokenize(input.trim());
  if (tokens.length === 0) {
    throw new Error('Empty input');
  }
  // Skip a leading "curl" if present.
  let i = tokens[0].toLowerCase() === 'curl' ? 1 : 0;

  let method = '';
  let url = '';
  const headers: Record<string, string> = {};
  let bodyRaw: string | null = null;

  while (i < tokens.length) {
    const tok = tokens[i];
    if (METHOD_FLAGS.has(tok)) {
      method = (tokens[i + 1] || '').toUpperCase();
      i += 2;
      continue;
    }
    if (HEADERLIKE.has(tok)) {
      const raw = tokens[i + 1] || '';
      const sep = raw.indexOf(':');
      if (sep > 0) {
        const name = raw.slice(0, sep).trim();
        const value = raw.slice(sep + 1).trim();
        if (name) headers[name] = value;
      }
      i += 2;
      continue;
    }
    if (DATA_FLAGS.has(tok)) {
      const raw = tokens[i + 1] || '';
      bodyRaw = bodyRaw === null ? raw : `${bodyRaw}&${raw}`;
      i += 2;
      continue;
    }
    if (URL_FLAGS.has(tok)) {
      url = tokens[i + 1] || '';
      i += 2;
      continue;
    }
    // Skip flags we don't model but that take a value (best-effort).
    if (tok === '-u' || tok === '--user' || tok === '-A' || tok === '--user-agent' || tok === '-e' || tok === '--referer' || tok === '-b' || tok === '--cookie' || tok === '--compressed' || tok === '-o' || tok === '--output') {
      // single-arg flags vs flags with value: --compressed has none, others do
      if (tok === '--compressed') {
        i += 1;
      } else {
        i += 2;
      }
      continue;
    }
    if (tok.startsWith('-')) {
      // Unknown flag, skip just the flag (don't eat next token, we don't know).
      i += 1;
      continue;
    }
    // First non-flag positional is treated as the URL.
    if (!url) {
      url = tok;
    }
    i += 1;
  }

  if (!url) {
    throw new Error('No URL found in curl command');
  }
  if (!method) {
    method = bodyRaw !== null ? 'POST' : 'GET';
  }

  const { baseUrl, path } = splitUrl(url);
  const bodyJson = bodyRaw !== null ? tryParseJson(bodyRaw) : null;
  const bodyKeys = bodyJson && typeof bodyJson === 'object' && !Array.isArray(bodyJson)
    ? Object.keys(bodyJson as Record<string, unknown>)
    : [];

  return {
    method,
    url,
    baseUrl,
    path,
    headers,
    body: bodyJson,
    bodyRaw,
    bodyKeys,
  };
}
