import { prisma } from "@/lib/prisma";
import { AdminAction } from "../AdminAction";

export const dynamic = "force-dynamic";

export default async function AdminBannedPage() {
  const banned = await prisma.user.findMany({
    where: { accountStatus: "BANNED" },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: { id: true, email: true, firstName: true, banReason: true, updatedAt: true },
  });

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-stamp text-bone">Banned users</h1>

      <div className="mt-5 overflow-x-auto rounded-plate border border-steel-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-steel-900 text-xs uppercase tracking-stamp text-steel-500">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Reason</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {banned.map((u: { id: string; email: string; firstName: string | null; banReason: string | null }) => (
              <tr key={u.id} className="border-t border-steel-800">
                <td className="p-3">
                  <div className="text-bone">{u.firstName ?? "—"}</div>
                  <div className="text-xs text-steel-500">{u.email}</div>
                </td>
                <td className="p-3 text-steel-400">{u.banReason ?? "—"}</td>
                <td className="p-3 text-right">
                  <AdminAction endpoint="/api/admin/users" payload={{ userId: u.id, action: "UNBAN" }} label="Unban" variant="steel" />
                </td>
              </tr>
            ))}
            {banned.length === 0 && (
              <tr><td colSpan={3} className="p-6 text-center text-steel-500">No banned users.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
