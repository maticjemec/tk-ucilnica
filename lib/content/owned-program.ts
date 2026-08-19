import { dashboardPrograms } from "@/lib/content/dashboard";
import {
  formatLessonHeading,
  getAdjacentLessons,
} from "@/lib/owned-program/access";
import { getOwnedLessonPath } from "@/lib/owned-program/paths";
import type {
  LessonResource,
  OwnedProgram,
  OwnedProgramMaterial,
  ProgramLesson,
  ProgramSection,
} from "@/types/owned-program";

const DURATION_LABELS = ["13 min", "15 min", "14 min", "16 min", "12 min"] as const;
const DURATION_SECONDS = [13 * 60, 15 * 60, 14 * 60, 16 * 60, 12 * 60] as const;

type LessonDraft = {
  day: number;
  slug: string;
  title: string;
  description: string;
};

function durationForDay(day: number) {
  const index = (day - 1) % DURATION_LABELS.length;
  return {
    duration: DURATION_LABELS[index],
    durationSeconds: DURATION_SECONDS[index],
  };
}

function worksheet(
  programSlug: string,
  day: number,
  title: string,
): LessonResource {
  return {
    id: `${programSlug}-resource-day-${day}`,
    title: `Delovni list – ${title}`,
    kind: "pdf",
    formatLabel: "PDF",
    sizeLabel: "1.2 MB",
  };
}

function createLesson(
  programSlug: string,
  day: number,
  slug: string,
  title: string,
  description: string,
  extras?: Partial<Pick<ProgramLesson, "duration" | "durationSeconds" | "resources">>,
): ProgramLesson {
  const timing = durationForDay(day);

  return {
    id: `${programSlug}-day-${day}`,
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
    resources: extras?.resources ?? [worksheet(programSlug, day, title)],
  };
}

function createLessons(programSlug: string, drafts: LessonDraft[]) {
  return drafts.map((draft) =>
    createLesson(
      programSlug,
      draft.day,
      draft.slug,
      draft.title,
      draft.description,
    ),
  );
}

function createSections(
  programSlug: string,
  lessons: ProgramLesson[],
  weeks: Array<{ title: string; startDay: number; endDay: number }>,
): ProgramSection[] {
  return weeks.map((week, index) => ({
    id: `${programSlug}-week-${index + 1}`,
    order: index + 1,
    title: week.title,
    lessonIds: lessons
      .filter((lesson) => lesson.day >= week.startDay && lesson.day <= week.endDay)
      .map((lesson) => lesson.id),
  }));
}

function createMaterials(
  items: Array<Pick<OwnedProgramMaterial, "id" | "title" | "subtitle" | "sizeLabel"> & {
    downloadLabel?: string;
  }>,
): OwnedProgramMaterial[] {
  return items.map((item) => ({
    ...item,
    kind: "pdf",
    formatLabel: "PDF",
    downloadLabel: item.downloadLabel ?? "Prenesi",
  }));
}

function fromCatalogIdentity(slug: string) {
  const program = dashboardPrograms.find((item) => item.slug === slug);

  if (!program) {
    throw new Error(`Unknown dashboard program slug: ${slug}`);
  }

  return program;
}

function completedLessonIds(programSlug: string, throughDay: number) {
  return Array.from(
    { length: throughDay },
    (_, index) => `${programSlug}-day-${index + 1}`,
  );
}

const CONFIDENCE_SLUG = "21-dni-do-boljse-samozavesti";
const ANXIETY_SLUG = "21-dni-do-manj-anksioznosti";
const FIND_SELF_SLUG = "najdi-sebe";
const SELF_HYPNOSIS_SLUG = "samohipnoza-v-praksi";

