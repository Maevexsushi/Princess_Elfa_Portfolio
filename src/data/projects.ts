import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "dermasculpt",
    title: "DermaSculpt",
    tagline: "AI Dermatology Clinic Support System",
    description:
      "An AI-powered clinic support platform that helps dermatology staff triage patient inquiries, surface relevant information, and respond faster. Improved response times by 30%.",
    image: "/images/projects/dermasculpt.svg",
    featured: true,
    technologies: ["JavaScript", "PHP", "MySQL", "AI APIs"],
    impact: "+30% faster response times",
    githubUrl: "https://github.com/princessmae/dermasculpt",
    liveUrl: "#",
    screenshots: [
      { src: "/images/projects/dermasculpt.svg", alt: "DermaSculpt dashboard overview" },
      { src: "/images/projects/dermasculpt-2.svg", alt: "DermaSculpt AI triage panel" },
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
    slug: "clinic-support-automation",
    title: "Clinic Customer Support Automation",
    tagline: "AI-powered customer inquiry management",
    description:
      "An AI-powered customer inquiry management system that streamlines support workflows and improves the customer experience by routing, drafting, and tracking responses.",
    image: "/images/projects/clinic-support.svg",
    featured: true,
    technologies: ["JavaScript", "PHP", "MySQL", "AI APIs"],
    impact: "Streamlined support workflows",
    githubUrl: "https://github.com/princessmae/clinic-support-automation",
    liveUrl: "#",
    screenshots: [
      { src: "/images/projects/clinic-support.svg", alt: "Support automation inbox" },
    ],
    caseStudy: {
      overview:
        "A support automation layer that helps a clinic manage inbound customer inquiries end to end — capturing messages, categorizing them, drafting AI-assisted replies, and tracking resolution status.",
      businessProblem:
        "Customer inquiries arrived across multiple channels with no central tracking, causing missed messages, slow replies, and an inconsistent customer experience.",
      userRequirements: [
        "Centralize inquiries into a single manageable queue.",
        "Automatically categorize and prioritize incoming messages.",
        "Suggest draft replies staff can approve or edit.",
        "Track status from received to resolved.",
      ],
      technicalChallenges: [
        "Reliably categorizing free-text inquiries with AI.",
        "Preventing duplicate or dropped messages in the queue.",
        "Keeping the interface fast for non-technical staff.",
      ],
      developmentProcess: [
        "Mapped the existing manual support flow with staff.",
        "Built a queue and status model in MySQL.",
        "Added AI categorization and reply-drafting services.",
        "Rolled out with a feedback loop to refine categories.",
      ],
      results: [
        { value: "Faster", label: "Response handling" },
        { value: "Better", label: "Customer experience" },
        { value: "Zero", label: "Dropped inquiries in testing" },
      ],
      lessonsLearned: [
        "Clear status tracking mattered as much as automation itself.",
        "Simple, fast UI adoption beat feature richness for staff.",
      ],
    },
  },
  {
    slug: "land-administration-tools",
    title: "Land Administration Support Tools",
    tagline: "Document retrieval & digital records (DENR)",
    description:
      "Support tools built during a DENR internship focused on document retrieval improvements and digital record management for the Land Administration and Management System (LAMS).",
    image: "/images/projects/land-admin.svg",
    featured: true,
    technologies: ["LAMS", "Document Management", "System Testing"],
    impact: "+15% document retrieval efficiency",
    githubUrl: "#",
    liveUrl: "#",
    screenshots: [
      { src: "/images/projects/land-admin.svg", alt: "Land administration records view" },
    ],
    caseStudy: {
      overview:
        "During an internship at the Department of Environment and Natural Resources (DENR), work focused on improving document retrieval and digital record management within the Land Administration and Management System (LAMS).",
      businessProblem:
        "Locating land documents was slow and manual, making record retrieval a bottleneck for staff serving citizen requests.",
      userRequirements: [
        "Retrieve land records faster and more reliably.",
        "Improve organization of digital records.",
        "Validate data accuracy during system testing.",
        "Provide technical support to staff using the system.",
      ],
      technicalChallenges: [
        "Working within an existing government system (LAMS).",
        "Improving retrieval without disrupting live operations.",
        "Validating data integrity across records.",
      ],
      developmentProcess: [
        "Shadowed staff to understand retrieval pain points.",
        "Assisted with digital record organization improvements.",
        "Performed system testing and validation.",
        "Provided troubleshooting and configured software/hardware.",
      ],
      results: [
        { value: "15%", label: "Faster document retrieval" },
        { value: "Improved", label: "Digital record management" },
        { value: "Validated", label: "System accuracy" },
      ],
      lessonsLearned: [
        "Government systems demand careful, low-risk incremental change.",
        "Small workflow improvements compound into meaningful time savings.",
      ],
    },
  },
  {
    slug: "personal-portfolio",
    title: "Personal Portfolio Website",
    tagline: "Built with Next.js",
    description:
      "This portfolio, built with Next.js and optimized for performance, SEO, and responsiveness — featuring a terminal-inspired developer aesthetic and smooth animations.",
    image: "/images/projects/portfolio.svg",
    featured: true,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    impact: "Optimized for performance & SEO",
    githubUrl: "https://github.com/princessmae/portfolio",
    liveUrl: "#",
    screenshots: [
      { src: "/images/projects/portfolio.svg", alt: "Portfolio home page" },
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
        { value: "A11y", label: "Keyboard & screen-reader friendly" },
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
