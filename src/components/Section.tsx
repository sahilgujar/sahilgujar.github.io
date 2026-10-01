"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, SCRAMBLE_CHARS, useGSAP } from "@/lib/gsap";

/** Section label: the accent rule draws in, then the text decodes like a terminal readout. */
export function SectionTitle({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } })
          .from(".title-rule", { scaleX: 0, duration: 0.6, ease: "power3.inOut" })
          .from(
            ".title-text",
            { duration: 0.9, scrambleText: { text: "", chars: SCRAMBLE_CHARS, speed: 0.6 }, ease: "none" },
            "-=0.3",
          );
      });
    },
    { scope: ref },
  );

  return (
    <h2
      ref={ref}
      className="mb-8 flex items-center gap-3 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-faint"
    >
      <span className="title-rule h-px w-8 origin-left bg-gradient-to-r from-accent to-accent-2" />
      <span className="title-text">{children}</span>
    </h2>
  );
}

export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-line py-16 sm:py-20 print:py-4">
      <SectionTitle>{title}</SectionTitle>
      {children}
    </section>
  );
}
