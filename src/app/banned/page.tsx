import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function BannedPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="stamp text-sm text-red-400">Account suspended</div>
        <h1 className="mt-3 font-display text-4xl uppercase tracking-stamp text-bone">
          Your account has been suspended
        </h1>
        <p className="mt-4 text-steel-400">
          This account was suspended for violating our Community Guidelines or Terms of Service.
          If you believe this was a mistake, contact our team and we&apos;ll review it.
        </p>
        <a
          href="mailto:support@bluecollarmatch.app"
          className="mt-6 inline-block rounded-plate border border-steel-700 bg-steel-900 px-5 py-3 text-bone hover:border-steel-600"
        >
          support@bluecollarmatch.app
        </a>
      </main>
      <SiteFooter />
    </>
  );
}
