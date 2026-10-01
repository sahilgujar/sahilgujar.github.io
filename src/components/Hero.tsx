"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, POINTER, SCRAMBLE_CHARS, SplitText, useGSAP } from "@/lib/gsap";
import { profile, stats, type Stat } from "@/data/resume";
import { GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon } from "./Icons";
import { Magnetic } from "./Magnetic";

const formatStat = (s: Stat, n: number) =>
  (s.format ? Math.round(n).toLocaleString("en-US") : String(Math.round(n))) + (s.suffix ?? "");

// Never wait on fonts forever: reveal the hero after at most 1.5s.
const fontsReady = () => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, (ctx) => {
        let alive = true;

        // Split text only after the web fonts load, or the line breaks are measured with the fallback font.
        fontsReady().then(() => {
          if (!alive) return;
          ctx.add(() => {
            const name = SplitText.create(".hero-name", { type: "chars" });
            const lede = SplitText.create(".hero-lede", { type: "lines", mask: "lines" });
            const eyebrow = root.current!.querySelector(".hero-eyebrow")!;

            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
            tl.from(".hero-bg", { autoAlpha: 0, duration: 1.6, ease: "power2.out" })
              .from(
                eyebrow,
                { duration: 1, scrambleText: { text: "", chars: SCRAMBLE_CHARS, speed: 0.5 }, ease: "none" },
                0.1,
              )
              .from(
                name.chars,
                {
                  yPercent: 90,
                  rotationX: -90,
                  autoAlpha: 0,
                  transformOrigin: "50% 100%",
                  duration: 1.1,
                  stagger: 0.035,
                },
                0.2,
              )
              .from(lede.lines, { yPercent: 105, duration: 1, stagger: 0.08 }, 0.55)
              .from(".hero-cta", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.07 }, 0.8)
              .from(".hero-stat", { y: 32, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.95)
              // Line-split markup is only needed for the intro; restore plain text so it reflows on resize.
              .add(() => lede.revert());

            // Stats count up from zero as their cards arrive.
            root.current!.querySelectorAll<HTMLElement>("[data-stat]").forEach((el, i) => {
              const stat = stats[Number(el.dataset.stat)];
              const counter = { n: 0 };
              el.textContent = formatStat(stat, 0);
              tl.to(
                counter,
                {
                  n: stat.value,
                  duration: 1.8,
                  ease: "expo.out",
                  onUpdate: () => void (el.textContent = formatStat(stat, counter.n)),
                },
                1.05 + i * 0.08,
              );
            });

            gsap.set(".hero-hide", { visibility: "visible" });
          });
        });

        // Slow ambient drift of the background glows.
        gsap.to(".hero-blob-a", { x: 80, y: 40, duration: 14, ease: "sine.inOut", repeat: -1, yoyo: true });
        gsap.to(".hero-blob-b", { x: -70, y: 60, duration: 17, ease: "sine.inOut", repeat: -1, yoyo: true });

        // As you scroll past, the hero gently recedes.
        gsap.to(".hero-content", {
          yPercent: -12,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => {
          alive = false;
        };
      });

      // A soft light that follows the cursor across the hero.
      mm.add(POINTER, () => {
        const glow = root.current!.querySelector<HTMLElement>(".hero-cursor")!;
        const xTo = gsap.quickTo(glow, "x", { duration: 0.9, ease: "power3.out" });
        const yTo = gsap.quickTo(glow, "y", { duration: 0.9, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = root.current!.getBoundingClientRect();
          xTo(e.clientX - r.left);
          yTo(e.clientY - r.top);
          // Only visibility: its opacity stays at the subtle value set in CSS.
          gsap.set(glow, { visibility: "visible" });
        };
        root.current!.addEventListener("pointermove", move);
        return () => root.current?.removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  const actions = [
    { href: `mailto:${profile.email}`, label: profile.email, icon: <MailIcon />, primary: true },
    { href: profile.linkedin, label: "LinkedIn", icon: <LinkedInIcon />, external: true },
    { href: profile.github, label: "GitHub", icon: <GitHubIcon />, external: true },
    { href: profile.phoneHref, label: profile.phone, icon: <PhoneIcon /> },
  ];

  return (
    <header ref={root} className="relative pb-16 pt-20 sm:pb-20 sm:pt-28 print:pt-0">
      {/* Background: grid, drifting glows and the cursor light. Full-bleed, behind the content. */}
      <div
        aria-hidden
        className="hero-bg hero-hide no-print pointer-events-none absolute -top-14 bottom-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent)]"
      >
        <div className="hero-grid absolute inset-0" />
        <div className="hero-blob-a absolute left-[8%] top-0 h-96 w-96 rounded-full bg-accent opacity-20 blur-3xl" />
        <div className="hero-blob-b absolute right-[8%] top-28 h-80 w-80 rounded-full bg-accent-2 opacity-15 blur-3xl" />
      </div>
      <div
        aria-hidden
        className="hero-cursor no-print pointer-events-none invisible absolute left-0 top-0 -z-10 -ml-60 -mt-60 h-[480px] w-[480px] rounded-full bg-accent opacity-[0.12] blur-3xl"
      />

      <div className="hero-content">
        <p className="hero-eyebrow hero-hide mb-5 font-mono text-[13px] text-accent">
          {profile.title} · {profile.location}
        </p>

        <h1
          className="hero-name hero-hide mb-6 text-[clamp(48px,9vw,104px)] font-bold leading-[1.02] tracking-[-0.045em] [perspective:600px]"
        >
          {profile.name}
        </h1>

        <p className="hero-lede hero-hide mb-9 max-w-[700px] text-lg text-muted sm:text-xl">
          I build <strong className="font-semibold text-text">real-time, product-heavy web apps</strong>: trading
          games, crypto wallets, copy-trading platforms, live-streaming and IoT dashboards. 5 years of shipping with{" "}
          <strong className="font-semibold text-text">React, Next.js and TypeScript</strong>, from first commit to
          production.
        </p>

        <div className="flex flex-wrap gap-2.5">
          {actions.map((a) => (
            <Magnetic key={a.label}>
              <a
                href={a.href}
                target={a.external ? "_blank" : undefined}
                rel={a.external ? "noopener" : undefined}
                className={`hero-cta hero-hide inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors hover:no-underline ${
                  a.primary
                    ? "border-accent bg-accent text-white hover:bg-accent/90"
                    : "border-line bg-surface/70 text-text backdrop-blur hover:border-accent print:hidden"
                }`}
              >
                {a.icon}
                {a.label}
              </a>
            </Magnetic>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 print:mt-4">
          {stats.map((s, i) => (
            <div key={s.label} className="hero-stat hero-hide rounded-2xl border border-line bg-surface/70 p-5 backdrop-blur">
              <b className="block text-[32px] font-bold tracking-[-0.03em]" data-stat={i}>
                {formatStat(s, s.value)}
              </b>
              <span className="text-[13px] leading-snug text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
