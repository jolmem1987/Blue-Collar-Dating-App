"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "../AuthShell";
import { Button, Input, Label } from "@/components/ui";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", birthDate: "", agreedToTerms: false });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) return setError(data.error ?? "Something went wrong.");
    setDone(true);
  }

  if (done) {
    return (
      <AuthShell title="Check your email" subtitle="We sent you a verification link.">
        <p className="text-sm text-steel-400">
          Click the link in your email to verify your account, then log in. In development the link
          is printed to your server console.
        </p>
        <Link href="/login" className="mt-5 inline-block text-orange hover:underline">
          Go to log in →
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Join the crew" subtitle="Free to join. You must be 18 or older.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <Label>Date of birth</Label>
          <Input
            type="date"
            required
            value={form.birthDate}
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          />
          <p className="mt-1 text-xs text-steel-500">You must be 18+ to use BlueCollar Match.</p>
        </div>
        <label className="flex items-start gap-3 text-sm text-steel-400">
          <input
            type="checkbox"
            checked={form.agreedToTerms}
            onChange={(e) => setForm({ ...form, agreedToTerms: e.target.checked })}
            className="mt-1 h-4 w-4 accent-orange"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-orange hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-orange hover:underline">Privacy Policy</Link>, and
            confirm I am 18 or older.
          </span>
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-steel-500">
        Already have an account?{" "}
        <Link href="/login" className="text-orange hover:underline">Log in</Link>
      </p>
    </AuthShell>
  );
}
