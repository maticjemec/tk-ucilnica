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
  getCurriculumForProgramsResult,
  getProgramBySlug,
  getProgramBySlugResult,
  getProgramWithCurriculum,
  getProgramWithCurriculumResult,
  getProgramsBySlugs,
  getPublishedPrograms,
  getPublishedProgramsResult,
} from "@/lib/programs/queries";
