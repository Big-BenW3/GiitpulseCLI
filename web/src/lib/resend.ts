// Placeholder for Resend integration — not wired until you decide use-case.
// Use cases to choose from:
// - Auth emails (magic link, verification)
// - Critical review alerts (HIGH findings → email owner)
// - Weekly digest
// Env: RESEND_API_KEY, RESEND_FROM
export async function sendEmail(_to: string, _subject: string, _html: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[resend] RESEND_API_KEY not set — skipping send");
    return;
  }
  // const { Resend } = await import("resend");
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: process.env.RESEND_FROM!, to: _to, subject: _subject, html: _html });
}
