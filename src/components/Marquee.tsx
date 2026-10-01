"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { marquee } from "@/data/resume";

function Row({ items, variant }: { items: string[]; variant: "stack" | "domains" }) {
  // Rendered twice back to back: sliding the track by exactly half makes a seamless loop.
  const copy = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={item} className="flex items-center">
          <span
            className={
              variant === "stack"
                ? `whitespace-nowrap px-6 text-[clamp(40px,7vw,88px)] font-bold leading-none tracking-[-0.04em] ${
                    i % 2 ? "text-outline" : "text-text"
                  }`
                : "whitespace-nowrap px-5 font-mono text-sm uppercase tracking-[0.14em] text-muted"
            }
          >
            {item}
          </span>
          <span className={variant === "stack" ? "text-3xl text-accent" : "text-accent-2"}>✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden">
      <div className={`marquee-track flex w-max ${variant === "domains" ? "marquee-reverse" : ""}`}>
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}

/** Two infinite ticker rows that speed up with scroll velocity and follow scroll direction. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loops = gsap.utils.toArray<HTMLElement>(".marquee-track").map((track) => {
          const reverse = track.classList.contains("marquee-reverse");
          const tween = gsap.fromTo(
            track,
            { xPercent: reverse ? -50 : 0 },
            { xPercent: reverse ? 0 : -50, duration: reverse ? 48 : 38, ease: "none", repeat: -1 },
          );
          // Start deep into the repeats so the loop can also run backwards when scrolling up.
          tween.totalTime(tween.duration() * 1000);
          return tween;
        });

        let direction = 1;
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            direction = self.direction;
            const boost = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 250);
            for (const loop of loops) {
              gsap
                .timeline({ overwrite: true })
                .to(loop, { timeScale: direction * boost, duration: 0.2, ease: "power1.out" })
                .to(loop, { timeScale: direction, duration: 1.2, ease: "power1.inOut" });
            }
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="no-print relative left-1/2 flex w-screen -translate-x-1/2 flex-col gap-5 border-y border-line bg-surface/40 py-8 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <Row items={marquee.stack} variant="stack" />
      <Row items={marquee.domains} variant="domains" />
    </div>
  );
}
