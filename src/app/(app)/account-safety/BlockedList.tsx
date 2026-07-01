"use client";
import { useState } from "react";
import { Button } from "@/components/ui";

type Blocked = { id: string; firstName: string | null };

export function BlockedList({ initial }: { initial: Blocked[] }) {
  const [list, setList] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  async function unblock(id: string) {
    setBusy(id);
    const res = await fetch("/api/block", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockedUserId: id }),
    });
    setBusy(null);
    if (res.ok) setList((l) => l.filter((b) => b.id !== id));
  }

  if (list.length === 0) {
    return (
      <div className="rounded-plate border border-steel-800 bg-steel-900 p-4 text-sm text-steel-500">
        You haven&apos;t blocked anyone. Blocked people can never see you or contact you again.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {list.map((b) => (
        <li
          key={b.id}
          className="flex items-center justify-between rounded-plate border border-steel-800 bg-steel-900 p-3"
        >
          <span className="text-bone">{b.firstName ?? "User"}</span>
          <Button size="sm" variant="steel" disabled={busy === b.id} onClick={() => unblock(b.id)}>
            {busy === b.id ? "…" : "Unblock"}
          </Button>
        </li>
      ))}
    </ul>
  );
}
