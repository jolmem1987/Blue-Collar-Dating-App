import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

// POST /api/account  { action: "PAUSE" | "REACTIVATE" | "DELETE" }
export async function POST(req: Request) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Not signed in." }, { status: 401 }); }

  const parsed = z.object({
    action: z.enum(["PAUSE", "REACTIVATE", "DELETE"]),
  }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { action } = parsed.data;

  if (action === "PAUSE") {
    await prisma.user.update({ where: { id: user.id }, data: { accountStatus: "PAUSED" } });
    return NextResponse.json({ ok: true, status: "PAUSED" });
  }

  if (action === "REACTIVATE") {
    await prisma.user.update({ where: { id: user.id }, data: { accountStatus: "ACTIVE" } });
    return NextResponse.json({ ok: true, status: "ACTIVE" });
  }

  // DELETE — soft delete: scrub PII, mark DELETED, drop active matches.
  // (Cascade deletes would also work; soft-delete preserves report history.)
  await prisma.$transaction([
    prisma.match.updateMany({
      where: { OR: [{ userAId: user.id }, { userBId: user.id }], unmatchedAt: null },
      data: { unmatchedAt: new Date() },
    }),
    prisma.photo.deleteMany({ where: { userId: user.id } }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        accountStatus: "DELETED",
        email: `deleted+${user.id}@deleted.invalid`,
        passwordHash: null,
        firstName: "Deleted user",
        bio: null,
        latitude: null,
        longitude: null,
        location: null,
        onboardingComplete: false,
      },
    }),
  ]);

  return NextResponse.json({ ok: true, status: "DELETED" });
}
