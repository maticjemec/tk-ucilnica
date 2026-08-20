import "server-only";

import { getOwnedProgramBySlug } from "@/lib/content/owned-program";
import { buildOwnedProgressBySlug } from "@/lib/progress/helpers";
import { getUserLessonProgress } from "@/lib/progress/queries";
import type { ProgramProgressView } from "@/lib/progress/helpers";

export async function getOwnedProgressBySlug(
  ownedSlugs: readonly string[],
): Promise<Map<string, ProgramProgressView>> {
  const programs = ownedSlugs
    .map((slug) => getOwnedProgramBySlug(slug))
    .filter((program): program is NonNullable<typeof program> => Boolean(program));
  const rows = await getUserLessonProgress();
  return buildOwnedProgressBySlug(programs, rows);
}
