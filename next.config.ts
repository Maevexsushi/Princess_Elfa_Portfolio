import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Project imagery morphs from the work list into its case study.
    viewTransition: true,
  },
  images: {
    // Placeholder project art is local, trusted SVG. Allow the optimizer to
    // serve it (with a strict CSP + attachment disposition as a safety net).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
