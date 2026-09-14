import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { getGlobalConfig } from './storage.js';

export type Severity = 'critical' | 'warning' | 'info';

export interface Issue {
  severity: Severity;
  file: string;
  line?: number;
  message: string;
  suggestion?: string;
}

export interface ReviewResult {
  summary: string;
  bugs: Issue[];
  security: Issue[];
  style: Issue[];
  suggestions: Issue[];
  score: number;
}

export interface ReviewOptions {
  model: string;
  language?: string;
  provider?: 'nvidia' | 'groq';
}

const MISSING_NV_KEY =
  'Missing NVIDIA_API_KEY. Set via `lenear config set nvidiaApiKey <key>` or env NVIDIA_API_KEY. Get one at https://build.nvidia.com';
const MISSING_GROQ_KEY =
  'Missing GROQ_API_KEY. Set via `lenear config set groqApiKey <key>` or env GROQ_API_KEY. Get one at https://console.groq.com';

function resolveApiKey(provider: 'nvidia' | 'groq'): string {
  const global = getGlobalConfig();
  if (provider === 'nvidia') {
    const key = global.nvidiaApiKey ?? process.env.NVIDIA_API_KEY ?? process.env.NIM_API_KEY;
    if (!key) throw new Error(MISSING_NV_KEY);
    return key;
  }
  const key = global.groqApiKey ?? process.env.GROQ_API_KEY;
  if (!key) throw new Error(MISSING_GROQ_KEY);
  return key;
}

const SYSTEM_PROMPT = `You are Lenear, a senior staff engineer doing a ruthless, precise code review — the OSS competitor to CodeRabbit and Greptile.

You receive a unified git diff. Return ONLY a single JSON object — no markdown, no fences.

Shape:
{
  "summary": string,
  "bugs": Issue[],
  "security": Issue[],
  "style": Issue[],
  "suggestions": Issue[],
  "score": number
}
Issue: { "severity": "critical"|"warning"|"info", "file": string, "line"?: number, "message": string, "suggestion"?: string }

Rules:
- security: EVERY vulnerability severity "critical" (SQLi, XSS, auth, secrets, injection, SSRF, path traversal, unsafe deserialization). Be exhaustive.
- bugs: logic errors, race, NPE, unhandled promise, off-by-one, type misuse. Cite file:line from diff hunk header.
- style: naming, formatting, readability only.
- suggestions: refactors, perf, API design, testability.
- Extract file EXACTLY from diff path (a/b prefix stripped). Line from @@ header new file. If unknowable omit line (do not hallucinate).
- Suggestion must be actionable: BEFORE→AFTER snippet if helpful, under 2 lines.
- Summary 1-2 sentences: what changed + verdict. No praise filler.
- Score 0-100: 90+ clean, 70-89 minor, 50-69 needs work, <50 blocking. Calibrate harshly — security bug drops to <60.
- Severity guide: critical = exploit/data loss, warning = bug likely, info = nit.
- Never omit keys — empty arrays if none.
- No filler: direct, specific, no "consider"/"you might want".
- Return raw JSON only.`;

function isSeverity(value: unknown): value is Severity {
  return value === 'critical' || value === 'warning' || value === 'info';
}

function validateIssue(value: unknown, path: string): Issue {
  if (typeof value !== 'object' || value === null) {
    throw new Error(`${path} is not an object`);
  }
  const v = value as Record<string, unknown>;
  if (!isSeverity(v.severity)) {
    throw new Error(`${path}.severity is invalid: ${String(v.severity)}`);
  }
  if (typeof v.file !== 'string') {
    throw new Error(`${path}.file must be a string`);
  }
  if (typeof v.message !== 'string') {
    throw new Error(`${path}.message must be a string`);
  }
  const issue: Issue = {
    severity: v.severity,
    file: v.file,
    message: v.message,
  };
  if (typeof v.line === 'number' && Number.isFinite(v.line)) issue.line = v.line;
  if (typeof v.suggestion === 'string') issue.suggestion = v.suggestion;
  return issue;
}

function validateIssueArray(value: unknown, name: string): Issue[] {
  if (!Array.isArray(value)) {
    throw new Error(`Field "${name}" must be an array`);
  }
  return value.map((item, i) => validateIssue(item, `${name}[${i}]`));
}

function validateReview(value: unknown): ReviewResult {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Model response is not a JSON object');
  }
  const v = value as Record<string, unknown>;
  if (typeof v.summary !== 'string') {
    throw new Error('Field "summary" must be a string');
  }
  if (typeof v.score !== 'number' || !Number.isFinite(v.score)) {
    throw new Error('Field "score" must be a number');
  }
  return {
    summary: v.summary,
    score: Math.max(0, Math.min(100, Math.round(v.score))),
    bugs: validateIssueArray(v.bugs, 'bugs'),
    security: validateIssueArray(v.security, 'security'),
    style: validateIssueArray(v.style, 'style'),
    suggestions: validateIssueArray(v.suggestions, 'suggestions'),
  };
}

export async function reviewDiff(diff: string, options: ReviewOptions): Promise<ReviewResult> {
  const provider = options.provider ?? getGlobalConfig().provider ?? 'nvidia';
  const apiKey = resolveApiKey(provider);
  const languageHint =
    options.language && options.language !== 'auto' ? `\nPrimary language: ${options.language}.` : '';

  try {
    let content: string | null | undefined;

    if (provider === 'nvidia') {
      const openai = new OpenAI({
        apiKey,
        baseURL: 'https://integrate.api.nvidia.com/v1',
      });
      const completion = await openai.chat.completions.create({
        model: options.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + languageHint },
          { role: 'user', content: `Review the following git diff and return JSON only.\n\n${diff}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 2048,
      });
      content = completion.choices[0]?.message?.content;
    } else {
      const groq = new Groq({ apiKey });
      const completion = await groq.chat.completions.create({
        model: options.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + languageHint },
          { role: 'user', content: `Review the following git diff and return JSON only.\n\n${diff}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 2048,
      });
      content = completion.choices[0]?.message?.content;
    }

    if (!content) {
      throw new Error(`${provider} returned an empty response.`);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to parse JSON from model: ${msg}`);
    }

    return validateReview(parsed);
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error(`Unexpected error during review: ${String(err)}`);
  }
}

export async function listModels(provider: 'nvidia' | 'groq' = 'nvidia'): Promise<string[]> {
  const apiKey = resolveApiKey(provider);
  try {
    if (provider === 'nvidia') {
      const openai = new OpenAI({ apiKey, baseURL: 'https://integrate.api.nvidia.com/v1' });
      const res = await openai.models.list();
      const data = (res as { data?: Array<{ id?: string }> }).data ?? [];
      return data
        .map((m) => m.id)
        .filter((id): id is string => typeof id === 'string')
        .sort();
    }
    const groq = new Groq({ apiKey });
    const res = await groq.models.list();
    const data = (res as { data?: Array<{ id?: string }> }).data ?? [];
    return data
      .map((m) => m.id)
      .filter((id): id is string => typeof id === 'string')
      .sort();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to list models: ${msg}`);
  }
}
