import "server-only";

import { getUserAccessContext } from "@/lib/auth/access";
import { buildOwnedProgressBySlug } from "@/lib/progress/helpers";
import { getUserLessonProgress } from "@/lib/progress/queries";
import type { ProgramProgressView } from "@/lib/progress/helpers";
import { getCurriculumForPrograms } from "@/lib/programs";
import type { ProgramWithCurriculum } from "@/lib/programs";
import type { LessonAccessEntitlement } from "@/types/owned-program";

export async function getOwnedCurriculumAndProgress(
  ownedSlugs: readonly string[],
): Promise<{
  bundles: ProgramWithCurriculum[];
  progressBySlug: Map<string, ProgramProgressView>;
}> {
  const access = await getUserAccessContext();
  const now = new Date();
  const entitlementsBySlug = new Map<string, LessonAccessEntitlement | null>(
    access.status === "authenticated"
      ? access.entitlements.map((item) => [item.programSlug, item])
      : [],
  );
  const [bundles, rows] = await Promise.all([
    getCurriculumForPrograms(ownedSlugs),
    getUserLessonProgress(),
  ]);
  const programs = bundles.map((bundle) => bundle.program);

  return {
    bundles,
    progressBySlug: buildOwnedProgressBySlug(
      programs,
      rows,
      entitlementsBySlug,
      now,
    ),
  };
}

export async function getOwnedProgressBySlug(
  ownedSlugs: readonly string[],
): Promise<Map<string, ProgramProgressView>> {
  const { progressBySlug } = await getOwnedCurriculumAndProgress(ownedSlugs);
  return progressBySlug;
}
