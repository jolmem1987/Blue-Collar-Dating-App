import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/tokens";
import { sendEmail, passwordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (!email) return NextResponse.json({ error: "Enter your email." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  // Always return ok to avoid leaking which emails exist
  if (user && user.passwordHash) {
    const token = await createToken(user.id, "PASSWORD_RESET");
    const mail = passwordResetEmail(token);
    await sendEmail({ to: user.email, subject: mail.subject, html: mail.html, text: mail.text });
  }
  return NextResponse.json({ ok: true });
}
