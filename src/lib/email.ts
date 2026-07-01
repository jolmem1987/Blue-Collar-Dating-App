// Email delivery for verification + password reset.
// MVP: if SMTP env vars are absent, links are logged to the server console so
// you can develop without an email provider. Wire a real transport for prod.

type SendArgs = { to: string; subject: string; html: string; text: string };

export async function sendEmail({ to, subject, text }: SendArgs) {
  const host = process.env.EMAIL_SERVER_HOST;
  if (!host) {
    // Dev fallback
    console.log("\n========== [DEV EMAIL] ==========");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log(text);
    console.log("=================================\n");
    return;
  }
  // Production: integrate nodemailer or a provider SDK here.
  // Intentionally left as a single integration point.
  console.warn("SMTP configured but transport not implemented in MVP scaffold.");
}

const base = () => process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export function verificationEmail(token: string) {
  const url = `${base()}/verify-email?token=${token}`;
  return {
    subject: "Verify your BlueCollar Match email",
    text: `Welcome to BlueCollar Match.\n\nVerify your email to start matching:\n${url}\n\nThis link expires in 24 hours.`,
    html: `<p>Welcome to <b>BlueCollar Match</b>.</p><p><a href="${url}">Verify your email</a> to start matching. Link expires in 24 hours.</p>`,
    url,
  };
}

export function passwordResetEmail(token: string) {
  const url = `${base()}/reset-password?token=${token}`;
  return {
    subject: "Reset your BlueCollar Match password",
    text: `Reset your password:\n${url}\n\nThis link expires in 1 hour. If you didn't request this, ignore it.`,
    html: `<p>Reset your password: <a href="${url}">${url}</a></p><p>Link expires in 1 hour.</p>`,
    url,
  };
}
