import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AppNav } from "@/components/AppNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.accountStatus === "BANNED") redirect("/banned");

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      <main className="flex-1 pb-24">{children}</main>
      <AppNav isAdmin={user.role === "ADMIN"} />
    </div>
  );
}
