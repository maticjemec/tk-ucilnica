import { getAverageOwnedProgressPercent } from "@/lib/progress/helpers";
import type {
  ContinueLesson,
  DashboardHeroContent,
  DashboardProgram,
  DashboardProgress,
  UpcomingLesson,
} from "@/types/dashboard";

export const dashboardHero: DashboardHeroContent = {
  headingLines: ["Tvoja sprememba", "se začne tukaj."],
  body: "Hipnoza je prirodno orodje, ki ga že imaš v sebi. Naša naloga je, da te naučimo, kako ga uporabljaš.",
  ctaLabel: "Razišči programe",
  ctaHref: "/programi",
  imageAlt: "Topla svetloba nad gorami ob sončnem vzhodu",
};

/**
 * Leftover demo copy. Pregled uses getDashboardProgressSummary() from
 * owned-program percents (average). Continue/upcoming widgets below are
 * still mock content, filtered by entitlements.
 */
export const dashboardProgress: DashboardProgress = {
  percent: 42,
  headline: "Odlično delaš!",
  supporting: "Nadaljuj in bodi ponosen/a nase.",
};

/**
 * Catalog identity for dashboard/catalog cards.
 * `progress` on these objects is leftover demo metadata. Owned-program
 * cards overlay authenticated percent from public.user_lesson_progress.
 */
export const dashboardPrograms: DashboardProgram[] = [
  {
    slug: "21-dni-do-manj-anksioznosti",
    title: "21 DNI DO MANJ ANKSIOZNOSTI",
    label: "21 dni do manj anksioznosti",
    description:
      "Program za zmanjšanje stresa, pomiritev uma in več notranjega miru.",
    progress: 60,
    visual: "feather",
    imageAlt: "Mehko pero na mirnem, svetlem ozadju",
  },
  {
    slug: "21-dni-do-boljse-samozavesti",
    title: "21 DNI DO BOLJŠE SAMOZAVESTI",
    label: "21 dni do boljše samozavesti",
    description:
      "Okrepi svojo samozavest in zgradi notranjo moč, ki te vodi naprej.",
    progress: 35,
    visual: "silhouette",
    imageAlt: "Silhueta ob toplem sončnem vzhodu",
  },
  {
    slug: "najdi-sebe",
    title: "NAJDI SEBE",
    label: "Najdi sebe",
    description:
      "Potovanje vase. Odkrij, kdo si, česa si želiš in kam želiš iti.",
    progress: 20,
    visual: "path",
    imageAlt: "Pot skozi gore ob sončnem vzhodu",
  },
  {
    slug: "samohipnoza-v-praksi",
    title: "SAMOHIPNOZA V PRAKSI",
    label: "Samohipnoza v praksi",
    description:
      "Nauči se samohipnoze in jo uporabi kadarkoli jo potrebuješ.",
    progress: 0,
    visual: "ripple",
    imageAlt: "Krogi na mirni vodi",
  },
];

export const continueLesson: ContinueLesson = {
  title: "Uvod v hipnozo",
  program: "Najdi sebe",
  duration: "15 min",
  href: "/programi/najdi-sebe",
  visual: "path",
  imageAlt: "Najdi sebe — predogled lekcije",
};

export const upcomingLessons: UpcomingLesson[] = [
  {
    id: "dih-telo-um",
    title: "Dih, telo in um",
    program: "21 dni do manj anksioznosti",
    schedule: "Jutri ob 18:00",
  },
  {
    id: "samohipnoza-za-mir",
    title: "Samohipnoza za mir",
    program: "Samohipnoza v praksi",
    schedule: "Petek ob 19:00",
  },
];

// Continue/upcoming rows are still mock content. They are only shown when
// the matching local program slug is in the user's valid entitlements.
function slugForDashboardProgramLabel(label: string) {
  return dashboardPrograms.find((program) => program.label === label)?.slug;
}

export function getOwnedDashboardPrograms(
  ownedSlugs: readonly string[],
  progressBySlug: ReadonlyMap<string, number> = new Map(),
) {
  const owned = new Set(ownedSlugs);

  return dashboardPrograms
    .filter((program) => owned.has(program.slug))
    .map((program) => ({
      ...program,
      progress: progressBySlug.get(program.slug) ?? 0,
    }));
}

export function getDashboardProgressSummary(
  percents: readonly number[],
): DashboardProgress {
  if (percents.length === 0) {
    return {
      percent: 0,
      headline: "Tvoja pot te čaka.",
      supporting: "Ko boš vstopil/a v program, se bo napredek prikazal tukaj.",
    };
  }

  return {
    percent: getAverageOwnedProgressPercent(percents),
    headline: "Odlično delaš!",
    supporting: "Nadaljuj in bodi ponosen/a nase.",
  };
}

export function getOwnedContinueLesson(ownedSlugs: readonly string[]) {
  const slug = slugForDashboardProgramLabel(continueLesson.program);

  if (!slug || !ownedSlugs.includes(slug)) {
    return null;
  }

  return continueLesson;
}

export function getOwnedUpcomingLessons(ownedSlugs: readonly string[]) {
  const owned = new Set(ownedSlugs);

  return upcomingLessons.filter((lesson) => {
    const slug = slugForDashboardProgramLabel(lesson.program);
    return Boolean(slug && owned.has(slug));
  });
}
