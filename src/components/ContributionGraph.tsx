"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import contributions from "@/data/contributions.json";
import { profile } from "@/data/resume";
import { SectionTitle } from "./Section";

const days: Record<string, number> = contributions.days;
const projectsByYear: Record<string, { name: string; commits: number }[]> = contributions.projects;

const YEARS = Object.keys(projectsByYear).sort().reverse(); // newest first, like GitHub
const DEFAULT_YEAR = YEARS.reduce((best, y) => (yearTotal(y) > yearTotal(best) ? y : best), YEARS[0]);

const DAY_MS = 86_400_000;
const GAP = 3; // px between cells
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Cell = { date: string; count: number } | null;

// Explicit end values plus overwrite: if two of these overlap (quick year switches, hot reload),
// the newer one takes over and every cell still finishes at full size. A plain from() would instead
// adopt the half-animated values as its target and leave cells frozen part-way.
function ripple(weeks: number, o: { from: number; duration: number; amount: number; ease: string }) {
  return gsap.fromTo(
    ".heat-cell",
    { scale: o.from, autoAlpha: 0 },
    {
      scale: 1,
      autoAlpha: 1,
      duration: o.duration,
      ease: o.ease,
      overwrite: true,
      stagger: { grid: [weeks, 7], from: "start", amount: o.amount },
    },
  );
}

function growBars(duration: number) {
  return gsap.fromTo(
    ".project-bar",
    { scaleX: 0 },
    { scaleX: 1, duration, ease: "power3.out", stagger: 0.05, overwrite: true },
  );
}

/** Counts an element's number up from zero, keeping the thousands separator. */
function countUp(el: Element | null, to: number, duration: number) {
  const counter = { n: 0 };
  return gsap.to(counter, {
    n: to,
    duration,
    ease: "power2.out",
    onUpdate: () => void (el && (el.textContent = Math.round(counter.n).toLocaleString("en-US"))),
  });
}

function yearTotal(year: string) {
  return projectsByYear[year].reduce((sum, p) => sum + p.commits, 0);
}

/** Shade bands roughly follow the quartiles of active days: 1–2, 3–4, 5–9, 10+ commits. */
function level(count: number) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 9) return 3;
  return 4;
}

// All date math in UTC so the static build and the browser agree on every cell.
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

function formatDate(date: string, withWeekday = false) {
  const d = new Date(`${date}T00:00:00Z`);
  const text = `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCDate()}`;
  return withWeekday ? `${WEEKDAYS[d.getUTCDay()]}, ${text}` : text;
}

/** Lays a calendar year out as GitHub does: one column per week, Sunday on top. */
function buildYear(year: number) {
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year, 11, 31);
  const weeks: Cell[][] = [];
  let week: Cell[] = Array(new Date(start).getUTCDay()).fill(null);
  for (let t = start; t <= end; t += DAY_MS) {
    const date = iso(t);
    week.push({ date, count: days[date] ?? 0 });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)]);

  const months = weeks.flatMap((w, i) => {
    const first = w.find((c) => c?.date.endsWith("-01"));
    return first ? [{ col: i, label: MONTHS[Number(first.date.slice(5, 7)) - 1] }] : [];
  });

  const active = weeks.flat().filter((c): c is NonNullable<Cell> => !!c && c.count > 0);
  let longest = 0;
  let run = 0;
  for (const c of weeks.flat()) {
    if (!c) continue;
    run = c.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  const busiest = active.reduce<NonNullable<Cell> | null>((b, c) => (!b || c.count > b.count ? c : b), null);

  return { weeks, months, activeDays: active.length, longest, busiest };
}

