import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "./lib/db";
import { sendVerificationRequest } from "./lib/resend";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(getDb()),
  providers: [
    Email({
      sendVerificationRequest,
      from: process.env.RESEND_FROM ?? "Lenear <onboarding@resend.dev>",
      // dummy server to satisfy build when using Resend custom transport
      server: process.env.EMAIL_SERVER ?? { host: "localhost", port: 587, auth: { user: "user", pass: "pass" } },
    } as Parameters<typeof Email>[0]),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
