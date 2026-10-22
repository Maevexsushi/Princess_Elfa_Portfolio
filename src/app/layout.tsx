import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { MobileTabBar } from "@/components/shell/MobileTabBar";
import { Shortcuts } from "@/components/shell/Shortcuts";
import { Footer } from "@/components/shell/Footer";
import { siteConfig } from "@/data/siteConfig";
import { socialLinks } from "@/data/social";
import { themeScript } from "@/lib/theme";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Toaster } from "@/components/ui/Toaster";
import { AskAI } from "@/components/ui/AskAI";

// Geist sets everything — headings are the same family, heavier and tighter.
// Geist Mono sets labels, indices and captions.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.intro,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.intro,
    siteName: siteConfig.name,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.intro,
    images: ["/og.png"],
  },
  alternates: { canonical: siteConfig.url },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: siteConfig.title,
  address: { "@type": "PostalAddress", addressCountry: siteConfig.location },
  email: siteConfig.email,
  url: siteConfig.url,
  sameAs: socialLinks
    .filter((l) => l.icon !== "email")
    .map((l) => l.href),
  knowsAbout: siteConfig.keywords,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full`}
      // The theme script sets data-theme before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-bg"
        >
          Skip to content
        </a>
        <Sidebar />
        <div className="flex min-h-screen flex-col transition-[padding] duration-300 ease-out-quint lg:pl-[var(--sidebar-w)]">
          <TopBar />
          <main
            id="main"
            className="mx-auto w-full max-w-[90rem] flex-1 px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:pt-8"
          >
            {children}
          </main>
          <Footer />
        </div>
        <MobileTabBar />
        <CommandPalette />
        <Toaster />
        <AskAI />
        <Shortcuts />
      </body>
    </html>
  );
}
