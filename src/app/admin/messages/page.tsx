import { prisma } from "@/lib/prisma";
import { AdminAction } from "../AdminAction";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  // Surface flagged messages first, then most recent, for spot-checking.
  const flagged = await prisma.message.findMany({
    where: { moderationStatus: "FLAGGED" },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { sender: { select: { firstName: true, email: true } } },
  });
  const recent = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
    include: { sender: { select: { firstName: true, email: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-stamp text-bone">Message moderation</h1>
      <p className="mt-1 text-sm text-steel-400">
        Rejected messages are hidden from both people in the conversation.
      </p>

      <Section title={`Flagged (${flagged.length})`} rows={flagged} empty="No flagged messages." />
      <Section title="Recent messages" rows={recent} empty="No messages yet." />
    </div>
  );
}

function Section({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: {
    id: string;
    body: string;
    createdAt: Date;
    moderationStatus: string;
    sender: { firstName: string | null; email: string };
  }[];
  empty: string;
}) {
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-stamp text-steel-400">{title}</h2>
      {rows.length === 0 ? (
        <div className="rounded-plate border border-steel-800 bg-steel-900 p-4 text-sm text-steel-500">{empty}</div>
      ) : (
        <ul className="space-y-2">
          {rows.map((m) => (
            <li key={m.id} className="rounded-plate border border-steel-800 bg-steel-900 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-steel-500">
                  {m.sender.firstName ?? m.sender.email} · {new Date(m.createdAt).toLocaleString()}
                </span>
                <span className="rounded bg-steel-800 px-2 py-0.5 text-[10px] text-steel-400">
                  {m.moderationStatus}
                </span>
              </div>
              <p className="mt-1 text-sm text-bone">{m.body}</p>
              <div className="mt-2 flex gap-2">
                <AdminAction endpoint="/api/admin/messages" payload={{ messageId: m.id, status: "APPROVED" }} label="Approve" variant="ghost" />
                <AdminAction endpoint="/api/admin/messages" payload={{ messageId: m.id, status: "REJECTED" }} label="Reject" variant="danger" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
