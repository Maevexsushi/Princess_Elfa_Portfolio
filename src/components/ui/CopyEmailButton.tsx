"use client";

import { Copy } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/cn";

export function CopyEmailButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => copyText(siteConfig.email, "Email address copied")}
      className={cn("group inline-flex items-center gap-2", className)}
    >
      {children ?? (
        <>
          <Copy className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          Copy email
        </>
      )}
    </button>
  );
}
