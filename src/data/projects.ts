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
    technologies: ["JavaScript", "PHP", "MySQL", "AI APIs"],
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
    tagline: "Built with Next.js",
    description:
      "This portfolio, built with Next.js and optimized for performance, SEO, and responsiveness — featuring a terminal-inspired developer aesthetic and smooth animations.",
    image: "/portfolio.png",
    featured: true,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    githubUrl: "https://github.com/Maevexsushi/Princess_Elfa_Portfolio",
    liveUrl: "#",
    screenshots: [
      { src: "/portfolio.png", alt: "Portfolio home page hero section" },
    ],
    caseStudy: {
      overview:
        "A production-ready personal portfolio built with Next.js (App Router), TypeScript, and Tailwind CSS. It showcases projects, experience, and skills with a modern, accessible, mobile-first design.",
      businessProblem:
        "Needed a professional online presence to reach employers and direct clients, clearly communicating skills, projects, and availability.",
      userRequirements: [
        "Fast, mobile-first, and accessible experience.",
        "Strong SEO for discoverability.",
        "Clear project case studies and a working contact form.",
        "Dark mode and a developer-focused aesthetic.",
      ],
      technicalChallenges: [
        "Balancing rich animation with performance and reduced-motion support.",
        "Implementing accessible keyboard navigation throughout.",
        "Server-side email delivery for the contact form.",
      ],
      developmentProcess: [
        "Designed a token-based dark theme with subtle blue accents.",
        "Built reusable, typed components and centralized content data.",
        "Added SEO metadata, sitemap, robots, and JSON-LD.",
        "Wired a Nodemailer contact API route with validation.",
      ],
      results: [
        { value: "SEO", label: "Metadata, sitemap & structured data" },
        { value: "Accessible", label: "Keyboard & screen-reader friendly" },
        { value: "Fast", label: "Optimized images & fonts" },
      ],
      lessonsLearned: [
        "Centralizing content in typed data files makes updates painless.",
        "Respecting reduced-motion preferences keeps animation inclusive.",
      ],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
