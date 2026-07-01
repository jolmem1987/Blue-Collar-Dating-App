import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ButtonLink, Stamp } from "@/components/ui";
import { TRADE_CATEGORIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      {/* HERO — the thesis is a stamped membership plate */}
      <section className="relative overflow-hidden border-b border-steel-800">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(242,88,27,0.10),transparent)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-steel-700 bg-steel-900 px-3 py-1 text-xs uppercase tracking-stamp text-amber">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" /> Verified worker dating
            </div>
            <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-stamp text-bone sm:text-6xl">
              Dating for people who{" "}
              <span className="text-orange">work hard</span> and love harder.
            </h1>
            <p className="mt-6 max-w-md text-lg text-steel-400">
              Meet blue-collar singles and the people who appreciate them. Built around real
              schedules, real skills, and real-life compatibility — not swiping for sport.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/signup" size="lg">
                Join BlueCollar Match
              </ButtonLink>
              <ButtonLink href="/how-it-works" size="lg" variant="steel">
                See how it works
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm text-steel-500">
              18+ only · Photo & profile review · Block and report on every profile.
            </p>
          </div>

          {/* Spec plate — signature element */}
          <div className="spec-plate relative mx-auto w-full max-w-sm p-1">
            <div className="rounded-[7px] border border-steel-700 bg-ink p-6">
              <div className="flex items-center justify-between border-b border-steel-800 pb-3">
                <Stamp className="text-sm text-steel-400">Member Plate</Stamp>
                <span className="rounded bg-amber/15 px-2 py-0.5 text-xs font-semibold text-amber">
                  VERIFIED
                </span>
              </div>
              <dl className="mt-4 space-y-3">
                {[
                  ["NAME", "Dani R."],
                  ["TRADE", "Industrial Maintenance"],
                  ["YEARS IN TRADE", "08"],
                  ["SHIFT", "Rotating / Nights"],
                  ["LOOKING FOR", "Serious relationship"],
                  ["UNION", "IBEW · Local 9"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <dt className="spec-row text-steel-500">{k}</dt>
                    <dd className="spec-row text-right text-bone">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 h-2 w-full rounded bg-hazard opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* POSITIONING strip */}
      <section className="border-b border-steel-800 bg-steel-950">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <p className="font-display text-2xl uppercase tracking-stamp text-bone sm:text-3xl">
            “Dating for blue-collar singles and the people who appreciate them.”
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-steel-400">
            Built for tradespeople, industrial workers, mechanics, truck drivers, farmers,
            construction workers — and anyone who respects the hands-on lifestyle.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS — a real sequence, so numbering is earned */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Stamp className="text-sm text-orange">How it works</Stamp>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            ["01", "Build your plate", "Add your trade, schedule, and photos. Profile prompts made for working people, not influencers."],
            ["02", "Browse on your terms", "Filter by trade, distance, intent, and verified status. Like or pass with one thumb."],
            ["03", "Match, then talk", "Messaging unlocks only when you both like each other. Block or report anytime."],
          ].map(([n, t, d]) => (
            <div key={n} className="spec-plate p-6">
              <div className="font-mono text-3xl text-orange">{n}</div>
              <h3 className="mt-3 font-display text-xl uppercase tracking-stamp text-bone">{t}</h3>
              <p className="mt-2 text-sm text-steel-400">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAFETY — front and center, especially for women */}
      <section className="border-y border-steel-800 bg-steel-950">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Stamp className="text-sm text-amber">Built to feel safe</Stamp>
            <h2 className="mt-4 font-display text-3xl uppercase tracking-stamp text-bone">
              Respect is the standard here
            </h2>
            <p className="mt-4 max-w-xl text-steel-400">
              This isn&apos;t a hookup app. Every profile has block and report one tap away. Photos
              and reports are reviewed. We&apos;ll never ask you for banking info — and neither
              should anyone you meet here.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/safety" variant="steel">Safety tips</ButtonLink>
              <ButtonLink href="/community-guidelines" variant="ghost">Community guidelines</ButtonLink>
            </div>
          </div>
          <ul className="grid gap-3">
            {[
              "Messaging only between mutual matches",
              "Block & report on every card and chat",
              "Photo and report moderation by admins",
              "Money-request scam warnings built in",
              "Pause or delete your account anytime",
            ].map((s) => (
              <li key={s} className="spec-plate flex items-center gap-3 p-4 text-sm text-bone">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-orange/15 text-orange">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TRADES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Stamp className="text-sm text-orange">Every trade welcome</Stamp>
        <div className="mt-6 flex flex-wrap gap-2">
          {TRADE_CATEGORIES.filter((t) => t !== "Other").map((t) => (
            <span
              key={t}
              className="rounded-full border border-steel-700 bg-steel-900 px-3 py-1.5 text-sm text-steel-300"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="border-t border-steel-800">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h2 className="font-display text-4xl uppercase tracking-stamp text-bone sm:text-5xl">
            Your people are clocking out right now.
          </h2>
          <p className="mt-4 text-steel-400">Free to join. Build your plate in a few minutes.</p>
          <div className="mt-8 flex justify-center gap-3">
            <ButtonLink href="/signup" size="lg">Join BlueCollar Match</ButtonLink>
            <Link href="/login" className="grid place-items-center px-4 text-steel-400 hover:text-bone">
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
