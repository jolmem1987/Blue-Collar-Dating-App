"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "../(auth)/AuthShell";
import { Button, Input, Label } from "@/components/ui";

function ResetForm() {
  const token = useSearchParams().get("token") ?? "";
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error ?? "Something went wrong.");
    setDone(true);
  }

  if (done)
    return (
      <div>
        <p className="text-bone">Password updated.</p>
        <Link href="/login" className="mt-4 inline-block text-orange hover:underline">Log in →</Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>New password</Label>
        <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" className="w-full">Update password</Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Set a new password">
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
