export type { Program, ProgramRow } from "@/lib/programs/types";
export type { ProgramWithCurriculum } from "@/lib/programs/curriculum";

export {
  applyProgramIdentity,
  toCatalogProgram,
  toDashboardProgram,
  toPurchasedProgram,
} from "@/lib/programs/mappers";

export {
  getCurriculumForPrograms,
  getProgramBySlug,
  getProgramWithCurriculum,
  getProgramsBySlugs,
  getPublishedPrograms,
} from "@/lib/programs/queries";
