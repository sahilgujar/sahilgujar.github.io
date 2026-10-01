// Single source of truth for everything shown on the site.
// Edit this file to update the resume — components only handle layout and motion.

export const profile = {
  name: "Sahil Gujar",
  title: "Frontend Engineer",
  location: "Mumbai – Pune, India",
  email: "sahilgujar007@gmail.com",
  phone: "+91 88055 29398",
  phoneHref: "tel:+918805529398",
  linkedin: "https://www.linkedin.com/in/sahilgujar",
  github: "https://github.com/sahilgujar",
  codewars: "https://www.codewars.com/users/sahilgujar",
  url: "https://sahilgujar.github.io/",
};

export type Stat = { value: number; suffix?: string; label: string; format?: boolean };

export const stats: Stat[] = [
  { value: 5, suffix: " yrs", label: "Professional experience" },
  { value: 2700, suffix: "+", label: "Commits since mid-2023", format: true },
  { value: 10, suffix: "+", label: "Production products shipped" },
  { value: 6, label: "Platforms: web, extension, Telegram, desktop, PWA, admin" },
];

export type SkillGroup = { name: string; items: string[]; core?: boolean };

export const skills: SkillGroup[] = [
  {
    name: "Core",
    core: true,
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Redux Toolkit", "TanStack Query", "Zustand"],
  },
  {
    name: "UI & Data",
    items: ["shadcn/ui", "Chakra UI", "GSAP", "Motion", "React Hook Form", "Zod", "TanStack Table", "Lightweight Charts", "Chart.js", "D3"],
  },
  {
    name: "Real-time & Web3",
    items: ["WebSockets", "Socket.IO", "HLS streaming", "Firebase Cloud Messaging", "wagmi", "viem", "ethers.js", "WalletConnect", "MPC custody"],
  },
  {
    name: "Platforms",
    items: ["Chrome Extensions (MV3)", "Telegram Mini Apps", "Tauri desktop", "PWA", "Admin dashboards"],
  },
  {
    name: "Auth & Payments",
    items: ["JWT + refresh tokens", "OTP / Google / Apple sign-in", "RBAC", "Stripe (3-D Secure)", "Encrypted API payloads"],
  },
  {
    name: "Backend & Tooling",
    items: ["Python", "FastAPI", "Redis", "Docker", "Git", "Vite", "Webpack", "Turborepo", "AWS"],
  },
];

export type Job = { when: string; title: string; org: string; points: string[] };

export const experience: Job[] = [
  {
    when: "Jul 2023 – Present",
    title: "Software Engineer (Frontend)",
    org: "Stackera · product & client engineering studio",
    points: [
      "Led the frontend on 7 products across fintech, Web3, creator economy and healthcare, and set up several from scratch.",
      "Top contributor on the studio's two largest products (~1,700 commits combined).",
      "Shipped on web, Chrome extension, Telegram Mini App, Tauri desktop and PWA.",
    ],
  },
  {
    when: "May 2022 – Jun 2023",
    title: "Software Developer",
    org: "CogniSaaS · customer-onboarding platform",
    points: ["Migrated the app from Angular to React, led its UI/UX revamp and built new features."],
  },
  {
    when: "Nov 2021 – Apr 2022",
    title: "Front End Engineer",
    org: "E-beta Innovations",
    points: ["Built frontends for client companies."],
  },
  {
    when: "Jul 2021 – Oct 2021",
    title: "Front End Engineer Intern",
    org: "Airprobe · Bengaluru",
    points: ["Built reusable React components from Figma designs."],
  },
];

export type Project = {
  name: string;
  tag: string;
  kind: string;
  role?: string;
  points: string[];
  stack: string[];
  links?: { label: string; href: string }[];
};

