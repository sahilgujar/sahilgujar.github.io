# sahilgujar.github.io

Personal resume / portfolio site for **Sahil Gujar**, Frontend Engineer. Live at https://sahilgujar.github.io

Built with Next.js (static export), TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText, ScrambleText) and Lenis smooth scrolling. All animations switch off for visitors who prefer reduced motion.

## Editing content

All resume content (profile, stats, about, marquee, skills, experience, projects, education) lives in
[`src/data/resume.ts`](src/data/resume.ts). Components in `src/components/` only handle layout and animation.
Wrap text in `**double asterisks**` to make it bold.

## Local development

```bash
npm install
npm run dev       # http://localhost:3000, hot reload
npm run build     # static export into out/
npm run preview   # serve the built out/ folder
```

## Deployment

Every push to `master` runs `.github/workflows/deploy.yml`, which builds the site and publishes `out/` to GitHub Pages.
One-time setup: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Print the page from the browser (Ctrl/⌘ + P) to get a PDF resume.
