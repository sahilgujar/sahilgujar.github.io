"use client";

import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Fades up every element marked `data-reveal` as it scrolls into view, in small staggered batches.
 * Rendered last on the page so every target already exists when it runs.
 */
export function Reveals() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.set("[data-reveal]", { autoAlpha: 0, y: 36 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
    });
  });

  return null;
}
