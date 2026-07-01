import { PublicPage } from "@/components/PublicPage";
import { ButtonLink } from "@/components/ui";

export const metadata = { title: "How it works — BlueCollar Match" };

const STEPS = [
  {
    n: "01",
    title: "Build your plate",
    body: "Sign up, verify you're 18+, and create your profile. Add your trade, schedule, photos, and answer a few blue-collar prompts that actually say something about you.",
  },
  {
    n: "02",
    title: "Browse the yard",
    body: "Discover shows you real, compatible people one profile at a time. Like the ones you're interested in, pass on the ones you're not. Filter by trade, distance, intent, and more.",
  },
  {
    n: "03",
    title: "Match & message",
    body: "When two people like each other, it's a match. Only matched people can message — no cold DMs, no spam. Talk on your schedule, meet when you're ready.",
  },
];

export default function HowItWorksPage() {
  return (
    <PublicPage
      eyebrow="How it works"
      title="Three steps, no games"
      intro="We kept it simple so you can spend less time swiping and more time meeting the right person."
    >
      <div className="space-y-4">
        {STEPS.map((s) => (
          <div key={s.n} className="flex gap-4 rounded-plate border border-steel-800 bg-steel-900 p-5">
            <div className="font-mono text-2xl text-orange">{s.n}</div>
            <div>
              <h3 className="font-display text-xl uppercase tracking-stamp text-bone">{s.title}</h3>
              <p className="mt-1 text-steel-300">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-plate border border-amber/30 bg-amber/5 p-5 text-amber">
        Safety is built in: report or block anyone, anytime. Our team reviews every report. Never
        send money or banking info to anyone you meet here.
      </div>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/signup" size="lg">Join BlueCollar Match</ButtonLink>
        <ButtonLink href="/safety" variant="steel" size="lg">Read safety tips</ButtonLink>
      </div>
    </PublicPage>
  );
}
