import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { recordLike } from "@/lib/matching";
import { rateLimit } from "@/lib/ratelimit";
import { RATE_LIMITS } from "@/lib/constants";

export async function POST(req: Request) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Not signed in." }, { status: 401 }); }

  if (!rateLimit(`like:${user.id}`, RATE_LIMITS.LIKES_PER_DAY, 86_400_000))
    return NextResponse.json({ error: "You've reached today's like limit." }, { status: 429 });

  const body = z.object({
    receiverId: z.string().min(1),
    type: z.enum(["LIKE", "SUPER_LIKE"]).optional(),
  }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  try {
    const result = await recordLike(user.id, body.data.receiverId, body.data.type ?? "LIKE");
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 400 });
  }
}
