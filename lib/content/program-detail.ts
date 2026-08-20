import {
  catalogPrograms,
  getCatalogProgramBySlug,
} from "@/lib/content/catalog";
import { toCatalogProgram } from "@/lib/programs/mappers";
import type { Program } from "@/lib/programs/types";
import type { CatalogProgram, ProgramCategory } from "@/types/catalog";
import type {
  ProgramAuthor,
  ProgramCurriculumItem,
  ProgramDetail,
  ProgramDetailListItem,
} from "@/types/program-detail";

/**
 * Local extras for public program detail.
 *
 * TASK 013B: public.programs is canonical for identity (title, slug, price,
 * category, descriptions, duration, lesson_count, difficulty).
 * This file only overlays content that is not in the programs table yet:
 * benefits, includes, purchase benefits, author, curriculum teaser.
 */

const defaultAuthor: ProgramAuthor = {
  name: "Tina Korošec",
  role: "Hipnoterapevtka",
  bio: "Pomagam ljudem najti notranji mir, samozavest in jasnost z močjo hipnoze.",
  initials: "TK",
};

const defaultPurchaseBenefits: ProgramDetailListItem[] = [
  {
    id: "instant-access",
    label: "Takojšnji dostop po nakupu",
    icon: "clock",
  },
  {
    id: "lifetime-lessons",
    label: "Dostop do vseh lekcij za vedno",
    icon: "loop",
  },
  {
    id: "print-worksheets",
    label: "Delovni listi za tiskanje",
    icon: "file",
  },
  {
    id: "multi-device",
    label: "Dostop na telefonu, tablici in računalniku",
    icon: "monitor",
  },
  {
    id: "lifetime-updates",
    label: "LifeTime posodobitve",
    icon: "refresh",
  },
];

const defaultBenefits = [
  "Jasnejši občutek, kaj potrebuješ in kam želiš",
  "Vsakodnevne vaje, ki jih zlahka vključiš v svoj ritem",
  "Več miru, osredotočenosti in notranje opore",
  "Orodja, ki ostanejo s tabo tudi po zaključku programa",
];

const breadcrumbByCategory: Record<ProgramCategory, string> = {
  anxiety: "Zmanjšanje stresa in anksioznosti",
  confidence: "Samozavest in samopodoba",
  growth: "Osebna rast",
  "self-hypnosis": "Samohipnoza",
  sleep: "Spanec in sprostitev",
  relaxation: "Spanec in sprostitev",
  journal: "Dnevnik",
};

type ProgramDetailOverride = Partial<
  Pick<
    ProgramDetail,
    | "shortDescription"
    | "longDescription"
    | "difficulty"
    | "breadcrumbLabel"
    | "benefits"
    | "curriculum"
    | "includes"
    | "purchaseBenefits"
    | "author"
    | "accessState"
  >
>;

const curriculumDurations = ["13 min", "15 min", "14 min", "16 min", "12 min"];

function lessonDuration(order: number) {
  return curriculumDurations[(order - 1) % curriculumDurations.length];
}

function createCurriculum(
  slug: string,
  titles: string[],
  previewCount = 5,
): ProgramCurriculumItem[] {
  return titles.map((title, index) => {
    const order = index + 1;
    return {
      id: `${slug}-lesson-${order}`,
      order,
      title,
      duration: lessonDuration(order),
      isPreview: order <= previewCount,
    };
  });
}

function fallbackCurriculum(
  program: CatalogProgram,
): ProgramCurriculumItem[] {
  return Array.from({ length: program.lessons }, (_, index) => {
    const order = index + 1;
    return {
      id: `${program.slug}-lesson-${order}`,
      order,
      title: `Lekcija ${order}`,
      duration: lessonDuration(order),
      isPreview: order <= 5,
    };
  });
}

function formatProgramLengthLabel(duration: string) {
  const match = duration.match(/^(\d+)\s*dni$/i);
  if (match) {
    return `${match[1]}-dnevni program`;
  }

  if (duration.toLowerCase() === "lifetime") {
    return "Doživljenjski program";
  }

  return duration;
}

function formatVideoLessonsLabel(lessons: number) {
  return `${lessons} video lekcij`;
}

function defaultIncludes(program: CatalogProgram): ProgramDetailListItem[] {
  return [
    {
      id: "video-lessons",
      label: formatVideoLessonsLabel(program.lessons),
      icon: "play",
    },
    {
      id: "program-length",
      label: formatProgramLengthLabel(program.duration),
      icon: "calendar",
    },
    {
      id: "worksheets",
      label: "Delovni listi in vaje",
      icon: "file",
    },
    {
      id: "reminders",
      label: "Dnevni opomniki",
      icon: "clock",
    },
    {
      id: "forever-access",
      label: "Dostop za vedno",
      icon: "lock",
    },
  ];
}

