import Link from "next/link";
import { Logo } from "@/components/SiteHeader";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <Logo />
          <span className="stamp text-lg text-bone">
            BlueCollar<span className="text-orange"> Match</span>
          </span>
        </Link>
        <div className="spec-plate p-7">
          <h1 className="font-display text-2xl uppercase tracking-stamp text-bone">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-steel-400">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
