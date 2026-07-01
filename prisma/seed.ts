/**
 * BlueCollar Match — DEVELOPMENT SEED DATA
 * ----------------------------------------------------------------------------
 * ⚠️  THIS IS TEST DATA ONLY. Do not run against a production database.
 *
 * Creates:
 *   - 1 admin account
 *   - 12 demo members across various trades (with photos)
 *   - A handful of likes + a couple of pre-made matches with messages
 *
 * All demo accounts share the password below so you can log in and click around.
 * Run with:  npm run db:seed
 * ----------------------------------------------------------------------------
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Every seeded account uses this password. CHANGE / REMOVE before production.
const DEMO_PASSWORD = "password123";

// Royalty-free Unsplash portraits for demo profiles only.
const PHOTO = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

function orderPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

// Roughly clustered around the Upper Midwest so distance filtering has signal.
type Demo = {
  email: string;
  firstName: string;
  gender: "MAN" | "WOMAN" | "NONBINARY";
  interestedIn: "MEN" | "WOMEN" | "EVERYONE";
  birthYear: number;
  trade: string;
  jobTitle: string;
  years: number;
  shift: "DAY" | "NIGHT" | "SWING" | "ROTATING" | "ON_CALL" | "VARIES";
  union: "UNION" | "NON_UNION" | "PREFER_NOT_TO_SAY";
  intent: "SERIOUS" | "DATING" | "FRIENDSHIP_FIRST" | "NOT_SURE";
  isBlueCollar: boolean;
  bcPref: "BLUE_COLLAR_ONLY" | "OPEN";
  location: string;
  lat: number;
  lng: number;
  verified: boolean;
  photo: string;
  bio: string;
  promptTrade: string;
  promptBestPart: string;
  promptIdealWeekend: string;
  promptProudSkill: string;
};

const DEMOS: Demo[] = [
  {
    email: "mike.welder@example.com", firstName: "Mike", gender: "MAN", interestedIn: "WOMEN",
    birthYear: 1990, trade: "Welding", jobTitle: "Structural Welder", years: 12, shift: "DAY",
    union: "UNION", intent: "SERIOUS", isBlueCollar: true, bcPref: "OPEN",
    location: "Milwaukee, WI", lat: 43.0389, lng: -87.9065, verified: true,
    photo: PHOTO("photo-1500648767791-00dcc994a43e"),
    bio: "Welder by trade, smoker (the BBQ kind) by hobby. Looking for someone real.",
    promptTrade: "Structural and pipe welding — mostly bridges and big steel.",
    promptBestPart: "Standing back at the end of a job and seeing something that'll outlast me.",
    promptIdealWeekend: "Smoking a brisket, a couple cold ones, and a long ride on the Harley.",
    promptProudSkill: "I can lay a bead you could frame.",
  },
  {
    email: "sara.nurse@example.com", firstName: "Sara", gender: "WOMAN", interestedIn: "MEN",
    birthYear: 1993, trade: "Other", jobTitle: "ER Nurse", years: 8, shift: "ROTATING",
    union: "NON_UNION", intent: "SERIOUS", isBlueCollar: false, bcPref: "BLUE_COLLAR_ONLY",
    location: "Madison, WI", lat: 43.0731, lng: -89.4012, verified: true,
    photo: PHOTO("photo-1494790108377-be9c29b29330"),
    bio: "ER nurse who works weird hours and appreciates someone who works hard too.",
    promptTrade: "Not a trade, but 12-hour shifts on my feet — I get the grind.",
    promptBestPart: "Helping someone on the worst day of their life.",
    promptIdealWeekend: "Farmers market, a hike, and absolutely nothing on a schedule.",
    promptProudSkill: "I can stay calm when everything's on fire.",
  },
  {
    email: "dave.diesel@example.com", firstName: "Dave", gender: "MAN", interestedIn: "WOMEN",
    birthYear: 1988, trade: "Diesel Mechanic", jobTitle: "Fleet Diesel Tech", years: 15, shift: "DAY",
    union: "NON_UNION", intent: "DATING", isBlueCollar: true, bcPref: "OPEN",
    location: "Rockford, IL", lat: 42.2711, lng: -89.0940, verified: false,
    photo: PHOTO("photo-1507003211169-0a1dd7228f2d"),
    bio: "If it's got an engine, I can fix it. Dog dad. Bad at texting, good at showing up.",
    promptTrade: "Heavy-duty diesel — semis, equipment, anything that hauls.",
    promptBestPart: "Cracking a problem three other guys gave up on.",
    promptIdealWeekend: "Garage time, my dog, and a fish fry on Friday.",
    promptProudSkill: "Diagnosing a knock by ear before I even pop the hood.",
  },
  {
    email: "ashley.electric@example.com", firstName: "Ashley", gender: "WOMAN", interestedIn: "EVERYONE",
    birthYear: 1995, trade: "Electrical", jobTitle: "Journeyman Electrician", years: 7, shift: "DAY",
    union: "UNION", intent: "SERIOUS", isBlueCollar: true, bcPref: "OPEN",
    location: "Chicago, IL", lat: 41.8781, lng: -87.6298, verified: true,
    photo: PHOTO("photo-1438761681033-6461ffad8d80"),
    bio: "IBEW electrician. Yes, I own more tools than you. Looking for a teammate.",
    promptTrade: "Commercial electrical — conduit, panels, the whole nine.",
    promptBestPart: "Flipping the breaker and watching a whole building come to life.",
    promptIdealWeekend: "Concert, good tacos, and sleeping in past 5 a.m. for once.",
    promptProudSkill: "I can bend perfect conduit offsets in my sleep.",
  },
  {
    email: "tom.trucker@example.com", firstName: "Tom", gender: "MAN", interestedIn: "WOMEN",
    birthYear: 1985, trade: "Trucking", jobTitle: "Regional CDL Driver", years: 18, shift: "VARIES",
    union: "NON_UNION", intent: "SERIOUS", isBlueCollar: true, bcPref: "OPEN",
    location: "Green Bay, WI", lat: 44.5133, lng: -88.0133, verified: false,
    photo: PHOTO("photo-1463453091185-61582044d556"),
    bio: "Regional routes so I'm home most weekends. Steady, honest, ready to settle down.",
    promptTrade: "Regional freight — I keep the Midwest stocked.",
    promptBestPart: "Sunrise over an empty highway with good coffee.",
    promptIdealWeekend: "Home cooking, a movie on the couch, no truck stop food.",
    promptProudSkill: "Backing a 53-footer into a spot with an inch to spare.",
  },
  {
    email: "maria.hvac@example.com", firstName: "Maria", gender: "WOMAN", interestedIn: "MEN",
    birthYear: 1991, trade: "HVAC", jobTitle: "HVAC Service Tech", years: 9, shift: "ON_CALL",
    union: "NON_UNION", intent: "DATING", isBlueCollar: true, bcPref: "OPEN",
    location: "Milwaukee, WI", lat: 43.0450, lng: -87.9200, verified: true,
    photo: PHOTO("photo-1544005313-94ddf0286df2"),
    bio: "I keep people warm in winter and cool in summer. Looking for warmth year-round.",
    promptTrade: "Residential and light commercial HVAC service.",
    promptBestPart: "Fixing someone's heat in January and seeing the relief on their face.",
    promptIdealWeekend: "Brunch, a long walk by the lake, and a good book.",
    promptProudSkill: "I can troubleshoot a system faster than the manual.",
  },
  {
    email: "carl.carpenter@example.com", firstName: "Carl", gender: "MAN", interestedIn: "WOMEN",
    birthYear: 1987, trade: "Carpentry", jobTitle: "Finish Carpenter", years: 14, shift: "DAY",
    union: "NON_UNION", intent: "SERIOUS", isBlueCollar: true, bcPref: "OPEN",
    location: "Madison, WI", lat: 43.0850, lng: -89.3900, verified: false,
    photo: PHOTO("photo-1492562080023-ab3db95bfbce"),
    bio: "I build things that last and I'm hoping to build something lasting with someone.",
    promptTrade: "Finish carpentry — trim, cabinets, built-ins, the detail work.",
    promptBestPart: "Turning a pile of lumber into something a family lives in.",
    promptIdealWeekend: "Woodshop project, farmers market, bonfire at night.",
    promptProudSkill: "Hand-cut dovetails that don't need glue to hold.",
  },
  {
    email: "jen.lineman@example.com", firstName: "Jen", gender: "WOMAN", interestedIn: "MEN",
    birthYear: 1992, trade: "Lineman", jobTitle: "Power Lineworker", years: 6, shift: "ON_CALL",
    union: "UNION", intent: "SERIOUS", isBlueCollar: true, bcPref: "BLUE_COLLAR_ONLY",
    location: "Rockford, IL", lat: 42.2600, lng: -89.0640, verified: true,
    photo: PHOTO("photo-1534528741775-53994a69daeb"),
    bio: "I climb poles in storms so you have lights. Want someone who gets the on-call life.",
    promptTrade: "Distribution lineworker — storms, outages, high voltage.",
    promptBestPart: "Restoring power to a whole neighborhood at 3 a.m.",
    promptIdealWeekend: "Kayaking, camping, anything outdoors and off the grid.",
    promptProudSkill: "I'm not afraid of heights or hard weather.",
  },
  {
    email: "luis.plumber@example.com", firstName: "Luis", gender: "MAN", interestedIn: "WOMEN",
    birthYear: 1989, trade: "Plumbing", jobTitle: "Master Plumber", years: 13, shift: "DAY",
    union: "NON_UNION", intent: "DATING", isBlueCollar: true, bcPref: "OPEN",
    location: "Chicago, IL", lat: 41.8500, lng: -87.6500, verified: false,
    photo: PHOTO("photo-1519085360753-af0119f7cbe7"),
    bio: "Master plumber, decent cook, great with my hands. Family-oriented.",
    promptTrade: "Residential and commercial plumbing — new builds and repairs.",
    promptBestPart: "Being the guy people are genuinely relieved to see.",
    promptIdealWeekend: "Cooking a big Sunday dinner for people I care about.",
    promptProudSkill: "I can sweat a copper joint that'll never leak.",
  },
  {
    email: "beth.farmer@example.com", firstName: "Beth", gender: "WOMAN", interestedIn: "MEN",
    birthYear: 1990, trade: "Farming/Agriculture", jobTitle: "Dairy Farmer", years: 16, shift: "VARIES",
    union: "PREFER_NOT_TO_SAY", intent: "SERIOUS", isBlueCollar: true, bcPref: "OPEN",
    location: "Green Bay, WI", lat: 44.4900, lng: -88.0400, verified: true,
    photo: PHOTO("photo-1502823403499-6ccfcf4fb453"),
    bio: "Up before the sun, running the family dairy. Looking for my partner in everything.",
    promptTrade: "Fourth-generation dairy farmer — cows don't take days off.",
    promptBestPart: "Sunrise over the fields and knowing it's all ours.",
    promptIdealWeekend: "There's no weekend on a farm, but I'll make time for the right person.",
    promptProudSkill: "I can fix a tractor and deliver a calf before breakfast.",
  },
  {
    email: "ryan.hvac@example.com", firstName: "Ryan", gender: "MAN", interestedIn: "EVERYONE",
    birthYear: 1994, trade: "Industrial Maintenance", jobTitle: "Maintenance Tech", years: 6, shift: "NIGHT",
    union: "NON_UNION", intent: "FRIENDSHIP_FIRST", isBlueCollar: true, bcPref: "OPEN",
    location: "Milwaukee, WI", lat: 43.0600, lng: -87.9400, verified: false,
    photo: PHOTO("photo-1506794778202-cad84cf45f1d"),
    bio: "Night-shift maintenance at a plant. Quiet, dependable, into hiking and dogs.",
    promptTrade: "Industrial maintenance — I keep the line running.",
    promptBestPart: "Fixing the thing that was about to shut down the whole shift.",
    promptIdealWeekend: "Trail with the dog, then catching up on sleep.",
    promptProudSkill: "Troubleshooting PLCs and hydraulics under pressure.",
  },
  {
    email: "nina.cnc@example.com", firstName: "Nina", gender: "WOMAN", interestedIn: "EVERYONE",
    birthYear: 1996, trade: "CNC/Machining", jobTitle: "CNC Machinist", years: 5, shift: "SWING",
    union: "NON_UNION", intent: "DATING", isBlueCollar: true, bcPref: "OPEN",
    location: "Madison, WI", lat: 43.0700, lng: -89.4100, verified: true,
    photo: PHOTO("photo-1531123897727-8f129e1688ce"),
    bio: "I make parts to the thousandth of an inch. Precise at work, easygoing off the clock.",
    promptTrade: "CNC machining — mills, lathes, tight tolerances.",
    promptBestPart: "Holding a finished part that's perfect down to the spec.",
    promptIdealWeekend: "Rock climbing, thrifting, and good coffee.",
    promptProudSkill: "Programming a complex part and nailing it first run.",
  },
];

async function main() {
  console.log("🌱 Seeding DEV data (test only)…");
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  // --- Admin ---
  const admin = await prisma.user.upsert({
    where: { email: "admin@bluecollarmatch.app" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@bluecollarmatch.app",
      passwordHash,
      role: "ADMIN",
      firstName: "Admin",
      emailVerified: new Date(),
      onboardingComplete: true,
      agreedToTerms: true,
      birthDate: new Date("1990-01-01"),
      accountStatus: "ACTIVE",
      subscription: { create: { plan: "FREE", status: "NONE" } },
    },
  });
  console.log(`   ✓ admin: ${admin.email} / ${DEMO_PASSWORD}`);

  // --- Demo members ---
  const created: { id: string; email: string }[] = [];
  for (const d of DEMOS) {
    const user = await prisma.user.upsert({
      where: { email: d.email },
      update: {},
      create: {
        email: d.email,
        passwordHash,
        firstName: d.firstName,
        gender: d.gender,
        interestedIn: d.interestedIn,
        birthDate: new Date(`${d.birthYear}-06-15`),
        relationshipIntent: d.intent,
        blueCollarPreference: d.bcPref,
        isBlueCollarWorker: d.isBlueCollar,
        workerCategory: d.isBlueCollar ? "TRADE" : "NOT_BLUE_COLLAR_INTERESTED",
        tradeCategory: d.trade,
        jobTitle: d.jobTitle,
        yearsInTrade: d.years,
        shiftType: d.shift,
        unionStatus: d.union,
        location: d.location,
        latitude: d.lat,
        longitude: d.lng,
        bio: d.bio,
        promptTrade: d.promptTrade,
        promptBestPart: d.promptBestPart,
        promptIdealWeekend: d.promptIdealWeekend,
        promptProudSkill: d.promptProudSkill,
        emailVerified: new Date(),
        onboardingComplete: true,
        agreedToTerms: true,
        verificationStatus: d.verified ? "VERIFIED" : "UNVERIFIED",
        accountStatus: "ACTIVE",
        minAgePref: 25,
        maxAgePref: 45,
        maxDistanceMiles: 200,
        photos: {
          create: [{ imageUrl: d.photo, order: 0, isPrimary: true, moderationStatus: "APPROVED" }],
        },
        subscription: { create: { plan: "FREE", status: "NONE" } },
      },
    });
    created.push({ id: user.id, email: user.email });
  }
  console.log(`   ✓ ${created.length} demo members created`);

  // --- Likes + matches (idempotent-ish; safe to re-run) ---
  const byEmail = (e: string) => created.find((u) => u.email === e)!;

  // Mutual likes -> matches
  const mutualPairs: [string, string][] = [
    ["mike.welder@example.com", "sara.nurse@example.com"],
    ["dave.diesel@example.com", "maria.hvac@example.com"],
    ["tom.trucker@example.com", "beth.farmer@example.com"],
  ];

  for (const [aEmail, bEmail] of mutualPairs) {
    const a = byEmail(aEmail);
    const b = byEmail(bEmail);
    await prisma.like.upsert({
      where: { senderId_receiverId: { senderId: a.id, receiverId: b.id } },
      update: {}, create: { senderId: a.id, receiverId: b.id },
    });
    await prisma.like.upsert({
      where: { senderId_receiverId: { senderId: b.id, receiverId: a.id } },
      update: {}, create: { senderId: b.id, receiverId: a.id },
    });
    const [uA, uB] = orderPair(a.id, b.id);
    const match = await prisma.match.upsert({
      where: { userAId_userBId: { userAId: uA, userBId: uB } },
      update: {}, create: { userAId: uA, userBId: uB },
    });
    // A couple of starter messages on the first match
    const count = await prisma.message.count({ where: { matchId: match.id } });
    if (count === 0) {
      await prisma.message.create({
        data: { matchId: match.id, senderId: a.id, body: "Hey! Saw we matched — how's your week going?" },
      });
      await prisma.message.create({
        data: { matchId: match.id, senderId: b.id, body: "Good! Long shifts but good. You?" },
      });
    }
  }

  // One-directional likes (pending — show up as "liked you" later)
  const oneWay: [string, string][] = [
    ["ashley.electric@example.com", "mike.welder@example.com"],
    ["luis.plumber@example.com", "sara.nurse@example.com"],
    ["nina.cnc@example.com", "ryan.hvac@example.com"],
  ];
  for (const [aEmail, bEmail] of oneWay) {
    const a = byEmail(aEmail);
    const b = byEmail(bEmail);
    await prisma.like.upsert({
      where: { senderId_receiverId: { senderId: a.id, receiverId: b.id } },
      update: {}, create: { senderId: a.id, receiverId: b.id },
    });
  }

  console.log("   ✓ likes + 3 matches (with sample messages) created");
  console.log("✅ Seed complete.");
  console.log(`\n   Log in with any demo email above, password: ${DEMO_PASSWORD}`);
  console.log("   Admin console: admin@bluecollarmatch.app\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
