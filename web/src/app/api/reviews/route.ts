import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { projects, reviews } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  const db = getDb();
  const { users } = await import("@/lib/schema");
  const rows = await db.select().from(users).where(eq(users.email, session.user.email as string));
  const user = rows[0];
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  if (projectId) {
    // verify ownership
    const ps = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.ownerId, user.id)));
    if (ps.length === 0) return Response.json({ error: "Project not found" }, { status: 404 });
    const rs = await db.select().from(reviews).where(eq(reviews.projectId, projectId)).orderBy(desc(reviews.createdAt));
    return Response.json(rs);
  }
  const rs = await db.select().from(reviews).where(eq(reviews.ownerId, user.id)).orderBy(desc(reviews.createdAt));
  return Response.json(rs);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const { users } = await import("@/lib/schema");
  const rows = await db.select().from(users).where(eq(users.email, session.user.email as string));
  const user = rows[0];
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as {
    projectId?: string;
    score?: number;
    summary?: string;
    payload?: unknown;
  };
  if (!body.projectId || typeof body.score !== "number" || !body.summary) {
    return Response.json({ error: "projectId, score, summary required" }, { status: 400 });
  }
  const ps = await db.select().from(projects).where(and(eq(projects.id, body.projectId), eq(projects.ownerId, user.id)));
  if (ps.length === 0) return Response.json({ error: "Project not found" }, { status: 404 });

  const [created] = await db
    .insert(reviews)
    .values({
      projectId: body.projectId,
      ownerId: user.id,
      score: body.score,
      summary: body.summary,
      payload: body.payload ?? {},
    })
    .returning();
  return Response.json(created, { status: 201 });
}
