import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getMatchesForUser } from "@/lib/matches";
import { Stamp, ButtonLink } from "@/components/ui";

export const dynamic = "force-dynamic";

function timeAgo(d: Date | string) {
  const t = new Date(d).getTime();
  const mins = Math.floor((Date.now() - t) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default async function MatchesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const matches = await getMatchesForUser(user.id);

  return (
    <div className="px-4 pt-8">
      <Stamp className="text-sm text-orange">Matches</Stamp>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-stamp text-bone">
        The crew you&apos;ve matched with
      </h1>

      {matches.length === 0 ? (
        <div className="mt-12 spec-plate p-8 text-center">
          <div className="stamp text-lg text-steel-300">No matches yet</div>
          <p className="mx-auto mt-2 max-w-xs text-sm text-steel-500">
            When you and someone both like each other, they&apos;ll show up here and you can start a
            conversation.
          </p>
          <div className="mt-6">
            <ButtonLink href="/discover">Start browsing</ButtonLink>
          </div>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {matches.map((m: {
            matchId: string;
            createdAt: Date | string;
            other: { photo: string | null; firstName: string | null; verified: boolean };
            lastMessage?: { fromMe: boolean; body: string; createdAt: Date | string; isRead: boolean } | null;
          }) => (
            <li key={m.matchId}>
              <Link
                href={`/messages/${m.matchId}`}
                className="flex items-center gap-3 rounded-plate border border-steel-800 bg-steel-900 p-3 transition-colors hover:border-steel-700"
              >
                <Avatar photo={m.other.photo} name={m.other.firstName} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-display text-lg uppercase tracking-stamp text-bone">
                      {m.other.firstName ?? "Someone"}
                    </span>
                    {m.other.verified && (
                      <span className="rounded bg-amber/20 px-1 text-[10px] font-bold text-amber">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-steel-400">
                    {m.lastMessage
                      ? `${m.lastMessage.fromMe ? "You: " : ""}${m.lastMessage.body}`
                      : "Say hello — break the ice."}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-steel-600">
                    {timeAgo(m.lastMessage?.createdAt ?? m.createdAt)}
                  </span>
                  {m.lastMessage && !m.lastMessage.fromMe && !m.lastMessage.isRead && (
                    <span className="h-2.5 w-2.5 rounded-full bg-orange" />
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Avatar({ photo, name }: { photo: string | null; name: string | null }) {
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt={name ?? ""} className="h-14 w-14 shrink-0 rounded-plate object-cover" />;
  }
  return (
    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-plate bg-steel-800 font-display text-xl text-steel-500">
      {(name ?? "?").charAt(0).toUpperCase()}
    </div>
  );
}
