import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
  // find user id via DrizzleAdapter user lookup not directly; we rely on users table
  const db = getDb();
  // fetch user id
  const { users } = await import("@/lib/schema");
  const rows = await db.select().from(users).where(eq(users.email, session.user.email as string));
  const user = rows[0];
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });
  const ps = await db.select().from(projects).where(eq(projects.ownerId, user.id));
  return Response.json(ps);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const { users } = await import("@/lib/schema");
  const rows = await db.select().from(users).where(eq(users.email, session.user.email as string));
  const user = rows[0];
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });
  const body = (await req.json().catch(() => ({}))) as { name?: string; description?: string };
  if (!body.name || typeof body.name !== "string") return Response.json({ error: "name required" }, { status: 400 });
  const [created] = await db
    .insert(projects)
    .values({ ownerId: user.id, name: body.name, description: body.description ?? null })
    .returning();
  return Response.json(created, { status: 201 });
}
