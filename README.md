```
       _ _               _
  __ _(_) |_ _ __  _   _| |___  ___
 / _` | | __| '_ \| | | | / __|/ _ \
| (_| | | |_| |_) | |_| | \__ \  __/
 \__, |_|\__| .__/ \__,_|_|___/\___|
 |___/      |_|
```

# gitpulse

[![npm version](https://img.shields.io/npm/v/gitpulse.svg?style=flat-square)](https://www.npmjs.com/package/gitpulse)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-blue.svg?style=flat-square)](https://nodejs.org)
[![Built with Groq](https://img.shields.io/badge/built%20with-Groq%20⚡-orange.svg?style=flat-square)](https://groq.com)

> **AI-powered code reviewer that lives in your terminal.** Stage your changes,
> run `gitpulse review`, and get a structured second pair of eyes before you
> push — in less than a second, thanks to Groq.

---

## What it does

`gitpulse` reads your staged git diff and returns a structured, actionable code
review directly in the terminal. It catches bugs, security holes, sloppy naming,
and refactor opportunities — the things a human reviewer would flag — without
leaving your shell.

```
╔══════════════════════════════════════╗
║  gitpulse • my-repo  Score: 87/100  ║
╚══════════════════════════════════════╝
📋 Summary
Clean refactor of the auth module. One critical SQL-injection risk and a
plaintext password log block this from being green.

🐛 Bugs (2)
[WARNING] src/auth.ts:42 — password logged in plaintext
          → Use a redaction utility before logging

🔒 Security (1)
[CRITICAL] src/api.ts:17 — SQL query built with string concatenation
           → Use parameterized queries

✨ Suggestions (3)
[INFO] src/utils.ts — function name `doStuff` is not descriptive
       → Rename to `sanitizeUserInput`

⚡ Powered by Groq — Run `git push` to proceed or fix issues first
```

## Why use it

- **Catches what you miss.** A second pair of eyes you don't have to schedule.
- **Instant.** Groq returns full reviews in well under a second — no waiting on
  a human, no waiting on a slow API.
- **Lives where you live.** No browser tab, no Slack thread. Just the terminal.
- **Pre-push hook included.** Block pushes below a quality threshold.
- **Structured output.** Pipe `--json` straight into CI or your own tooling.
- **Free to run.** Bring your own Groq API key — the model is free-tier-friendly.

## Installation

```bash
npm install -g gitpulse
```

Set your Groq API key (get one for free at [console.groq.com](https://console.groq.com)):

```bash
export GROQ_API_KEY=your_key_here
```

Add it to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.) to make it permanent.

## Usage

### Review staged changes (the default)

```bash
git add .
gitpulse review
```

### Review the last commit

```bash
gitpulse review --full
```

### Override the model for one run

```bash
gitpulse review --model llama-3.1-8b-instant
```

### Print the raw diff first (debugging)

```bash
gitpulse review --verbose
```

### Output JSON for CI / scripts

```bash
gitpulse review --json | jq '.score'
```

### Install a pre-push git hook

```bash
gitpulse init
```

This adds a `.git/hooks/pre-push` that runs `gitpulse review` and aborts the
push if the score falls below 60. Remove it with:

```bash
gitpulse uninstall
```

### Manage config

```bash
gitpulse config --show
gitpulse config --set model llama-3.3-70b-versatile
gitpulse config --set maxDiffLines 1500
gitpulse config --set language typescript
```

## Configuration

`gitpulse` reads an optional `.gitpulserc` JSON file from the project root.
Every field is optional — defaults are applied when the file or the field
is missing.

| Key            | Default                     | Description |
|----------------|-----------------------------|-------------|
| `model`        | `llama-3.3-70b-versatile`   | Groq model used for the review. |
| `maxDiffLines` | `2000`                      | Diff is truncated past this many lines to stay within token limits. |
| `language`     | `auto`                      | Hint the primary language to the model (`typescript`, `python`, …) or leave `auto`. |

Example `.gitpulserc`:

```json
{
  "model": "llama-3.3-70b-versatile",
  "maxDiffLines": 1500,
  "language": "typescript"
}
```

> Don't commit `.gitpulserc` if it contains anything sensitive — it's gitignored
> by default in this project.

## How it works

```
┌─────────────┐    ┌──────────┐    ┌────────────┐    ┌──────────────┐
│ git staged  │ →  │ simple-  │ →  │  Groq API  │ →  │  terminal    │
│   diff      │    │  git     │    │  (JSON)    │    │  renderer    │
└─────────────┘    └──────────┘    └────────────┘    └──────────────┘
```

1. `simple-git` reads the staged diff from your working tree.
2. The diff is sent to Groq with a strict JSON-only system prompt and
   `response_format: { type: "json_object" }` to enforce structured output.
3. The response is validated against the `ReviewResult` shape — malformed
   responses surface a clear error instead of silent failure.
4. `chalk` + `boxen` render the review with color-coded severities.

**Why Groq?** Code review is interactive — you want it now, not in 8 seconds.
Groq's inference latency makes the review feel synchronous with your typing,
which is the difference between a tool you actually use before every push
and one you don't.

## Roadmap

- `gitpulse explain <file>` — explain a file or function on demand.
- Inline GitHub PR comment integration.
- Multi-model consensus mode.
- Local-only mode via Ollama for offline use.

## Contributing

Pull requests welcome! See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the
setup guide, test workflow, and PR conventions.

## License

[MIT](LICENSE) © contributors. Use it, fork it, ship it.
