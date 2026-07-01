import { PROFILE_PROMPTS } from "@/lib/constants";

function titleCase(s: string) {
  return s.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export type ProfileViewData = {
  firstName: string | null;
  age: number | null;
  location: string | null;
  bio: string | null;
  jobTitle: string | null;
  tradeCategory: string | null;
  yearsInTrade: number | null;
  unionStatus: string | null;
  shiftType: string | null;
  workSchedule: string | null;
  relationshipIntent: string | null;
  isBlueCollarWorker: boolean;
  travelForWork: boolean;
  hobbies: string | null;
  weekendLifestyle: string | null;
  lookingFor: string | null;
  verified: boolean;
  photos: string[];
  prompts: Record<string, string | null>;
};

const INTENT_LABEL: Record<string, string> = {
  SERIOUS: "Serious relationship",
  DATING: "Dating",
  FRIENDSHIP_FIRST: "Friendship first",
  NOT_SURE: "Not sure yet",
};

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="spec-row text-steel-500">{k}</dt>
      <dd className="spec-row text-right text-bone">{v}</dd>
    </div>
  );
}

export function ProfileView({ data }: { data: ProfileViewData }) {
  const main = data.photos[0];
  const rest = data.photos.slice(1);
  const answeredPrompts = PROFILE_PROMPTS.filter((p) => data.prompts[p.key]?.trim());

  return (
    <div className="overflow-hidden spec-plate">
      <div className="relative aspect-[4/5] bg-steel-900">
        {main ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={main} alt={data.firstName ?? ""} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-steel-600">No photo yet</div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-3xl uppercase tracking-stamp text-bone">
              {data.firstName} {data.age ? `· ${data.age}` : ""}
            </h2>
            {data.verified && (
              <span className="rounded bg-amber/20 px-1.5 py-0.5 text-xs font-bold text-amber">
                VERIFIED
              </span>
            )}
          </div>
          <p className="text-sm text-steel-300">
            {[data.jobTitle || data.tradeCategory, data.location].filter(Boolean).join("  ·  ")}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-steel-800 p-4">
        {data.relationshipIntent && (
          <Spec k="Looking for" v={INTENT_LABEL[data.relationshipIntent] ?? data.relationshipIntent} />
        )}
        {data.tradeCategory && <Spec k="Trade" v={data.tradeCategory} />}
        {data.jobTitle && <Spec k="Job title" v={data.jobTitle} />}
        {data.yearsInTrade != null && <Spec k="Years in trade" v={String(data.yearsInTrade)} />}
        {data.shiftType && <Spec k="Shift" v={titleCase(data.shiftType)} />}
        {data.unionStatus && <Spec k="Union" v={titleCase(data.unionStatus)} />}
        {data.workSchedule && <Spec k="Schedule" v={data.workSchedule} />}
        <Spec k="Travels for work" v={data.travelForWork ? "Yes" : "No"} />
        <Spec k="Blue-collar" v={data.isBlueCollarWorker ? "Yes" : "Open to it"} />
      </dl>

      {data.bio && (
        <div className="border-t border-steel-800 p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-stamp text-steel-500">About</div>
          <p className="text-sm text-steel-300">{data.bio}</p>
        </div>
      )}

      {answeredPrompts.length > 0 && (
        <div className="space-y-3 border-t border-steel-800 p-4">
          {answeredPrompts.map((p) => (
            <div key={p.key}>
              <div className="text-xs font-semibold uppercase tracking-stamp text-orange">{p.label}</div>
              <p className="mt-0.5 text-sm text-bone">{data.prompts[p.key]}</p>
            </div>
          ))}
        </div>
      )}

      {(data.hobbies || data.weekendLifestyle || data.lookingFor) && (
        <dl className="space-y-3 border-t border-steel-800 p-4">
          {data.hobbies && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-stamp text-steel-500">Hobbies</div>
              <p className="text-sm text-steel-300">{data.hobbies}</p>
            </div>
          )}
          {data.weekendLifestyle && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-stamp text-steel-500">Weekends</div>
              <p className="text-sm text-steel-300">{data.weekendLifestyle}</p>
            </div>
          )}
          {data.lookingFor && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-stamp text-steel-500">Looking for</div>
              <p className="text-sm text-steel-300">{data.lookingFor}</p>
            </div>
          )}
        </dl>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-1 border-t border-steel-800 p-1">
          {rest.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="aspect-square w-full rounded object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}

export function toProfileView(u: {
  firstName: string | null;
  birthDate: Date | string | null;
  location: string | null;
  bio: string | null;
  jobTitle: string | null;
  tradeCategory: string | null;
  yearsInTrade: number | null;
  unionStatus: string | null;
  shiftType: string | null;
  workSchedule: string | null;
  relationshipIntent: string | null;
  isBlueCollarWorker: boolean;
  travelForWork: boolean;
  hobbies: string | null;
  weekendLifestyle: string | null;
  lookingFor: string | null;
  verificationStatus: string;
  photos: { imageUrl: string; moderationStatus: string }[];
  promptTrade: string | null;
  promptWhyWorkHard: string | null;
  promptBestPart: string | null;
  promptHardestSchedule: string | null;
  promptIdealWeekend: string | null;
  promptProudSkill: string | null;
  promptMisunderstood: string | null;
  promptRelaxAfterWork: string | null;
}): ProfileViewData {
  const age = u.birthDate
    ? Math.floor((Date.now() - new Date(u.birthDate).getTime()) / (365.25 * 864e5))
    : null;
  return {
    firstName: u.firstName,
    age,
    location: u.location,
    bio: u.bio,
    jobTitle: u.jobTitle,
    tradeCategory: u.tradeCategory,
    yearsInTrade: u.yearsInTrade,
    unionStatus: u.unionStatus,
    shiftType: u.shiftType,
    workSchedule: u.workSchedule,
    relationshipIntent: u.relationshipIntent,
    isBlueCollarWorker: u.isBlueCollarWorker,
    travelForWork: u.travelForWork,
    hobbies: u.hobbies,
    weekendLifestyle: u.weekendLifestyle,
    lookingFor: u.lookingFor,
    verified: u.verificationStatus === "VERIFIED",
    photos: u.photos.filter((p) => p.moderationStatus !== "REJECTED").map((p) => p.imageUrl),
    prompts: {
      promptTrade: u.promptTrade,
      promptWhyWorkHard: u.promptWhyWorkHard,
      promptBestPart: u.promptBestPart,
      promptHardestSchedule: u.promptHardestSchedule,
      promptIdealWeekend: u.promptIdealWeekend,
      promptProudSkill: u.promptProudSkill,
      promptMisunderstood: u.promptMisunderstood,
      promptRelaxAfterWork: u.promptRelaxAfterWork,
    },
  };
}
