import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "dermasculpt",
    title: "DermaSculpt",
    tagline: "AI Dermatology Clinic Support System",
    description:
      "An AI-powered clinic support platform that helps dermatology staff triage patient inquiries, surface relevant information, and respond faster. Improved response times by 30%.",
    image: "/dermasculpt_thumbnail.png",
    featured: true,
    technologies: [
      "JavaScript",
      "PHP",
      "MySQL",
      "CSS",
      "Tailwind CSS",
      "AI APIs",
      "Claude Code",
      "Windsurf",
    ],
    impact: "+30% faster response times",
    githubUrl: "https://github.com/Maevexsushi",
    liveUrl: "#",
    screenshots: [
      { src: "/dermasculpt_thumbnail.png", alt: "DermaSculpt clinic dashboard" },
    ],
    caseStudy: {
      overview:
        "DermaSculpt is a dermatology clinic support system that combines a web application with AI APIs to assist front-desk and clinical staff. It was developed as an undergraduate thesis project and focuses on reducing the time staff spend handling repetitive patient inquiries while keeping responses accurate and consistent.",
      businessProblem:
        "Dermatology clinics receive a high volume of repetitive patient questions about procedures, aftercare, and scheduling. Staff spent significant time answering these manually, leading to slow response times and inconsistent information across the team.",
      userRequirements: [
        "Quickly answer common patient inquiries with consistent, approved information.",
        "Let staff review and edit AI-suggested responses before sending.",
        "Store patient and inquiry records securely for follow-up.",
        "Work reliably on the clinic's existing low-cost hosting.",
      ],
      technicalChallenges: [
        "Integrating AI APIs with a PHP/MySQL stack while keeping API costs predictable.",
        "Designing prompts that produce safe, on-brand clinical language.",
        "Caching frequent answers to reduce latency and API usage.",
        "Ensuring data privacy for sensitive patient information.",
      ],
      developmentProcess: [
        "Interviewed clinic staff to map the most common inquiry types.",
        "Built a PHP + MySQL backend for records and an AI suggestion service.",
        "Iterated on prompt templates with staff feedback.",
        "Added a human-in-the-loop review step before any response is sent.",
        "Load-tested and tuned caching to hit response-time goals.",
      ],
      results: [
        { value: "30%", label: "Faster response times" },
        { value: "Fewer", label: "Repetitive manual replies" },
        { value: "Higher", label: "Response consistency" },
      ],
      lessonsLearned: [
        "A human review step builds trust in AI-generated content for clinical use.",
        "Caching common answers dramatically cut both latency and API cost.",
        "Close collaboration with end users produced far more useful prompts.",
      ],
    },
  },
  {
    slug: "acadify",
    status: "in-progress",
    progress: { value: 62, total: 84, unit: "sprints" },
    title: "Acadify",
    tagline: "AI study companion (formerly Pawgress)",
    description:
      "Students upload their own class files — PDFs, slides, Word docs, even photos of notes — and Acadify turns them into reviewers, flashcards and quizzes, then tracks topic mastery to tell them what to study next. Includes Aki, a study assistant that answers from the student's own material.",
    image: "/images/projects/acadify_thumb.png",
    featured: true,
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "pgvector",
      "Groq / Gemini / OpenAI",
      "Zod",
      "Radix UI",
      "Claude Code",
    ],
    impact: "Upload → reviewers, quizzes & mastery in one loop",
    githubUrl: "https://github.com/MarcEsteban04/Pawgress",
    liveUrl: "#",
    screenshots: [
      {
        src: "/images/projects/acadify_thumb.png",
        alt: "Acadify landing page: upload it, understand it, know what to study next",
      },
    ],
    caseStudy: {
      overview:
        "Acadify (built under the codename Pawgress) is a responsive web app for high school and college students. They upload the material their teachers actually hand out, and the app turns it into reviewers, flashcards, practice questions, quizzes and mock exams. Every answer feeds a per-topic mastery score, so the app can say which topic is holding the student back and plan study time around it. It is being built across an 84-sprint roadmap, with 130+ commits so far covering everything from authentication through to the academic planner.",
      businessProblem:
        "Students juggle separate apps for files, flashcards, quizzes and schedules, and none of them know what the student actually understands. Generic AI chat tools answer from the open web rather than the student's own syllabus, and study planners treat a deadline as just a date, with no idea how ready the student is for it.",
      userRequirements: [
        "Upload PDF, PPTX, DOCX, images and typed notes, organized by subject, topic and semester.",
        "Ask an AI assistant questions that are answered from, and cite, the student's own material.",
        "Generate reviewers, flashcards and practice questions from a reviewer, then edit or rewrite them by section.",
        "Sit quizzes and timed mock exams with multiple choice, true/false, identification and short-answer questions.",
        "See topic mastery, quiz analytics and weak topics, with a plain reason for each recommendation.",
        "Plan deadlines and study sessions on a calendar that knows how ready the student is.",
        "Keep every student's files and results private to them.",
      ],
      technicalChallenges: [
        "Retrieval-augmented answers: extracting text from PDFs, slides and photos (OCR), splitting it into chunks, embedding them as 1536-dimension vectors in pgvector, and retrieving the right passage for each question.",
        "A provider chain across Groq → Gemini → OpenAI behind one OpenAI-compatible SDK, with short timeouts so a hanging provider really does fall through, JSON-schema validation of every structured response, and a per-call cost ledger.",
        "Long AI jobs that outlast serverless request limits: a Postgres job queue where workers claim work with FOR UPDATE SKIP LOCKED, hold a lease, and a scheduled sweeper reclaims orphaned jobs.",
        "Marking quizzes on the server so the browser can't decide its own score: deterministic marking for objective question types, model-graded short answers.",
        "A mastery formula that can forget: it counts only the latest answer per question, gives a 30-day half-life to older evidence, weights difficulty asymmetrically, and pulls thin evidence toward 50% instead of showing a confident number.",
        "Security in three layers (optimistic proxy redirects, a real server-side session gate, and Row Level Security), with a script that attacks the live RLS policies using two throwaway accounts, plus byte-sniffed upload validation.",
      ],
      developmentProcess: [
        "Started with product foundations: a spec, requirements with FR/NFR IDs, user stories, user flows and low-fidelity wireframes.",
        "Explored brand directions, then built a token-based design system (direction “Daylight”) with a full primitive set and dark mode.",
        "Laid down the architecture: App Router route groups, the three auth layers, typed env access and the background-job contract.",
        "Built auth (6-digit email codes, password recovery), then the schema, RLS policies, private storage buckets and the validation layer.",
        "Shipped subjects, topics, uploads with per-file progress and retry, a material library and file previews.",
        "Added the AI service layer, extraction and OCR, chunking, embeddings and retrieval, then the study assistant Aki with saved conversations and guardrail evaluations.",
        "Built the study loop: reviewer generator, flashcards, practice, matching, quizzes, mock exams, server-side marking and analytics.",
        "Built mastery, weakness detection and the Progress page, then the academic planner with readiness-aware deadlines. Each pure engine (marking, analytics, mastery, planner) has its own test script.",
      ],
      results: [
        { value: "Sprint 62", label: "Of an 84-sprint roadmap" },
        { value: "3", label: "AI providers in a fall-through chain" },
        { value: "4", label: "Question types marked on the server" },
      ],
      lessonsLearned: [
        "A score students act on has to be explainable and able to forget, or it loses their trust the first time it's wrong.",
        "Anything that is recorded and counts toward a result belongs on the server, not in the browser.",
        "A fallback chain only works if “timed out” is bounded. Without a ceiling, the backup provider is never reached.",
        "Writing down why each rule exists, right beside the code, made later sprints much faster to build on.",
      ],
    },
  },
  {
    slug: "portfolio-analyzer",
    title: "Portfolio Analyzer",
    tagline: "AI hiring-readiness reviewer for your work",
    description:
      "Paste a URL or upload a file — a website, resume, or portfolio deck — and get a scored report on what a hiring reviewer sees: what's missing, how deep the work reads, dead links, and a ranked list of what to fix first. Exports the whole thing as a PDF.",
    image: "/images/projects/portfolio_analyzer_thumb.png",
    featured: true,
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "AI / LLMs",
      "Groq API",
      "pdf-lib",
      "Claude Code",
    ],
    impact: "0–100 scored reports with ranked fixes",
    githubUrl: "https://github.com/Maevexsushi/portfolio_analyzer",
    liveUrl: "https://portfolio-analyzer-flame-ten.vercel.app/",
    screenshots: [
      {
        src: "/images/projects/portfolio_analyzer_thumb.png",
        alt: "Portfolio Analyzer intake screen",
      },
    ],
    caseStudy: {
      overview:
        "Portfolio Analyzer shows job applicants what a hiring reviewer actually sees in their material. You paste a URL or upload a file — a website, a resume, or a portfolio deck — and get a 0–100 scored report covering what's missing, how deep the work reads, dead links, and a ranked list of what to fix first, exportable as a PDF. Each input is judged against its own checks and against the applicant's detected field, not a one-size-fits-all developer standard.",
      businessProblem:
        "Applicants send out portfolios, resumes, and decks with no idea how a reviewer — or an applicant tracking system — will read them: what's missing, what reads as weak, or whether a parser can even extract their resume as text. There was no honest, field-aware way to check your own material before sending it.",
      userRequirements: [
        "Analyze three separate input types — website, resume, or portfolio file — each judged on its own checks.",
        "Detect the applicant's field (design, writing, healthcare, trades, and more) and judge against that field's expectations.",
        "Return a clear 0–100 score with a ranked, actionable list of what to fix first.",
        "Check resumes for machine (ATS) readability and match them against specific job postings.",
        "Export the full report as a PDF while keeping deep links and keyboard navigation.",
        "Keep uploads private — extract in memory and never store the file.",
      ],
      technicalChallenges: [
        "Fetching arbitrary user-supplied URLs safely with an SSRF-guarded fetcher that rejects private/loopback hosts across redirects, under strict time and body caps.",
        "Keeping AI output honest — pairing every AI claim with supporting evidence and mechanically stripping invented numbers from resume rewrites.",
        "Reading resumes from PDF, DOCX, and images (OCR), sniffing format from file bytes rather than the extension.",
        "Detecting the field from a document's own vocabulary, reporting confidence and falling back rather than committing to a wrong guess.",
        "A tabbed report that still prints every panel, keeps deep links via the URL hash, and follows the ARIA tabs keyboard pattern.",
      ],
      developmentProcess: [
        "Built a weighted scoring engine (projects, sections, design, skills, links, performance) that returns the evidence behind every score.",
        "Added discipline profiles so each field is scored against what it actually expects as proof of work.",
        "Layered in optional Groq-powered AI review, resume rewrite, cover letter, job match, and company briefing — each strictly additive and degrading cleanly without a key.",
        "Wrote a deterministic, network-free test suite over HTML and synthesized document fixtures, pinning each real-world idiom the checks must recognize.",
      ],
      results: [
        { value: "0–100", label: "Weighted score with ranked fixes" },
        { value: "3 inputs", label: "Website, resume & portfolio file" },
        { value: "12+ fields", label: "Field-aware scoring" },
      ],
      lessonsLearned: [
        "AI is only safe here when it's strictly additive and every claim is pinned to evidence — an unsupported confident sentence is worse than no feature at all.",
        "Declining to guess (low-confidence fields, ambiguous title/company splits) builds more trust than a confident wrong answer.",
        "Judging every applicant against a developer's standards was actively wrong for other fields — the field profile had to decide which checks even run.",
      ],
    },
  },
  {
    slug: "personal-portfolio",
    title: "Personal Portfolio Website",
    tagline: "Dashboard-style portfolio in Next.js 16",
    description:
      "This site: a black-and-white dashboard on Next.js 16 — sidebar, widgets and charts drawn from my own data — with an ID badge you can grab and swing, a 3D model of my room, a ⌘K command menu and keyboard navigation.",
    image: "/images/projects/portfolio_dashboard_thumb.png",
    featured: true,
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "View Transitions",
      "three.js",
      "Claude Code",
      "Windsurf",
    ],
    githubUrl: "https://github.com/Maevexsushi/Princess_Elfa_Portfolio",
    liveUrl: "#",
    screenshots: [
      { src: "/images/projects/portfolio_dashboard_thumb.png", alt: "Portfolio overview dashboard" },
    ],
    caseStudy: {
      overview:
        "My personal portfolio, built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4. It is laid out as a dashboard: an overview of widgets — the ID badge, headline figures, current work, a projects table, a stack chart and a career timeline — with each opening onto a full page. It is black and white throughout, in one typeface.",
      businessProblem:
        "Employers and clients need to judge quickly whether I can do the work. A grid of cards and badges says little about how I think, so the site needed to put real projects first and let each one explain its problem, its hard parts and its results.",
      userRequirements: [
        "See the whole picture at a glance, then drill into any project, role or skill.",
        "Back each project with a written case study.",
        "Fast, accessible and comfortable to read on any screen, from a phone up.",
        "Light and dark themes that follow the visitor's system and remember their choice.",
        "Quick ways to act: copy my email, download my résumé, or jump anywhere.",
        "Every way to reach me in one place: email, LinkedIn, GitHub and the résumé.",
        "Strong SEO: metadata, sitemap, robots rules and structured data.",
      ],
      technicalChallenges: [
        "Applying the saved theme before first paint with an inline script, so the page never flashes the wrong colors, while keeping server and client markup identical.",
        "A ⌘K command menu built on a native <dialog> and the ARIA combobox pattern, so focus trapping, Escape and screen-reader announcements work without a UI library.",
        "Charts that can't drift from the content: technology usage is counted from the projects list, and the career timeline is drawn from each role's dates.",
        "A collapsible sidebar whose state, like the theme, is applied before first paint, plus G-then-letter keyboard navigation in the style of developer tools.",
        "An ID badge on a lanyard that visitors can drag, swing and fling, built as a small Verlet physics simulation with no libraries: the strap is a chain of points, the card a rigid bar, and the loop sleeps when it comes to rest.",
        "Morphing project images from the work list into the case study with React's <ViewTransition> and Next.js navigation.",
        "A 3D room in React Three Fiber that follows Philippine time and live weather, with 15 clickable objects — lazy-loaded so only the Setup page pays for three.js.",
        "Showing my local time and the right keyboard shortcut for each platform without hydration mismatches.",
      ],
      developmentProcess: [
        "Defined black-and-white design tokens (ink, muted ink and rules) as CSS variables with matching light and dark sets, checked for WCAG contrast.",
        "Set the type system: Geist throughout, with headings set heavier and tighter, and Geist Mono for labels.",
        "Built the app shell: a collapsible sidebar on desktop and a tab bar on phones, with breadcrumbs and page routes for every section.",
        "Built typed widgets and charts over centralized content data, so every number on screen comes from one source.",
        "Added the interaction layer: command menu, keyboard shortcuts, project search and filters, toasts, theme switching and view transitions.",
        "Added SEO metadata, sitemap, robots rules and JSON-LD.",
      ],
      results: [
        { value: "⌘K", label: "Every page and action one shortcut away" },
        { value: "2 themes", label: "Light and dark, with no flash on load" },
        { value: "0", label: "Hand-typed chart numbers: all derived from content" },
      ],
      lessonsLearned: [
        "A dashboard earns its density only when every figure is real — derived data beats decoration.",
        "Restraint reads as quality: one typeface and two colors did more than any effect.",
        "The platform now covers what used to need libraries: <dialog>, scroll timelines and view transitions.",
        "Centralizing content in typed data files kept this redesign to the presentation layer.",
      ],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
