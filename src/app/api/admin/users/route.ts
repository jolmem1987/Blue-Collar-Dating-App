import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

// POST /api/admin/users  { userId, action, reason? }
export async function POST(req: Request) {
  let admin;
  try { admin = await requireAdmin(); } catch { return NextResponse.json({ error: "Forbidden." }, { status: 403 }); }

  const parsed = z.object({
    userId: z.string().min(1),
    action: z.enum(["BAN", "UNBAN", "VERIFY", "UNVERIFY", "REMOVE"]),
    reason: z.string().max(500).optional(),
  }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { userId, action, reason } = parsed.data;

  // Guard: never let an admin ban/remove themselves or another admin.
  if (action === "BAN" || action === "REMOVE") {
    if (userId === admin.id) {
      return NextResponse.json({ error: "You can't remove your own account here." }, { status: 400 });
    }
    const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });
    if (target.role === "ADMIN") {
      return NextResponse.json({ error: "Admins can't be banned or removed." }, { status: 400 });
    }
  }

  // REMOVE — soft delete (same semantics as self-serve /api/account DELETE):
  // scrub PII, drop matches + photos, mark DELETED — but preserve report history for the record.
  if (action === "REMOVE") {
    await prisma.$transaction([
      prisma.match.updateMany({
        where: { OR: [{ userAId: userId }, { userBId: userId }], unmatchedAt: null },
        data: { unmatchedAt: new Date() },
      }),
      prisma.photo.deleteMany({ where: { userId } }),
      prisma.user.update({
        where: { id: userId },
        data: {
          accountStatus: "DELETED",
          banReason: reason ?? "Removed by admin",
          email: `deleted+${userId}@deleted.invalid`,
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
    return NextResponse.json({ ok: true });
  }

  const data =
    action === "BAN"
      ? { accountStatus: "BANNED" as const, banReason: reason ?? "Violated guidelines" }
      : action === "UNBAN"
      ? { accountStatus: "ACTIVE" as const, banReason: null }
      : action === "VERIFY"
      ? { verificationStatus: "VERIFIED" as const }
      : { verificationStatus: "UNVERIFIED" as const };

  await prisma.user.update({ where: { id: userId }, data });
  return NextResponse.json({ ok: true });
}
