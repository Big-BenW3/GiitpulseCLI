# Lenear CLI — Windows Release & E2E Test Guide

> No npm publish — standalone Windows exe via GitHub Release.

## Can we GitHub Release ourselves? Yes

I can do the full `gh release` when you say `release`: build → verify → `pkg` Windows exe → `gh release create` + asset upload. But **build must be verified first** — we do that in steps below before any release.

---

## A. Build locally (ensure it works before release)

```powershell
cd cli
npm install --legacy-peer-deps
npm run lint
npm test          # 16/16
npm run build     # creates dist/cli.js  ~38KB

# sanity
node dist/cli.js --help
node dist/cli.js --version
node dist/cli.js doctor
```

Expected: no lint errors, `doctor` shows git/config/key/hook/auth checks.

## B. Windows standalone exe

```powershell
npm install --save-dev @yao-pkg/pkg  # or use Node SEA in future
npx pkg . --targets node20-win-x64 --output lenear-win-x64.exe
# test exe (needs no Node)
.\lenear-win-x64.exe --help
.\lenear-win-x64.exe doctor
```

Add `cli/package.json` script `build:win` for CI:
```json
"build:win": "tsup src/cli.ts --format esm --target node20 --clean --shims && pkg . --targets node20-win-x64 --output lenear-win-x64.exe"
```

## C. GitHub Release (I can run this)

```bash
git tag v0.1.0-beta
git push origin main --tags
gh release create v0.1.0-beta --title "Lenear v0.1.0-beta" --generate-notes
gh release upload v0.1.0-beta cli/lenear-win-x64.exe
# users download from https://github.com/Ben-W3cloud/GiitpulseCLI/releases
```

Link the asset in `web/src/app/cli/page.tsx:16` Download button.

## D. Your E2E test (after new Nvidia vars)

Create test emails (defaults, use Resend test inbox):
- `lenear-test+alex@resend.dev`
- `lenear-test+reviewer@resend.dev`
- `lenear-test+critical@resend.dev`

Steps (in a fresh repo clone):

```powershell
# 1. inject Nvidia vars (you will put new vars in cli/.env or env var)
$env:NVIDIA_API_KEY="nvapi-..."
$env:LENEAR_TOKEN_EXPIRY_HOURS="24"

# 2. init + config
lenear init
lenear config set provider nvidia
lenear config set model meta/llama-3.3-70b-instruct
lenear config set nvidiaApiKey $env:NVIDIA_API_KEY

# 3. auth (Email link via Resend, Auth.js on lenear.vercel.app)
lenear auth login          # opens browser, click email link
lenear auth status

# 4. project
lenear project create beta-test --desc "beta"
lenear pull                # arrows select, writes .lenearrc projectId

# 5. review flows
git add .
lenear review .            # staged+unstaged, warns untracked
lenear review staged --json | jq .score
lenear review unstaged --verbose
lenear review cli/src/ai.ts --fail-under 60
lenear review cli/src/ai.ts cli/src/cli.ts
lenear models
lenear doctor

# 6. dashboard check
# open https://lenear.vercel.app/dashboard — see review with score/summary/severity counts/payload
```

If any step fails, paste the `renderError` output and we iterate before release.

## E. After E2E passes — polish before `gh release`

- Ensure `web` builds (`npm run build --prefix web`) with `DATABASE_URL`/`AUTH_SECRET`/`RESEND_API_KEY` in Vercel env (already set per you)
- `drizzle-kit push` once with new Neon URL (rotated)
- Commit batches: see `v2.md` for future improvements (T-REX, GitHub OAuth)
