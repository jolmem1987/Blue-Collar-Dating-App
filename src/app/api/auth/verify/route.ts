import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consumeToken } from "@/lib/tokens";

export async function POST(req: Request) {
  const { token } = await req.json().catch(() => ({}));
  if (!token) return NextResponse.json({ error: "Missing token." }, { status: 400 });

  const userId = await consumeToken(token, "EMAIL_VERIFY");
  if (!userId) return NextResponse.json({ error: "This link is invalid or expired." }, { status: 400 });

  await prisma.user.update({ where: { id: userId }, data: { emailVerified: new Date() } });
  return NextResponse.json({ ok: true });
}
