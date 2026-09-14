import { getGlobalConfig, setGlobalConfig, clearToken, getExpiryHours, isTokenExpired } from './storage.js';

const WEB_BASE = process.env.LENEAR_WEB_URL ?? 'https://lenear.vercel.app';

export interface AuthStatus {
  authenticated: boolean;
  expired: boolean;
  token: string | null;
  expiresAt: string | null;
}

export function getAuthStatus(): AuthStatus {
  const cfg = getGlobalConfig();
  const expired = isTokenExpired(cfg);
  return {
    authenticated: !!cfg.token && !expired,
    expired,
    token: cfg.token ?? null,
    expiresAt: cfg.tokenExpiresAt ?? null,
  };
}

export async function login(): Promise<void> {
  const webUrl = process.env.LENEAR_WEB_URL ?? WEB_BASE;
  if (!webUrl) throw new Error('LENEAR_WEB_URL not set');

  // Backend not yet provisioned — stub with guidance
  const apiUrl = `${webUrl.replace(/\/$/, '')}/api/auth/cli/status`;
  try {
    const res = await fetch(apiUrl, { method: 'GET' });
    if (res.status === 404) throw new Error('not_configured');
  } catch {
    console.log('Backend not configured yet.');
    console.log(`Set DATABASE_URL and AUTH_SECRET in web/.env.local and deploy to ${webUrl}`);
    console.log('For now, run: lenear config set nvidiaApiKey <key> and lenear review will work locally.');
    console.log(`When backend is live, lenear auth login will open ${webUrl}/auth/cli`);
    return;
  }

  // Real flow (when backend live): device code
  console.log(`Opening ${webUrl}/auth/cli ...`);
  const mod = await import('node:child_process');
  try {
    const cmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    mod.exec(`${cmd} ${webUrl}/auth/cli`);
  } catch {
    console.log(`Please open: ${webUrl}/auth/cli`);
  }

  console.log('Waiting for authentication... (press Ctrl+C to cancel)');

  const maxWait = 120_000;
  const interval = 3000;
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    await new Promise((r) => setTimeout(r, interval));
    try {
      const r = await fetch(apiUrl, { headers: { Authorization: `Bearer pending` } });
      if (r.ok) {
        const data = (await r.json()) as { token?: string };
        if (data.token) {
          const hours = getExpiryHours();
          const expiresAt = new Date(Date.now() + hours * 3600 * 1000).toISOString();
          setGlobalConfig({ token: data.token, tokenExpiresAt: expiresAt });
          console.log(`Authenticated. Token expires in ${hours}h (${expiresAt})`);
          return;
        }
      }
    } catch {
      // poll continue
    }
  }
  throw new Error('Login timed out. Try again.');
}

export function logout(): void {
  clearToken();
  console.log('Logged out. Token cleared.');
}

export function whoami(): void {
  const s = getAuthStatus();
  if (!s.authenticated) {
    console.log(s.expired ? 'Token expired. Run `lenear auth login`.' : 'Not authenticated. Run `lenear auth login`.');
    return;
  }
  console.log(`Authenticated — expires at ${s.expiresAt}`);
  // When backend live, fetch user profile
}

export function checkAuthOrThrow(): void {
  const s = getAuthStatus();
  if (!s.authenticated) {
    if (s.expired) throw new Error('Token expired. Run `lenear auth login` to re-authenticate.');
    throw new Error('Not authenticated. Run `lenear auth login` first. (Required after lenear init)');
  }
}
