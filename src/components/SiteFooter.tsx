import Link from "next/link";

const COLS = [
  {
    title: "Product",
    links: [
      ["/how-it-works", "How it works"],
      ["/pricing", "Pricing"],
      ["/safety", "Safety"],
      ["/about", "About"],
    ],
  },
  {
    title: "Trust & safety",
    links: [
      ["/safety", "Safety tips"],
      ["/community-guidelines", "Community guidelines"],
      ["/terms", "Terms of Service"],
      ["/privacy", "Privacy Policy"],
    ],
  },
  {
    title: "Account",
    links: [
      ["/signup", "Sign up"],
      ["/login", "Log in"],
      ["/support", "Support"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-steel-800 bg-steel-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="stamp text-bone">BlueCollar Match</div>
          <p className="mt-3 max-w-xs text-sm text-steel-500">
            Dating for blue-collar singles and the people who appreciate them.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <div className="mb-3 text-xs font-semibold uppercase tracking-stamp text-steel-500">
              {col.title}
            </div>
            <ul className="space-y-2">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-steel-400 hover:text-bone">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-steel-800 px-4 py-5 text-center text-xs text-steel-600">
        © {new Date().getFullYear()} BlueCollar Match. Be safe. Never send money or banking info to
        someone you haven&apos;t met.
      </div>
    </footer>
  );
}
