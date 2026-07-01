import { PublicPage } from "@/components/PublicPage";
import { ButtonLink } from "@/components/ui";

export const metadata = { title: "Pricing — BlueCollar Match" };

const FEATURES = [
  "Create your profile",
  "Browse & match",
  "Message your matches",
  "See who liked you",
  "Unlimited likes",
  "Report & block tools",
];

export default function PricingPage() {
  return (
    <PublicPage
      eyebrow="Pricing"
      title="It's free. All of it."
      intro="BlueCollar Match is completely free. Every feature, no paid tiers, no upgrades, no surprise charges — ever."
    >
      <div className="mx-auto max-w-md">
        <div className="flex flex-col rounded-plate border border-orange bg-orange/5 p-6">
          <div className="font-display text-2xl uppercase tracking-stamp text-bone">Free</div>
          <div className="mt-1">
            <span className="font-mono text-4xl text-bone">$0</span>
            <span className="text-sm text-steel-500"> forever</span>
          </div>
          <p className="mt-1 text-sm text-steel-400">Everything you need to meet people.</p>
          <ul className="mt-4 flex-1 space-y-1.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-steel-300">
                <span className="text-orange">▸</span> {f}
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <ButtonLink href="/signup" variant="primary" className="w-full">
              Get started
            </ButtonLink>
          </div>
        </div>
      </div>
    </PublicPage>
  );
}
