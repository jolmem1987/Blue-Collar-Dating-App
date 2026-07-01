import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type TradeGroup = { tradeCategory: string | null; _count: { _all: number } };
type IntentGroup = { relationshipIntent: string | null; _count: { _all: number } };
type BarRow = { label: string; count: number };
type IntentRow = { label: string; count: number };

export default async function AdminAnalyticsPage() {
  const [
    totalUsers,
    blueCollar,
    verified,
    withPhotos,
    totalLikes,
    totalMatches,
    totalMessages,
    byTrade,
    byIntent,
  ] = await Promise.all([
    prisma.user.count({ where: { accountStatus: { not: "DELETED" } } }),
    prisma.user.count({ where: { isBlueCollarWorker: true, accountStatus: { not: "DELETED" } } }),
    prisma.user.count({ where: { verificationStatus: "VERIFIED" } }),
    prisma.user.count({ where: { photos: { some: {} } } }),
    prisma.like.count(),
    prisma.match.count(),
    prisma.message.count(),
    prisma.user.groupBy({
      by: ["tradeCategory"],
      where: { tradeCategory: { not: null }, accountStatus: { not: "DELETED" } },
      _count: { _all: true },
    }) as unknown as Promise<TradeGroup[]>,
    prisma.user.groupBy({
      by: ["relationshipIntent"],
      where: { relationshipIntent: { not: null }, accountStatus: { not: "DELETED" } },
      _count: { _all: true },
    }) as unknown as Promise<IntentGroup[]>,
  ]);

  const likeToMatch = totalLikes > 0 ? Math.round((totalMatches / totalLikes) * 100) : 0;

  const trades: BarRow[] = byTrade
    .map((t: TradeGroup) => ({ label: t.tradeCategory ?? "—", count: t._count._all }))
    .sort((a: BarRow, b: BarRow) => b.count - a.count)
    .slice(0, 12);
  const maxTrade = Math.max(1, ...trades.map((t) => t.count));

  const intents: IntentRow[] = byIntent.map((i: IntentGroup) => ({
    label: (i.relationshipIntent ?? "—").replace("_", " "),
    count: i._count._all,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-stamp text-bone">Analytics</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Users" value={totalUsers} />
        <Stat label="Blue-collar" value={blueCollar} />
        <Stat label="Verified" value={verified} />
        <Stat label="Have photos" value={withPhotos} />
        <Stat label="Likes" value={totalLikes} />
        <Stat label="Matches" value={totalMatches} />
        <Stat label="Messages" value={totalMessages} />
        <Stat label="Like→match" value={`${likeToMatch}%`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-stamp text-steel-400">
            Users by trade
          </h2>
          <div className="space-y-2">
            {trades.length === 0 && <Empty />}
            {trades.map((t) => (
              <div key={t.label}>
                <div className="flex justify-between text-sm">
                  <span className="text-steel-300">{t.label}</span>
                  <span className="font-mono text-steel-500">{t.count}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-steel-800">
                  <div className="h-full bg-orange" style={{ width: `${(t.count / maxTrade) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-stamp text-steel-400">
            Relationship intent
          </h2>
          <div className="space-y-2">
            {intents.length === 0 && <Empty />}
            {intents.map((i) => (
              <div
                key={i.label}
                className="flex items-center justify-between rounded-plate border border-steel-800 bg-steel-900 p-3 text-sm"
              >
                <span className="capitalize text-steel-300">{i.label.toLowerCase()}</span>
                <span className="font-mono text-bone">{i.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-plate border border-steel-800 bg-steel-900 p-4">
      <div className="font-mono text-2xl text-bone">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-stamp text-steel-500">{label}</div>
    </div>
  );
}

function Empty() {
  return <div className="rounded-plate border border-steel-800 bg-steel-900 p-4 text-sm text-steel-500">No data yet.</div>;
}
