export const primaryNav = [
  { href: "/", label: "Pregled", id: "pregled" },
  { href: "/moji-programi", label: "Moji programi", id: "moji-programi" },
  { href: "/programi", label: "Vsi programi", id: "programi" },
  { href: "/nastavitve", label: "Nastavitve", id: "nastavitve" },
] as const;

export type PrimaryNavId = (typeof primaryNav)[number]["id"];
