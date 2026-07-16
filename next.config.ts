import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder project art is local, trusted SVG. Allow the optimizer to
    // serve it (with a strict CSP + attachment disposition as a safety net).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
