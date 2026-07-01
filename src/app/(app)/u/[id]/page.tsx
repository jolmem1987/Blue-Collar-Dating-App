import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { areMatched } from "@/lib/matches";
import { ProfileView, toProfileView } from "@/components/ProfileView";
import { Stamp, ButtonLink } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (params.id === me.id) redirect("/profile");

  // Only allow viewing full profiles of people you've matched with (safety).
  const matched = await areMatched(me.id, params.id);
  if (!matched) notFound();

  const target = await prisma.user.findUnique({
    where: { id: params.id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!target || ["DELETED"].includes(target.accountStatus)) notFound();

  const data = toProfileView(target);

  return (
    <div className="px-4 pt-8">
      <Link href="/messages" className="text-sm text-steel-400 hover:text-bone">← Back</Link>
      <Stamp className="mt-3 block text-sm text-orange">Profile</Stamp>

      <div className="mt-3">
        <ProfileView data={data} />
      </div>

      <div className="mt-5 pb-4">
        <ButtonLink href={`/messages`} variant="steel" className="w-full">
          Back to messages
        </ButtonLink>
      </div>
    </div>
  );
}
