import chalk from 'chalk';
import boxen from 'boxen';
import type { Issue, ReviewResult, Severity } from './ai.js';

function scoreColor(score: number): (s: string) => string {
  if (score >= 80) return chalk.green.bold;
  if (score >= 60) return chalk.yellow.bold;
  return chalk.red.bold;
}

function severityLabel(sev: Severity): string {
  const tag = `[${sev.toUpperCase()}]`;
  if (sev === 'critical') return chalk.red.bold(tag);
  if (sev === 'warning') return chalk.yellow.bold(tag);
  return chalk.cyan.bold(tag);
}

function formatIssue(issue: Issue): string {
  const tag = severityLabel(issue.severity);
  const loc = issue.line !== undefined ? `${issue.file}:${issue.line}` : issue.file;
  const head = `${tag} ${chalk.white(loc)} — ${issue.message}`;
  if (issue.suggestion) {
    return `${head}\n          ${chalk.gray('→')} ${chalk.italic(issue.suggestion)}`;
  }
  return head;
}

function renderSection(
  title: string,
  emoji: string,
  issues: Issue[],
): string | null {
  if (issues.length === 0) return null;
  const header = chalk.bold(`${emoji} ${title} (${issues.length})`);
  const body = issues.map(formatIssue).join('\n\n');
  return `${header}\n${body}`;
}

export function renderReview(result: ReviewResult, repoName: string): void {
  const color = scoreColor(result.score);
  const headerText = `${chalk.cyan.bold('gitpulse')} ${chalk.gray('•')} ${chalk.white(repoName)}   ${chalk.bold('Score:')} ${color(`${result.score}/100`)}`;

  console.log(
    boxen(headerText, {
      padding: { top: 0, bottom: 0, left: 2, right: 2 },
      margin: { top: 1, bottom: 1, left: 0, right: 0 },
      borderStyle: 'double',
      borderColor: result.score >= 80 ? 'green' : result.score >= 60 ? 'yellow' : 'red',
    }),
  );

  console.log(chalk.bold('📋 Summary'));
  console.log(result.summary.trim());
  console.log('');

  const sections = [
    renderSection('Bugs', '🐛', result.bugs),
    renderSection('Security', '🔒', result.security),
    renderSection('Style', '🎨', result.style),
    renderSection('Suggestions', '✨', result.suggestions),
  ].filter((s): s is string => s !== null);

  if (sections.length === 0) {
    console.log(chalk.green('✅ No issues found. Clean diff!\n'));
  } else {
    for (const s of sections) {
      console.log(s);
      console.log('');
    }
  }

  console.log(
    chalk.gray('⚡ Powered by Groq — Run `git push` to proceed or fix issues first'),
  );
}

export function renderError(message: string): void {
  console.error(
    boxen(chalk.red.bold('Error: ') + chalk.red(message), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'red',
    }),
  );
}

export function renderEmpty(): void {
  console.log(
    boxen(
      chalk.yellow.bold('Nothing to review.') +
        '\n\n' +
        chalk.gray('Stage changes with `git add` and try again.'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'yellow',
      },
    ),
  );
}
