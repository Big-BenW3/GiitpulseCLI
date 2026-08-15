# gitpulse — Quick Guide

Everything you need to **use it**, **run it**, and **share it** with the world.

---

## 1. Prerequisites

- **Node.js 20 or higher** — check with `node --version`.
- **A Groq API key** — free at [console.groq.com](https://console.groq.com).
- **Git** installed and a project that is a git repository.

Set your key in your shell (and add this line to `~/.zshrc` / `~/.bashrc`
to make it permanent):

```bash
export GROQ_API_KEY=your_key_here
```

---

## 2. Running it locally (from this folder)

If you're sitting in the `gitpulse/` directory you just built:

```bash
# 1. install dependencies (only the first time)
npm install

# 2. compile TypeScript to dist/
npm run build

# 3. run the CLI directly
node dist/cli.js review
```

You should see the boxed review with a score, summary, and color-coded
issue sections.

### Optional — link it as a real `gitpulse` command on your machine

```bash
npm link
```

Now `gitpulse` works from any folder on your system:

```bash
cd ~/some-other-project
git add .
gitpulse review
```

To undo the link later: `npm unlink -g gitpulse`.

---

## 3. Daily usage

| What you want                              | Command                                              |
|--------------------------------------------|------------------------------------------------------|
| Review staged changes                      | `gitpulse review`                                    |
| Review the last commit                     | `gitpulse review --full`                             |
| Pick a different model for this run        | `gitpulse review --model llama-3.1-8b-instant`       |
| Print the raw diff being sent              | `gitpulse review --verbose`                          |
| Get JSON output (for CI / scripts)         | `gitpulse review --json`                             |
| See current config                         | `gitpulse config --show`                             |
| Change a config value                      | `gitpulse config --set model llama-3.3-70b-versatile`|
| Auto-block bad pushes with a git hook      | `gitpulse init`                                      |
| Remove the git hook                        | `gitpulse uninstall`                                 |

### Typical workflow

```bash
# 1. Make changes
vim src/auth.ts

# 2. Stage them
git add src/auth.ts

# 3. Get a review BEFORE committing
gitpulse review

# 4. Fix what it flags, then push
git commit -m "feat: add auth flow"
git push
```

### Install the pre-push gate (recommended)

```bash
cd ~/my-project
gitpulse init
```

From now on, every `git push` is reviewed automatically; pushes with a
score under 60 are blocked. Override the threshold by editing
`.git/hooks/pre-push` (look for the `60` literal).

---

## 4. Configuration

Drop a `.gitpulserc` JSON file in your project root to set defaults:

```json
{
  "model": "llama-3.3-70b-versatile",
  "maxDiffLines": 1500,
  "language": "typescript"
}
```

| Key            | Default                     | Notes |
|----------------|-----------------------------|-------|
| `model`        | `llama-3.3-70b-versatile`   | Any Groq model ID. |
| `maxDiffLines` | `2000`                      | Diffs longer than this are truncated. |
| `language`     | `auto`                      | Helps the model focus, e.g. `python`. |

CLI flags (`--model`, etc.) always override the file.

---

## 5. Using gitpulse in CI

Because `--json` outputs structured data, you can wire it straight into CI:

```yaml
- name: Code review
  env:
    GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
  run: |
    score=$(npx gitpulse review --full --json | jq '.score')
    echo "gitpulse score: $score"
    if [ "$score" -lt 70 ]; then
      echo "Review score below threshold"; exit 1
    fi
```

---

## 6. Sharing gitpulse with others

You have three good options.

### Option A — Push to GitHub (fastest)

1. Create a new repo at `github.com/<you>/gitpulse`.
2. From inside the project folder:

   ```bash
   git init
   git add .
   git commit -m "feat: initial gitpulse release"
   git branch -M main
   git remote add origin git@github.com:<you>/gitpulse.git
   git push -u origin main
   ```

3. Anyone can now install your fork directly from GitHub:

   ```bash
   npm install -g github:<you>/gitpulse
   ```

### Option B — Publish to npm (canonical share)

1. Sign in to npm (one time):

   ```bash
   npm login
   ```

2. Make sure `package.json` `name` is unique on npm. If `gitpulse` is
   taken, scope it to your username: change the name to
   `@<your-npm-username>/gitpulse`.

3. Build and publish:

   ```bash
   npm run build
   npm publish --access public
   ```

4. Anyone, anywhere can now run:

   ```bash
   npm install -g gitpulse                   # if unscoped
   npm install -g @<you>/gitpulse            # if scoped
   gitpulse review
   ```

Future releases: bump the version (`npm version patch` / `minor` / `major`)
then `npm publish` again.

### Option C — Share the folder directly

For a friend on the same network or a zipped handoff:

```bash
# zip the project (skip heavy folders)
zip -r gitpulse.zip gitpulse -x "gitpulse/node_modules/*" "gitpulse/dist/*"
```

Send them `gitpulse.zip`. They unzip, then:

```bash
cd gitpulse
npm install
npm run build
npm link
```

…and they have the `gitpulse` command.

---

## 7. Troubleshooting

| Symptom                                              | Fix                                                                 |
|------------------------------------------------------|---------------------------------------------------------------------|
| `Missing GROQ_API_KEY` error                         | Run `export GROQ_API_KEY=…` in the same shell as gitpulse.          |
| `Not a git repository`                               | `cd` into a project that has a `.git` folder.                       |
| `No staged changes found`                            | Run `git add <files>` first, or use `gitpulse review --full`.       |
| Build fails on `tsup`                                | Make sure Node is 20+. Delete `node_modules` and `npm install` again.|
| Pre-push hook never blocks the push                  | Confirm `gitpulse` is on your `PATH` (try `which gitpulse`).        |
| Model errors / rate limits                           | Try a smaller model: `gitpulse review --model llama-3.1-8b-instant`.|

---

## 8. Updating your installation

If you installed via `npm link`:

```bash
cd path/to/gitpulse
git pull           # if cloned from GitHub
npm install
npm run build
# the linked binary auto-updates
```

If you installed via `npm install -g gitpulse`:

```bash
npm update -g gitpulse
```

---

## 9. Suggested next steps

- Add a `gitpulse explain <file>` command that walks through a file.
- Wire `--json` output into a GitHub Action that posts a PR comment.
- Add a local-only mode using [Ollama](https://ollama.com) for offline reviews.

Happy reviewing. ⚡
