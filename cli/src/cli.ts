#!/usr/bin/env node
import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { getConfig, setConfig, showConfig, setProjectId, getConfigPath } from './config.js';
import {
  getStagedDiff,
  getUnstagedDiff,
  getAllDiff,
  getFileDiffs,
  getFullDiff,
  getRepoName,
  isGitRepo,
  getUntrackedFiles,
} from './git.js';
import { reviewDiff, listModels, type ReviewResult } from './ai.js';
import { renderReview, renderError, renderEmpty } from './display.js';
import { installPrePushHook, uninstallPrePushHook } from './hooks.js';
import { getGlobalConfig, setGlobalConfig, getExpiryHours } from './storage.js';
import { login, logout, whoami, getAuthStatus } from './auth.js';
import { createProject, listProjects, selectProjectInteractive } from './project.js';
import { runDoctor } from './doctor.js';

interface ReviewFlags {
  staged?: boolean;
  unstaged?: boolean;
  full?: boolean;
  model?: string;
  verbose?: boolean;
  json?: boolean;
  failUnder?: string;
}

function truncateDiff(diff: string, maxLines: number): string {
  const lines = diff.split('\n');
  if (lines.length <= maxLines) return diff;
  return lines.slice(0, maxLines).join('\n') + `\n... [truncated ${lines.length - maxLines} lines per maxDiffLines]`;
}

async function runReview(files: string[], flags: ReviewFlags): Promise<void> {
  if (!(await isGitRepo())) {
    renderError('Not a git repository. Run lenear inside a git project.');
    process.exit(1);
  }

  const cfg = getConfig();
  const global = getGlobalConfig();
  const model = flags.model ?? global.model ?? cfg.model;
  const provider = global.provider ?? cfg.provider ?? 'nvidia';

  // handle untracked warning for "." case
  if (files.length === 1 && files[0] === '.') files = [];

  let diff: string;
  try {
    if (files.length > 0) {
      diff = await getFileDiffs(files);
    } else if (flags.full) {
      diff = await getFullDiff();
    } else if (flags.staged) {
      diff = await getStagedDiff();
    } else if (flags.unstaged) {
      diff = await getUnstagedDiff();
    } else {
      // "." or no arg => staged + unstaged
      try {
        diff = await getAllDiff();
      } catch {
        diff = await getStagedDiff();
      }
      const untracked = await getUntrackedFiles();
      if (untracked.length > 0) {
        console.log(chalk.yellow(`Warning: ${untracked.length} untracked file(s) not included: ${untracked.slice(0, 5).join(', ')}${untracked.length > 5 ? '...' : ''}`));
        console.log(chalk.gray('Stage them with `git add` to include in review.\n'));
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('no staged') || msg.toLowerCase().includes('no diff') || msg.toLowerCase().includes('no changes') || msg.toLowerCase().includes('no unstaged')) {
      renderEmpty();
      process.exit(0);
    }
    renderError(msg);
    process.exit(1);
  }

  diff = truncateDiff(diff, cfg.maxDiffLines);

  if (flags.verbose) {
    console.log(chalk.gray('--- Raw diff ---'));
    console.log(diff);
    console.log(chalk.gray('--- End diff ---\n'));
  }

  const spinner = flags.json ? null : ora({ text: `Reviewing diff with ${model} (${provider})…`, color: 'cyan' }).start();

  let result: ReviewResult;
  try {
    result = await reviewDiff(diff, { model, language: cfg.language, provider });
    spinner?.succeed('Review complete');
  } catch (err) {
    spinner?.fail('Review failed');
    const msg = err instanceof Error ? err.message : String(err);
    if (flags.json) {
      console.log(JSON.stringify({ error: msg }));
    } else {
      renderError(msg);
      if (msg.includes('Missing')) {
        console.log(chalk.yellow(`\nFix: lenear config set ${provider === 'nvidia' ? 'nvidiaApiKey' : 'groqApiKey'} <key>`));
        console.log(chalk.gray(`Or set env ${provider === 'nvidia' ? 'NVIDIA_API_KEY' : 'GROQ_API_KEY'}`));
      }
    }
    process.exit(1);
  }

  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
    if (flags.failUnder) {
      const n = Number(flags.failUnder);
      if (Number.isFinite(n) && result.score < n) process.exit(2);
    }
    return;
  }

  const repo = await getRepoName();
  renderReview(result, repo);

  if (flags.failUnder) {
    const n = Number(flags.failUnder);
    if (Number.isFinite(n) && result.score < n) {
      console.log(chalk.red(`\nScore ${result.score} < --fail-under ${n}. Exiting 2.`));
      process.exit(2);
    }
  }
}

