"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { profile } from "@/data/resume";
import { GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon } from "./Icons";
import { Magnetic } from "./Magnetic";

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".cta-title", {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 110,
              duration: 1,
              ease: "power4.out",
              stagger: 0.05,
              scrollTrigger: { trigger: ".cta-title", start: "top 85%", once: true },
            }),
        });
        gsap.from(".cta-item", {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".cta-title", start: "top 80%", once: true },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  const links = [
    { href: `mailto:${profile.email}`, label: profile.email, icon: <MailIcon />, primary: true },
    { href: profile.linkedin, label: "LinkedIn", icon: <LinkedInIcon />, external: true },
    { href: profile.github, label: "GitHub", icon: <GitHubIcon />, external: true },
    { href: profile.phoneHref, label: profile.phone, icon: <PhoneIcon /> },
  ];

  return (
    <footer ref={root} id="contact" className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="no-print pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full bg-accent opacity-15 blur-3xl"
      />
      <div className="relative mx-auto max-w-[1040px] px-5 pb-12 pt-24 sm:pt-32">
        <p className="cta-item mb-5 font-mono text-[13px] text-accent">Open to frontend / full-stack roles</p>
        <h2 className="cta-title m-0 max-w-[820px] text-[clamp(40px,7vw,84px)] font-bold leading-[1.02] tracking-[-0.045em]">
          Let&apos;s build something that feels instant.
        </h2>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {links.map((l) => (
            <Magnetic key={l.label}>
              <a
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener" : undefined}
                className={`cta-item inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors hover:no-underline ${
                  l.primary
                    ? "border-accent bg-accent text-white hover:bg-accent/90"
                    : "border-line bg-surface text-text hover:border-accent"
                }`}
              >
                {l.icon}
                {l.label}
              </a>
            </Magnetic>
          ))}
        </div>

        <div className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[13px] text-muted">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </span>
          <span className="no-print">Built with Next.js, GSAP &amp; Tailwind · Print (⌘/Ctrl + P) for a PDF resume</span>
        </div>
      </div>
    </footer>
  );
}
