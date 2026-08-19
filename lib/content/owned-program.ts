import { dashboardPrograms } from "@/lib/content/dashboard";
import {
  formatLessonHeading,
  getAdjacentLessons,
} from "@/lib/owned-program/access";
import { getOwnedLessonPath } from "@/lib/owned-program/paths";
import type {
  LessonResource,
  OwnedProgram,
  ProgramLesson,
} from "@/types/owned-program";

const DURATION_LABELS = ["13 min", "15 min", "14 min", "16 min", "12 min"] as const;
const DURATION_SECONDS = [13 * 60, 15 * 60, 14 * 60, 16 * 60, 12 * 60] as const;

function durationForDay(day: number) {
  const index = (day - 1) % DURATION_LABELS.length;
  return {
    duration: DURATION_LABELS[index],
    durationSeconds: DURATION_SECONDS[index],
  };
}

function worksheet(day: number, title: string): LessonResource {
  return {
    id: `resource-day-${day}`,
    title: `Delovni list – ${title}`,
    kind: "pdf",
    formatLabel: "PDF",
    sizeLabel: "1.2 MB",
  };
}

function createLesson(
  day: number,
  slug: string,
  title: string,
  description: string,
  extras?: Partial<Pick<ProgramLesson, "duration" | "durationSeconds" | "resources">>,
): ProgramLesson {
  const timing = durationForDay(day);

  return {
    id: `21-dni-do-boljse-samozavesti-day-${day}`,
    slug,
    day,
    title,
    description,
    duration: extras?.duration ?? timing.duration,
    durationSeconds: extras?.durationSeconds ?? timing.durationSeconds,
    media: {
      kind: "video",
      durationSeconds: extras?.durationSeconds ?? timing.durationSeconds,
      provider: "mock",
    },
    resources: extras?.resources ?? [worksheet(day, title)],
  };
}

const demonstratedLessons: ProgramLesson[] = [
  createLesson(
    1,
    "spoznaj-svojo-vrednost",
    "Spoznaj svojo vrednost",
    "Danes se ustavi pri tem, kdo si – brez primerjav in brez pogojev. Tvoja vrednost ni nekaj, kar moraš dokazati.",
  ),
  createLesson(
    2,
    "premagaj-dvome",
    "Premagaj dvome",
    "Dvomi se lahko umirijo, ko jih pogledaš od blizu. Danes se naučiš, kako jih slišiš, ne da bi jim predal krmilo.",
  ),
  createLesson(
    3,
    "zgradi-notranjo-moc",
    "Zgradi notranjo moč",
    "Notranja moč ni nekaj, s čimer se rodiš. Je nekaj, kar vsak dan gradiš – skozi svoje misli, odločitve in dejanja. Danes boš naredil/a korak k sebi.",
    { duration: "14 min", durationSeconds: 14 * 60 + 20 },
  ),
  createLesson(
    4,
    "samozavest-v-dejanjih",
    "Samozavest v dejanjih",
    "Samozavest zraste, ko jo živiš. Danes narediš majhen, konkreten korak, ki potrdi tvojo notranjo držo.",
  ),
  createLesson(
    5,
    "govori-s-seboj-z-ljubeznijo",
    "Govori s seboj z ljubeznijo",
    "Notranji glas te lahko podpira ali te taji. Danes vadimo govor, ki je jasen, topel in resničen.",
  ),
  createLesson(
    6,
    "postavi-zdrave-meje",
    "Postavi zdrave meje",
    "Meje niso zid. So način, kako varuješ svojo energijo in ostajaš zvest/a sebi.",
  ),
  createLesson(
    7,
    "sprejmi-in-bodi-hvalezen",
    "Sprejmi in bodi hvaležen/a",
    "Hvaležnost ne izniči tistega, kar je težko. Pomaga ti videti, kaj že drži tvoj dan.",
  ),
  createLesson(
    8,
    "vizualizacija-tvoje-prihodnosti",
    "Vizualizacija tvoje prihodnosti",
    "Danes si dovoliš jasno sliko prihodnosti, v kateri stojiš v svoji moči – mirno in samozavestno.",
  ),
  createLesson(
    9,
    "premagaj-strah-pred-neuspehom",
    "Premagaj strah pred neuspehom",
    "Strah pred napako te lahko ustavi še pred prvim korakom. Danes ga pogledaš in greš mimo njega.",
  ),
  createLesson(
    10,
    "praznuj-sebe",
    "Praznuj sebe",
    "Zaključek ni konec. Je trenutek, ko prepoznaš, koliko si že naredil/a – in to proslaviš.",
  ),
];

