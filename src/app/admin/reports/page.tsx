import { prisma } from "@/lib/prisma";
import { AdminAction } from "../AdminAction";

export const dynamic = "force-dynamic";

const REASON_LABEL: Record<string, string> = {
  FAKE_PROFILE: "Fake profile",
  HARASSMENT: "Harassment",
  INAPPROPRIATE_PHOTOS: "Inappropriate photos",
  SCAM_OR_MONEY_REQUEST: "Scam / money request",
  UNDERAGE: "Appears underage",
  OFFLINE_BEHAVIOR: "Offline behavior",
  OTHER: "Other",
};

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
    include: {
      reporter: { select: { firstName: true, email: true } },
      reported: { select: { id: true, firstName: true, email: true, accountStatus: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-stamp text-bone">Reports</h1>
      <p className="mt-1 text-sm text-steel-400">Reported users stay visible until you take action.</p>

      <div className="mt-5 space-y-3">
        {reports.length === 0 && (
          <div className="rounded-plate border border-steel-800 bg-steel-900 p-6 text-center text-steel-500">
            No reports. All clear.
          </div>
        )}
        {reports.map((r: {
          id: string;
          reason: string;
          status: string;
          createdAt: Date | string;
          reported: { firstName: string | null; email: string; accountStatus: string };
          reporter: { firstName: string | null; email: string };
          details: string | null;
        }) => (
          <div key={r.id} className="rounded-plate border border-steel-800 bg-steel-900 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-500/15 px-2 py-0.5 text-xs text-red-400">
                  {REASON_LABEL[r.reason] ?? r.reason}
                </span>
                <StatusPill status={r.status} />
              </div>
              <span className="text-xs text-steel-600">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-stamp text-steel-500">Reported</div>
                <div className="text-bone">{r.reported.firstName ?? "—"}</div>
                <div className="text-xs text-steel-500">{r.reported.email}</div>
                <div className="text-xs text-steel-500">Status: {r.reported.accountStatus}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-stamp text-steel-500">Reported by</div>
                <div className="text-bone">{r.reporter.firstName ?? "—"}</div>
                <div className="text-xs text-steel-500">{r.reporter.email}</div>
              </div>
            </div>

            {r.details && (
              <p className="mt-2 rounded border border-steel-800 bg-ink/50 p-2 text-sm text-steel-300">
                “{r.details}”
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              <AdminAction endpoint="/api/admin/reports" payload={{ reportId: r.id, status: "REVIEWING" }} label="Mark reviewing" variant="steel" />
              <AdminAction endpoint="/api/admin/reports" payload={{ reportId: r.id, status: "DISMISSED" }} label="Dismiss" variant="ghost" />
              <AdminAction
                endpoint="/api/admin/reports"
                payload={{ reportId: r.id, status: "ACTION_TAKEN", banUser: true }}
                label="Ban reported user"
                variant="danger"
                confirm="Ban the reported user and close this report?"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    OPEN: "bg-orange/15 text-orange",
    REVIEWING: "bg-amber/15 text-amber",
    ACTION_TAKEN: "bg-red-500/15 text-red-400",
    DISMISSED: "bg-steel-800 text-steel-400",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs ${map[status]}`}>{status.replace("_", " ")}</span>;
}
