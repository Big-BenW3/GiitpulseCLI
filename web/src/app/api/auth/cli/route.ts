import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ authenticated: false }, { status: 401 });
  // For lenear CLI: return token stub (jwt session). CLI will store it as token.
  // In beta, we return session existence; real device-code flow would issue a CLI-specific token.
  return Response.json({ authenticated: true, user: session.user, expires: session.expires });
}
