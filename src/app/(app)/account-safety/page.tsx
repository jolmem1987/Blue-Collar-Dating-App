import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Stamp } from "@/components/ui";
import { BlockedList } from "./BlockedList";

export const dynamic = "force-dynamic";

export default async function AccountSafetyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const blocks = await prisma.block.findMany({
    where: { blockerId: user.id },
    include: { blocked: { select: { id: true, firstName: true } } },
    orderBy: { createdAt: "desc" },
  });

  const reports = await prisma.report.count({ where: { reporterId: user.id } });

  return (
    <div className="px-4 pt-8">
      <Stamp className="text-sm text-orange">Account &amp; safety</Stamp>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-stamp text-bone">
        Your safety controls
      </h1>

      <div className="mt-4 rounded-plate border border-amber/30 bg-amber/5 p-4 text-sm text-amber">
        BlueCollar Match will never ask for your password or payment info in chat. Never send money,
        gift cards, or banking details to anyone — report anyone who asks.
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link href="/safety" className="rounded-plate border border-steel-800 bg-steel-900 p-4 hover:border-steel-700">
          <div className="text-bone">Safety tips</div>
          <div className="text-xs text-steel-500">Meeting safely, red flags</div>
        </Link>
        <Link href="/community-guidelines" className="rounded-plate border border-steel-800 bg-steel-900 p-4 hover:border-steel-700">
          <div className="text-bone">Community guidelines</div>
          <div className="text-xs text-steel-500">What&apos;s allowed here</div>
        </Link>
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-stamp text-steel-400">
          Blocked users ({blocks.length})
        </h2>
        <BlockedList
          initial={blocks.map((b: { blocked: { id: string; firstName: string } }) => ({ id: b.blocked.id, firstName: b.blocked.firstName }))}
        />
      </div>

      <p className="mt-6 pb-4 text-xs text-steel-600">
        You&apos;ve filed {reports} report{reports === 1 ? "" : "s"}. Thank you for helping keep this
        community safe.
      </p>
    </div>
  );
}
