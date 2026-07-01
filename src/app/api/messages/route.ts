import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getMatchForUser } from "@/lib/matches";
import { rateLimit } from "@/lib/ratelimit";
import { RATE_LIMITS } from "@/lib/constants";

// GET /api/messages?matchId=...  -> conversation thread (marks incoming read)
export async function GET(req: Request) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Not signed in." }, { status: 401 }); }

  const matchId = new URL(req.url).searchParams.get("matchId");
  if (!matchId) return NextResponse.json({ error: "Missing matchId." }, { status: 400 });

  const found = await getMatchForUser(matchId, user.id);
  if (!found) return NextResponse.json({ error: "Match not found." }, { status: 404 });

  const messages = await prisma.message.findMany({
    where: { matchId, moderationStatus: { not: "REJECTED" } },
    orderBy: { createdAt: "asc" },
    take: 500,
  });

  // Mark messages from the other person as read
  await prisma.message.updateMany({
    where: { matchId, senderId: { not: user.id }, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({
    match: {
      id: found.match.id,
      other: {
        id: found.other.id,
        firstName: found.other.firstName,
        photo: found.other.photos[0]?.imageUrl ?? null,
        verified: found.other.verificationStatus === "VERIFIED",
      },
    },
    messages: messages.map((m) => ({
      id: m.id,
      body: m.body,
      fromMe: m.senderId === user.id,
      createdAt: m.createdAt,
      isRead: m.isRead,
    })),
  });
}

// POST /api/messages  { matchId, body }  -> send a message
export async function POST(req: Request) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Not signed in." }, { status: 401 }); }

  if (!rateLimit(`msg:${user.id}`, RATE_LIMITS.MESSAGES_PER_MINUTE, 60_000))
    return NextResponse.json({ error: "Slow down a moment — too many messages." }, { status: 429 });

  const parsed = z.object({
    matchId: z.string().min(1),
    body: z.string().trim().min(1).max(2000),
  }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Write a message first." }, { status: 400 });

  const found = await getMatchForUser(parsed.data.matchId, user.id);
  if (!found) return NextResponse.json({ error: "You can only message your matches." }, { status: 403 });

  // Safety guard: block if the other user is gone/banned
  if (["BANNED", "DELETED"].includes(found.other.accountStatus)) {
    return NextResponse.json({ error: "This person is no longer available." }, { status: 403 });
  }

  const msg = await prisma.message.create({
    data: {
      matchId: parsed.data.matchId,
      senderId: user.id,
      body: parsed.data.body,
    },
  });

  return NextResponse.json({
    message: { id: msg.id, body: msg.body, fromMe: true, createdAt: msg.createdAt, isRead: false },
  });
}