// Client and product names are under NDA, so work projects are described by what they are, not what they're called.
// Keep these names in sync with the labels in scripts/project-map.local.mjs (used for the contribution graph).
export const projects: Project[] = [
  {
    name: "Web3 Streaming Platform",
    tag: "2024 – 2025 · ~800 commits",
    kind: "Video & live streaming for crypto creators",
    role: "Lead frontend engineer, from the first commit to a major chain-ecosystem launch.",
    points: [
      "**Live streaming:** go-live flow, HLS playback and real-time chat over Socket.IO.",
      "**On-chain payments:** crypto checkout for promotions across 4 EVM chains, with balance checks and automatic network switching.",
      "**Growth:** rewards, referrals, airdrops, leaderboards, multi-language audio/subtitles and virtualized feeds.",
    ],
    stack: ["Next.js", "TanStack Query", "Zustand", "wagmi", "viem", "Socket.IO", "Firebase"],
  },
  {
    name: "Real-time Trading Game",
    tag: "2024 – 2025 · ~900 commits",
    kind: "Telegram Mini App plus an admin console",
    role: "Top contributor on the game client. Built the admin console from scratch.",
    points: [
      "**Real-time engine:** live candlestick feeds, backend-synced countdowns, heartbeat, auto-reconnect and multi-device reconciliation.",
      "**Game systems:** copy trading, tournaments, subscriptions, achievements and Stripe deposits with 3-D Secure.",
      "**Performance:** bounded event buffers, dynamic chart imports and state persisted to IndexedDB.",
    ],
    stack: ["Next.js", "Redux Toolkit", "RTK Query", "WebSockets", "Lightweight Charts", "Stripe"],
  },
  {
    name: "Crypto Wallet Extension",
    tag: "2023 – 2024 · 370+ commits",
    kind: "Wallet & trading hub as a Chrome extension",
    points: [
      "Wallet creation/import, seed-phrase backup, multi-wallet management and swaps.",
      "Smart buy/sell, stop-loss/take-profit and grid-bot trading screens. Prototyped MPC custody.",
    ],
    stack: ["React", "Chrome MV3", "Redux Toolkit", "ethers.js", "WalletConnect"],
  },
  {
    name: "IoT Fleet Dashboard",
    tag: "2025 · 150+ commits",
    kind: "Medical-device tracking for healthcare logistics",
    points: [
      "Built from scratch: architecture, encrypted API layer, token refresh and RBAC.",
      "Device inventory with server-side search and CSV/PDF export; telemetry charts and alerts.",
    ],
    stack: ["Next.js", "Tailwind v4", "shadcn/ui", "TanStack Table", "Chart.js"],
  },
  {
    name: "Royal Darbar",
    tag: "Personal · 2025 – 2026",
    kind: "Real-time multiplayer strategy game, full stack",
    points: [
      "Event-driven game server with lobbies, timed rounds, hidden moves and conflict resolution. Dockerized.",
    ],
    stack: ["FastAPI", "python-socketio", "Redis", "Next.js", "Docker"],
    links: [
      { label: "Frontend", href: "https://github.com/sahilgujar/Royal-Darbar-Frontend" },
      { label: "Backend", href: "https://github.com/sahilgujar/Royal-Darbar-Backend" },
    ],
  },
];

export const otherWork = [
  "**Copy-trading platform:** trader dashboards, copy-portfolio flows and PnL charts.",
  "**Desktop trading terminal:** multi-exchange order entry and balances in SolidJS + Tauri.",
  "**Internal tools:** a Tauri wallet utility with encrypted storage, and a Turborepo analytics suite.",
];

export const about =
  "I've spent the last two and a half years leading frontend work at a product studio, turning live price feeds, WebSocket game engines and on-chain payments into interfaces that feel simple, across web, browser extensions, Telegram, desktop and PWA.";

export const marquee = {
  stack: ["React", "Next.js", "TypeScript", "WebSockets", "Tailwind CSS", "Redux Toolkit", "TanStack Query", "wagmi", "Tauri", "FastAPI"],
  domains: ["Trading games", "Crypto wallets", "Live streaming", "Copy trading", "Telegram Mini Apps", "IoT dashboards", "On-chain payments", "Chrome extensions"],
};

export const education = [{ title: "B.Sc. Information Technology", detail: "University of Mumbai · 2017 – 2021" }];

export const extras = [
  { title: "Founding member, RiviLabs", detail: "Since 2020" },
  { title: "Languages", detail: "English, Hindi, Marathi (professional proficiency)" },
];
