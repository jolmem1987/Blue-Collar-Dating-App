import { prisma } from "@/lib/prisma";
import { AdminAction } from "../AdminAction";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage() {
  const photos = await prisma.photo.findMany({
    where: { moderationStatus: { in: ["PENDING", "FLAGGED"] } },
    orderBy: { createdAt: "asc" },
    take: 60,
    include: { user: { select: { firstName: true, email: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-stamp text-bone">Photo moderation</h1>
      <p className="mt-1 text-sm text-steel-400">
        Pending and flagged photos. Rejected photos are hidden from Discover.
      </p>

      {photos.length === 0 ? (
        <div className="mt-6 rounded-plate border border-steel-800 bg-steel-900 p-6 text-center text-steel-500">
          Nothing in the queue.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p: { id: string; imageUrl: string; user: { firstName: string | null; email: string } }) => (
            <div key={p.id} className="overflow-hidden rounded-plate border border-steel-800 bg-steel-900">
              <div className="aspect-square bg-steel-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-2">
                <div className="truncate text-xs text-steel-400">{p.user.firstName ?? p.user.email}</div>
                <div className="mt-2 flex gap-2">
                  <AdminAction endpoint="/api/admin/photos" payload={{ photoId: p.id, status: "APPROVED" }} label="Approve" variant="steel" />
                  <AdminAction endpoint="/api/admin/photos" payload={{ photoId: p.id, status: "REJECTED" }} label="Reject" variant="danger" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
