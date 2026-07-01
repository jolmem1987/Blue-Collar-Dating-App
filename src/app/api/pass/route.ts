import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { recordPass } from "@/lib/matching";

export async function POST(req: Request) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Not signed in." }, { status: 401 }); }
  const body = z.object({ receiverId: z.string().min(1) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  await recordPass(user.id, body.data.receiverId);
  return NextResponse.json({ ok: true });
}
