import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const dayAgo = new Date(Date.now() - 864e5);
  const [
    users,
    activeUsers,
    newUsers,
    matches,
    messages,
    openReports,
    pendingPhotos,
    bannedUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { accountStatus: { not: "DELETED" } } }),
    prisma.user.count({ where: { accountStatus: "ACTIVE", lastActiveAt: { gte: dayAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: dayAgo } } }),
    prisma.match.count({ where: { unmatchedAt: null } }),
    prisma.message.count(),
    prisma.report.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } }),
    prisma.photo.count({ where: { moderationStatus: "PENDING" } }),
    prisma.user.count({ where: { accountStatus: "BANNED" } }),
  ]);

  const stats = [
    { label: "Total users", value: users },
    { label: "Active (24h)", value: activeUsers },
    { label: "New (24h)", value: newUsers },
    { label: "Active matches", value: matches },
    { label: "Messages sent", value: messages },
    { label: "Banned users", value: bannedUsers },
  ];

  const queues = [
    { label: "Open reports", value: openReports, href: "/admin/reports", urgent: openReports > 0 },
    { label: "Photos pending review", value: pendingPhotos, href: "/admin/photos", urgent: pendingPhotos > 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-stamp text-bone">Dashboard</h1>
      <p className="mt-1 text-sm text-steel-400">Overview of BlueCollar Match.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-plate border border-steel-800 bg-steel-900 p-4">
            <div className="font-mono text-3xl text-bone">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-stamp text-steel-500">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-xs font-semibold uppercase tracking-stamp text-steel-400">
        Moderation queues
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {queues.map((q) => (
          <Link
            key={q.label}
            href={q.href}
            className={`flex items-center justify-between rounded-plate border p-4 ${
              q.urgent ? "border-orange/40 bg-orange/5" : "border-steel-800 bg-steel-900"
            }`}
          >
            <div>
              <div className="text-bone">{q.label}</div>
              <div className="text-xs text-steel-500">Tap to review</div>
            </div>
            <div className={`font-mono text-2xl ${q.urgent ? "text-orange" : "text-steel-400"}`}>
              {q.value}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
