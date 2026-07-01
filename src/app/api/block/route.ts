import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { orderPair } from "@/lib/utils";

export async function POST(req: Request) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Not signed in." }, { status: 401 }); }
  const body = z.object({ blockedUserId: z.string().min(1) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const blockedUserId = body.data.blockedUserId;
  if (blockedUserId === user.id) return NextResponse.json({ error: "Cannot block yourself." }, { status: 400 });

  await prisma.block.upsert({
    where: { blockerId_blockedUserId: { blockerId: user.id, blockedUserId } },
    update: {},
    create: { blockerId: user.id, blockedUserId },
  });

  // Unmatch if matched
  const [a, b] = orderPair(user.id, blockedUserId);
  await prisma.match.updateMany({
    where: { userAId: a, userBId: b, unmatchedAt: null },
    data: { unmatchedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/block  { blockedUserId }  -> unblock
export async function DELETE(req: Request) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Not signed in." }, { status: 401 }); }
  const body = z.object({ blockedUserId: z.string().min(1) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  await prisma.block.deleteMany({
    where: { blockerId: user.id, blockedUserId: body.data.blockedUserId },
  });
  return NextResponse.json({ ok: true });
}
