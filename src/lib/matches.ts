import { prisma } from "./prisma";
import { orderPair } from "./utils";

/** The "other" user in a match relative to me. */
export function otherUserId(match: { userAId: string; userBId: string }, me: string) {
  return match.userAId === me ? match.userBId : match.userAId;
}

/**
 * All active (not unmatched) matches for a user, newest first, with the other
 * user's basic card data and the last message for preview.
 */
export async function getMatchesForUser(userId: string) {
  const matches = await prisma.match.findMany({
    where: {
      unmatchedAt: null,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      userA: { include: { photos: { orderBy: { order: "asc" }, take: 1 } } },
      userB: { include: { photos: { orderBy: { order: "asc" }, take: 1 } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return matches.map((m) => {
    const other = m.userAId === userId ? m.userB : m.userA;
    const last = m.messages[0] ?? null;
    return {
      matchId: m.id,
      createdAt: m.createdAt,
      other: {
        id: other.id,
        firstName: other.firstName,
        photo: other.photos[0]?.imageUrl ?? null,
        verified: other.verificationStatus === "VERIFIED",
        accountStatus: other.accountStatus,
      },
      lastMessage: last
        ? {
            body: last.body,
            createdAt: last.createdAt,
            fromMe: last.senderId === userId,
            isRead: last.isRead,
          }
        : null,
    };
  });
}

/** Fetch a match the user is a member of, or null. */
export async function getMatchForUser(matchId: string, userId: string) {
  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      unmatchedAt: null,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: { include: { photos: { orderBy: { order: "asc" }, take: 1 } } },
      userB: { include: { photos: { orderBy: { order: "asc" }, take: 1 } } },
    },
  });
  if (!match) return null;
  const other = match.userAId === userId ? match.userB : match.userA;
  return { match, other };
}

/** True if these two users have an active match. */
export async function areMatched(a: string, b: string): Promise<boolean> {
  const [userAId, userBId] = orderPair(a, b);
  const m = await prisma.match.findUnique({
    where: { userAId_userBId: { userAId, userBId } },
  });
  return !!m && !m.unmatchedAt;
}
