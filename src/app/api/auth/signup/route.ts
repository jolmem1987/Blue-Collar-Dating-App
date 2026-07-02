import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/tokens";
import { sendEmail, verificationEmail } from "@/lib/email";
import { isAdult } from "@/lib/utils";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Use at least 8 characters."),
  birthDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Enter a valid date."),
  agreedToTerms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms." }) }),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }
  const { email, password, birthDate, agreedToTerms } = parsed.data;
  const requireEmailVerification = process.env.REQUIRE_EMAIL_VERIFICATION === "true";

  // 18+ requirement
  if (!isAdult(birthDate)) {
    return NextResponse.json({ error: "You must be 18 or older to join." }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email: normalized,
      passwordHash,
      birthDate: new Date(birthDate),
      agreedToTerms,
      emailVerified: requireEmailVerification ? null : new Date(),
      subscription: { create: { plan: "FREE", status: "NONE" } },
    },
  });

  if (requireEmailVerification) {
    const token = await createToken(user.id, "EMAIL_VERIFY");
    const mail = verificationEmail(token);
    await sendEmail({ to: normalized, subject: mail.subject, html: mail.html, text: mail.text });
  }

  return NextResponse.json({ ok: true });
}
