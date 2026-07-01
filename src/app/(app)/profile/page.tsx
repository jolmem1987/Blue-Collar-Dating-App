import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Stamp, ButtonLink, VerifiedBadge } from "@/components/ui";
import { ProfileView, toProfileView } from "@/components/ProfileView";
import { profileCompleteness } from "@/lib/matching";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const pct = Math.round(profileCompleteness(user) * 100);
  const data = toProfileView(user);

  return (
    <div className="px-4 pt-8">
      <div className="flex items-center justify-between">
        <Stamp className="text-sm text-orange">Your profile</Stamp>
        <Link href="/settings" className="text-sm text-steel-400 hover:text-bone">Settings</Link>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-3xl uppercase tracking-stamp text-bone">
          {user.firstName ?? "You"}
        </h1>
        {user.verificationStatus === "VERIFIED" ? (
          <VerifiedBadge />
        ) : (
          <span className="rounded-full border border-steel-700 px-2 py-0.5 text-xs text-steel-400">
            Unverified
          </span>
        )}
      </div>

      {pct < 100 && (
        <div className="mt-4 rounded-plate border border-amber/30 bg-amber/5 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-amber">Profile {pct}% complete</span>
            <Link href="/profile/edit" className="font-semibold text-amber hover:underline">
              Finish it
            </Link>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-steel-800">
            <div className="h-full bg-amber" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div className="mt-5">
        <ProfileView data={data} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 pb-4">
        <ButtonLink href="/profile/edit" variant="steel">Edit profile</ButtonLink>
        <ButtonLink href="/discover">Browse</ButtonLink>
      </div>
    </div>
  );
}
