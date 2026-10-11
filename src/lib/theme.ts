export type Theme = "light" | "dark";

const THEME_KEY = "theme";
const SIDEBAR_KEY = "sidebar";

/**
 * Runs inline in <head>, before first paint, so neither the theme nor the
 * sidebar's width ever flashes. A saved theme wins; otherwise the OS
 * preference applies, and keeps applying if it changes while the page is open.
 */
export const themeScript = `(function(){try{var d=document.documentElement,k="${THEME_KEY}",m=window.matchMedia("(prefers-color-scheme: dark)"),s=localStorage.getItem(k);d.setAttribute("data-theme",s||(m.matches?"dark":"light"));m.addEventListener("change",function(e){if(!localStorage.getItem(k))d.setAttribute("data-theme",e.matches?"dark":"light")});if(localStorage.getItem("${SIDEBAR_KEY}")==="collapsed")d.setAttribute("data-sidebar","collapsed")}catch(e){}})()`;

export function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function save(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Private mode or blocked storage: the change still holds for this visit.
  }
}

export function toggleTheme() {
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  save(THEME_KEY, next);
}

export function toggleSidebar() {
  const root = document.documentElement;
  const collapsed = root.getAttribute("data-sidebar") === "collapsed";
  if (collapsed) root.removeAttribute("data-sidebar");
  else root.setAttribute("data-sidebar", "collapsed");
  save(SIDEBAR_KEY, collapsed ? null : "collapsed");
}
