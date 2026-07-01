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

export const metadata: Metadata = {
  title: "BlueCollar Match — Dating for blue-collar singles and the people who appreciate them",
  description:
    "Meet blue-collar singles and the people who appreciate them. Built for tradespeople, industrial workers, mechanics, truck drivers, farmers, and construction workers.",
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
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
