import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getConfig, setConfig } from '../src/config.js';

let dir: string;
let originalCwd: string;

beforeEach(() => {
  originalCwd = process.cwd();
  dir = mkdtempSync(join(tmpdir(), 'gitpulse-cfg-'));
  process.chdir(dir);
});

afterEach(() => {
  process.chdir(originalCwd);
  rmSync(dir, { recursive: true, force: true });
});

describe('getConfig', () => {
  it('returns defaults when .gitpulserc does not exist', () => {
    const cfg = getConfig();
    expect(cfg.model).toBe('llama-3.3-70b-versatile');
    expect(cfg.maxDiffLines).toBe(2000);
    expect(cfg.language).toBe('auto');
  });

  it('merges file values on top of defaults', () => {
    writeFileSync(
      join(dir, '.gitpulserc'),
      JSON.stringify({ model: 'custom-model' }),
    );
    const cfg = getConfig();
    expect(cfg.model).toBe('custom-model');
    expect(cfg.maxDiffLines).toBe(2000);
  });
});

describe('setConfig', () => {
  it('writes a string key to disk', () => {
    setConfig('model', 'mixtral-8x7b');
    expect(existsSync(join(dir, '.gitpulserc'))).toBe(true);
    const cfg = getConfig();
    expect(cfg.model).toBe('mixtral-8x7b');
  });

  it('coerces numeric keys', () => {
    setConfig('maxDiffLines', '500');
    const cfg = getConfig();
    expect(cfg.maxDiffLines).toBe(500);
  });

  it('rejects invalid numeric values', () => {
    expect(() => setConfig('maxDiffLines', 'oops')).toThrow();
  });

  it('rejects unknown keys', () => {
    expect(() => setConfig('totallyFake', 'x')).toThrow(/Unknown config key/);
  });

  it('preserves other values when one is updated', () => {
    setConfig('model', 'a');
    setConfig('language', 'typescript');
    const written = JSON.parse(readFileSync(join(dir, '.gitpulserc'), 'utf8'));
    expect(written.model).toBe('a');
    expect(written.language).toBe('typescript');
  });
});
