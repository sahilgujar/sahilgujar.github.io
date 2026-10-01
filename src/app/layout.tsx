import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { profile, skills } from "@/data/resume";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

const description =
  "Sahil Gujar, Frontend Engineer with 5 years of experience building real-time trading, Web3, live-streaming and SaaS products with React, Next.js and TypeScript.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: `${profile.name} — ${profile.title}`,
  description,
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: "React · Next.js · TypeScript · Web3 · Real-time apps. 2,700+ commits shipped across 10 production products.",
    url: profile.url,
    type: "profile",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  email: `mailto:${profile.email}`,
  url: profile.url,
  address: { "@type": "PostalAddress", addressRegion: "Maharashtra", addressCountry: "IN" },
  sameAs: [profile.github, profile.linkedin, profile.codewars],
  knowsAbout: skills.find((g) => g.core)?.items,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script flags JS as available before first paint, so the hero can start hidden
    // and animate in without a flash. Without JS, nothing is ever hidden.
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans text-base leading-relaxed">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