const programDetailOverrides: Record<string, ProgramDetailOverride> = {
  "21-dni-do-manj-anksioznosti": {
    difficulty: "Vseh stopenj",
    benefits: [
      "Boljše razumevanje, kako se anksioznost pokaže v telesu in mislih",
      "Orodja za umirjanje v trenutku, ko se napetost dvigne",
      "Manj izogibanja in več mirnega soočenja",
      "Občutek notranje varnosti, ki ostane tudi po programu",
    ],
  },
  "21-dni-do-boljse-samozavesti": {
    shortDescription:
      "Okrepi svojo samozavest in zgradi notranjo moč, ki te vodi naprej.",
    longDescription:
      "Ta 21-dnevni program ti pomaga premagati dvome, okrepiti samozavest in občutek lastne vrednosti. Z vsakodnevno prakso in vodenimi vajami boš stopil/a v svojo najbolj avtentično različico sebe.",
    difficulty: "Vseh stopenj",
    benefits: [
      "Več zaupanja vase in v svoje odločitve",
      "Manj notranjega kritika in dvomov",
      "Jasnejšo samopodobo in osebno moč",
      "Boljše odnose in samozavestno komunikacijo",
    ],
    curriculum: createCurriculum("21-dni-do-boljse-samozavesti", [
      "Dan 1: Spoznaj svojo vrednost",
      "Dan 2: Premagaj dvome",
      "Dan 3: Zgradi notranjo moč",
      "Dan 4: Samozavest v dejanjih",
      "Dan 5: Govori s seboj z ljubeznijo",
      "Dan 6: Telo kot zaveznik",
      "Dan 7: Postavi zdrave meje",
      "Dan 8: Samozavest v odnosih",
      "Dan 9: Pogum za nove korake",
      "Dan 10: Živi iz svoje moči",
    ]),
  },
  "najdi-sebe": {
    difficulty: "Vseh stopenj",
    benefits: [
      "Jasnejši občutek, kdo si in kaj ti res daje smisel",
      "Manj prilagajanja pričakovanjem, ki niso tvoja",
      "Moč, da izbiraš v skladu s svojimi vrednotami",
      "Konkretnejšo smer, v katero želiš iti",
    ],
  },
  "samohipnoza-v-praksi": {
    difficulty: "Vseh stopenj",
    benefits: [
      "Zanesljiv način, kako vstopiti v sproščeno stanje",
      "Sugestije, ki jih lahko uporabljaš sam/a, kadar jih potrebuješ",
      "Prakso za mir in samozavest v vsakdanu",
      "Osebni ritual, ki ostane s tabo tudi po programu",
    ],
  },
};

function buildProgramDetail(program: CatalogProgram): ProgramDetail {
  const override = programDetailOverrides[program.slug] ?? {};

  return {
    ...program,
    shortDescription: override.shortDescription ?? program.description,
    longDescription:
      override.longDescription ??
      `${program.description} S premišljenimi vajami in vodenimi lekcijami te program vodi korak za korakom.`,
    difficulty: override.difficulty ?? "Vseh stopenj",
    breadcrumbLabel:
      override.breadcrumbLabel ?? breadcrumbByCategory[program.category],
    benefits: override.benefits ?? defaultBenefits,
    curriculum: override.curriculum ?? fallbackCurriculum(program),
    includes: override.includes ?? defaultIncludes(program),
    purchaseBenefits: override.purchaseBenefits ?? defaultPurchaseBenefits,
    author: override.author ?? defaultAuthor,
    accessState: override.accessState ?? "public",
  };
}

/**
 * Overlay local extras onto a DB program.
 * Identity fields always come from `program` (Supabase). Local overrides
 * never replace title, price, category, descriptions, duration, or lesson count.
 */
export function overlayLocalProgramDetailExtras(
  program: Program,
): ProgramDetail {
  const catalog = toCatalogProgram(program);
  const extras = programDetailOverrides[program.slug] ?? {};

  return {
    ...catalog,
    shortDescription: program.shortDescription,
    longDescription: program.longDescription,
    difficulty: program.difficulty,
    breadcrumbLabel:
      extras.breadcrumbLabel ?? breadcrumbByCategory[program.category],
    benefits: extras.benefits ?? defaultBenefits,
    curriculum: extras.curriculum ?? fallbackCurriculum(catalog),
    includes: extras.includes ?? defaultIncludes(catalog),
    purchaseBenefits: extras.purchaseBenefits ?? defaultPurchaseBenefits,
    author: extras.author ?? defaultAuthor,
    accessState: extras.accessState ?? "public",
  };
}

export function getLocalProgramDetailExtras(slug: string) {
  const extras = programDetailOverrides[slug] ?? {};

  return {
    benefits: extras.benefits ?? defaultBenefits,
    author: extras.author ?? defaultAuthor,
    purchaseBenefits: extras.purchaseBenefits ?? defaultPurchaseBenefits,
  };
}

/**
 * @deprecated TASK 013B: not an identity source. Public detail uses
 * overlayLocalProgramDetailExtras with a Supabase Program.
 */
export function getProgramBySlug(slug: string) {
  const program = getCatalogProgramBySlug(slug);
  if (!program) {
    return undefined;
  }

  return buildProgramDetail(program);
}

/** @deprecated TASK 013B: public slugs come from getPublishedPrograms. */
export function getProgramSlugs() {
  return catalogPrograms.map((program) => program.slug);
}
