import { prisma } from "./prisma";
import { ageFromBirthDate, distanceMiles, orderPair } from "./utils";

/**
 * Discover candidate selection + ranking.
 *
 * Hard exclusions (never shown):
 *  - self
 *  - users either side has blocked
 *  - users you already liked or passed
 *  - banned / deleted / paused accounts
 *  - profiles without a primary photo when "has photos only" is requested
 *
 * Ranking priority (per spec):
 *  1. Dating preference compatibility (mutual interestedIn / gender)
 *  2. Age range compatibility
 *  3. Distance
 *  4. Relationship intent
 *  5. Blue-collar preference
 *  6. Trade / lifestyle compatibility
 *  7. Active users
 *  8. Verified users
 *  9. Completed profiles
 */

export type DiscoverFilters = {
  minAge?: number;
  maxAge?: number;
  maxDistanceMiles?: number;
  interestedIn?: "MEN" | "WOMEN" | "EVERYONE";
  relationshipIntent?: string;
  blueCollarOnly?: boolean;
  tradeCategory?: string;
  hasPhotosOnly?: boolean;
  verifiedOnly?: boolean;
};

function genderMatchesPreference(
  pref: string | null | undefined,
  gender: string | null | undefined
): boolean {
  if (!pref || pref === "EVERYONE") return true;
  if (pref === "MEN") return gender === "MAN";
  if (pref === "WOMEN") return gender === "WOMAN";
  return true;
}

