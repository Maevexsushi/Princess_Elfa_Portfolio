/**
 * The dashboard's pages. `key` is the second key of the "G then …" shortcut
 * (G O, G P, …) and `icon` resolves in the components that draw the nav.
 * `tab: false` leaves a page out of the phone tab bar.
 */
export const navLinks = [
  { label: "Overview", href: "/", key: "o", icon: "overview" },
  { label: "Projects", href: "/projects", key: "p", icon: "projects" },
  { label: "Experience", href: "/experience", key: "e", icon: "experience" },
  { label: "Stack", href: "/stack", key: "s", icon: "stack" },
  { label: "Résumé", href: "/resume", key: "r", icon: "resume", tab: false },
  { label: "Contact", href: "/contact", key: "c", icon: "contact" },
] as const;

/** The pages in the phone tab bar; the résumé is reached from the top bar. */
export const tabLinks = navLinks.filter((l) => !("tab" in l && l.tab === false));

export type NavIcon = (typeof navLinks)[number]["icon"];

/** Whether `pathname` is inside the section `href` heads. */
export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
