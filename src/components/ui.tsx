import { cn } from "@/lib/utils";
import Link from "next/link";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "steel" | "danger";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary: "bg-orange text-white hover:bg-orange-600 border border-orange-600",
  steel: "bg-steel-800 text-bone hover:bg-steel-700 border border-steel-700",
  ghost: "bg-transparent text-steel-400 hover:text-bone border border-transparent",
  danger: "bg-transparent text-red-400 hover:bg-red-500/10 border border-red-500/40",
};
const sizes = { sm: "h-9 px-3 text-sm", md: "h-11 px-5", lg: "h-14 px-7 text-lg" };

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-plate font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-plate font-medium transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </Link>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-plate border border-steel-700 bg-steel-900 px-4 py-3 text-bone placeholder:text-steel-500 focus:border-orange focus:outline-none",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-plate border border-steel-700 bg-steel-900 px-4 py-3 text-bone placeholder:text-steel-500 focus:border-orange focus:outline-none",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-plate border border-steel-700 bg-steel-900 px-4 py-3 text-bone focus:border-orange focus:outline-none",
        props.className
      )}
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium uppercase tracking-stamp text-steel-400">
      {children}
    </label>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber/15 px-2 py-0.5 text-xs font-semibold text-amber">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2l2.4 1.8 3 .3 1 2.8 2.2 2-.9 2.9.9 2.9-2.2 2-1 2.8-3 .3L12 22l-2.4-1.8-3-.3-1-2.8-2.2-2 .9-2.9-.9-2.9 2.2-2 1-2.8 3-.3L12 2zm-1.2 13.4l5-5-1.4-1.4-3.6 3.6-1.6-1.6-1.4 1.4 3 3z" />
      </svg>
      Verified
    </span>
  );
}

export function Stamp({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("stamp", className)}>{children}</span>;
}
