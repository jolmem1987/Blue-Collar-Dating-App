import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getMatchesForUser } from "@/lib/matches";
import { Stamp, ButtonLink } from "@/components/ui";

export const dynamic = "force-dynamic";

type MatchSummary = {
  matchId: string;
  other: { photo: string | null; firstName: string | null };
  lastMessage?: { fromMe: boolean; body: string; createdAt: Date | string; isRead: boolean } | null;
};

function timeAgo(d: Date | string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const all = (await getMatchesForUser(user.id)) as MatchSummary[];
  // Conversations = matches that have at least one message, plus matches w/o
  // messages shown as "new match — say hi".
  const withMsgs = all.filter((m) => m.lastMessage);
  const fresh = all.filter((m) => !m.lastMessage);

  return (
    <div className="px-4 pt-8">
      <Stamp className="text-sm text-orange">Messages</Stamp>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-stamp text-bone">Conversations</h1>

      {all.length === 0 ? (
        <div className="mt-12 spec-plate p-8 text-center">
          <div className="stamp text-lg text-steel-300">No conversations yet</div>
          <p className="mx-auto mt-2 max-w-xs text-sm text-steel-500">
            Match with someone first, then you can message each other here. You can only message
            people you&apos;ve matched with — that keeps things safe.
          </p>
          <div className="mt-6">
            <ButtonLink href="/discover">Find matches</ButtonLink>
          </div>
        </div>
      ) : (
        <>
          {fresh.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 text-xs font-semibold uppercase tracking-stamp text-steel-500">
                New matches
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {fresh.map((m) => (
                  <Link key={m.matchId} href={`/messages/${m.matchId}`} className="shrink-0 text-center">
                    <Avatar photo={m.other.photo} name={m.other.firstName} size={64} ring />
                    <div className="mt-1 max-w-[64px] truncate text-xs text-steel-400">
                      {m.other.firstName}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <ul className="mt-4 space-y-2">
            {withMsgs.map((m) => (
              <li key={m.matchId}>
                <Link
                  href={`/messages/${m.matchId}`}
                  className="flex items-center gap-3 rounded-plate border border-steel-800 bg-steel-900 p-3 hover:border-steel-700"
                >
                  <Avatar photo={m.other.photo} name={m.other.firstName} size={56} />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg uppercase tracking-stamp text-bone">
                      {m.other.firstName}
                    </div>
                    <p className="truncate text-sm text-steel-400">
                      {m.lastMessage?.fromMe ? "You: " : ""}
                      {m.lastMessage?.body}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-steel-600">{timeAgo(m.lastMessage!.createdAt)}</span>
                    {!m.lastMessage!.fromMe && !m.lastMessage!.isRead && (
                      <span className="h-2.5 w-2.5 rounded-full bg-orange" />
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Avatar({
  photo,
  name,
  size = 56,
  ring = false,
}: {
  photo: string | null;
  name: string | null;
  size?: number;
  ring?: boolean;
}) {
  const cls = `shrink-0 rounded-full object-cover ${ring ? "ring-2 ring-orange" : ""}`;
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt={name ?? ""} width={size} height={size} className={cls} style={{ width: size, height: size }} />;
  }
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full bg-steel-800 font-display text-steel-500 ${ring ? "ring-2 ring-orange" : ""}`}
      style={{ width: size, height: size }}
    >
      {(name ?? "?").charAt(0).toUpperCase()}
    </div>
  );
}
