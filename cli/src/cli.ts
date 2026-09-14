#!/usr/bin/env node
import { Command } from 'commander';
import ora from 'ora';
import chalk from 'chalk';
import { getConfig, setConfig, showConfig } from './config.js';
import { getStagedDiff, getFullDiff, getRepoName, isGitRepo } from './git.js';
import { reviewDiff, type ReviewResult } from './ai.js';
import { renderReview, renderError, renderEmpty } from './display.js';
import { installPrePushHook, uninstallPrePushHook } from './hooks.js';

interface ReviewFlags {
  full?: boolean;
  model?: string;
  verbose?: boolean;
  json?: boolean;
}

interface ConfigFlags {
  set?: [string, string];
  show?: boolean;
}

function truncateDiff(diff: string, maxLines: number): string {
  const lines = diff.split('\n');
  if (lines.length <= maxLines) return diff;
  return (
    lines.slice(0, maxLines).join('\n') +
    `\n... [truncated ${lines.length - maxLines} lines per maxDiffLines]`
  );
}

async function runReview(flags: ReviewFlags): Promise<void> {
  if (!(await isGitRepo())) {
    renderError('Not a git repository. Run gitpulse inside a git project.');
    process.exit(1);
  }

  const cfg = getConfig();
  const model = flags.model ?? cfg.model;

  let diff: string;
  try {
    diff = flags.full ? await getFullDiff() : await getStagedDiff();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes('no staged') || msg.toLowerCase().includes('no diff')) {
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

  const spinner = flags.json
    ? null
    : ora({
        text: `Reviewing diff with ${model}…`,
        color: 'cyan',
      }).start();

  let result: ReviewResult;
  try {
    result = await reviewDiff(diff, { model, language: cfg.language });
    spinner?.succeed('Review complete');
  } catch (err) {
    spinner?.fail('Review failed');
    const msg = err instanceof Error ? err.message : String(err);
    if (flags.json) {
      console.log(JSON.stringify({ error: msg }));
    } else {
      renderError(msg);
    }
    process.exit(1);
  }

  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const repo = await getRepoName();
  renderReview(result, repo);
}

async function runConfig(flags: ConfigFlags): Promise<void> {
  try {
    if (flags.set) {
      const [key, value] = flags.set;
      setConfig(key, value);
      console.log(chalk.green(`Set ${key} = ${value}`));
      return;
    }
    if (flags.show) {
      showConfig();
      return;
    }
    showConfig();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    renderError(msg);
    process.exit(1);
  }
}

async function runInit(): Promise<void> {
  try {
    await installPrePushHook();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    renderError(msg);
    process.exit(1);
  }
}

async function runUninstall(): Promise<void> {
  try {
    uninstallPrePushHook();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    renderError(msg);
    process.exit(1);
  }
}

const program = new Command();

program
  .name('gitpulse')
  .description('AI-powered terminal code reviewer — built on Groq.')
  .version('1.0.0');

program
  .command('review', { isDefault: true })
  .description('Review the staged diff (or full HEAD diff with --full).')
  .option('--full', 'Review HEAD~1..HEAD instead of the staged diff', false)
  .option('--model <name>', 'Override the Groq model for this run')
  .option('--verbose', 'Print the raw diff before the review', false)
  .option('--json', 'Output review as raw JSON for CI piping', false)
  .action(async (opts: ReviewFlags) => {
    await runReview(opts);
  });

program
  .command('config')
  .description('Read or write gitpulse config (.gitpulserc).')
  .option('--set <items...>', 'Set a config key: --set model llama-3.3-70b-versatile')
  .option('--show', 'Print current config', false)
  .action(async (opts: { set?: string[]; show?: boolean }) => {
    const parsed: ConfigFlags = { show: opts.show };
    if (opts.set) {
      if (opts.set.length !== 2) {
        renderError('Usage: gitpulse config --set <key> <value>');
        process.exit(1);
      }
      parsed.set = [opts.set[0], opts.set[1]];
    }
    await runConfig(parsed);
  });

program
  .command('init')
  .description('Install the gitpulse pre-push git hook in this repo.')
  .action(async () => {
    await runInit();
  });

program
  .command('uninstall')
  .description('Remove the gitpulse pre-push git hook from this repo.')
  .action(async () => {
    await runUninstall();
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  renderError(msg);
  process.exit(1);
});
