import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getConfig } from './config.js';
import { getGlobalConfig } from './storage.js';
import { getAuthStatus } from './auth.js';
import { isGitRepo } from './git.js';

export async function runDoctor(): Promise<void> {
  console.log('lenear doctor — checking setup\n');

  const checks: Array<{ name: string; ok: boolean; msg: string }> = [];

  checks.push({
    name: 'Git repository',
    ok: await isGitRepo(),
    msg: (await isGitRepo()) ? 'inside a git repo' : 'not a git repo — run inside a project with .git',
  });

  const cfg = getConfig();
  checks.push({ name: 'Config (.lenearrc)', ok: true, msg: `provider=${cfg.provider} model=${cfg.model} threshold=${cfg.threshold}` });

  const global = getGlobalConfig();
  const hasKey =
    (cfg.provider === 'nvidia' && !!(global.nvidiaApiKey ?? process.env.NVIDIA_API_KEY)) ||
    (cfg.provider === 'groq' && !!(global.groqApiKey ?? process.env.GROQ_API_KEY));
  checks.push({
    name: `API key (${cfg.provider})`,
    ok: hasKey,
    msg: hasKey ? 'present' : `missing — run lenear config set ${cfg.provider === 'nvidia' ? 'nvidiaApiKey' : 'groqApiKey'} <key>`,
  });

  const hookPath = join(process.cwd(), '.git', 'hooks', 'pre-push');
  checks.push({
    name: 'Pre-push hook',
    ok: existsSync(hookPath),
    msg: existsSync(hookPath) ? `found at ${hookPath}` : 'not installed — run lenear init',
  });

  const auth = getAuthStatus();
  // not required for local review, but show
  checks.push({
    name: 'Auth',
    ok: auth.authenticated,
    msg: auth.authenticated ? `authenticated until ${auth.expiresAt}` : auth.expired ? 'token expired — lenear auth login' : 'not authenticated — lenear auth login (required for project features)',
  });

  for (const c of checks) {
    const icon = c.ok ? '✓' : '✗';
    console.log(`${icon} ${c.name}: ${c.msg}`);
  }

  const allOk = checks.filter((c) => c.name !== 'Auth').every((c) => c.ok);
  console.log(allOk ? '\nAll required checks pass.' : '\nSome checks failed — see above.');
}
