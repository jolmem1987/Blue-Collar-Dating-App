import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Stamp } from "@/components/ui";

export function PublicPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <Stamp className="text-sm text-orange">{eyebrow}</Stamp>
        <h1 className="mt-2 font-display text-4xl uppercase leading-tight tracking-stamp text-bone sm:text-5xl">
          {title}
        </h1>
        {intro && <p className="mt-4 text-lg text-steel-400">{intro}</p>}
        <div className="mt-8 space-y-6">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}

export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl uppercase tracking-stamp text-bone">{heading}</h2>
      <div className="mt-2 space-y-2 text-steel-300">{children}</div>
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-steel-300">{children}</p>;
}

export function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2 text-steel-300">
          <span className="text-orange">▸</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