async function runInit(): Promise<void> {
  try {
    const cfg = getConfig();
    const global = getGlobalConfig();
    // Write initial config if missing
    if (!cfg.projectId) setProjectId(null);
    console.log(chalk.green(`Initialized lenear config at ${getConfigPath()}`));
    console.log(chalk.gray(`provider=${cfg.provider} model=${cfg.model} threshold=${cfg.threshold}`));

    const missingKey =
      (cfg.provider === 'nvidia' && !global.nvidiaApiKey && !process.env.NVIDIA_API_KEY) ||
      (cfg.provider === 'groq' && !global.groqApiKey && !process.env.GROQ_API_KEY);

    if (missingKey) {
      console.log(chalk.yellow(`\nWarning: No API key for provider "${cfg.provider}" found.`));
      console.log(chalk.gray(`Set it with: lenear config set ${cfg.provider === 'nvidia' ? 'nvidiaApiKey' : 'groqApiKey'} <key>`));
      console.log(chalk.gray(`Or switch provider: lenear config set provider nvidia|groq`));
    }

    const hours = getExpiryHours();
    console.log(chalk.gray(`\nAuth token expiry: ${hours}h (LENEAR_TOKEN_EXPIRY_HOURS env var)`));
    console.log(chalk.gray('Next: lenear auth login → lenear project create <name> → lenear pull → lenear review'));

    await installPrePushHook();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    renderError(msg);
    process.exit(1);
  }
}

const program = new Command();

program.name('lenear').description('Lenear — AI code reviewer (Nvidia + Groq) with project workspaces.').version('1.0.0');

// review
program
  .command('review', { isDefault: true })
  .description('Review diffs. Args: . (staged+unstaged), staged, unstaged, or file(s) e.g. app.ts server.ts')
  .argument('[files...]', 'Files to review, "." for all, or staged/unstaged keywords')
  .option('--staged', 'Review staged diff only')
  .option('--unstaged', 'Review unstaged diff only')
  .option('--full', 'Review HEAD~1..HEAD')
  .option('--model <name>', 'Override model for this run')
  .option('--verbose', 'Print raw diff before review', false)
  .option('--json', 'Output JSON for CI', false)
  .option('--fail-under <n>', 'Exit 2 if score < n')
  .action(async (files: string[], opts: ReviewFlags) => {
    // handle staged/unstaged as arg keywords
    const f = [...files];
    const flags = { ...opts } as ReviewFlags;
    if (f.length === 1 && f[0] === 'staged') {
      flags.staged = true;
      f.length = 0;
    } else if (f.length === 1 && f[0] === 'unstaged') {
      flags.unstaged = true;
      f.length = 0;
    }
    await runReview(f, flags);
  });

// init
program.command('init').description('Init lenear in this repo (.lenearrc + pre-push hook)').action(async () => {
  await runInit();
});

