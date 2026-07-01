import { prisma } from "@/lib/prisma";
import { AdminAction } from "../AdminAction";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim();
  const users = await prisma.user.findMany({
    where: {
      accountStatus: { not: "DELETED" },
      ...(q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { firstName: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      email: true,
      firstName: true,
      role: true,
      accountStatus: true,
      verificationStatus: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-stamp text-bone">Users</h1>

      <form className="mt-4 flex gap-2" action="/admin/users" method="get">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name or email…"
          className="w-full max-w-sm rounded-plate border border-steel-700 bg-steel-900 px-3 py-2 text-bone placeholder:text-steel-500 focus:border-orange focus:outline-none"
        />
        <button className="rounded-plate bg-steel-800 px-4 text-bone hover:bg-steel-700">Search</button>
      </form>

      <div className="mt-5 overflow-x-auto rounded-plate border border-steel-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-xs uppercase tracking-stamp text-steel-500">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Status</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Joined</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-steel-800">
                <td className="p-3">
                  <div className="text-bone">
                    {u.firstName ?? "—"}{" "}
                    {u.role === "ADMIN" && (
                      <span className="ml-1 rounded bg-orange/20 px-1 text-[10px] font-bold text-orange">ADMIN</span>
                    )}
                  </div>
                  <div className="text-xs text-steel-500">{u.email}</div>
                </td>
                <td className="p-3">
                  <StatusPill status={u.accountStatus} />
                </td>
                <td className="p-3 text-steel-400">
                  {u.verificationStatus === "VERIFIED" ? "Yes" : "No"}
                </td>
                <td className="p-3 text-steel-400">
                  {u.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    {u.verificationStatus === "VERIFIED" ? (
                      <AdminAction endpoint="/api/admin/users" payload={{ userId: u.id, action: "UNVERIFY" }} label="Unverify" variant="ghost" />
                    ) : (
                      <AdminAction endpoint="/api/admin/users" payload={{ userId: u.id, action: "VERIFY" }} label="Verify" variant="steel" />
                    )}
                    {u.accountStatus === "BANNED" ? (
                      <AdminAction endpoint="/api/admin/users" payload={{ userId: u.id, action: "UNBAN" }} label="Unban" variant="steel" />
                    ) : (
                      u.role !== "ADMIN" && (
                        <AdminAction
                          endpoint="/api/admin/users"
                          payload={{ userId: u.id, action: "BAN" }}
                          label="Ban"
                          variant="danger"
                          confirm="Ban this user? They'll be locked out immediately."
                        />
                      )
                    )}
                    {u.role !== "ADMIN" && (
                      <AdminAction
                        endpoint="/api/admin/users"
                        payload={{ userId: u.id, action: "REMOVE" }}
                        label="Remove"
                        variant="danger"
                        confirm="Permanently remove this user? Their profile and photos are scrubbed and they're locked out. This can't be undone."
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-steel-500">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-green-500/15 text-green-400",
    PAUSED: "bg-amber/15 text-amber",
    BANNED: "bg-red-500/15 text-red-400",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${map[status] ?? "bg-steel-800 text-steel-400"}`}>
      {status}
    </span>
  );
}
