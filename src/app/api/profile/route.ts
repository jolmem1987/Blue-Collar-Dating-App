import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

const schema = z.object({
  firstName: z.string().max(40).optional(),
  gender: z.enum(["MAN", "WOMAN", "NONBINARY", "OTHER"]).optional(),
  interestedIn: z.enum(["MEN", "WOMEN", "EVERYONE"]).optional(),
  location: z.string().max(120).optional(),
  bio: z.string().max(800).optional(),
  hobbies: z.string().max(400).optional(),
  weekendLifestyle: z.string().max(400).optional(),
  lookingFor: z.string().max(400).optional(),
  relationshipIntent: z.enum(["SERIOUS", "DATING", "FRIENDSHIP_FIRST", "NOT_SURE"]).optional(),
  blueCollarPreference: z.enum(["BLUE_COLLAR_ONLY", "OPEN"]).optional(),
  isBlueCollarWorker: z.boolean().optional(),
  tradeCategory: z.string().max(60).optional().nullable(),
  jobTitle: z.string().max(80).optional(),
  yearsInTrade: z.coerce.number().int().min(0).max(80).optional(),
  unionStatus: z.enum(["UNION", "NON_UNION", "PREFER_NOT_TO_SAY"]).optional(),
  workSchedule: z.string().max(120).optional(),
  shiftType: z.enum(["DAY", "NIGHT", "SWING", "ROTATING", "ON_CALL", "VARIES"]).optional(),
  travelForWork: z.boolean().optional(),
  minAgePref: z.coerce.number().int().min(18).max(99).optional(),
  maxAgePref: z.coerce.number().int().min(18).max(99).optional(),
  maxDistanceMiles: z.coerce.number().int().min(1).max(500).optional(),
  // prompts
  promptTrade: z.string().max(300).optional(),
  promptWhyWorkHard: z.string().max(300).optional(),
  promptBestPart: z.string().max(300).optional(),
  promptHardestSchedule: z.string().max(300).optional(),
  promptIdealWeekend: z.string().max(300).optional(),
  promptProudSkill: z.string().max(300).optional(),
  promptMisunderstood: z.string().max(300).optional(),
  promptRelaxAfterWork: z.string().max(300).optional(),
});

export async function PATCH(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  await prisma.user.update({ where: { id: user.id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}
