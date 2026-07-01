"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TRADE_CATEGORIES,
  PROFILE_PROMPTS,
  UNION_STATUS_OPTIONS,
  SHIFT_TYPE_OPTIONS,
  RELATIONSHIP_INTENT_OPTIONS,
  GENDER_OPTIONS,
  INTERESTED_IN_OPTIONS,
} from "@/lib/constants";
import { Button, Input, Textarea, Select, Label } from "@/components/ui";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState({
    firstName: user.firstName ?? "",
    gender: user.gender ?? "",
    interestedIn: user.interestedIn ?? "",
    location: user.location ?? "",
    bio: user.bio ?? "",
    hobbies: user.hobbies ?? "",
    weekendLifestyle: user.weekendLifestyle ?? "",
    lookingFor: user.lookingFor ?? "",
    relationshipIntent: user.relationshipIntent ?? "",
    isBlueCollarWorker: user.isBlueCollarWorker ?? false,
    tradeCategory: user.tradeCategory ?? "",
    jobTitle: user.jobTitle ?? "",
    yearsInTrade: user.yearsInTrade ?? "",
    unionStatus: user.unionStatus ?? "",
    workSchedule: user.workSchedule ?? "",
    shiftType: user.shiftType ?? "",
    travelForWork: user.travelForWork ?? false,
    minAgePref: user.minAgePref ?? 18,
    maxAgePref: user.maxAgePref ?? 60,
    maxDistanceMiles: user.maxDistanceMiles ?? 50,
    promptTrade: user.promptTrade ?? "",
    promptWhyWorkHard: user.promptWhyWorkHard ?? "",
    promptBestPart: user.promptBestPart ?? "",
    promptHardestSchedule: user.promptHardestSchedule ?? "",
    promptIdealWeekend: user.promptIdealWeekend ?? "",
    promptProudSkill: user.promptProudSkill ?? "",
    promptMisunderstood: user.promptMisunderstood ?? "",
    promptRelaxAfterWork: user.promptRelaxAfterWork ?? "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const payload = { ...f, yearsInTrade: f.yearsInTrade === "" ? undefined : Number(f.yearsInTrade) };
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json();
      return setError(d.error ?? "Could not save.");
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="mt-5 space-y-5">
      <Card title="About you">
        <Row>
          <Field label="First name">
            <Input value={f.firstName} onChange={(e) => set("firstName", e.target.value)} />
          </Field>
          <Field label="Location">
            <Input value={f.location} onChange={(e) => set("location", e.target.value)} placeholder="City, State" />
          </Field>
        </Row>
        <Row>
          <Field label="Gender">
            <Select value={f.gender} onChange={(e) => set("gender", e.target.value)}>
              <option value="">Select…</option>
              {GENDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </Field>
          <Field label="Interested in">
            <Select value={f.interestedIn} onChange={(e) => set("interestedIn", e.target.value)}>
              <option value="">Select…</option>
              {INTERESTED_IN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </Field>
        </Row>
        <Field label="Relationship intent">
          <Select value={f.relationshipIntent} onChange={(e) => set("relationshipIntent", e.target.value)}>
            <option value="">Select…</option>
            {RELATIONSHIP_INTENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Bio">
          <Textarea rows={3} value={f.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Tell people who you are." />
        </Field>
      </Card>

      <Card title="Your work">
        <label className="flex items-center gap-3 text-sm text-bone">
          <input type="checkbox" checked={f.isBlueCollarWorker} onChange={(e) => set("isBlueCollarWorker", e.target.checked)} className="h-4 w-4 accent-orange" />
          I work a blue-collar job
        </label>
        {f.isBlueCollarWorker && (
          <>
            <Row>
              <Field label="Trade category">
                <Select value={f.tradeCategory} onChange={(e) => set("tradeCategory", e.target.value)}>
                  <option value="">Select…</option>
                  {TRADE_CATEGORIES.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Job title">
                <Input value={f.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} placeholder="e.g. Journeyman Electrician" />
              </Field>
            </Row>
            <Row>
              <Field label="Years in trade">
                <Input type="number" min={0} max={80} value={f.yearsInTrade} onChange={(e) => set("yearsInTrade", e.target.value)} />
              </Field>
              <Field label="Union status">
                <Select value={f.unionStatus} onChange={(e) => set("unionStatus", e.target.value)}>
                  <option value="">Select…</option>
                  {UNION_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              </Field>
            </Row>
            <Row>
              <Field label="Shift type">
                <Select value={f.shiftType} onChange={(e) => set("shiftType", e.target.value)}>
                  <option value="">Select…</option>
                  {SHIFT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              </Field>
              <Field label="Work schedule">
                <Input value={f.workSchedule} onChange={(e) => set("workSchedule", e.target.value)} placeholder="e.g. 4 on / 4 off" />
              </Field>
            </Row>
            <label className="flex items-center gap-3 text-sm text-bone">
              <input type="checkbox" checked={f.travelForWork} onChange={(e) => set("travelForWork", e.target.checked)} className="h-4 w-4 accent-orange" />
              I travel for work
            </label>
          </>
        )}
      </Card>

      <Card title="Lifestyle">
        <Field label="Hobbies">
          <Input value={f.hobbies} onChange={(e) => set("hobbies", e.target.value)} placeholder="Fishing, lifting, wrenching…" />
        </Field>
        <Field label="Weekend lifestyle">
          <Input value={f.weekendLifestyle} onChange={(e) => set("weekendLifestyle", e.target.value)} />
        </Field>
        <Field label="What I'm looking for">
          <Textarea rows={2} value={f.lookingFor} onChange={(e) => set("lookingFor", e.target.value)} />
        </Field>
      </Card>

      <Card title="Prompts">
        <p className="-mt-2 mb-1 text-sm text-steel-500">Answer a few — they make your plate stand out.</p>
        {PROFILE_PROMPTS.map((p) => (
          <Field key={p.key} label={p.label}>
            <Input
              value={(f as Record<string, string>)[p.key] ?? ""}
              onChange={(e) => set(p.key, e.target.value)}
            />
          </Field>
        ))}
      </Card>

      <Card title="Discovery preferences">
        <Row>
          <Field label="Min age">
            <Input type="number" min={18} max={99} value={f.minAgePref} onChange={(e) => set("minAgePref", Number(e.target.value))} />
          </Field>
          <Field label="Max age">
            <Input type="number" min={18} max={99} value={f.maxAgePref} onChange={(e) => set("maxAgePref", Number(e.target.value))} />
          </Field>
        </Row>
        <Field label={`Max distance: ${f.maxDistanceMiles} miles`}>
          <input type="range" min={1} max={500} value={f.maxDistanceMiles} onChange={(e) => set("maxDistanceMiles", Number(e.target.value))} className="w-full accent-orange" />
        </Field>
      </Card>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {saved && <p className="text-sm text-amber">Saved.</p>}
      <div className="sticky bottom-24 z-10">
        <Button onClick={save} disabled={saving} className="w-full" size="lg">
          {saving ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="spec-plate p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-stamp text-steel-400">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
