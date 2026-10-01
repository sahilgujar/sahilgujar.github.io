"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, STACK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { otherWork, projects, type Project } from "@/data/resume";
import { Rich } from "./Rich";
import { Section } from "./Section";

const STICKY_TOP = 96; // px from the top of the viewport where cards stick
const STACK_OFFSET = 14; // each later card sticks a little lower, so the stack shows its edges

function trackSpotlight(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  return (
    <article
      onMouseMove={trackSpotlight}
      className="spotlight relative overflow-hidden rounded-2xl border border-line p-6 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.45)] transition-colors duration-300 hover:border-accent/50 sm:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-10">
        <div className="flex flex-col">
          <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mb-1 mt-2 text-[28px] font-bold leading-tight tracking-[-0.03em]">{p.name}</h3>
          <p className="m-0 text-[15px] font-medium text-accent">{p.kind}</p>
          <p className="mb-4 mt-1 font-mono text-xs text-muted">{p.tag}</p>
          {p.role && (
            <p className="mb-4 rounded-r-md border-l-[3px] border-accent bg-chip px-3 py-2 text-[13px] text-muted">
              {p.role}
            </p>
          )}
          {p.links && (
            <div className="no-print mb-4 flex gap-4 text-sm">
              {p.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener" className="text-accent hover:underline">
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
          <ul className="m-0 mt-auto flex list-none flex-wrap gap-1.5 p-0">
            {p.stack.map((s) => (
              <li key={s} className="rounded-full border border-line bg-chip px-2 py-0.5 text-xs">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <ul className="m-0 list-disc pl-[18px] text-[15px] marker:text-faint">
          {p.points.map((pt) => (
            <li key={pt} className="my-1.5">
              <Rich text={pt} />
            </li>
          ))}
        </ul>
      </div>
      {/* Darkens the card as the next one stacks on top of it. */}
      <div aria-hidden className="card-dim no-print pointer-events-none absolute inset-0 bg-bg opacity-0" />
    </article>
  );
}

export function Projects() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Without the sticky stack (phones, short screens), cards simply rise into view.
      // With it, the stacking is the motion: a card still fading in would show the one beneath through it.
      mm.add({ motion: MOTION_OK, stack: STACK }, (ctx) => {
        const { motion, stack } = ctx.conditions!;
        if (!motion || stack) return;
        gsap.set(".stack-card", { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(".stack-card", {
          start: "top 90%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }),
        });
      });

      mm.add(STACK, () => {
        const slots = gsap.utils.toArray<HTMLElement>(".stack-slot");
        slots.forEach((slot, i) => {
          const next = slots[i + 1];
          if (!next) return;
          // While the next card slides up over this one, this one shrinks back and dims.
          const scrollTrigger = {
            trigger: next,
            start: "top bottom",
            end: `top ${STICKY_TOP + (i + 1) * STACK_OFFSET}px`,
            scrub: true,
          };
          gsap.to(slot.querySelector(".stack-card"), { scale: 0.94, ease: "none", scrollTrigger });
          gsap.to(slot.querySelector(".card-dim"), { opacity: 0.55, ease: "none", scrollTrigger });
        });
      });
    },
    { scope: root },
  );

  return (
    <Section id="projects" title="Selected projects">
      <div ref={root} className="flex flex-col gap-6 stack:gap-10 stack:pb-10">
        {projects.map((p, i) => (
          <div key={p.name} className="stack-slot stack:sticky" style={{ top: STICKY_TOP + i * STACK_OFFSET }}>
            <div className="stack-card origin-top">
              <ProjectCard project={p} index={i} />
            </div>
          </div>
        ))}
      </div>

      <div data-reveal className="mt-6 rounded-2xl border border-dashed border-line p-6 sm:p-8">
        <h3 className="mb-3 mt-0 text-lg font-semibold">Also worked on</h3>
        <ul className="m-0 list-disc pl-[18px] text-[15px] marker:text-faint">
          {otherWork.map((w) => (
            <li key={w} className="my-1.5">
              <Rich text={w} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