export async function getDiscoverCandidates(userId: string, filters: DiscoverFilters = {}) {
  const me = await prisma.user.findUnique({
    where: { id: userId },
    include: { photos: true },
  });
  if (!me) return [];

  // IDs to exclude: blocks (either direction), prior likes, prior passes
  const [blocksMade, blocksGot, likesMade, passesMade] = await Promise.all([
    prisma.block.findMany({ where: { blockerId: userId }, select: { blockedUserId: true } }),
    prisma.block.findMany({ where: { blockedUserId: userId }, select: { blockerId: true } }),
    prisma.like.findMany({ where: { senderId: userId }, select: { receiverId: true } }),
    prisma.pass.findMany({ where: { senderId: userId }, select: { receiverId: true } }),
  ]);

  const excludeIds = new Set<string>([userId]);
  blocksMade.forEach((b) => excludeIds.add(b.blockedUserId));
  blocksGot.forEach((b) => excludeIds.add(b.blockerId));
  likesMade.forEach((l) => excludeIds.add(l.receiverId));
  passesMade.forEach((p) => excludeIds.add(p.receiverId));

  const minAge = filters.minAge ?? me.minAgePref ?? 18;
  const maxAge = filters.maxAge ?? me.maxAgePref ?? 99;
  const interestedIn = filters.interestedIn ?? me.interestedIn ?? "EVERYONE";
  const blueCollarOnly =
    filters.blueCollarOnly ?? me.blueCollarPreference === "BLUE_COLLAR_ONLY";

  const candidates = await prisma.user.findMany({
    where: {
      id: { notIn: Array.from(excludeIds) },
      accountStatus: "ACTIVE",
      onboardingComplete: true,
      ...(blueCollarOnly ? { isBlueCollarWorker: true } : {}),
      ...(filters.tradeCategory ? { tradeCategory: filters.tradeCategory } : {}),
      ...(filters.relationshipIntent
        ? { relationshipIntent: filters.relationshipIntent as never }
        : {}),
      ...(filters.verifiedOnly ? { verificationStatus: "VERIFIED" } : {}),
    },
    include: { photos: { orderBy: { order: "asc" } } },
    take: 200,
  });

  const scored = candidates
    .map((c) => {
      const age = ageFromBirthDate(c.birthDate);
      const hasPhoto = c.photos.some((p) => p.moderationStatus !== "REJECTED");

      // Hard filters
      if (filters.hasPhotosOnly && !hasPhoto) return null;
      if (age === null || age < minAge || age > maxAge) return null;
      // Mutual gender-preference compatibility
      if (!genderMatchesPreference(interestedIn, c.gender)) return null;
      if (!genderMatchesPreference(c.interestedIn, me.gender)) return null;

      let dist: number | null = null;
      if (me.latitude && me.longitude && c.latitude && c.longitude) {
        dist = distanceMiles(me.latitude, me.longitude, c.latitude, c.longitude);
        const maxDist = filters.maxDistanceMiles ?? me.maxDistanceMiles ?? 50;
        if (dist > maxDist) return null;
      }

      // Scoring (higher = better)
      let score = 0;
      // 1. dating preference already satisfied (gate) -> base
      score += 1000;
      // 2. age proximity to midpoint of preferred range
      const mid = (minAge + maxAge) / 2;
      score += Math.max(0, 200 - Math.abs(age - mid) * 8);
      // 3. distance (closer better)
      if (dist !== null) score += Math.max(0, 150 - dist);
      // 4. relationship intent alignment
      if (me.relationshipIntent && c.relationshipIntent === me.relationshipIntent) score += 120;
      // 5. blue-collar preference alignment
      if (me.blueCollarPreference === "BLUE_COLLAR_ONLY" && c.isBlueCollarWorker) score += 100;
      if (me.blueCollarPreference === "OPEN") score += 40;
      // 6. trade / lifestyle compatibility
      if (me.tradeCategory && c.tradeCategory === me.tradeCategory) score += 60;
      if (c.isBlueCollarWorker) score += 30;
      // 7. recently active
      const daysIdle = (Date.now() - new Date(c.lastActiveAt).getTime()) / 86_400_000;
      score += Math.max(0, 80 - daysIdle * 4);
      // 8. verified
      if (c.verificationStatus === "VERIFIED") score += 70;
      // 9. profile completeness
      const completeness = profileCompleteness(c);
      score += completeness * 60;

      return { user: c, score, age, dist, hasPhoto };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.score - a.score);

  return scored;
}

export function profileCompleteness(u: {
  bio: string | null;
  jobTitle: string | null;
  tradeCategory: string | null;
  hobbies: string | null;
  lookingFor: string | null;
  promptTrade: string | null;
}): number {
  const fields = [u.bio, u.jobTitle, u.tradeCategory, u.hobbies, u.lookingFor, u.promptTrade];
  const filled = fields.filter((f) => f && f.trim().length > 0).length;
  return filled / fields.length; // 0..1
}

/**
 * Record a like. If the receiver already liked the sender, create a Match.
 * Returns { matched: boolean, matchId?: string }.
 */
export async function recordLike(
  senderId: string,
  receiverId: string,
  type: "LIKE" | "SUPER_LIKE" = "LIKE"
): Promise<{ matched: boolean; matchId?: string }> {
  if (senderId === receiverId) throw new Error("Cannot like yourself.");

  // Block guard (either direction)
  const blocked = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: senderId, blockedUserId: receiverId },
        { blockerId: receiverId, blockedUserId: senderId },
      ],
    },
  });
  if (blocked) throw new Error("Action not allowed.");

  // Upsert the like (idempotent)
  await prisma.like.upsert({
    where: { senderId_receiverId: { senderId, receiverId } },
    update: { type },
    create: { senderId, receiverId, type },
  });

  // Did the receiver already like me back?
  const reciprocal = await prisma.like.findUnique({
    where: { senderId_receiverId: { senderId: receiverId, receiverId: senderId } },
  });

  if (!reciprocal) return { matched: false };

  const [userAId, userBId] = orderPair(senderId, receiverId);
  const match = await prisma.match.upsert({
    where: { userAId_userBId: { userAId, userBId } },
    update: { unmatchedAt: null },
    create: { userAId, userBId },
  });

  return { matched: true, matchId: match.id };
}

export async function recordPass(senderId: string, receiverId: string) {
  if (senderId === receiverId) return;
  await prisma.pass.upsert({
    where: { senderId_receiverId: { senderId, receiverId } },
    update: {},
    create: { senderId, receiverId },
  });
}
