# Princess Mae D. Elfa — Portfolio

A production-ready personal portfolio for **Princess Mae D. Elfa**, a Full Stack
Developer and IT professional from the Philippines. Built with Next.js, it
highlights web development, AI integration, and IT support experience.

## Tech Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS v4** — CSS-first theming; every design token lives in
  [`src/app/globals.css`](src/app/globals.css)
- **Geist** and **Geist Mono** (via `next/font`) — everything, and labels
- **lucide-react** + **react-icons** — icons
- **Nodemailer** — contact form email delivery (Gmail SMTP)

No animation, chart, theme or UI-component library: charts are plain markup,
motion is CSS (`@starting-style`, scroll timelines, React `<ViewTransition>`),
the theme is CSS variables, and the command menu is a native `<dialog>`.

## Design system

**A black-and-white dashboard.** A grey canvas with white panels (black on
black in the dark theme), one typeface, and greys only for secondary text and
rules. Hierarchy comes from weight, from the step between full and muted ink,
and from the panels themselves.

- **Tokens** are CSS variables in [`src/app/globals.css`](src/app/globals.css)
  (`--bg`, `--surface`, `--ink`, `--ink-2`, `--ink-3`, `--rule`, …), exposed to
  Tailwind as `bg-bg`, `bg-surface`, `text-ink`, `border-rule` and so on.
  Every text/background pair was checked against WCAG AA.
- **Theme and sidebar state** are attributes on `<html>` (`data-theme`,
  `data-sidebar`), applied by an inline script before first paint, so neither
  flashes. Style the folded sidebar with the `collapsed:` variant.
- **Type.** `.heading` sets headings (Geist, semibold, tight tracking);
  `.eyebrow` sets every mono label, index and key hint; `.panel` is the card.
- **Images** are greyscale until hovered, so the page stays black and white.

### Structure

| Route | What it shows |
| --- | --- |
| `/` | Overview: ID badge, intro, headline figures, now building, projects, stack chart, timeline, contact |
| `/projects` | Searchable, filterable project cards |
| `/projects/[slug]` | Case study: figures, chapters, details sidebar, table of contents |
| `/experience` | Career timeline chart, roles and education |
| `/stack` | Technology usage across projects, plus every skill by area |
| `/contact` | Contact form and channels |

The shell lives in [`src/components/shell/`](src/components/shell/) (`Sidebar`,
`TopBar`, `MobileTabBar`, `Shortcuts`), the widgets in
[`src/components/dashboard/`](src/components/dashboard/), and shared pieces in
[`src/components/ui/`](src/components/ui/) (`Panel`, `IdBadge`, `StatusBadge`,
`CommandPalette`, …). Every chart is derived from the content files by
[`src/lib/insights.ts`](src/lib/insights.ts) — nothing is typed in by hand.

## Features

- **An ID badge on a lanyard**: drag it, swing it, fling it, click (or press
  Enter) to turn it over; arrow keys swing it. A small Verlet physics
  simulation, no libraries; it starts at rest and sleeps when still
- Dashboard shell: collapsible sidebar on desktop (`[` to fold), tab bar on phones
- **Keyboard first**: ⌘K / Ctrl+K (or `/`) command menu; **G then O / P / E / S / C**
  jumps to Overview, Projects, Experience, Stack or Contact
- Charts from real data: technology usage counted across projects, a career
  timeline from each role's dates, and Acadify's roadmap progress
- Project cards with search and a status filter
- Project images morph into the case study (React `<ViewTransition>`)
- Light and dark themes with no flash on load; live local clock
- Working contact form (server-side email) and one-click copy of the email
- SEO: per-page metadata, Open Graph/Twitter, `sitemap.xml`, `robots.txt`, JSON-LD
- **Ask AI**: a chat assistant (floating button, ⌘K, or G then A) that answers
  questions about Princess using only the portfolio's own data. Groq first,
  Gemini as fallback; the profile is built from `src/data/` by
  [`src/lib/ai/knowledge.ts`](src/lib/ai/knowledge.ts), and it declines
  off-topic questions
- Accessible: semantic landmarks, skip link, keyboard-first menu, visible focus

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contact form (Gmail App Password)

The contact form (`/api/contact`) sends email through Gmail SMTP using an
**App Password** (not your normal password):

1. Enable 2-Step Verification on the Google account.
2. Create an App Password at <https://myaccount.google.com/apppasswords>.
3. Put the values in `.env.local`:
   ```
   GMAIL_USER=your-address@gmail.com
   GMAIL_APP_PASSWORD=your16charapppass
   CONTACT_TO=your-address@gmail.com   # optional; defaults to GMAIL_USER
   ```

Without these variables the form returns a friendly error and asks the visitor
to email directly.

## Ask AI (environment variables)

The assistant (`/api/ask`) needs at least one key in `.env.local` — and in
Vercel → Project Settings → Environment Variables for production:

```
GROQ_API_TOKEN=...      # primary
GEMINI_API_KEY=...      # fallback
# optional: GROQ_MODEL (default openai/gpt-oss-120b), GEMINI_MODEL (default gemini-flash-latest)
```

## Editing content

All content lives in typed files under [`src/data/`](src/data/) — edit these,
not the components:

| File | Contents |
| --- | --- |
| `siteConfig.ts` | Name, title, intro, email, SEO keywords, resume URL, site URL |
| `social.ts` | GitHub / LinkedIn / Email links |
| `skills.ts` | Skill categories and items |
| `projects.ts` | Projects + full case-study content |
| `experience.ts` | Work experience timeline |
| `education.ts` | Education entries |
| `stats.ts` | Headline figures (each with its source) |
| `nav.ts` | Dashboard pages, icons and G-key shortcuts |

**Placeholders to replace before publishing:**

- `public/resume.pdf` — the real resume
- `public/images/projects/*.svg` — real project screenshots
- `public/og.png` — social share image (1200×630)
- URLs in `src/data/social.ts` and `src/data/siteConfig.ts` (including `url`)

## Deploy (Vercel)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com/new).
2. Add `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and (optionally) `CONTACT_TO` in
   **Project Settings → Environment Variables**.
3. Update `url` in `src/data/siteConfig.ts` to your production domain.

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint
```
