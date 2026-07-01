import Link from "next/link";
import { ButtonLink } from "./ui";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/safety", label: "Safety" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-steel-800 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="stamp text-lg text-bone">
            BlueCollar<span className="text-orange"> Match</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-steel-400 hover:text-bone">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden px-3 text-sm text-steel-400 hover:text-bone sm:block">
            Log in
          </Link>
          <ButtonLink href="/signup" size="sm">
            Join
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="6" fill="#141D2A" stroke="#2A3849" />
      {/* hard hat silhouette in safety orange */}
      <path
        d="M7 20a9 9 0 0118 0v1H7v-1z"
        fill="#F2581B"
      />
      <rect x="14.5" y="8" width="3" height="5" rx="1.2" fill="#F2581B" />
      <rect x="6" y="21" width="20" height="2.4" rx="1.2" fill="#E0A93B" />
    </svg>
  );
}
