export const primaryNav = [
  { href: "/", label: "Pregled", id: "pregled" },
  { href: "/moji-programi", label: "Moji programi", id: "moji-programi" },
  { href: "/programi", label: "Vsi programi", id: "programi" },
  { href: "/nastavitve", label: "Nastavitve", id: "nastavitve" },
] as const;

export type PrimaryNavId = (typeof primaryNav)[number]["id"];

export function isNavItemActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/programi") {
    return pathname === "/programi" || pathname.startsWith("/programi/");
  }

  if (href === "/moji-programi") {
    return pathname === "/moji-programi" || pathname.startsWith("/moji-programi/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