const demonstratedLessons: ProgramLesson[] = [
  createLesson(
    CONFIDENCE_SLUG,
    1,
    "spoznaj-svojo-vrednost",
    "Spoznaj svojo vrednost",
    "Danes se ustavi pri tem, kdo si – brez primerjav in brez pogojev. Tvoja vrednost ni nekaj, kar moraš dokazati.",
  ),
  createLesson(
    CONFIDENCE_SLUG,
    2,
    "premagaj-dvome",
    "Premagaj dvome",
    "Dvomi se lahko umirijo, ko jih pogledaš od blizu. Danes se naučiš, kako jih slišiš, ne da bi jim predal krmilo.",
  ),
  createLesson(
    CONFIDENCE_SLUG,
    3,
    "zgradi-notranjo-moc",
    "Zgradi notranjo moč",
    "Notranja moč ni nekaj, s čimer se rodiš. Je nekaj, kar vsak dan gradiš – skozi svoje misli, odločitve in dejanja. Danes boš naredil/a korak k sebi.",
    { duration: "14 min", durationSeconds: 14 * 60 + 20 },
  ),
  createLesson(
    CONFIDENCE_SLUG,
    4,
    "samozavest-v-dejanjih",
    "Samozavest v dejanjih",
    "Samozavest zraste, ko jo živiš. Danes narediš majhen, konkreten korak, ki potrdi tvojo notranjo držo.",
  ),
  createLesson(
    CONFIDENCE_SLUG,
    5,
    "govori-s-seboj-z-ljubeznijo",
    "Govori s seboj z ljubeznijo",
    "Notranji glas te lahko podpira ali te taji. Danes vadimo govor, ki je jasen, topel in resničen.",
  ),
  createLesson(
    CONFIDENCE_SLUG,
    6,
    "postavi-zdrave-meje",
    "Postavi zdrave meje",
    "Meje niso zid. So način, kako varuješ svojo energijo in ostajaš zvest/a sebi.",
  ),
  createLesson(
    CONFIDENCE_SLUG,
    7,
    "sprejmi-in-bodi-hvalezen",
    "Sprejmi in bodi hvaležen/a",
    "Hvaležnost ne izniči tistega, kar je težko. Pomaga ti videti, kaj že drži tvoj dan.",
  ),
  createLesson(
    CONFIDENCE_SLUG,
    8,
    "vizualizacija-tvoje-prihodnosti",
    "Vizualizacija tvoje prihodnosti",
    "Danes si dovoliš jasno sliko prihodnosti, v kateri stojiš v svoji moči – mirno in samozavestno.",
  ),
  createLesson(
    CONFIDENCE_SLUG,
    9,
    "premagaj-strah-pred-neuspehom",
    "Premagaj strah pred neuspehom",
    "Strah pred napako te lahko ustavi še pred prvim korakom. Danes ga pogledaš in greš mimo njega.",
  ),
  createLesson(
    CONFIDENCE_SLUG,
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
    CONFIDENCE_SLUG,
    day,
    `dan-${day}`,
    title,
    "Nadaljuj s prakso in poglobi tisto, kar si že začel/a graditi. Ta dan je pripravljen v modelu, v tem prvem prikazu pa še ni viden v vsebini programa.",
    { resources: [] },
  );
});

const confidenceIdentity = fromCatalogIdentity(CONFIDENCE_SLUG);
const confidenceLessons = [...demonstratedLessons, ...extraLessons];

const confidenceMaterials: OwnedProgramMaterial[] = [
  {
    id: "confidence-workbook",
    title: "Delovni zvezek – 21 dni do boljše samozavesti",
    subtitle: "Praktične vaje za vsak dan.",
    kind: "pdf",
    formatLabel: "PDF",
    sizeLabel: "2.4 MB",
    downloadLabel: "Prenesi vse",
  },
  {
    id: "confidence-reminders",
    title: "Dnevni opomniki",
    subtitle: "Pozitivne misli za vsak dan programa.",
    kind: "pdf",
    formatLabel: "PDF",
    sizeLabel: "0.8 MB",
    downloadLabel: "Prenesi",
  },
  {
    id: "confidence-guide",
    title: "Vodnik programa",
    subtitle: "Pregled celotnega 21-dnevnega programa.",
    kind: "pdf",
    formatLabel: "PDF",
    sizeLabel: "1.1 MB",
    downloadLabel: "Prenesi",
  },
];

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
    `${CONFIDENCE_SLUG}-day-1`,
    `${CONFIDENCE_SLUG}-day-2`,
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
  materials: confidenceMaterials,
};

