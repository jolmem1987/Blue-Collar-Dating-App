import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { rateLimit } from "@/lib/ratelimit";
import { RATE_LIMITS } from "@/lib/constants";

export async function POST(req: Request) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Not signed in." }, { status: 401 }); }

  if (!rateLimit(`report:${user.id}`, RATE_LIMITS.REPORTS_PER_DAY, 86_400_000))
    return NextResponse.json({ error: "Too many reports. Try again later." }, { status: 429 });

  const body = z.object({
    reportedUserId: z.string().min(1),
    reason: z.enum(["FAKE_PROFILE","HARASSMENT","INAPPROPRIATE_PHOTOS","SCAM_OR_MONEY_REQUEST","UNDERAGE","OFFLINE_BEHAVIOR","OTHER"]),
    details: z.string().max(1000).optional(),
  }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  await prisma.report.create({
    data: {
      reporterId: user.id,
      reportedUserId: body.data.reportedUserId,
      reason: body.data.reason,
      details: body.data.details,
    },
  });
  return NextResponse.json({ ok: true });
}
