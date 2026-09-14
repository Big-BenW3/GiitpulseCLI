import { getGlobalConfig, setGlobalConfig } from './storage.js';
import { checkAuthOrThrow } from './auth.js';
import { setProjectId, getConfig } from './config.js';

const WEB_BASE = process.env.LENEAR_WEB_URL ?? 'https://lenear.vercel.app';

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId?: string;
}

async function api(path: string, init?: RequestInit): Promise<unknown> {
  const base = (process.env.LENEAR_WEB_URL ?? WEB_BASE).replace(/\/$/, '');
  const cfg = getGlobalConfig();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  if (cfg.token) headers.Authorization = `Bearer ${cfg.token}`;
  const res = await fetch(`${base}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    if (res.status === 404 && text.includes('<!DOCTYPE')) {
      throw new Error('Backend not configured yet. Deploy web with DATABASE_URL first.');
    }
    throw new Error(`API ${path} failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}

export async function createProject(name: string, description?: string): Promise<Project> {
  checkAuthOrThrow();
  const data = (await api('/api/projects', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  })) as Project;
  // auto-select
  setProjectId(data.id);
  setGlobalConfig({ lastProjectId: data.id });
  console.log(`Created project "${data.name}" (${data.id}) — selected.`);
  return data;
}

export async function listProjects(): Promise<Project[]> {
  checkAuthOrThrow();
  const data = (await api('/api/projects', { method: 'GET' })) as Project[] | { projects: Project[] };
  if (Array.isArray(data)) return data;
  return (data as { projects: Project[] }).projects ?? [];
}

export async function selectProjectInteractive(): Promise<Project | null> {
  checkAuthOrThrow();
  const projects = await listProjects();
  if (projects.length === 0) {
    console.log('No projects found. Create one with `lenear project create <name>`.');
    return null;
  }

  // Try interactive prompt, fallback to list
  try {
    const { select } = await import('@clack/prompts');
    const choice = (await select({
      message: 'Select a project (use arrows, Enter to confirm)',
      options: projects.map((p) => ({ value: p.id, label: p.name, hint: p.description ?? p.id })),
    })) as unknown as string | symbol;

    if (typeof choice === 'symbol') {
      console.log('Cancelled.');
      return null;
    }
    const selected = projects.find((p) => p.id === choice);
    if (!selected) return null;
    setProjectId(selected.id);
    setGlobalConfig({ lastProjectId: selected.id });
    console.log(`Selected project "${selected.name}"`);
    return selected;
  } catch {
    console.log('Projects:');
    for (const p of projects) console.log(`- ${p.name} (${p.id})`);
    console.log('Install @clack/prompts for interactive selection, or run `lenear pull` with arrow keys when available.');
    const first = projects[0];
    setProjectId(first.id);
    setGlobalConfig({ lastProjectId: first.id });
    console.log(`Auto-selected "${first.name}" — use lenear config set projectId <id> to change.`);
    return first;
  }
}

export function currentProjectId(): string | null {
  const cfg = getConfig();
  return cfg.projectId ?? null;
}
