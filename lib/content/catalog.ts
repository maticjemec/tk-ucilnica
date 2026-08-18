import { dashboardPrograms } from "@/lib/content/dashboard";
import type {
  CatalogFilterId,
  CatalogProgram,
  CatalogSortId,
  ProgramCategory,
} from "@/types/catalog";

type CatalogFields = Pick<
  CatalogProgram,
  | "category"
  | "categoryLabel"
  | "lessons"
  | "duration"
  | "price"
  | "popularity"
  | "isFavorite"
> &
  Partial<
    Pick<CatalogProgram, "id" | "description" | "imageSrc" | "imageAlt" | "visual">
  >;

const categoriesByFilter: Record<
  Exclude<CatalogFilterId, "all">,
  ProgramCategory[]
> = {
  anxiety: ["anxiety"],
  confidence: ["confidence"],
  growth: ["growth"],
  "self-hypnosis": ["self-hypnosis"],
  "sleep-relaxation": ["sleep", "relaxation"],
};

export const catalogFilters: Array<{ id: CatalogFilterId; label: string }> = [
  { id: "all", label: "Vsi programi" },
  { id: "anxiety", label: "Zmanjšanje stresa in anksioznosti" },
  { id: "confidence", label: "Samozavest in samopodoba" },
  { id: "growth", label: "Osebna rast" },
  { id: "self-hypnosis", label: "Samohipnoza" },
  { id: "sleep-relaxation", label: "Spanec in sprostitev" },
];

export const catalogSortOptions: Array<{ id: CatalogSortId; label: string }> = [
  { id: "popularity", label: "Priljubljenost" },
  { id: "price-asc", label: "Cena: najnižja" },
  { id: "price-desc", label: "Cena: najvišja" },
  { id: "name-asc", label: "Ime A–Ž" },
];

function fromDashboard(slug: string, fields: CatalogFields): CatalogProgram {
  const program = dashboardPrograms.find((item) => item.slug === slug);

  if (!program) {
    throw new Error(`Unknown dashboard program slug: ${slug}`);
  }

  return {
    id: fields.id ?? program.slug,
    slug: program.slug,
    title: program.title,
    description: fields.description ?? program.description,
    visual: fields.visual ?? program.visual,
    imageSrc: fields.imageSrc ?? program.imageSrc,
    imageAlt: fields.imageAlt ?? program.imageAlt,
    category: fields.category,
    categoryLabel: fields.categoryLabel,
    lessons: fields.lessons,
    duration: fields.duration,
    price: fields.price,
    popularity: fields.popularity,
    isFavorite: fields.isFavorite,
  };
}

export const catalogPrograms: CatalogProgram[] = [
  fromDashboard("21-dni-do-manj-anksioznosti", {
    category: "anxiety",
    categoryLabel: "Anksioznost",
    lessons: 12,
    duration: "21 dni",
    price: 89,
    popularity: 100,
    isFavorite: false,
    description:
      "Program za pomiritev uma, zmanjšanje stresa in več notranjega miru.",
  }),
  fromDashboard("21-dni-do-boljse-samozavesti", {
    category: "confidence",
    categoryLabel: "Samozavest",
    lessons: 10,
    duration: "21 dni",
    price: 89,
    popularity: 90,
    isFavorite: false,
  }),
  fromDashboard("najdi-sebe", {
    category: "growth",
    categoryLabel: "Osebna rast",
    lessons: 9,
    duration: "21 dni",
    price: 79,
    popularity: 80,
    isFavorite: false,
  }),
  fromDashboard("samohipnoza-v-praksi", {
    category: "self-hypnosis",
    categoryLabel: "Samohipnoza",
    lessons: 8,
    duration: "Lifetime",
    price: 69,
    popularity: 70,
    isFavorite: false,
  }),
  {
    id: "boljsi-spanec-boljse-jutri",
    slug: "boljsi-spanec-boljse-jutri",
    title: "BOLJŠI SPANEC, BOLJŠE JUTRI",
    description:
      "Nežen program za globlji spanec, umirjene večere in boljša jutra.",
    category: "sleep",
    categoryLabel: "Spanec",
    lessons: 8,
    duration: "21 dni",
    price: 69,
    popularity: 60,
    isFavorite: false,
    visual: "moon",
    imageAlt: "Mirna noč in mehka svetloba za boljši spanec",
  },
  {
    id: "umiri-telo-umiri-um",
    slug: "umiri-telo-umiri-um",
    title: "UMIRI TELO, UMIRI UM",
    description:
      "Sprostitev telesa in uma s hipnozo, dihom in nežnimi vodenimi vajami.",
    category: "relaxation",
    categoryLabel: "Sprostitev",
    lessons: 7,
    duration: "14 dni",
    price: 59,
    popularity: 50,
    isFavorite: false,
    visual: "calm",
    imageAlt: "Mirna voda in mehka svetloba za sprostitev",
  },
  {
    id: "zasij-v-21-dneh",
    slug: "zasij-v-21-dneh",
    title: "ZASIJ V 21 DNEH",
    description:
      "21-dnevna pot do več svetlobe, jasnosti in notranje moči.",
    category: "growth",
    categoryLabel: "Osebna rast",
    lessons: 11,
    duration: "21 dni",
    price: 89,
    popularity: 40,
    isFavorite: false,
    visual: "glow",
    imageAlt: "Topla svetloba ob sončnem vzhodu",
  },
  {
    id: "21-dni-hvaleznosti",
    slug: "21-dni-hvaleznosti",
    title: "21 DNI HVALEŽNOSTI",
    description:
      "Dnevnik hvaležnosti, ki krepi mir, prisotnost in toplejši pogled na življenje.",
    category: "journal",
    categoryLabel: "Dnevnik",
    lessons: 7,
    duration: "21 dni",
    price: 59,
    popularity: 30,
    isFavorite: false,
    visual: "journal",
    imageAlt: "Odprt dnevnik na svetlem, umirjenem ozadju",
  },
];

export function filterCatalogPrograms(
  programs: CatalogProgram[],
  filter: CatalogFilterId,
): CatalogProgram[] {
  if (filter === "all") {
    return programs;
  }

  const categories = categoriesByFilter[filter];
  return programs.filter((program) => categories.includes(program.category));
}

export function sortCatalogPrograms(
  programs: CatalogProgram[],
  sort: CatalogSortId,
): CatalogProgram[] {
  const next = [...programs];

  switch (sort) {
    case "price-asc":
      return next.sort((a, b) => a.price - b.price || b.popularity - a.popularity);
    case "price-desc":
      return next.sort((a, b) => b.price - a.price || b.popularity - a.popularity);
    case "name-asc":
      return next.sort((a, b) => a.title.localeCompare(b.title, "sl"));
    case "popularity":
    default:
      return next.sort((a, b) => b.popularity - a.popularity);
  }
}

export function getVisibleCatalogPrograms(
  programs: CatalogProgram[],
  filter: CatalogFilterId,
  sort: CatalogSortId,
): CatalogProgram[] {
  return sortCatalogPrograms(filterCatalogPrograms(programs, filter), sort);
}

export function formatCatalogPrice(price: number) {
  return `${price} €`;
}

export function formatCatalogLessons(lessons: number) {
  return `${lessons} lekcij`;
}

export function getCatalogProgramBySlug(slug: string) {
  return catalogPrograms.find((program) => program.slug === slug);
}
