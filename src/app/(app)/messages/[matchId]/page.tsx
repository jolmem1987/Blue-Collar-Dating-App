import { getCurrentUser } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { getMatchForUser } from "@/lib/matches";
import { ChatThread } from "./ChatThread";

export const dynamic = "force-dynamic";

export default async function ChatPage({ params }: { params: { matchId: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const found = await getMatchForUser(params.matchId, user.id);
  if (!found) notFound();

  return (
    <ChatThread
      matchId={params.matchId}
      other={{
        id: found.other.id,
        firstName: found.other.firstName,
        photo: found.other.photos[0]?.imageUrl ?? null,
        verified: found.other.verificationStatus === "VERIFIED",
      }}
    />
  );
}
