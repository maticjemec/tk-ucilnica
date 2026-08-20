import { dashboardPrograms } from "@/lib/content/dashboard";
import { getFallbackContinueHref } from "@/lib/progress/helpers";
import type { ProgramProgressView } from "@/lib/progress/helpers";
import type {
  ProgramFilter,
  ProgramStatus,
  PurchasedProgram,
} from "@/types/programs";

type PurchasedFields = {
  status: ProgramStatus;
  lessons: string;
  duration: string;
  progress?: number;
  description?: string;
};

type PurchasedProgramSeed = Omit<PurchasedProgram, "continueHref">;

function toPurchasedProgram(
  slug: string,
  fields: PurchasedFields,
): PurchasedProgramSeed {
  const program = dashboardPrograms.find((item) => item.slug === slug);

  if (!program) {
    throw new Error(`Unknown dashboard program slug: ${slug}`);
  }

  return {
    ...program,
    ...fields,
    progress: fields.progress ?? program.progress,
    description: fields.description ?? program.description,
  };
}

/**
 * LEGACY local owned-card identity.
 * TASK 013B: /moji-programi reads public.programs via lib/programs.
 * status/progress here are leftover demo values and are overwritten at
 * runtime from public.user_lesson_progress.
 *
 * @deprecated TASK 013B: program identity comes from public.programs.
 */
export const purchasedPrograms: PurchasedProgramSeed[] = [
  toPurchasedProgram("21-dni-do-manj-anksioznosti", {
    status: "in-progress",
    lessons: "21 lekcij",
    duration: "21 dni",
    description:
      "Program za pomiritev uma, zmanjšanje stresa in več notranjega miru.",
  }),
  toPurchasedProgram("21-dni-do-boljse-samozavesti", {
    status: "in-progress",
    lessons: "10 lekcij",
    duration: "21 dni",
  }),
  toPurchasedProgram("najdi-sebe", {
    status: "in-progress",
    lessons: "21 lekcij",
    duration: "21 dni",
  }),
  toPurchasedProgram("samohipnoza-v-praksi", {
    status: "completed",
    lessons: "8 lekcij",
    duration: "Lifetime dostop",
    progress: 100,
  }),
];

/** @deprecated TASK 013B: map owned DB programs with toPurchasedProgram. */
export function getPurchasedProgramsForSlugs(
  ownedSlugs: readonly string[],
  progressBySlug: ReadonlyMap<string, ProgramProgressView> = new Map(),
): PurchasedProgram[] {
  const owned = new Set(ownedSlugs);

  return purchasedPrograms
    .filter((program) => owned.has(program.slug))
    .map((program) => {
      const progress = progressBySlug.get(program.slug);
      const progressPercent = progress?.progressPercent ?? 0;
      const isCompleted = progress?.isCompleted ?? false;

      return {
        ...program,
        progress: progressPercent,
        status: (isCompleted ? "completed" : "in-progress") as ProgramStatus,
        continueHref:
          progress?.continueHref ?? getFallbackContinueHref(program.slug),
      };
    });
}

export function filterPurchasedPrograms(
  programs: PurchasedProgram[],
  filter: ProgramFilter,
): PurchasedProgram[] {
  if (filter === "all") {
    return programs;
  }

  return programs.filter((program) => program.status === filter);
}
