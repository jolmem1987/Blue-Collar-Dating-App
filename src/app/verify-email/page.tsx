"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "../(auth)/AuthShell";

function Verifier() {
  const token = useSearchParams().get("token");
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    if (!token) return setState("error");
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then((r) => setState(r.ok ? "ok" : "error"));
  }, [token]);

  if (state === "loading") return <p className="text-steel-400">Verifying…</p>;
  if (state === "ok")
    return (
      <div>
        <p className="text-bone">Your email is verified. You&apos;re all set.</p>
        <Link href="/login" className="mt-4 inline-block text-orange hover:underline">Log in →</Link>
      </div>
    );
  return (
    <div>
      <p className="text-red-400">This link is invalid or expired.</p>
      <Link href="/signup" className="mt-4 inline-block text-orange hover:underline">Sign up again →</Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Verify email">
      <Suspense>
        <Verifier />
      </Suspense>
    </AuthShell>
  );
}
