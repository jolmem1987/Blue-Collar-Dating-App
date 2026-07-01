import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { MAX_PHOTOS } from "@/lib/constants";

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const body = z.object({ imageUrl: z.string().url() }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid image." }, { status: 400 });

  const count = await prisma.photo.count({ where: { userId: user.id } });
  if (count >= MAX_PHOTOS)
    return NextResponse.json({ error: `Max ${MAX_PHOTOS} photos.` }, { status: 400 });

  const photo = await prisma.photo.create({
    data: {
      userId: user.id,
      imageUrl: body.data.imageUrl,
      order: count,
      isPrimary: count === 0,
      moderationStatus: "PENDING",
    },
  });
  return NextResponse.json({ photo });
}

export async function DELETE(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo || photo.userId !== user.id)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.photo.delete({ where: { id } });
  // promote a new primary if needed
  if (photo.isPrimary) {
    const next = await prisma.photo.findFirst({ where: { userId: user.id }, orderBy: { order: "asc" } });
    if (next) await prisma.photo.update({ where: { id: next.id }, data: { isPrimary: true } });
  }
  return NextResponse.json({ ok: true });
}
