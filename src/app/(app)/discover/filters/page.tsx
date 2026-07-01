"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stamp, Button, Select, Label } from "@/components/ui";
import {
  TRADE_CATEGORIES,
  INTERESTED_IN_OPTIONS,
  RELATIONSHIP_INTENT_OPTIONS,
} from "@/lib/constants";

const STORAGE_KEYS = [
  "minAge",
  "maxAge",
  "maxDistance",
  "interestedIn",
  "relationshipIntent",
  "blueCollarOnly",
  "tradeCategory",
  "hasPhotosOnly",
  "verifiedOnly",
] as const;

export default function FiltersPage() {
  const router = useRouter();
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(60);
  const [maxDistance, setMaxDistance] = useState(50);
  const [interestedIn, setInterestedIn] = useState("");
  const [relationshipIntent, setRelationshipIntent] = useState("");
  const [tradeCategory, setTradeCategory] = useState("");
  const [blueCollarOnly, setBlueCollarOnly] = useState(false);
  const [hasPhotosOnly, setHasPhotosOnly] = useState(true);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  function apply() {
    const params = new URLSearchParams();
    params.set("minAge", String(minAge));
    params.set("maxAge", String(maxAge));
    params.set("maxDistance", String(maxDistance));
    if (interestedIn) params.set("interestedIn", interestedIn);
    if (relationshipIntent) params.set("relationshipIntent", relationshipIntent);
    if (tradeCategory) params.set("tradeCategory", tradeCategory);
    if (blueCollarOnly) params.set("blueCollarOnly", "true");
    if (hasPhotosOnly) params.set("hasPhotosOnly", "true");
    if (verifiedOnly) params.set("verifiedOnly", "true");
    router.push(`/discover?${params.toString()}`);
  }

  function reset() {
    setMinAge(18); setMaxAge(60); setMaxDistance(50);
    setInterestedIn(""); setRelationshipIntent(""); setTradeCategory("");
    setBlueCollarOnly(false); setHasPhotosOnly(true); setVerifiedOnly(false);
  }

  return (
    <div className="px-4 pt-8">
      <Stamp className="text-sm text-orange">Filters</Stamp>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-stamp text-bone">
        Dial in your search
      </h1>

      <div className="mt-6 space-y-5 spec-plate p-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Min age</Label>
            <input type="number" min={18} max={99} value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              className="w-full rounded-plate border border-steel-700 bg-steel-900 px-3 py-2.5 text-bone focus:border-orange focus:outline-none" />
          </div>
          <div>
            <Label>Max age</Label>
            <input type="number" min={18} max={99} value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              className="w-full rounded-plate border border-steel-700 bg-steel-900 px-3 py-2.5 text-bone focus:border-orange focus:outline-none" />
          </div>
        </div>

        <div>
          <Label>Max distance: {maxDistance} mi</Label>
          <input type="range" min={5} max={300} step={5} value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full accent-orange" />
        </div>

        <div>
          <Label>Show me</Label>
          <Select value={interestedIn} onChange={(e) => setInterestedIn(e.target.value)}>
            <option value="">Use my profile preference</option>
            {INTERESTED_IN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Relationship intent</Label>
          <Select value={relationshipIntent} onChange={(e) => setRelationshipIntent(e.target.value)}>
            <option value="">Any</option>
            {RELATIONSHIP_INTENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Trade category</Label>
          <Select value={tradeCategory} onChange={(e) => setTradeCategory(e.target.value)}>
            <option value="">Any trade</option>
            {TRADE_CATEGORIES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-2 border-t border-steel-800 pt-4">
          <Toggle label="Blue-collar workers only" checked={blueCollarOnly} onChange={setBlueCollarOnly} />
          <Toggle label="Has photos only" checked={hasPhotosOnly} onChange={setHasPhotosOnly} />
          <Toggle label="Verified users only" checked={verifiedOnly} onChange={setVerifiedOnly} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 pb-4">
        <Button variant="steel" onClick={reset}>Reset</Button>
        <Button onClick={apply}>Apply filters</Button>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-plate border border-steel-800 bg-steel-900 px-3 py-3 text-left"
    >
      <span className="text-sm text-bone">{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-orange" : "bg-steel-700"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}
