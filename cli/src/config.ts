import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface Config {
  model: string;
  maxDiffLines: number;
  language: string;
}

const CONFIG_FILENAME = '.gitpulserc';

const DEFAULT_CONFIG: Config = {
  model: 'llama-3.3-70b-versatile',
  maxDiffLines: 2000,
  language: 'auto',
};

function configPath(): string {
  return join(process.cwd(), CONFIG_FILENAME);
}

function readConfigFile(): Partial<Config> {
  const path = configPath();
  if (!existsSync(path)) return {};
  try {
    const raw = readFileSync(path, 'utf8');
    const parsed = JSON.parse(raw) as Partial<Config>;
    return parsed;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to read ${CONFIG_FILENAME}: ${msg}`);
  }
}

function writeConfigFile(cfg: Config): void {
  try {
    writeFileSync(configPath(), JSON.stringify(cfg, null, 2) + '\n', 'utf8');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to write ${CONFIG_FILENAME}: ${msg}`);
  }
}

export function getConfig(): Config {
  const fromFile = readConfigFile();
  return { ...DEFAULT_CONFIG, ...fromFile };
}

function coerceValue(key: keyof Config, value: string): Config[keyof Config] {
  if (key === 'maxDiffLines') {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) {
      throw new Error(`maxDiffLines must be a positive number, got "${value}"`);
    }
    return n;
  }
  return value;
}

export function setConfig(key: string, value: string): void {
  const validKeys: (keyof Config)[] = ['model', 'maxDiffLines', 'language'];
  if (!validKeys.includes(key as keyof Config)) {
    throw new Error(
      `Unknown config key "${key}". Valid keys: ${validKeys.join(', ')}`,
    );
  }
  const current = getConfig();
  const typedKey = key as keyof Config;
  const next: Config = { ...current, [typedKey]: coerceValue(typedKey, value) };
  writeConfigFile(next);
}

export function showConfig(): void {
  const cfg = getConfig();
  const entries = Object.entries(cfg)
    .map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`)
    .join('\n');
  console.log(`gitpulse config (${configPath()}):\n${entries}`);
}