const anxietyIdentity = fromCatalogIdentity(ANXIETY_SLUG);
const anxietyLessons = createLessons(ANXIETY_SLUG, [
  {
    day: 1,
    slug: "kaj-je-anksioznost",
    title: "Kaj je anksioznost?",
    description:
      "Danes spoznaš anksioznost brez sramu. Ni napaka – je signal, ki ga lahko začneš razumeti.",
  },
  {
    day: 2,
    slug: "kako-telo-obcuti-anksioznost",
    title: "Kako telo občuti anksioznost",
    description:
      "Anksioznost se najprej pogosto pokaže v telesu. Danes opazuješ napetost, dih in ritem, ne da bi se jima uprl/a.",
  },
  {
    day: 3,
    slug: "misli-in-custva",
    title: "Misli in čustva",
    description:
      "Misli in čustva se hranijo med seboj. Danes se naučiš ju ločiti dovolj, da dobiš prostor za izbiro.",
  },
  {
    day: 4,
    slug: "tisina-med-mislimi",
    title: "Tišina med mislimi",
    description:
      "Med eno mislijo in naslednjo je kratek prostor. Danes vadiš, da ga opaziš – in da v njem malo dlje ostaneš.",
  },
  {
    day: 5,
    slug: "izogibanje-ali-soocenje",
    title: "Izogibanje ali soočenje",
    description:
      "Izogibanje za hip pomiri, a dolgoročno krepi strah. Danes narediš majhen korak proti soočenju.",
  },
  {
    day: 6,
    slug: "majhen-korak-naprej",
    title: "Majhen korak naprej",
    description:
      "Spremembe ne pridejo naenkrat. Danes izbereš en majhen, izvedljiv korak, ki telo prepriča, da si varen/a.",
  },
  {
    day: 7,
    slug: "zakljucek-prvega-tedna",
    title: "Zaključek prvega tedna",
    description:
      "Prvi teden zaključiš z razumevanjem, ne s pritiskom. Pogledaš, kaj si opazil/a – in to šteje.",
  },
  {
    day: 8,
    slug: "tvoj-notranji-alarm",
    title: "Tvoj notranji alarm",
    description:
      "Notranji alarm te želi zaščititi, tudi ko nevarnosti ni. Danes ga spoznaš od blizu, da te ne vodi več sam.",
  },
  {
    day: 9,
    slug: "dih-in-zivcni-sistem",
    title: "Dih in živčni sistem",
    description:
      "Dih je najbližji stik z živčnim sistemom. Danes vadiš ritem, ki telesu sporoča: zdaj sem varen/a.",
  },
  {
    day: 10,
    slug: "ustvarjanje-obcutka-varnosti",
    title: "Ustvarjanje občutka varnosti",
    description:
      "Varnost ni samo zunanja. Danes gradiš notranji občutek opore, ki ga lahko prikličeš, ko ga potrebuješ.",
  },
  {
    day: 11,
    slug: "prepoznavanje-sprozilcev",
    title: "Prepoznavanje sprožilcev",
    description:
      "Sprožilci niso sovražniki. Ko jih prepoznaš, dobiš izbiro, preden te odziv ponese s seboj.",
  },
  {
    day: 12,
    slug: "vrnitev-v-sedanji-trenutek",
    title: "Vrnitev v sedanji trenutek",
    description:
      "Anksioznost pogosto živi v prihodnosti. Danes se vračaš v telo, dih in tisto, kar je res zdaj.",
  },
  {
    day: 13,
    slug: "umirjanje-notranjega-dialoga",
    title: "Umirjanje notranjega dialoga",
    description:
      "Notranji glas zna pretiravati. Danes ga slišiš, ga upočasniš in mu ponudiš bolj resničen ton.",
  },
  {
    day: 14,
    slug: "tvoj-novi-odziv",
    title: "Tvoj novi odziv",
    description:
      "Drugi teden zaključiš z novim odzivom: opaziš alarm, se umiriš in izbereš naslednji korak.",
  },
  {
    day: 15,
    slug: "zaupanje-telesu",
    title: "Zaupanje telesu",
    description:
      "Telo ni proti tebi. Danes vadiš zaupanje v njegove signale – kot zaveznika, ne kot grožnjo.",
  },
  {
    day: 16,
    slug: "ko-pride-napetost",
    title: "Ko pride napetost",
    description:
      "Napetost se bo še vrnila. Danes vadiš, kaj narediš takrat – mirno, konkretno in brez obtoževanja.",
  },
  {
    day: 17,
    slug: "soocenje-z-negotovostjo",
    title: "Soočenje z negotovostjo",
    description:
      "Negotovosti ni treba odpraviti, da bi živel/a. Danes vadiš, da jo nosiš, ne da te ustavi.",
  },
  {
    day: 18,
    slug: "gradnja-notranje-varnosti",
    title: "Gradnja notranje varnosti",
    description:
      "Notranja varnost se gradi s ponavljanjem. Danes utrdiš prakso, ki ti ostane tudi po programu.",
  },
  {
    day: 19,
    slug: "zivljenje-z-vec-miru",
    title: "Življenje z več miru",
    description:
      "Mir ni praznina. Danes ga vnašaš v vsakdan – v odnose, ritem in odločitve, ki so tvoje.",
  },
  {
    day: 20,
    slug: "tvoja-nova-notranja-drza",
    title: "Tvoja nova notranja drža",
    description:
      "Nova drža ni maska. Je bolj miren, jasen način, kako stojiš pri sebi, ko pride val.",
  },
  {
    day: 21,
    slug: "zakljucek-programa",
    title: "Zaključek programa",
    description:
      "Zaključek je opomnik, da orodja ostanejo s tabo. Danes prepoznaš, kaj že znaš – in to vzameš naprej.",
  },
]);