export function ContributionGraph() {
  const root = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const entered = useRef(false);
  const [year, setYear] = useState(DEFAULT_YEAR);

  const grid = useMemo(() => buildYear(Number(year)), [year]);
  const projects = projectsByYear[year];
  const total = yearTotal(year);
  const maxProject = projects[0]?.commits ?? 1;

  // First appearance: the grid ripples in from the top-left corner as it scrolls into view.
  useGSAP(
    () => {
      // On narrow screens the graph scrolls sideways: start at December, the way GitHub shows recent weeks.
      if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: ".heat-grid", start: "top 85%", once: true },
            onStart: () => void (entered.current = true),
          })
          .add(ripple(grid.weeks.length, { from: 0, duration: 0.5, amount: 1.4, ease: "back.out(2.5)" }))
          .add(growBars(0.9), 0.4)
          .add(countUp(root.current!.querySelector(".heat-total"), total, 1.4), 0);
      });
    },
    { scope: root },
  );

  // Switching years: a quicker ripple, bars regrow, and the total counts to the new number.
  useGSAP(
    () => {
      if (!entered.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        ripple(grid.weeks.length, { from: 0.3, duration: 0.35, amount: 0.6, ease: "power2.out" });
        growBars(0.7);
        countUp(root.current!.querySelector(".heat-total"), total, 0.8);
      });
    },
    { scope: root, dependencies: [year] },
  );

  const showTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-date]");
    const tip = tooltip.current;
    if (!tip || !root.current) return;
    if (!cell) return void (tip.style.visibility = "hidden");
    const count = Number(cell.dataset.count);
    tip.textContent = `${count === 0 ? "No" : count} contribution${count === 1 ? "" : "s"} on ${formatDate(cell.dataset.date!, true)}`;
    const c = cell.getBoundingClientRect();
    const r = root.current.getBoundingClientRect();
    tip.style.visibility = "visible";
    tip.style.left = `${c.left - r.left + c.width / 2}px`;
    tip.style.top = `${c.top - r.top - 8}px`;
  };

  const hideTooltip = () => {
    if (tooltip.current) tooltip.current.style.visibility = "hidden";
  };

  return (
    <section ref={root} id="activity" className="relative border-t border-line py-16 sm:py-20 print:hidden">
      <SectionTitle>Contribution activity</SectionTitle>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <div className="min-w-0 flex-1">
          <h3 className="m-0 mb-3 text-lg font-semibold tracking-[-0.01em]">
            <span className="heat-total">{total.toLocaleString("en-US")}</span> contributions in {year}
          </h3>

          {/* ---------- heatmap ---------- */}
          <div className="rounded-xl border border-line bg-surface">
            <div ref={scroller} className="overflow-x-auto px-4 pb-3 pt-4">
              {/* One grid: day labels in column 1, a flexible column per week, months along the top row.
                  Cells stay square and scale with the card; below 640px the graph scrolls sideways instead. */}
              <div
                role="img"
                aria-label={`${total.toLocaleString("en-US")} contributions in ${year}, on ${grid.activeDays} different days`}
                className="heat-grid grid min-w-[640px]"
                style={{ gridTemplateColumns: `28px repeat(${grid.weeks.length}, minmax(0, 1fr))`, gap: GAP }}
                onMouseMove={showTooltip}
                onMouseLeave={hideTooltip}
              >
                {grid.months.map((m) => (
                  <span
                    key={m.label}
                    aria-hidden
                    className="whitespace-nowrap pb-1 text-xs leading-none text-muted"
                    style={{ gridColumn: m.col + 2, gridRow: 1 }}
                  >
                    {m.label}
                  </span>
                ))}
                {["Mon", "Wed", "Fri"].map((d, i) => (
                  <span
                    key={d}
                    aria-hidden
                    className="self-center text-xs leading-none text-muted"
                    style={{ gridColumn: 1, gridRow: i * 2 + 3 }}
                  >
                    {d}
                  </span>
                ))}
                {grid.weeks.map((week, w) =>
                  week.map((c, d) =>
                    c ? (
                      <div
                        key={c.date}
                        aria-hidden
                        data-date={c.date}
                        data-count={c.count}
                        className="heat-cell aspect-square rounded-[3px] outline-offset-1 hover:outline hover:outline-1 hover:outline-text/60"
                        style={{ gridColumn: w + 2, gridRow: d + 2, background: `var(--heat-${level(c.count)})` }}
                      />
                    ) : null,
                  ),
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs text-muted">
              <span>
                Private company repos (GitHub, GitLab, Bitbucket), counted from git history.{" "}
                <a href={profile.github} target="_blank" rel="noopener" className="text-accent hover:underline">
                  Public profile ↗
                </a>
              </span>
              <span aria-hidden className="flex items-center gap-1">
                Less
                {[0, 1, 2, 3, 4].map((l) => (
                  <span key={l} className="inline-block h-[11px] w-[11px] rounded-[3px]" style={{ background: `var(--heat-${l})` }} />
                ))}
                More
              </span>
            </div>
          </div>

          {/* ---------- activity overview ---------- */}
          <div className="mt-4 grid gap-4 rounded-xl border border-line bg-surface p-5 md:grid-cols-[1.4fr_1fr] md:gap-8">
            <div>
              <h4 className="m-0 mb-3 text-sm font-semibold">Contributed to</h4>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {projects.map((p) => (
                  <li key={p.name} className="grid grid-cols-[minmax(0,150px)_1fr_auto] items-center gap-3 text-sm">
                    <span className="truncate font-medium text-accent">{p.name}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-chip">
                      <span
                        className="project-bar block h-full origin-left rounded-full"
                        style={{ width: `${Math.max(2, (p.commits / maxProject) * 100)}%`, background: "var(--heat-3)" }}
                      />
                    </span>
                    <span className="w-12 text-right font-mono text-xs text-muted">{p.commits}</span>
                  </li>
                ))}
              </ul>
            </div>
            <dl className="m-0 grid grid-cols-3 gap-3 md:grid-cols-1 md:content-start md:gap-4">
              <div>
                <dt className="text-xs text-muted">Active days</dt>
                <dd className="m-0 text-xl font-bold tracking-[-0.02em]">{grid.activeDays}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Longest streak</dt>
                <dd className="m-0 text-xl font-bold tracking-[-0.02em]">{grid.longest} days</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Busiest day</dt>
                <dd className="m-0 text-xl font-bold tracking-[-0.02em]">
                  {grid.busiest ? (
                    <>
                      {grid.busiest.count} <span className="text-sm font-medium text-muted">on {MONTHS[Number(grid.busiest.date.slice(5, 7)) - 1]} {Number(grid.busiest.date.slice(8))}</span>
                    </>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* ---------- year tabs ---------- */}
        <div role="group" aria-label="Year" className="order-first flex gap-2 lg:order-none lg:w-28 lg:flex-col lg:pt-9">
          {YEARS.map((y) => (
            <button
              key={y}
              type="button"
              aria-pressed={y === year}
              onClick={() => setYear(y)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
                y === year ? "bg-accent text-white" : "text-muted hover:bg-chip hover:text-text"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={tooltip}
        role="tooltip"
        className="pointer-events-none invisible absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-text px-2.5 py-1.5 text-xs font-medium text-bg shadow-lg"
      />
    </section>
  );
}
