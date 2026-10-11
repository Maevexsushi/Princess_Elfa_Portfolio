/**
 * The dashboard's pages. `key` is the second key of the "G then …" shortcut
 * (G O, G P, …) and `icon` resolves in the components that draw the nav.
 */
export const navLinks = [
  { label: "Overview", href: "/", key: "o", icon: "overview" },
  { label: "Projects", href: "/projects", key: "p", icon: "projects" },
  { label: "Experience", href: "/experience", key: "e", icon: "experience" },
  { label: "Stack", href: "/stack", key: "s", icon: "stack" },
  { label: "Contact", href: "/contact", key: "c", icon: "contact" },
] as const;

export type NavIcon = (typeof navLinks)[number]["icon"];

/** Whether `pathname` is inside the section `href` heads. */
export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
