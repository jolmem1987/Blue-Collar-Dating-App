"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";

export function SettingsActions({ accountStatus }: { accountStatus: string }) {
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const paused = accountStatus === "PAUSED";

  async function account(action: "PAUSE" | "REACTIVATE" | "DELETE") {
    setBusy(true);
    const res = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(false);
    if (res.ok) {
      if (action === "DELETE") {
        await signOut({ callbackUrl: "/" });
      } else {
        window.location.reload();
      }
    }
  }

  return (
    <div className="mt-6 space-y-3 pb-4">
      <Button variant="steel" className="w-full" onClick={() => signOut({ callbackUrl: "/" })}>
        Log out
      </Button>

      {paused ? (
        <div className="rounded-plate border border-amber/30 bg-amber/5 p-4">
          <div className="text-sm text-amber">Your account is paused.</div>
          <p className="mt-1 text-xs text-steel-400">
            You&apos;re hidden from Discover and won&apos;t get new matches until you reactivate.
          </p>
          <Button className="mt-3 w-full" disabled={busy} onClick={() => account("REACTIVATE")}>
            Reactivate account
          </Button>
        </div>
      ) : (
        <Button variant="ghost" className="w-full" disabled={busy} onClick={() => account("PAUSE")}>
          Pause my account
        </Button>
      )}

      <div className="rounded-plate border border-red-500/30 bg-red-500/5 p-4">
        <div className="text-sm font-semibold text-red-400">Delete account</div>
        <p className="mt-1 text-xs text-steel-400">
          This permanently removes your profile, photos, and matches. This can&apos;t be undone.
        </p>
        {!confirmDelete ? (
          <Button variant="danger" className="mt-3 w-full" onClick={() => setConfirmDelete(true)}>
            Delete my account
          </Button>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="steel" disabled={busy} onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" disabled={busy} onClick={() => account("DELETE")}>
              {busy ? "Deleting…" : "Confirm delete"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