const anxietyProgram: OwnedProgram = {
  id: anxietyIdentity.slug,
  slug: anxietyIdentity.slug,
  title: anxietyIdentity.title,
  label: anxietyIdentity.label,
  description: anxietyIdentity.description,
  visual: anxietyIdentity.visual,
  imageSrc: anxietyIdentity.imageSrc,
  imageAlt: anxietyIdentity.imageAlt,
  totalDays: 21,
  unlockMode: "sequential",
  progress: anxietyIdentity.progress,
  currentLessonSlug: "tvoj-notranji-alarm",
  initialCompletedLessonIds: completedLessonIds(ANXIETY_SLUG, 7),
  lessons: anxietyLessons,
  sections: createSections(ANXIETY_SLUG, anxietyLessons, [
    { title: "1. TEDEN – RAZUMEVANJE ANKSIOZNOSTI", startDay: 1, endDay: 7 },
    { title: "2. TEDEN – UMIRJANJE TELESA IN UMA", startDay: 8, endDay: 14 },
    { title: "3. TEDEN – NOVA NOTRANJA STABILNOST", startDay: 15, endDay: 21 },
  ]),
  materials: createMaterials([
    {
      id: "anxiety-workbook",
      title: "Delovni zvezek – 21 dni do manj anksioznosti",
      subtitle: "Dnevne vaje za umirjanje uma in telesa.",
      sizeLabel: "2.6 MB",
      downloadLabel: "Prenesi vse",
    },
    {
      id: "anxiety-triggers",
      title: "Dnevnik sprožilcev",
      subtitle: "Prostor, kjer opazuješ, kaj te sproži in kaj ti pomaga.",
      sizeLabel: "1.0 MB",
    },
    {
      id: "anxiety-calming",
      title: "Vaje za umirjanje",
      subtitle: "Kratke vaje za trenutke, ko se napetost dvigne.",
      sizeLabel: "0.9 MB",
    },
  ]),
};

