# Princess Mae D. Elfa — Portfolio

A production-ready personal portfolio for **Princess Mae D. Elfa**, a Full Stack
Developer and IT professional from the Philippines. Built with Next.js, it
highlights web development, AI integration, and IT support experience.

## Tech Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS v4** — dark theme (default) with a subtle-blue accent system
- **Framer Motion** — animations (typing effect, scroll reveals, card hovers)
- **next-themes** — dark/light mode toggle
- **lucide-react** + **react-icons** — icons
- **Nodemailer** — contact form email delivery (Gmail SMTP)

## Features

- Hero with animated typing effect + terminal-style UI
- About, skills (icon cards), projects, experience timeline, education
- Dedicated case-study pages at `/projects/[slug]`
- Working contact form (server-side email)
- SEO: metadata, Open Graph/Twitter, `sitemap.xml`, `robots.txt`, JSON-LD
- Accessible: semantic HTML, keyboard navigation, focus states, reduced-motion
- Mobile-first responsive design with a hamburger menu

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
| `stats.ts` | Key statistics |

**Placeholders to replace before publishing:**

- `public/resume.pdf` — the real resume
- `public/images/projects/*.svg` — real project screenshots
- `public/og.svg` — social share image
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
