"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Variant = "primary" | "steel" | "danger" | "ghost";

const cls: Record<Variant, string> = {
  primary: "bg-orange text-white hover:bg-orange-600",
  steel: "bg-steel-800 text-bone hover:bg-steel-700",
  danger: "bg-transparent text-red-400 border border-red-500/40 hover:bg-red-500/10",
  ghost: "bg-transparent text-steel-400 hover:text-bone",
};

export function AdminAction({
  endpoint,
  payload,
  label,
  busyLabel = "…",
  variant = "steel",
  confirm,
}: {
  endpoint: string;
  payload: Record<string, unknown>;
  label: string;
  busyLabel?: string;
  variant?: Variant;
  confirm?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function go() {
    if (confirm && !window.confirm(confirm)) return;
    setBusy(true);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("Action failed.");
  }

  return (
    <button
      onClick={go}
      disabled={busy}
      className={`inline-flex h-8 items-center justify-center rounded-plate px-3 text-xs font-medium transition-colors disabled:opacity-50 ${cls[variant]}`}
    >
      {busy ? busyLabel : label}
    </button>
  );
}