const findSelfIdentity = fromCatalogIdentity(FIND_SELF_SLUG);
const findSelfLessons = createLessons(FIND_SELF_SLUG, [
  {
    day: 1,
    slug: "kdo-sem-danes",
    title: "Kdo sem danes?",
    description:
      "Danes se ustaviš pri sebi, kakršen/a si zdaj – brez zgodbe o tem, kdo bi moral/a biti.",
  },
  {
    day: 2,
    slug: "kaj-mi-daje-energijo",
    title: "Kaj mi daje energijo?",
    description:
      "Slediš tistemu, kar te napolni. Danes prepoznaš vire, ki ti vračajo moč.",
  },
  {
    day: 3,
    slug: "kaj-mi-jemlje-energijo",
    title: "Kaj mi jemlje energijo?",
    description:
      "Nekatere vloge in navade te tiho praznijo. Danes jih poimenuješ, da jih lahko kasneje odložiš.",
  },
  {
    day: 4,
    slug: "kaj-si-v-resnici-zelim",
    title: "Kaj si v resnici želim?",
    description:
      "Pod pričakovanji je tvoja želja. Danes jo slišiš dovolj jasno, da ji daš prostor – brez opravičevanja.",
  },
  {
    day: 5,
    slug: "moje-vrednote",
    title: "Moje vrednote",
    description:
      "Vrednote so kompas, ko je okoli tebe hrup. Danes izbereš tiste, ki so res tvoje.",
  },
  {
    day: 6,
    slug: "kaj-me-zadrzuje",
    title: "Kaj me zadržuje?",
    description:
      "Zadržki niso lenoba. Danes pogledaš strah, navado ali dolžnost, ki te drži na mestu.",
  },
  {
    day: 7,
    slug: "kaj-sem-odkril-o-sebi",
    title: "Kaj sem odkril/a o sebi?",
    description:
      "Prvi teden zaključiš z jasnostjo. Zbereš, kaj si videl/a – in to vzameš v naslednji teden.",
  },
  {
    day: 8,
    slug: "pricakovanja-drugih",
    title: "Pričakovanja drugih",
    description:
      "Pričakovanja drugih lahko zvenijo kot tvoj glas. Danes ločiš, kaj je tvoje in kaj si prevzel/a.",
  },
  {
    day: 9,
    slug: "vloge-ki-jih-igram",
    title: "Vloge, ki jih igram",
    description:
      "Vloge so včasih koristne, včasih utesnjene. Danes vidiš, kje igraš vlogo namesto sebe.",
  },
  {
    day: 10,
    slug: "strah-pred-spremembo",
    title: "Strah pred spremembo",
    description:
      "Strah pred spremembo varuje znano. Danes ga slišiš in vseeno narediš prostor za premik.",
  },
  {
    day: 11,
    slug: "dovoljenje-da-sem-jaz",
    title: "Dovoljenje, da sem jaz",
    description:
      "Nihče ti ne more dati dovoljenja namesto tebe. Danes ga daš sebi – mirno in odločno.",
  },
  {
    day: 12,
    slug: "poslusanje-svoje-intuicije",
    title: "Poslušanje svoje intuicije",
    description:
      "Intuicija je tiha, a vztrajna. Danes vadiš, da jo slišiš pred razlago, ki jo utiša.",
  },
  {
    day: 13,
    slug: "postavljanje-meja",
    title: "Postavljanje meja",
    description:
      "Meje varujejo tvoje središče. Danes postaviš eno jasno mejo, ki te vrača k sebi.",
  },
  {
    day: 14,
    slug: "vrnitev-k-sebi",
    title: "Vrnitev k sebi",
    description:
      "Drugi teden zaključiš z vrnitvijo. Odložiš, kar ni tvoje, in se spet postaviš v svoje središče.",
  },
  {
    day: 15,
    slug: "kako-zelim-ziveti",
    title: "Kako želim živeti?",
    description:
      "Danes ne iščeš popolnega načrta. Iščeš občutek življenja, ki ti pristaja – in ga poimenuješ.",
  },
  {
    day: 16,
    slug: "moja-notranja-vizija",
    title: "Moja notranja vizija",
    description:
      "Vizija ni pritisk. Je topla slika smeri, v kateri dihaš lažje in stojiš bolj pri sebi.",
  },
  {
    day: 17,
    slug: "kaj-izbiram-zase",
    title: "Kaj izbiram zase?",
    description:
      "Smer nastane z izbiro. Danes izbereš eno stvar zase – zavestno, brez opravičila.",
  },
  {
    day: 18,
    slug: "prvi-konkretni-koraki",
    title: "Prvi konkretni koraki",
    description:
      "Vizija potrebuje korak. Danes ga narediš dovolj majhnega, da ga zmoreš ponoviti.",
  },
  {
    day: 19,
    slug: "zaupanje-vase",
    title: "Zaupanje vase",
    description:
      "Zaupanje raste, ko držiš besedo sebi. Danes utrdiš ta občutek z eno zanesljivo gesto.",
  },
  {
    day: 20,
    slug: "moja-nova-smer",
    title: "Moja nova smer",
    description:
      "Nova smer ni beg. Je odločitev, da greš naprej kot ti – z več jasnosti in manj prilagajanja.",
  },
  {
    day: 21,
    slug: "nadaljujem-kot-jaz",
    title: "Nadaljujem kot jaz",
    description:
      "Zaključek ni nova identiteta. Je zaveza, da nadaljuješ kot ti – v ritmu, ki je tvoj.",
  },
]);

