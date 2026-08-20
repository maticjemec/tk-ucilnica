import "server-only";

import { buildOwnedProgressBySlug } from "@/lib/progress/helpers";
import { getUserLessonProgress } from "@/lib/progress/queries";
import type { ProgramProgressView } from "@/lib/progress/helpers";
import { getCurriculumForPrograms } from "@/lib/programs";

export async function getOwnedProgressBySlug(
  ownedSlugs: readonly string[],
): Promise<Map<string, ProgramProgressView>> {
  const bundles = await getCurriculumForPrograms(ownedSlugs);
  const programs = bundles.map((bundle) => bundle.program);
  const rows = await getUserLessonProgress();
  return buildOwnedProgressBySlug(programs, rows);
}
