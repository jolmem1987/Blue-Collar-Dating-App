import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Stamp } from "@/components/ui";
import { SettingsActions } from "./SettingsActions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const rows = [
    { href: "/profile/edit", label: "Edit profile", sub: "Photos, work details, prompts" },
    { href: "/discover/filters", label: "Discovery filters", sub: "Age, distance, trade, verified" },
    { href: "/account-safety", label: "Account & safety", sub: "Blocked users, safety tips" },
    { href: "/support", label: "Support", sub: "Get help, contact the team" },
  ];

  return (
    <div className="px-4 pt-8">
      <Stamp className="text-sm text-orange">Settings</Stamp>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-stamp text-bone">Account</h1>

      <div className="mt-4 rounded-plate border border-steel-800 bg-steel-900 p-4">
        <div className="text-sm text-steel-400">Signed in as</div>
        <div className="text-bone">{user.email}</div>
        <div className="mt-1 text-xs text-steel-500">
          Status: {user.accountStatus} · Role: {user.role}
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r.href}>
            <Link
              href={r.href}
              className="flex items-center justify-between rounded-plate border border-steel-800 bg-steel-900 p-4 hover:border-steel-700"
            >
              <div>
                <div className="text-bone">{r.label}</div>
                <div className="text-xs text-steel-500">{r.sub}</div>
              </div>
              <span className="text-steel-600">›</span>
            </Link>
          </li>
        ))}
      </ul>

      <SettingsActions accountStatus={user.accountStatus} />
    </div>
  );
}
