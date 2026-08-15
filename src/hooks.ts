import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
  chmodSync,
} from 'node:fs';
import { createInterface } from 'node:readline';
import { join } from 'node:path';

const HOOK_MARKER = '# gitpulse-managed-hook';

const HOOK_SCRIPT = `#!/bin/sh
${HOOK_MARKER}
# Installed by \`gitpulse init\`. Aborts the push if score < 60.

if ! command -v gitpulse >/dev/null 2>&1; then
  echo "gitpulse not found in PATH — skipping review." >&2
  exit 0
fi

output=$(gitpulse review --full --json 2>/dev/null)
status=$?
if [ $status -ne 0 ]; then
  echo "$output"
  echo "gitpulse review failed. Aborting push." >&2
  exit 1
fi

score=$(echo "$output" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{console.log(JSON.parse(d).score)}catch(e){console.log(0)}})")

if [ -z "$score" ]; then
  echo "Could not determine gitpulse score. Aborting push." >&2
  exit 1
fi

if [ "$score" -lt 60 ]; then
  echo "gitpulse score $score < 60. Push aborted. Run \`gitpulse review\` for details." >&2
  exit 1
fi

exit 0
`;

function hookPath(): string {
  return join(process.cwd(), '.git', 'hooks', 'pre-push');
}

function hooksDir(): string {
  return join(process.cwd(), '.git', 'hooks');
}

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export async function installPrePushHook(): Promise<void> {
  if (!existsSync(join(process.cwd(), '.git'))) {
    throw new Error('Not a git repository — no .git directory found.');
  }

  const dir = hooksDir();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const path = hookPath();
  if (existsSync(path)) {
    const existing = readFileSync(path, 'utf8');
    if (!existing.includes(HOOK_MARKER)) {
      const answer = await prompt(
        'A pre-push hook already exists. Overwrite? [y/N] ',
      );
      if (answer !== 'y' && answer !== 'yes') {
        console.log('Aborted. Existing hook left in place.');
        return;
      }
    }
  }

  writeFileSync(path, HOOK_SCRIPT, 'utf8');
  try {
    chmodSync(path, 0o755);
  } catch {
    // chmod may fail on Windows — git for windows still respects executability.
  }
  console.log(`Installed gitpulse pre-push hook at ${path}`);
}

export function uninstallPrePushHook(): void {
  const path = hookPath();
  if (!existsSync(path)) {
    console.log('No pre-push hook found — nothing to uninstall.');
    return;
  }
  const contents = readFileSync(path, 'utf8');
  if (!contents.includes(HOOK_MARKER)) {
    throw new Error(
      'Existing pre-push hook was not installed by gitpulse. Remove it manually.',
    );
  }
  unlinkSync(path);
  console.log(`Removed gitpulse pre-push hook at ${path}`);
}
