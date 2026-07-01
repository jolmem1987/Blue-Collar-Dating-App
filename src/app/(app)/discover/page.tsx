"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Stamp, Button } from "@/components/ui";
import { REPORT_REASON_OPTIONS } from "@/lib/constants";

type Card = {
  id: string;
  firstName: string | null;
  age: number | null;
  jobTitle: string | null;
  tradeCategory: string | null;
  isBlueCollarWorker: boolean;
  location: string | null;
  distance: number | null;
  relationshipIntent: string | null;
  bio: string | null;
  yearsInTrade: number | null;
  shiftType: string | null;
  unionStatus: string | null;
  verified: boolean;
  photos: string[];
};

const INTENT_LABEL: Record<string, string> = {
  SERIOUS: "Serious relationship",
  DATING: "Dating",
  FRIENDSHIP_FIRST: "Friendship first",
  NOT_SURE: "Not sure yet",
};

export default function DiscoverPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchName, setMatchName] = useState<string | null>(null);
  const [reportFor, setReportFor] = useState<Card | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = typeof window !== "undefined" ? window.location.search : "";
    const res = await fetch(`/api/discover${qs}`);
    const data = await res.json();
    setCards(data.cards ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const top = cards[0];

  async function act(kind: "like" | "pass", card: Card) {
    setCards((c) => c.slice(1)); // optimistic
    const res = await fetch(`/api/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: card.id }),
    });
    if (kind === "like" && res.ok) {
      const d = await res.json();
      if (d.matched) setMatchName(card.firstName ?? "your match");
    }
    if (cards.length <= 2) load();
  }

  async function block(card: Card) {
    await fetch("/api/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockedUserId: card.id }),
    });
    setCards((c) => c.filter((x) => x.id !== card.id));
  }

  return (
    <div className="px-4 pt-8">
      <div className="flex items-center justify-between">
        <Stamp className="text-sm text-orange">Discover</Stamp>
        <Link href="/discover/filters" className="text-sm text-steel-400 hover:text-bone">Filters</Link>
      </div>

      {loading ? (
        <div className="mt-10 text-center text-steel-500">Loading the yard…</div>
      ) : !top ? (
        <EmptyState onRefresh={load} />
      ) : (
        <>
          <ProfilePlate card={top} />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button variant="steel" size="lg" onClick={() => act("pass", top)}>Pass</Button>
            <Button size="lg" onClick={() => act("like", top)}>Like</Button>
          </div>
          <div className="mt-3 flex justify-center gap-6 text-sm text-steel-500">
            <button onClick={() => setReportFor(top)} className="hover:text-bone">Report</button>
            <button onClick={() => block(top)} className="hover:text-bone">Block</button>
          </div>
        </>
      )}

      {matchName && (
        <Modal onClose={() => setMatchName(null)}>
          <div className="text-center">
            <div className="stamp text-2xl text-orange">It&apos;s a match</div>
            <p className="mt-2 text-steel-300">You and {matchName} liked each other.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="steel" onClick={() => setMatchName(null)}>Keep browsing</Button>
              <Link href="/matches"><Button>See matches</Button></Link>
            </div>
          </div>
        </Modal>
      )}

      {reportFor && (
        <ReportModal card={reportFor} onClose={() => setReportFor(null)} onDone={() => {
          setCards((c) => c.filter((x) => x.id !== reportFor.id));
          setReportFor(null);
        }} />
      )}
    </div>
  );
}

function ProfilePlate({ card }: { card: Card }) {
  const photo = card.photos[0];
  return (
    <div className="mt-5 overflow-hidden spec-plate">
      <div className="relative aspect-[4/5] bg-steel-900">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={card.firstName ?? ""} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-steel-600">No photo yet</div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-3xl uppercase tracking-stamp text-bone">
              {card.firstName} {card.age ? `· ${card.age}` : ""}
            </h2>
            {card.verified && <span className="rounded bg-amber/20 px-1.5 py-0.5 text-xs font-bold text-amber">VERIFIED</span>}
          </div>
          <p className="text-sm text-steel-300">
            {[card.jobTitle || card.tradeCategory, card.location, card.distance != null ? `${card.distance} mi` : null]
              .filter(Boolean).join("  ·  ")}
          </p>
        </div>
      </div>

      {/* spec rows */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-steel-800 p-4">
        {card.relationshipIntent && <Spec k="Looking for" v={INTENT_LABEL[card.relationshipIntent]} />}
        {card.tradeCategory && <Spec k="Trade" v={card.tradeCategory} />}
        {card.yearsInTrade != null && <Spec k="Years in trade" v={String(card.yearsInTrade)} />}
        {card.shiftType && <Spec k="Shift" v={titleCase(card.shiftType)} />}
        {card.unionStatus && <Spec k="Union" v={titleCase(card.unionStatus)} />}
      </dl>
      {card.bio && <p className="border-t border-steel-800 p-4 text-sm text-steel-300">{card.bio}</p>}
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="spec-row text-steel-500">{k}</dt>
      <dd className="spec-row text-right text-bone">{v}</dd>
    </div>
  );
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="mt-16 text-center">
      <div className="stamp text-xl text-steel-400">You&apos;re all caught up</div>
      <p className="mx-auto mt-2 max-w-xs text-sm text-steel-500">
        No more profiles match your filters right now. Widen your distance or check back after the
        next shift change.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button variant="steel" onClick={onRefresh}>Refresh</Button>
        <Link href="/discover/filters"><Button>Adjust filters</Button></Link>
      </div>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-sm spec-plate p-6" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ReportModal({ card, onClose, onDone }: { card: Card; onClose: () => void; onDone: () => void }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit() {
    if (!reason) return;
    setBusy(true);
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportedUserId: card.id, reason, details }),
    });
    setBusy(false);
    onDone();
  }
  return (
    <Modal onClose={onClose}>
      <div className="stamp text-lg text-bone">Report {card.firstName}</div>
      <p className="mt-1 text-sm text-steel-500">Reports are reviewed by our team. Thanks for keeping this place safe.</p>
      <div className="mt-4 space-y-2">
        {REPORT_REASON_OPTIONS.map((o) => (
          <button key={o.value} onClick={() => setReason(o.value)}
            className={`w-full rounded-plate border px-3 py-2 text-left text-sm ${reason === o.value ? "border-orange bg-orange/10 text-bone" : "border-steel-700 text-steel-300"}`}>
            {o.label}
          </button>
        ))}
      </div>
      <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={2} placeholder="Details (optional)"
        className="mt-3 w-full rounded-plate border border-steel-700 bg-steel-900 p-3 text-sm text-bone" />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" disabled={!reason || busy} onClick={submit}>{busy ? "Sending…" : "Submit report"}</Button>
      </div>
    </Modal>
  );
}

function titleCase(s: string) {
  return s.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
