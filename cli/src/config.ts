import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export type Provider = 'nvidia' | 'groq';

export interface Config {
  provider: Provider;
  model: string;
  maxDiffLines: number;
  language: string;
  projectId?: string | null;
  threshold: number;
}

const CONFIG_FILENAMES = ['.lenearrc', '.gitpulserc'];

const DEFAULT_CONFIG: Config = {
  provider: 'nvidia',
  model: 'meta/llama-3.3-70b-instruct',
  maxDiffLines: 2000,
  language: 'auto',
  projectId: null,
  threshold: 60,
};

function configPath(): string | null {
  for (const name of CONFIG_FILENAMES) {
    const p = join(process.cwd(), name);
    if (existsSync(p)) return p;
  }
  return join(process.cwd(), CONFIG_FILENAMES[0]);
}

function activePath(): string {
  return configPath() ?? join(process.cwd(), CONFIG_FILENAMES[0]);
}

function readConfigFile(): Partial<Config> {
  for (const name of CONFIG_FILENAMES) {
    const p = join(process.cwd(), name);
    if (!existsSync(p)) continue;
    try {
      const raw = readFileSync(p, 'utf8');
      const parsed = JSON.parse(raw) as Partial<Config>;
      return parsed;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to read ${name}: ${msg}`);
    }
  }
  return {};
}

function writeConfigFile(cfg: Config): void {
  const path = activePath();
  try {
    writeFileSync(path, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to write ${path}: ${msg}`);
  }
}

function validateConfig(partial: Partial<Config>): Partial<Config> {
  const out: Partial<Config> = { ...partial };
  if (out.provider && out.provider !== 'nvidia' && out.provider !== 'groq') {
    throw new Error(`provider must be "nvidia" or "groq", got "${out.provider}"`);
  }
  if (out.threshold !== undefined) {
    const n = Number(out.threshold);
    if (!Number.isFinite(n) || n < 0 || n > 100) throw new Error(`threshold must be 0-100, got "${out.threshold}"`);
    out.threshold = n;
  }
  if (out.maxDiffLines !== undefined) {
    const n = Number(out.maxDiffLines);
    if (!Number.isFinite(n) || n <= 0) throw new Error(`maxDiffLines must be positive, got "${out.maxDiffLines}"`);
    out.maxDiffLines = n;
  }
  return out;
}

export function getConfig(): Config {
  const fromFile = validateConfig(readConfigFile());
  return { ...DEFAULT_CONFIG, ...fromFile };
}

function coerceValue(key: keyof Config, value: string): Config[keyof Config] {
  if (key === 'maxDiffLines' || key === 'threshold') {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) {
      throw new Error(`${key} must be a positive number, got "${value}"`);
    }
    if (key === 'threshold' && (n < 0 || n > 100)) throw new Error(`threshold must be 0-100, got "${value}"`);
    return n as unknown as Config[keyof Config];
  }
  if (key === 'provider') {
    if (value !== 'nvidia' && value !== 'groq') throw new Error(`provider must be "nvidia" or "groq"`);
    return value as Config[keyof Config];
  }
  return value as Config[keyof Config];
}

export function setConfig(key: string, value: string): void {
  const validKeys: (keyof Config)[] = ['provider', 'model', 'maxDiffLines', 'language', 'projectId', 'threshold'];
  if (!validKeys.includes(key as keyof Config)) {
    throw new Error(`Unknown config key "${key}". Valid keys: ${validKeys.join(', ')}`);
  }
  const current = getConfig();
  const typedKey = key as keyof Config;
  const next: Config = { ...current, [typedKey]: coerceValue(typedKey, value) };
  writeConfigFile(next);
}

export function setProjectId(projectId: string | null): void {
  const current = getConfig();
  writeConfigFile({ ...current, projectId });
}

export function showConfig(): void {
  const cfg = getConfig();
  const entries = Object.entries(cfg)
    .map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`)
    .join('\n');
  console.log(`lenear config (${activePath()}):\n${entries}`);
}

export function getConfigPath(): string {
  return activePath();
}
