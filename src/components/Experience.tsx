"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { experience } from "@/data/resume";
import { Rich } from "./Rich";
import { Section } from "./Section";

export function Experience() {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The rail fills as the list scrolls through the viewport.
        gsap.fromTo(
          ".rail-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 65%", end: "bottom 55%", scrub: 0.4 },
          },
        );

        // Reading focus: the job in the middle of the screen is bright, the rest step back.
        gsap.utils.toArray<HTMLElement>(".job").forEach((job) => {
          const dot = job.querySelector(".job-dot");
          gsap.set(job, { opacity: 0.35 });
          gsap.from(job.querySelector(".job-body"), {
            y: 40,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: job, start: "top 90%", once: true },
          });
          ScrollTrigger.create({
            trigger: job,
            start: "top 62%",
            end: "bottom 38%",
            onToggle: (self) => {
              gsap.to(job, { opacity: self.isActive ? 1 : 0.35, duration: 0.5, overwrite: "auto" });
              gsap.to(dot, { scale: self.isActive ? 1.35 : 1, duration: 0.5, ease: "back.out(3)", overwrite: "auto" });
              dot?.toggleAttribute("data-on", self.isActive);
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <Section id="experience" title="Experience">
      <ol ref={root} className="relative m-0 list-none p-0">
        <div aria-hidden className="no-print absolute bottom-2 left-[5px] top-2 w-px bg-line sm:left-[185px]" />
        <div
          aria-hidden
          className="rail-fill no-print absolute bottom-2 left-[5px] top-2 w-[2px] origin-top bg-gradient-to-b from-accent to-accent-2 sm:left-[184px]"
        />

        {experience.map((job) => (
          <li
            key={job.title + job.when}
            className="job relative pb-12 pl-8 last:pb-0 sm:grid sm:grid-cols-[180px_1fr] sm:gap-6 sm:pl-0"
          >
            <span
              aria-hidden
              className="job-dot no-print absolute left-0 top-[7px] h-[11px] w-[11px] rounded-full border-2 border-accent bg-bg transition-colors data-[on]:bg-accent sm:left-[180px]"
            />
            <div className="font-mono text-[13px] text-muted sm:pt-[3px]">{job.when}</div>
            <div className="job-body sm:pl-8">
              <h3 className="m-0 text-xl font-semibold tracking-[-0.015em]">{job.title}</h3>
              <p className="mb-3 mt-0.5 text-[15px] text-muted">{job.org}</p>
              <ul className="m-0 list-disc pl-[18px] marker:text-faint">
                {job.points.map((p) => (
                  <li key={p} className="my-1.5">
                    <Rich text={p} />
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
