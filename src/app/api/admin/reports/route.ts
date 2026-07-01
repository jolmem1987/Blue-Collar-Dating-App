import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

// POST /api/admin/reports { reportId, status, banUser? }
export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Forbidden." }, { status: 403 }); }

  const parsed = z.object({
    reportId: z.string().min(1),
    status: z.enum(["OPEN", "REVIEWING", "ACTION_TAKEN", "DISMISSED"]),
    banUser: z.boolean().optional(),
  }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const report = await prisma.report.update({
    where: { id: parsed.data.reportId },
    data: { status: parsed.data.status },
  });

  if (parsed.data.banUser) {
    await prisma.user.update({
      where: { id: report.reportedUserId },
      data: { accountStatus: "BANNED", banReason: "Banned after report review" },
    });
  }

  return NextResponse.json({ ok: true });
}
