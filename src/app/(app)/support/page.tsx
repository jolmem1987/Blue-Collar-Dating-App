import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Stamp } from "@/components/ui";

export const dynamic = "force-dynamic";

const FAQ = [
  {
    q: "How do matches work?",
    a: "When you like someone and they like you back, it's a match. You can only message people you've matched with.",
  },
  {
    q: "How do I stay safe?",
    a: "Keep conversations on the app until you trust someone. Never send money or banking info. Use Report and Block on anyone who makes you uncomfortable — see our Safety Tips for more.",
  },
  {
    q: "Someone is harassing me. What do I do?",
    a: "Open their profile or your chat, tap Report, and choose a reason. You can also Block them so they can never contact you again. Our team reviews every report.",
  },
  {
    q: "How do I get verified?",
    a: "Profile verification is rolling out soon. Verified members get a badge and show up higher in Discover.",
  },
  {
    q: "How do I pause or delete my account?",
    a: "Go to Settings. Pausing hides you from Discover; deleting permanently removes your profile, photos, and matches.",
  },
];

export default async function SupportPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="px-4 pt-8">
      <Stamp className="text-sm text-orange">Support</Stamp>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-stamp text-bone">
        How can we help?
      </h1>

      <div className="mt-5 space-y-3">
        {FAQ.map((f) => (
          <details key={f.q} className="rounded-plate border border-steel-800 bg-steel-900 p-4">
            <summary className="cursor-pointer text-bone">{f.q}</summary>
            <p className="mt-2 text-sm text-steel-400">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-6 rounded-plate border border-steel-800 bg-steel-900 p-5">
        <div className="text-bone">Still need help?</div>
        <p className="mt-1 text-sm text-steel-400">
          Email our team at{" "}
          <a href="mailto:support@bluecollarmatch.app" className="text-orange hover:underline">
            support@bluecollarmatch.app
          </a>{" "}
          and we&apos;ll get back to you.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 pb-4 text-sm text-steel-400">
        <Link href="/safety" className="hover:text-bone">Safety tips</Link>
        <Link href="/community-guidelines" className="hover:text-bone">Community guidelines</Link>
        <Link href="/terms" className="hover:text-bone">Terms</Link>
        <Link href="/privacy" className="hover:text-bone">Privacy</Link>
      </div>
    </div>
  );
}