const extraLessonTitles = [
  "Utrdi notranji mir",
  "Dih kot sidro",
  "Jasnost v odločitvah",
  "Telo kot zaveznik",
  "Samozavest v odnosih",
  "Pogum za nove korake",
  "Ritem, ki te nosi",
  "Mehka disciplina",
  "Živi iz svoje moči",
  "Vrni se k sebi",
  "Nadaljuj svojo prakso",
];

const extraLessons: ProgramLesson[] = extraLessonTitles.map((title, index) => {
  const day = index + 11;
  return createLesson(
    day,
    `dan-${day}`,
    title,
    "Nadaljuj s prakso in poglobi tisto, kar si že začel/a graditi. Ta dan je pripravljen v modelu, v tem prvem prikazu pa še ni viden v vsebini programa.",
    { resources: [] },
  );
});

function fromCatalogIdentity(slug: string) {
  const program = dashboardPrograms.find((item) => item.slug === slug);

  if (!program) {
    throw new Error(`Unknown dashboard program slug: ${slug}`);
  }

  return program;
}

const confidenceIdentity = fromCatalogIdentity("21-dni-do-boljse-samozavesti");
const confidenceLessons = [...demonstratedLessons, ...extraLessons];

const confidenceProgram: OwnedProgram = {
  id: confidenceIdentity.slug,
  slug: confidenceIdentity.slug,
  title: confidenceIdentity.title,
  label: confidenceIdentity.label,
  description: confidenceIdentity.description,
  visual: confidenceIdentity.visual,
  imageSrc: confidenceIdentity.imageSrc,
  imageAlt: confidenceIdentity.imageAlt,
  totalDays: 21,
  unlockMode: "sequential",
  progress: confidenceIdentity.progress,
  currentLessonSlug: "zgradi-notranjo-moc",
  initialCompletedLessonIds: [
    "21-dni-do-boljse-samozavesti-day-1",
    "21-dni-do-boljse-samozavesti-day-2",
  ],
  lessons: confidenceLessons,
  sections: [
    {
      id: "week-1",
      order: 1,
      title: "1. TEDEN – SPOZNAJ SEBE",
      lessonIds: demonstratedLessons.slice(0, 5).map((lesson) => lesson.id),
    },
    {
      id: "week-2",
      order: 2,
      title: "2. TEDEN – OKREPI SAMOZAVEST",
      lessonIds: demonstratedLessons.slice(5, 7).map((lesson) => lesson.id),
    },
    {
      id: "week-3",
      order: 3,
      title: "3. TEDEN – ŽIVI SVOJO MOČ",
      lessonIds: demonstratedLessons.slice(7, 10).map((lesson) => lesson.id),
    },
  ],
};

export const ownedPrograms: OwnedProgram[] = [confidenceProgram];

export function getOwnedProgramBySlug(slug: string) {
  return ownedPrograms.find((program) => program.slug === slug);
}

export function getOwnedLesson(program: OwnedProgram, lessonSlug: string) {
  return program.lessons.find((lesson) => lesson.slug === lessonSlug);
}

export function getOwnedProgramContinueHref(slug: string) {
  const program = getOwnedProgramBySlug(slug);
  if (!program) {
    return undefined;
  }

  return getOwnedLessonPath(program.slug, program.currentLessonSlug);
}

export function getOwnedLessonStaticParams() {
  return ownedPrograms.flatMap((program) =>
    program.lessons.map((lesson) => ({
      slug: program.slug,
      lessonSlug: lesson.slug,
    })),
  );
}

export function getOwnedLessonNav(program: OwnedProgram, lessonSlug: string) {
  const { previous, next } = getAdjacentLessons(program.lessons, lessonSlug);

  return {
    previous: previous
      ? {
          href: getOwnedLessonPath(program.slug, previous.slug),
          label: formatLessonHeading(previous),
        }
      : undefined,
    next: next
      ? {
          href: getOwnedLessonPath(program.slug, next.slug),
          label: formatLessonHeading(next),
        }
      : undefined,
  };
}
