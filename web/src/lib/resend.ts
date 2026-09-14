import { Resend } from "resend";

export async function sendVerificationRequest(params: { identifier: string; url: string; provider: { from?: string } }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? params.provider.from ?? "Lenear <onboarding@resend.dev>";
  if (!key) {
    console.log(`[resend] RESEND_API_KEY not set — magic link for ${params.identifier}: ${params.url}`);
    return;
  }
  const resend = new Resend(key);
  await resend.emails.send({
    from,
    to: params.identifier,
    subject: "Sign in to Lenear",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #172A42;">
        <h2 style="color:#0B1F3A; margin:0 0 12px;">Sign in to Lenear</h2>
        <p style="color:#8B9AB0;">Click the button below to sign in. This link expires in 24 hours.</p>
        <a href="${params.url}" style="display:inline-block; margin-top:16px; background:#0B1F3A; color:white; padding:12px 20px; text-decoration:none;">Sign in</a>
        <p style="margin-top:16px; color:#8B9AB0; font-size:12px;">If you did not request this email, you can ignore it.</p>
      </div>
    `,
  });
}
