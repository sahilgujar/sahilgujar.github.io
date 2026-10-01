"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { skills } from "@/data/resume";
import { Section } from "./Section";

export function Skills() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".skill-row").forEach((row) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 90%", once: true } })
            .from(row.querySelector(".skill-label"), { x: -24, autoAlpha: 0, duration: 0.6, ease: "power3.out" })
            .from(
              row.querySelectorAll(".skill-chip"),
              { y: 14, scale: 0.85, autoAlpha: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.025 },
              "<0.05",
            );
        });
      });
    },
    { scope: root },
  );

  return (
    <Section id="skills" title="Tech stack">
      <div ref={root} className="-mx-3 flex flex-col">
        {skills.map((group) => (
          <div
            key={group.name}
            className="skill-row group grid grid-cols-1 gap-2 rounded-xl px-3 py-3 transition-colors hover:bg-surface sm:grid-cols-[180px_1fr] sm:gap-6"
          >
            <h3 className="skill-label m-0 pt-1 text-sm font-semibold transition-colors group-hover:text-accent">
              {group.name}
            </h3>
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              {group.items.map((item) => (
                <li
                  key={item}
                  className={`skill-chip cursor-default rounded-full border px-3 py-1 text-[13px] transition-transform duration-200 hover:-translate-y-0.5 ${
                    group.core ? "border-transparent bg-accent-soft font-medium text-accent" : "border-line bg-chip"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
