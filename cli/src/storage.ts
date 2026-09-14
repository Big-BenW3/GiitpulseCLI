import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

export interface GlobalConfig {
  provider: 'nvidia' | 'groq';
  nvidiaApiKey?: string;
  groqApiKey?: string;
  token?: string | null;
  tokenExpiresAt?: string | null;
  lastProjectId?: string | null;
  model?: string;
}

const DIR_NAME = '.lenear';
const FILE_NAME = 'config.json';

function globalDir(): string {
  return join(homedir(), DIR_NAME);
}

function globalPath(): string {
  return join(globalDir(), FILE_NAME);
}

function ensureDir(): void {
  const dir = globalDir();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function getExpiryHours(): number {
  const raw = process.env.LENEAR_TOKEN_EXPIRY_HOURS ?? process.env.TOKEN_EXPIRY_HOURS;
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) return n;
  return 24;
}

export function getGlobalConfig(): GlobalConfig {
  const path = globalPath();
  if (!existsSync(path)) return { provider: 'nvidia' };
  try {
    const raw = readFileSync(path, 'utf8');
    return JSON.parse(raw) as GlobalConfig;
  } catch {
    return { provider: 'nvidia' };
  }
}

export function setGlobalConfig(patch: Partial<GlobalConfig>): GlobalConfig {
  ensureDir();
  const current = getGlobalConfig();
  const next = { ...current, ...patch };
  writeFileSync(globalPath(), JSON.stringify(next, null, 2) + '\n', 'utf8');
  return next;
}

export function isTokenExpired(cfg: GlobalConfig): boolean {
  if (!cfg.token || !cfg.tokenExpiresAt) return true;
  const exp = new Date(cfg.tokenExpiresAt).getTime();
  if (!Number.isFinite(exp)) return true;
  return Date.now() > exp;
}

export function requireAuth(): GlobalConfig {
  const cfg = getGlobalConfig();
  if (!cfg.token || isTokenExpired(cfg)) {
    throw new Error('Not authenticated or token expired. Run `lenear auth login` to continue.');
  }
  return cfg;
}

export function clearToken(): void {
  setGlobalConfig({ token: null, tokenExpiresAt: null });
}

export function getGlobalConfigPath(): string {
  return globalPath();
}
