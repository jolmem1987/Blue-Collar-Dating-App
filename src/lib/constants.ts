// Shared domain constants for BlueCollar Match.
// Single source of truth for trades, prompts, and onboarding options.

export const TRADE_CATEGORIES = [
  "Industrial Maintenance",
  "Construction",
  "Welding",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Automotive",
  "Diesel Mechanic",
  "Trucking",
  "Farming/Agriculture",
  "Manufacturing",
  "CNC/Machining",
  "Heavy Equipment",
  "Roofing",
  "Concrete",
  "Carpentry",
  "Painting",
  "Landscaping",
  "Utility Worker",
  "Lineman",
  "Railroad",
  "Oil/Gas",
  "Warehouse/Logistics",
  "Factory Worker",
  "Machine Operator",
  "Other",
] as const;

export type TradeCategory = (typeof TRADE_CATEGORIES)[number];

// Blue-collar profile prompts. Field key maps to a User column (prompt*).
export const PROFILE_PROMPTS = [
  { key: "promptTrade", label: "My trade is\u2026" },
  { key: "promptWhyWorkHard", label: "I work hard because\u2026" },
  { key: "promptBestPart", label: "The best part of my job is\u2026" },
  { key: "promptHardestSchedule", label: "The hardest part of my schedule is\u2026" },
  { key: "promptIdealWeekend", label: "My ideal weekend is\u2026" },
  { key: "promptProudSkill", label: "A skill I am proud of is\u2026" },
  { key: "promptMisunderstood", label: "Something people misunderstand about my job is\u2026" },
  { key: "promptRelaxAfterWork", label: "My favorite way to relax after work is\u2026" },
] as const;

export const WORKER_CATEGORY_OPTIONS = [
  { value: "TRADE", label: "I work in a blue-collar trade" },
  { value: "MANUFACTURING_MAINTENANCE", label: "I work in manufacturing or industrial maintenance" },
  { value: "TRANSPORTATION_LOGISTICS", label: "I work in transportation or logistics" },
  { value: "AGRICULTURE_OUTDOOR", label: "I work in agriculture or outdoor labor" },
  { value: "NOT_BLUE_COLLAR_INTERESTED", label: "I don't work blue-collar, but I want to date someone who does" },
  { value: "OTHER", label: "Other" },
] as const;

export const INTERESTED_IN_OPTIONS = [
  { value: "MEN", label: "Men" },
  { value: "WOMEN", label: "Women" },
  { value: "EVERYONE", label: "Everyone" },
] as const;

export const RELATIONSHIP_INTENT_OPTIONS = [
  { value: "SERIOUS", label: "Serious relationship" },
  { value: "DATING", label: "Dating" },
  { value: "FRIENDSHIP_FIRST", label: "Friendship first" },
  { value: "NOT_SURE", label: "Not sure yet" },
] as const;

export const BLUE_COLLAR_PREFERENCE_OPTIONS = [
  { value: "BLUE_COLLAR_ONLY", label: "Blue-collar workers only" },
  { value: "OPEN", label: "Open to blue-collar and non-blue-collar" },
] as const;

export const GENDER_OPTIONS = [
  { value: "MAN", label: "Man" },
  { value: "WOMAN", label: "Woman" },
  { value: "NONBINARY", label: "Non-binary" },
  { value: "OTHER", label: "Other" },
] as const;

export const UNION_STATUS_OPTIONS = [
  { value: "UNION", label: "Union" },
  { value: "NON_UNION", label: "Non-union" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
] as const;

export const SHIFT_TYPE_OPTIONS = [
  { value: "DAY", label: "Day shift" },
  { value: "NIGHT", label: "Night shift" },
  { value: "SWING", label: "Swing shift" },
  { value: "ROTATING", label: "Rotating" },
  { value: "ON_CALL", label: "On call" },
  { value: "VARIES", label: "Varies" },
] as const;

export const REPORT_REASON_OPTIONS = [
  { value: "FAKE_PROFILE", label: "Fake or impersonating profile" },
  { value: "HARASSMENT", label: "Harassment or abusive messages" },
  { value: "INAPPROPRIATE_PHOTOS", label: "Inappropriate photos" },
  { value: "SCAM_OR_MONEY_REQUEST", label: "Scam or asking for money" },
  { value: "UNDERAGE", label: "Appears to be under 18" },
  { value: "OFFLINE_BEHAVIOR", label: "Something that happened offline" },
  { value: "OTHER", label: "Other" },
] as const;

// Rate limits (per rolling window)
export const RATE_LIMITS = {
  LIKES_PER_DAY: 100,
  MESSAGES_PER_MINUTE: 10,
  REPORTS_PER_DAY: 20,
} as const;

export const MIN_AGE = 18;
export const MAX_PHOTOS = 6;