const findSelfProgram: OwnedProgram = {
  id: findSelfIdentity.slug,
  slug: findSelfIdentity.slug,
  title: findSelfIdentity.title,
  label: findSelfIdentity.label,
  description: findSelfIdentity.description,
  visual: findSelfIdentity.visual,
  imageSrc: findSelfIdentity.imageSrc,
  imageAlt: findSelfIdentity.imageAlt,
  totalDays: 21,
  unlockMode: "sequential",
  progress: findSelfIdentity.progress,
  currentLessonSlug: "kaj-si-v-resnici-zelim",
  initialCompletedLessonIds: completedLessonIds(FIND_SELF_SLUG, 3),
  lessons: findSelfLessons,
  sections: createSections(FIND_SELF_SLUG, findSelfLessons, [
    { title: "1. TEDEN – SPOZNAJ SEBE", startDay: 1, endDay: 7 },
    { title: "2. TEDEN – ODLOŽI, KAR NI TVOJE", startDay: 8, endDay: 14 },
    { title: "3. TEDEN – USTVARI SVOJO SMER", startDay: 15, endDay: 21 },
  ]),
  materials: createMaterials([
    {
      id: "find-self-workbook",
      title: "Delovni zvezek – Najdi sebe",
      subtitle: "Vaje za spoznavanje sebe in svoje smeri.",
      sizeLabel: "2.2 MB",
      downloadLabel: "Prenesi vse",
    },
    {
      id: "find-self-values",
      title: "Moje vrednote",
      subtitle: "List za razjasnitev tistega, kar ti je res pomembno.",
      sizeLabel: "0.7 MB",
    },
    {
      id: "find-self-vision",
      title: "Moja življenjska vizija",
      subtitle: "Prostor za vizijo življenja, ki ti pristaja.",
      sizeLabel: "0.8 MB",
    },
  ]),
};

