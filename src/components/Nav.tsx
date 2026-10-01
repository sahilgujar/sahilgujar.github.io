"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { profile } from "@/data/resume";

const links = [
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLLIElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useGSAP(() => {
    // Reading-progress bar across the top of the page.
    gsap.fromTo(
      ".nav-progress",
      { scaleX: 0 },
      { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
    );

    // Highlight the link for the section in the middle of the screen.
    for (const { id } of links) {
      const isLast = id === "contact";
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: isLast ? "top bottom" : "top 50%",
        end: isLast ? "bottom bottom" : "bottom 50%",
        onToggle: (self) => self.isActive && setActive(id),
        onLeaveBack: (self) => id === "skills" && !self.isActive && setActive(null),
      });
    }

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(navRef.current, { yPercent: -100, duration: 0.8, ease: "power3.out", delay: 0.2 });

      // Tuck the nav away while reading down the page; bring it back on any scroll up.
      const slide = gsap.quickTo(navRef.current, "yPercent", { duration: 0.4, ease: "power3.out" });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => slide(self.direction === 1 && self.scroll() > 480 ? -100 : 0),
      });
    });
  });

  // Slide the highlight pill under the active link.
  useEffect(() => {
    const pill = pillRef.current;
    const link = active ? listRef.current?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`) : null;
    if (!pill) return;
    const place = () => {
      if (!link) return gsap.to(pill, { autoAlpha: 0, duration: 0.2 });
      gsap.to(pill, {
        x: link.offsetLeft,
        width: link.offsetWidth,
        autoAlpha: 1,
        duration: 0.45,
        ease: "power3.out",
      });
      // On narrow screens the link row scrolls sideways: keep the active link in view.
      // (Not scrollIntoView: that would also scroll the page while the nav is tucked away.)
      const list = listRef.current!;
      if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: link.offsetLeft - 24, behavior: "smooth" });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <>
      <div
        aria-hidden
        className="nav-progress no-print fixed inset-x-0 top-0 z-30 h-[2px] origin-left bg-gradient-to-r from-accent to-accent-2"
      />
      <nav ref={navRef} className="no-print sticky top-0 z-20 border-b border-line bg-bg/75 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1040px] items-center justify-between gap-4 px-5">
          <a href="#top" className="hidden items-center gap-2 font-bold text-text sm:flex">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-xs text-white">SG</span>
            {profile.name}
          </a>
          <ul ref={listRef} className="relative -mx-2 my-0 flex list-none overflow-x-auto p-0 text-[13px] sm:mx-0 sm:text-sm">
            <li
              ref={pillRef}
              aria-hidden
              className="invisible absolute left-0 top-0 h-full rounded-full bg-chip ring-1 ring-line"
            />
            {links.map(({ id, label }) => (
              <li key={id} className="relative">
                <a
                  href={`#${id}`}
                  className={`relative block whitespace-nowrap rounded-full px-2.5 py-1.5 transition-colors sm:px-3.5 ${
                    active === id ? "text-text" : "text-muted hover:text-text"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
