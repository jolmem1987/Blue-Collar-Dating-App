import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { getDiscoverCandidates } from "@/lib/matching";
import { ageFromBirthDate } from "@/lib/utils";

export async function GET(req: Request) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Not signed in." }, { status: 401 }); }

  const sp = new URL(req.url).searchParams;
  const num = (k: string) => (sp.get(k) ? Number(sp.get(k)) : undefined);
  const bool = (k: string) => sp.get(k) === "true";

  const results = await getDiscoverCandidates(user.id, {
    minAge: num("minAge"),
    maxAge: num("maxAge"),
    maxDistanceMiles: num("maxDistance"),
    interestedIn: (sp.get("interestedIn") as never) ?? undefined,
    relationshipIntent: sp.get("relationshipIntent") ?? undefined,
    blueCollarOnly: bool("blueCollarOnly"),
    tradeCategory: sp.get("tradeCategory") ?? undefined,
    hasPhotosOnly: bool("hasPhotosOnly"),
    verifiedOnly: bool("verifiedOnly"),
  });

  const cards = results.slice(0, 30).map((r) => ({
    id: r.user.id,
    firstName: r.user.firstName,
    age: r.age,
    jobTitle: r.user.jobTitle,
    tradeCategory: r.user.tradeCategory,
    isBlueCollarWorker: r.user.isBlueCollarWorker,
    location: r.user.location,
    distance: r.dist,
    relationshipIntent: r.user.relationshipIntent,
    bio: r.user.bio,
    yearsInTrade: r.user.yearsInTrade,
    shiftType: r.user.shiftType,
    unionStatus: r.user.unionStatus,
    verified: r.user.verificationStatus === "VERIFIED",
    photos: r.user.photos.filter((p) => p.moderationStatus !== "REJECTED").map((p) => p.imageUrl),
  }));

  return NextResponse.json({ cards });
}
