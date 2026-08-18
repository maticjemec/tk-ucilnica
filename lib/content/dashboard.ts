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

export const dashboardProgress: DashboardProgress = {
  percent: 42,
  headline: "Odlično delaš!",
  supporting: "Nadaljuj in bodi ponosen/a nase.",
};

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
