import { siteConfig } from "@/data/siteConfig";

/** A quiet sign-off under the content. Room is left for the tab bar on phones. */
export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[90rem] px-4 pb-24 sm:px-6 lg:px-8 lg:pb-8">
      <div className="eyebrow flex flex-col gap-2 border-t border-rule pt-5 text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <p className="hidden sm:block">
          Press <kbd className="rounded border border-rule px-1">G</kbd> then a page&apos;s letter to
          jump · <kbd className="rounded border border-rule px-1">[</kbd> folds the sidebar
        </p>
      </div>
    </footer>
  );
}