const selfHypnosisIdentity = fromCatalogIdentity(SELF_HYPNOSIS_SLUG);
const selfHypnosisLessons = createLessons(SELF_HYPNOSIS_SLUG, [
  {
    day: 1,
    slug: "kaj-je-samohipnoza",
    title: "Kaj je samohipnoza?",
    description:
      "Samohipnoza ni izguba nadzora. Je osredotočeno, sproščeno stanje, ki ga lahko vodiš sam/a.",
  },
  {
    day: 2,
    slug: "kako-vstopiti-v-sprosceno-stanje",
    title: "Kako vstopiti v sproščeno stanje",
    description:
      "Danes vadiš vstop: dih, pozornost in dovoljenje, da se telo umiri dovolj za delo.",
  },
  {
    day: 3,
    slug: "ustvarjanje-notranjega-fokusa",
    title: "Ustvarjanje notranjega fokusa",
    description:
      "Fokus drži prakso. Danes se naučiš zbrati pozornost, ne da bi se silil/a.",
  },
  {
    day: 4,
    slug: "sugestije-ki-delujejo",
    title: "Sugestije, ki delujejo",
    description:
      "Dobre sugestije so preproste, resnične in v sedanjiku. Danes sestaviš take, ki jih telo lahko sprejme.",
  },
  {
    day: 5,
    slug: "sidranje-obcutkov",
    title: "Sidranje občutkov",
    description:
      "Občutek, ki ga hočeš ponoviti, potrebuje sidro. Danes ga povežeš z gesto, ki jo lahko prikličeš.",
  },
  {
    day: 6,
    slug: "samohipnoza-za-mir",
    title: "Samohipnoza za mir",
    description:
      "Prakso usmeriš v mir. Danes vstopiš, se umiriš in pustiš, da se živčni sistem spomni varnosti.",
  },
  {
    day: 7,
    slug: "samohipnoza-za-samozavest",
    title: "Samohipnoza za samozavest",
    description:
      "Isto orodje lahko nosi drug namen. Danes vadiš sugestije, ki krepijo notranjo držo.",
  },
  {
    day: 8,
    slug: "tvoja-osebna-praksa",
    title: "Tvoja osebna praksa",
    description:
      "Zaključek je tvoj ritual. Danes zložiš korake v prakso, ki jo lahko ponoviš, kadar jo potrebuješ.",
  },
]);

const selfHypnosisProgram: OwnedProgram = {
  id: selfHypnosisIdentity.slug,
  slug: selfHypnosisIdentity.slug,
  title: selfHypnosisIdentity.title,
  label: selfHypnosisIdentity.label,
  description: selfHypnosisIdentity.description,
  visual: selfHypnosisIdentity.visual,
  imageSrc: selfHypnosisIdentity.imageSrc,
  imageAlt: selfHypnosisIdentity.imageAlt,
  totalDays: 8,
  durationLabel: "Lifetime dostop",
  unlockMode: "sequential",
  progress: 100,
  currentLessonSlug: "kaj-je-samohipnoza",
  initialCompletedLessonIds: completedLessonIds(SELF_HYPNOSIS_SLUG, 8),
  lessons: selfHypnosisLessons,
  sections: createSections(SELF_HYPNOSIS_SLUG, selfHypnosisLessons, [
    { title: "1. DEL – OSNOVE", startDay: 1, endDay: 4 },
    { title: "2. DEL – PRAKSA", startDay: 5, endDay: 8 },
  ]),
  materials: createMaterials([
    {
      id: "self-hypnosis-guide",
      title: "Priročnik za samohipnozo",
      subtitle: "Koraki za vstop v sproščeno stanje in osebno prakso.",
      sizeLabel: "1.8 MB",
      downloadLabel: "Prenesi vse",
    },
    {
      id: "self-hypnosis-suggestions",
      title: "Predloge za sugestije",
      subtitle: "Primera sugestij za mir, fokus in samozavest.",
      sizeLabel: "0.6 MB",
    },
    {
      id: "self-hypnosis-plan",
      title: "Moj načrt prakse",
      subtitle: "Preprost načrt, kdaj in kako vadiš naprej.",
      sizeLabel: "0.5 MB",
    },
  ]),
};

export const ownedPrograms: OwnedProgram[] = [
  anxietyProgram,
  confidenceProgram,
  findSelfProgram,
  selfHypnosisProgram,
];

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

export function getOwnedProgramStaticParams() {
  return ownedPrograms.map((program) => ({ slug: program.slug }));
}

export function getOwnedLessonStaticParams() {
  return ownedPrograms.flatMap((program) =>
    program.lessons.map((lesson) => ({
      slug: program.slug,
      lessonSlug: lesson.slug,
    })),
  );
}

export function getOwnedProgramMaterials(program: OwnedProgram) {
  const featuredIds = new Set(program.materials.map((item) => item.id));
  const visibleIds = new Set(
    program.sections.flatMap((section) => section.lessonIds),
  );
  const extra = program.lessons
    .filter((lesson) => visibleIds.has(lesson.id))
    .flatMap((lesson) =>
      lesson.resources.filter((resource) => !featuredIds.has(resource.id)),
    );

  return {
    featured: program.materials,
    extra,
    total: program.materials.length + extra.length,
  };
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
