"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  WORKER_CATEGORY_OPTIONS,
  INTERESTED_IN_OPTIONS,
  RELATIONSHIP_INTENT_OPTIONS,
  BLUE_COLLAR_PREFERENCE_OPTIONS,
  GENDER_OPTIONS,
  TRADE_CATEGORIES,
} from "@/lib/constants";
import { Button, Input, Label, Select, Stamp } from "@/components/ui";
import { cn } from "@/lib/utils";

type Form = {
  firstName: string;
  gender: string;
  workerCategory: string;
  tradeCategory: string;
  interestedIn: string;
  relationshipIntent: string;
  blueCollarPreference: string;
  location: string;
};

const STEPS = ["You", "Your work", "Looking for", "Intent", "Preference"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>({
    firstName: "",
    gender: "",
    workerCategory: "",
    tradeCategory: "",
    interestedIn: "",
    relationshipIntent: "",
    blueCollarPreference: "OPEN",
    location: "",
  });
  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const showTrade = ["TRADE", "MANUFACTURING_MAINTENANCE", "OTHER"].includes(form.workerCategory);

  function canAdvance() {
    if (step === 0) return form.firstName && form.gender && form.location;
    if (step === 1) return form.workerCategory;
    if (step === 2) return form.interestedIn;
    if (step === 3) return form.relationshipIntent;
    if (step === 4) return form.blueCollarPreference;
    return false;
  }

  async function finish() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json();
      return setError(d.error ?? "Could not save.");
    }
    router.push("/profile/edit?welcome=1");
    router.refresh();
  }

  return (
    <div className="px-4 pt-8">
      <Stamp className="text-sm text-orange">Build your plate</Stamp>
      {/* progress */}
      <div className="mt-4 flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className={cn("h-1.5 flex-1 rounded", i <= step ? "bg-orange" : "bg-steel-800")} />
        ))}
      </div>

      <div className="mt-8 spec-plate p-6">
        {step === 0 && (
          <Section title="The basics">
            <Field label="First name">
              <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="What should people call you?" />
            </Field>
            <Field label="I am a">
              <OptionGrid options={GENDER_OPTIONS} value={form.gender} onSelect={(v) => set("gender", v)} />
            </Field>
            <Field label="Location">
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City, State" />
            </Field>
          </Section>
        )}

        {step === 1 && (
          <Section title="What best describes you?">
            <OptionList options={WORKER_CATEGORY_OPTIONS} value={form.workerCategory} onSelect={(v) => set("workerCategory", v)} />
            {showTrade && (
              <Field label="Trade category">
                <Select value={form.tradeCategory} onChange={(e) => set("tradeCategory", e.target.value)}>
                  <option value="">Select a trade…</option>
                  {TRADE_CATEGORIES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </Field>
            )}
          </Section>
        )}

        {step === 2 && (
          <Section title="Who are you looking for?">
            <OptionList options={INTERESTED_IN_OPTIONS} value={form.interestedIn} onSelect={(v) => set("interestedIn", v)} />
          </Section>
        )}

        {step === 3 && (
          <Section title="What are you hoping to find?">
            <OptionList options={RELATIONSHIP_INTENT_OPTIONS} value={form.relationshipIntent} onSelect={(v) => set("relationshipIntent", v)} />
          </Section>
        )}

        {step === 4 && (
          <Section title="Your match preference">
            <OptionList options={BLUE_COLLAR_PREFERENCE_OPTIONS} value={form.blueCollarPreference} onSelect={(v) => set("blueCollarPreference", v)} />
          </Section>
        )}

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-8 flex justify-between">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button disabled={!canAdvance()} onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button disabled={!canAdvance() || saving} onClick={finish}>
              {saving ? "Saving…" : "Finish setup"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl uppercase tracking-stamp text-bone">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function OptionList({
  options,
  value,
  onSelect,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onSelect(o.value)}
          className={cn(
            "w-full rounded-plate border px-4 py-3 text-left transition-colors",
            value === o.value
              ? "border-orange bg-orange/10 text-bone"
              : "border-steel-700 bg-steel-900 text-steel-300 hover:border-steel-600"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function OptionGrid({
  options,
  value,
  onSelect,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onSelect(o.value)}
          className={cn(
            "rounded-plate border px-3 py-3 text-sm transition-colors",
            value === o.value
              ? "border-orange bg-orange/10 text-bone"
              : "border-steel-700 bg-steel-900 text-steel-300 hover:border-steel-600"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
