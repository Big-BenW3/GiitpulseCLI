import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { reviews, projects } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const isAuthed = !!session?.user?.email;
  let recent: Array<{
    id: string;
    score: number;
    summary: string;
    projectId: string;
    createdAt: Date;
    payload: unknown;
  }> = [];
  const projMap = new Map<string, string>();
  let stats = { repos: 0, total: 0, open: 0, critical: 0 };

  if (isAuthed) {
    try {
      const db = getDb();
      const { users } = await import("@/lib/schema");
      const rows = await db.select().from(users).where(eq(users.email, session!.user!.email as string));
      const user = rows[0];
      if (user) {
        const ps = await db.select().from(projects).where(eq(projects.ownerId, user.id));
        stats.repos = ps.length;
        for (const p of ps) projMap.set(p.id, p.name);
        const rs = await db.select().from(reviews).where(eq(reviews.ownerId, user.id)).orderBy(desc(reviews.createdAt)).limit(20);
        stats.total = rs.length;
        stats.open = rs.filter((r) => r.score < 80).length;
        // critical count from payload security
        stats.critical = rs.filter((r) => {
          const pl = r.payload as { security?: unknown[] };
          return pl?.security && Array.isArray(pl.security) && pl.security.length > 0;
        }).length;
        recent = rs.map((r) => ({
          id: r.id,
          score: r.score,
          summary: r.summary,
          projectId: r.projectId,
          createdAt: r.createdAt,
          payload: r.payload,
        }));
      }
    } catch {
      // db not migrated yet — show empty
    }
  }

  return (
    <div className="min-h-screen flex bg-black text-white">
      <aside className="w-[260px] border-r border-white/10 hidden md:flex flex-col bg-black">
        <div className="px-5 py-4 border-b border-white/10 font-semibold tracking-tight">lenear</div>
        <nav className="p-3 space-y-1 text-[13px]">
          <div className="bg-[#DFF57A] text-black px-3 py-2 font-medium">Reviews</div>
          <Link href="/cli" className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/[0.06]">
            CLI
          </Link>
          <Link href="/docs" className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/[0.06]">
            Docs
          </Link>
          <Link href="/auth" className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/[0.06]">
            Auth
          </Link>
        </nav>
        <div className="mt-auto p-4 border-t border-white/10 text-[12px] text-white/50">
          {isAuthed ? `Signed in as ${session?.user?.email}` : "Not signed in — Email link via Resend"}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[56px] border-b border-white/10 bg-black flex items-center justify-between px-4 md:px-6">
          <span className="text-[13px] text-white/70">Dashboard — Beta history</span>
          <Link href="/cli" className="bg-[#DFF57A] text-black px-4 py-2 text-[13px] font-medium hover:bg-[#E8FF9A]">
            Open CLI docs
          </Link>
        </header>

        {/* Stats row like PNG */}
        {isAuthed && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 md:p-6 border-b border-white/10">
            <div className="bg-white/[0.04] border border-white/10 p-4">
              <div className="text-[11px] tracking-wide text-white/50 uppercase">Repositories</div>
              <div className="text-[22px] font-semibold mt-1">{stats.repos}</div>
            </div>
            <div className="bg-white/[0.04] border border-white/10 p-4">
              <div className="text-[11px] tracking-wide text-white/50 uppercase">Total reviews</div>
              <div className="text-[22px] font-semibold mt-1">{stats.total}</div>
            </div>
            <div className="bg-white/[0.04] border border-white/10 p-4">
              <div className="text-[11px] tracking-wide text-white/50 uppercase">Open findings</div>
              <div className="text-[22px] font-semibold mt-1">{stats.open}</div>
            </div>
            <div className="bg-[#DFF57A] text-black p-4">
              <div className="text-[11px] tracking-wide uppercase opacity-60">Critical</div>
              <div className="text-[22px] font-semibold mt-1">{stats.critical}</div>
            </div>
          </div>
        )}

        <div className="flex-1 grid md:grid-cols-[1fr_340px] min-h-0">
          <div className="p-4 md:p-8 overflow-auto">
            <div className="max-w-[760px] mx-auto space-y-4">
              {!isAuthed && (
                <div className="bg-white/[0.04] border border-white/10 p-4 text-[13px] text-white/60">
                  Sign in to see project history. CLI will store reviews with clear details once authenticated.
                </div>
              )}
              {isAuthed && recent.length === 0 && (
                <div className="bg-white/[0.04] border border-white/10 p-4 text-[13px] text-white/60">
                  No reviews yet. Run <span className="font-mono text-[#DFF57A]">lenear review .</span> with a project
                  selected via <span className="font-mono text-[#DFF57A]">lenear pull</span>.
                </div>
              )}
              {recent.map((r) => {
                const payload = r.payload as
                  | { bugs?: unknown[]; security?: unknown[]; style?: unknown[]; suggestions?: unknown[] }
                  | null;
                const counts = payload
                  ? `bugs:${(payload.bugs as unknown[])?.length ?? 0} sec:${(payload.security as unknown[])?.length ?? 0} style:${(payload.style as unknown[])?.length ?? 0}`
                  : "";
                const scoreColor = r.score >= 80 ? "bg-[#DFF57A] text-black" : r.score >= 60 ? "bg-white text-black" : "bg-white/10 text-white border border-white/10";
                return (
                  <div key={r.id} className="bg-white/[0.04] border border-white/10 p-4 hover:border-[#DFF57A]/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] tracking-wide text-white/50">
                        {projMap.get(r.projectId) ?? r.projectId} — {r.createdAt.toLocaleString()}
                      </span>
                      <span className={`text-[11px] px-2 py-1 font-medium ${scoreColor}`}>{r.score}/100</span>
                    </div>
                    <div className="text-[14px] mt-2 text-white">{r.summary}</div>
                    <div className="text-[12px] text-white/50 mt-1">{counts}</div>
                    {payload && (
                      <details className="mt-3">
                        <summary className="text-[12px] text-[#DFF57A] cursor-pointer">Details</summary>
                        <pre className="mt-2 bg-black border border-white/10 p-3 text-[12px] overflow-auto text-white/80">
                          {JSON.stringify(payload, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                );
              })}

              <div className="bg-white/[0.04] border border-white/10 p-4">
                <div className="text-[13px] text-white">Conversation — ask Lenear about this diff (T-REX in v2)</div>
                <div className="mt-3 flex gap-2">
                  <input
                    placeholder="Ask about this review... (sandbox logs/videos in v2)"
                    className="flex-1 bg-black border border-white/10 px-3 py-2 text-[13px] placeholder:text-white/40 text-white"
                  />
                  <button className="bg-[#DFF57A] text-black px-4 py-2 text-[13px] font-medium">Send</button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-l border-white/10 bg-white/[0.03] p-5 hidden md:block">
            <div className="text-[11px] tracking-wide text-white/50 uppercase">History (last 20)</div>
            <div className="mt-3 space-y-2 text-[13px]">
              {recent.length === 0 ? (
                <div className="text-white/40 text-[12px]">No history yet.</div>
              ) : (
                recent.slice(0, 8).map((r) => (
                  <div key={r.id} className="border border-white/10 bg-white/[0.04] p-3">
                    <div className="font-medium text-white">{projMap.get(r.projectId) ?? "Project"} — {r.score}/100</div>
                    <div className="text-[12px] text-white/50 truncate">{r.summary}</div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 text-[12px] text-white/40">Resend: critical findings email via Vercel env (RESEND_API_KEY).</div>
          </div>
        </div>
      </div>
    </div>
  );
}
