# Princess Mae D. Elfa — Portfolio

A production-ready personal portfolio for **Princess Mae D. Elfa**, a Full Stack
Developer and IT professional from the Philippines. Built with Next.js, it
highlights web development, AI integration, and IT support experience.

## Tech Stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS v4** — CSS-first theming; every design token lives in
  [`src/app/globals.css`](src/app/globals.css)
- **Outfit** (via `next/font`) — the single typeface
- **lucide-react** + **react-icons** — icons
- **Nodemailer** — contact form email delivery (Gmail SMTP)

No animation library and no theme library: interaction feedback is plain CSS
transitions, which keeps all but three components on the server.

## Design system

A strict **flat design** system — no box shadows, no blur, no vibrant
gradients. Hierarchy comes from scale, weight and solid colour instead of depth,
and each page section is a full-bleed colour block:

| Section | Block |
| --- | --- |
| Hero | Blue 600 |
| About · Projects | White |
| Skills · Education | Gray 100 |
| Experience · Footer | Gray 900 |
| Contact | Amber 500 |

Two rules worth knowing before extending it:

- **The depth namespaces are deleted.** `globals.css` declares
  `--shadow-*: initial` and `--blur-*: initial`, so `shadow-lg` or `blur-sm`
  will not compile. That is deliberate.
- **Inverted blocks need dark text.** White on Blue 500 and white on Emerald
  both fail WCAG AA, so blue blocks use Blue 600 (`--color-primary-strong`) and
  emerald/amber blocks use ink text. `Section` stamps a `data-tone` attribute
  that flips the focus outline to white on those blocks.

Reusable primitives live in [`src/components/ui/`](src/components/ui/):
`Section` (colour blocks), `Card`, `IconTile`, `Label`, `BulletList`,
`buttonClass()` and `GeometricComposition` (the hero artwork).

## Features

- Hero with a flat geometric composition and an animated typing effect
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
