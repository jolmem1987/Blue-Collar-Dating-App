import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

// POST /api/admin/photos { photoId, status }
export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Forbidden." }, { status: 403 }); }

  const parsed = z.object({
    photoId: z.string().min(1),
    status: z.enum(["APPROVED", "REJECTED", "FLAGGED", "PENDING"]),
  }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  await prisma.photo.update({
    where: { id: parsed.data.photoId },
    data: { moderationStatus: parsed.data.status },
  });
  return NextResponse.json({ ok: true });
}
