import { dashboardPrograms } from "@/lib/content/dashboard";
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

function toPurchasedProgram(
  slug: string,
  fields: PurchasedFields,
): PurchasedProgram {
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

export const purchasedPrograms: PurchasedProgram[] = [
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

export function filterPurchasedPrograms(
  programs: PurchasedProgram[],
  filter: ProgramFilter,
): PurchasedProgram[] {
  if (filter === "all") {
    return programs;
  }

  return programs.filter((program) => program.status === filter);
}
