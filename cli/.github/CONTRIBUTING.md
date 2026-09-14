# Contributing to gitpulse

Thanks for your interest in making gitpulse better! This guide walks you
through getting set up and submitting a quality pull request.

## Quick start

1. **Fork** the repository on GitHub and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/gitpulse.git
   cd gitpulse
   ```

2. **Install dependencies** (Node 20+ required):

   ```bash
   npm install
   ```

3. **Set your Groq API key** — gitpulse reads it from the environment:

   ```bash
   export GROQ_API_KEY=your_key_here
   ```

   You can get a free key at [console.groq.com](https://console.groq.com).

4. **Build and run locally**:

   ```bash
   npm run build
   node dist/cli.js review
   ```

## Running the test suite

```bash
npm test
```

Watch mode while iterating:

```bash
npm run test:watch
```

Lint:

```bash
npm run lint
```

## Submitting a PR

1. Create a branch from `main`:

   ```bash
   git checkout -b feat/your-feature
   ```

2. Make your changes. Follow these conventions:
   - **Conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, etc.
   - **TypeScript only** — strict mode, no `any`.
   - **Add tests** for new functionality.
   - **No hardcoded keys** — always read from `process.env.GROQ_API_KEY`.

3. Make sure CI passes locally:

   ```bash
   npm run lint && npm test && npm run build
   ```

4. Push your branch and open a pull request against `main`. Describe what
   changed and why, and link any related issues.

## Reporting bugs

Open a GitHub issue using the bug report template. Include:
- gitpulse version (`gitpulse --version`)
- Node version (`node --version`)
- A minimal repro
- Expected vs actual behavior

## Code of conduct

Be kind, be specific, and assume good faith. We're all here to build something
useful.
