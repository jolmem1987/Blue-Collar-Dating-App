"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

type Msg = { id: string; body: string; fromMe: boolean; createdAt: string; isRead: boolean };
type Other = { id: string; firstName: string | null; photo: string | null; verified: boolean };

export function ChatThread({ matchId, other }: { matchId: string; other: Other }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/messages?matchId=${matchId}`);
    if (res.ok) {
      const d = await res.json();
      setMessages(d.messages ?? []);
    }
    setLoaded(true);
  }, [matchId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000); // lightweight polling for MVP
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send() {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setErr(null);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, body }),
    });
    if (res.ok) {
      const d = await res.json();
      setMessages((m) => [...m, d.message]);
      setText("");
    } else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error ?? "Couldn't send. Try again.");
    }
    setSending(false);
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-steel-800 bg-ink/95 px-4 py-3 backdrop-blur">
        <Link href="/messages" className="text-steel-400 hover:text-bone" aria-label="Back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link href={`/u/${other.id}`} className="flex items-center gap-2">
          {other.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={other.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-full bg-steel-800 font-display text-steel-500">
              {(other.firstName ?? "?").charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-display text-lg uppercase tracking-stamp text-bone">
            {other.firstName}
          </span>
          {other.verified && (
            <span className="rounded bg-amber/20 px-1 text-[10px] font-bold text-amber">VERIFIED</span>
          )}
        </Link>
      </div>

      {/* Safety banner */}
      <div className="border-b border-amber/20 bg-amber/5 px-4 py-2 text-center text-xs text-amber">
        Never send money, gift cards, or banking info. Report anyone who asks.
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {!loaded ? (
          <div className="mt-8 text-center text-steel-500">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="mt-8 text-center text-sm text-steel-500">
            You matched with {other.firstName}. Say hello.
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-plate px-3 py-2 text-sm ${
                  m.fromMe ? "bg-orange text-white" : "bg-steel-800 text-bone"
                }`}
              >
                {m.body}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-steel-800 bg-ink px-3 py-3">
        {err && <div className="mb-2 text-center text-xs text-red-400">{err}</div>}
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder={`Message ${other.firstName ?? ""}…`}
            className="max-h-32 flex-1 resize-none rounded-plate border border-steel-700 bg-steel-900 px-3 py-2.5 text-bone placeholder:text-steel-500 focus:border-orange focus:outline-none"
          />
          <Button onClick={send} disabled={!text.trim() || sending}>
            {sending ? "…" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
