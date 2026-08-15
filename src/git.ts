import { simpleGit, type SimpleGit } from 'simple-git';
import { basename } from 'node:path';

function client(): SimpleGit {
  return simpleGit(process.cwd());
}

export async function isGitRepo(): Promise<boolean> {
  try {
    return await client().checkIsRepo();
  } catch {
    return false;
  }
}

async function ensureRepo(): Promise<void> {
  if (!(await isGitRepo())) {
    throw new Error(
      'Not a git repository. Run gitpulse inside a git project.',
    );
  }
}

export async function getStagedDiff(): Promise<string> {
  await ensureRepo();
  try {
    const diff = await client().diff(['--staged']);
    if (!diff.trim()) {
      throw new Error(
        'No staged changes found. Stage files with `git add` before running gitpulse review.',
      );
    }
    return diff;
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('No staged')) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to read staged diff: ${msg}`);
  }
}

export async function getFullDiff(): Promise<string> {
  await ensureRepo();
  try {
    const diff = await client().diff(['HEAD~1', 'HEAD']);
    if (!diff.trim()) {
      throw new Error('No diff found between HEAD~1 and HEAD.');
    }
    return diff;
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('No diff')) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to read full diff: ${msg}`);
  }
}

export async function getRepoName(): Promise<string> {
  const fallback = basename(process.cwd());
  if (!(await isGitRepo())) return fallback;
  try {
    const remotes = await client().getRemotes(true);
    const origin = remotes.find((r) => r.name === 'origin') ?? remotes[0];
    const url = origin?.refs?.fetch ?? origin?.refs?.push;
    if (!url) return fallback;
    const cleaned = url.replace(/\.git$/, '');
    const parts = cleaned.split(/[/:]/).filter(Boolean);
    return parts[parts.length - 1] || fallback;
  } catch {
    return fallback;
  }
}
