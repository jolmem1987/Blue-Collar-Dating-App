import type { Metadata } from "next";
import { Saira_Condensed, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const display = Saira_Condensed({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" });

// Resolve a valid base URL for metadata even if NEXTAUTH_URL is missing a
// scheme (e.g. "example.vercel.app") or otherwise malformed — never throw at build.
function resolveBaseUrl(): URL {
  const raw = process.env.NEXTAUTH_URL?.trim();
  const withScheme = raw && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw;
  try {
    return new URL(withScheme || "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  title: "BlueCollar Match — Dating for blue-collar singles and the people who appreciate them",
  description:
    "Meet blue-collar singles and the people who appreciate them. Built for tradespeople, industrial workers, mechanics, truck drivers, farmers, and construction workers.",
  metadataBase: resolveBaseUrl(),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-ink font-sans text-bone antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
