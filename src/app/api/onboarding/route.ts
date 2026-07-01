import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const schema = z.object({
  firstName: z.string().min(1).max(40),
  gender: z.enum(["MAN", "WOMAN", "NONBINARY", "OTHER"]),
  interestedIn: z.enum(["MEN", "WOMEN", "EVERYONE"]),
  relationshipIntent: z.enum(["SERIOUS", "DATING", "FRIENDSHIP_FIRST", "NOT_SURE"]),
  blueCollarPreference: z.enum(["BLUE_COLLAR_ONLY", "OPEN"]),
  workerCategory: z.enum([
    "TRADE",
    "MANUFACTURING_MAINTENANCE",
    "TRANSPORTATION_LOGISTICS",
    "AGRICULTURE_OUTDOOR",
    "NOT_BLUE_COLLAR_INTERESTED",
    "OTHER",
  ]),
  location: z.string().min(1).max(120),
  tradeCategory: z.string().optional(),
});

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const d = parsed.data;
  const isBlueCollarWorker = d.workerCategory !== "NOT_BLUE_COLLAR_INTERESTED";

  await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName: d.firstName,
      gender: d.gender,
      interestedIn: d.interestedIn,
      relationshipIntent: d.relationshipIntent,
      blueCollarPreference: d.blueCollarPreference,
      workerCategory: d.workerCategory,
      location: d.location,
      isBlueCollarWorker,
      tradeCategory: d.tradeCategory || null,
      onboardingComplete: true,
    },
  });

  return NextResponse.json({ ok: true });
}