// auth
const auth = program.command('auth').description('Authentication');
auth
  .command('login')
  .description('Login via browser (stores global token, expiry via LENEAR_TOKEN_EXPIRY_HOURS)')
  .action(async () => {
    try {
      await login();
    } catch (err) {
      renderError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });
auth
  .command('logout')
  .description('Clear global token')
  .action(() => logout());
auth
  .command('status')
  .description('Show auth status')
  .action(() => {
    const s = getAuthStatus();
    if (s.authenticated) console.log(chalk.green(`Authenticated — expires ${s.expiresAt}`));
    else if (s.expired) console.log(chalk.yellow('Token expired — run lenear auth login'));
    else console.log(chalk.yellow('Not authenticated — run lenear auth login'));
  });
auth
  .command('whoami')
  .description('Show current user (requires backend)')
  .action(() => whoami());

// config
const config = program.command('config').description('Config (.lenearrc + global ~/.lenear/config.json)');
config
  .command('set')
  .description('Set key: provider|model|maxDiffLines|language|projectId|threshold|nvidiaApiKey|groqApiKey')
  .argument('<key>', 'Key')
  .argument('<value>', 'Value')
  .action((key: string, value: string) => {
    try {
      if (key === 'nvidiaApiKey' || key === 'groqApiKey') {
        const patch = key === 'nvidiaApiKey' ? { nvidiaApiKey: value } : { groqApiKey: value };
        setGlobalConfig(patch);
        console.log(chalk.green(`Set global ${key}`));
        return;
      }
      setConfig(key, value);
      console.log(chalk.green(`Set ${key} = ${value}`));
    } catch (err) {
      renderError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });
config
  .command('get')
  .description('Get key')
  .argument('<key>', 'Key')
  .action((key: string) => {
    try {
      const global = getGlobalConfig() as Record<string, unknown>;
      if (key in global) {
        console.log(`${key}: ${JSON.stringify(global[key])}`);
        return;
      }
      const cfg = getConfig() as Record<string, unknown>;
      console.log(`${key}: ${JSON.stringify(cfg[key])}`);
    } catch (err) {
      renderError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });
config
  .command('list')
  .alias('show')
  .description('Show all config')
  .action(() => {
    showConfig();
    const g = getGlobalConfig();
    console.log(chalk.gray(`\nglobal ~/.lenear/config.json: provider=${g.provider} token=${g.token ? '***' : 'null'} lastProjectId=${g.lastProjectId ?? 'null'}`));
  });

// project
const project = program.command('project').description('Project workspaces (requires auth)');
project
  .command('create')
  .description('Create project')
  .argument('<name>', 'Project name')
  .option('--desc <text>', 'Description')
  .action(async (name: string, opts: { desc?: string }) => {
    try {
      await createProject(name, opts.desc);
    } catch (err) {
      renderError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });
project
  .command('list')
  .description('List projects')
  .action(async () => {
    try {
      const ps = await listProjects();
      if (ps.length === 0) console.log('No projects');
      else for (const p of ps) console.log(`${p.name} — ${p.id}${p.description ? ` — ${p.description}` : ''}`);
    } catch (err) {
      renderError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

// pull (interactive selector)
program
  .command('pull')
  .description('Pull projects for owner and select with arrows (requires auth)')
  .action(async () => {
    try {
      await selectProjectInteractive();
    } catch (err) {
      renderError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

// models
program
  .command('models')
  .description('List models for current provider')
  .option('--provider <p>', 'nvidia|groq')
  .action(async (opts: { provider?: string }) => {
    const provider = (opts.provider as 'nvidia' | 'groq') ?? (getGlobalConfig().provider as 'nvidia' | 'groq') ?? 'nvidia';
    try {
      const list = await listModels(provider);
      for (const m of list) console.log(m);
    } catch (err) {
      renderError(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

// doctor
program.command('doctor').description('Check setup').action(async () => {
  await runDoctor();
});

// uninstall hook
program.command('uninstall').description('Remove lenear pre-push hook').action(() => {
  try {
    uninstallPrePushHook();
  } catch (err) {
    renderError(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
});

program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  renderError(msg);
  process.exit(1);
});
