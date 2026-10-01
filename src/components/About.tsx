"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { about } from "@/data/resume";
import { SectionTitle } from "./Section";

/** A large statement whose words light up one by one as you scroll through it. */
export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".about-text", { type: "words", autoSplit: true, onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: ".about-text", start: "top 80%", end: "bottom 50%", scrub: true },
            },
          ),
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="py-20 sm:py-28 print:py-4">
      <SectionTitle>About</SectionTitle>
      <p className="about-text m-0 max-w-[900px] text-[clamp(24px,3.4vw,40px)] font-semibold leading-[1.3] tracking-[-0.025em]">
        {about}
      </p>
    </section>
  );
}
