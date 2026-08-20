import "server-only";

import { getUserAccessContext } from "@/lib/auth/access";
import { buildOwnedProgressBySlug } from "@/lib/progress/helpers";
import { getUserLessonProgress } from "@/lib/progress/queries";
import type { ProgramProgressView } from "@/lib/progress/helpers";
import { getCurriculumForPrograms } from "@/lib/programs";
import type { LessonAccessEntitlement } from "@/types/owned-program";

export async function getOwnedProgressBySlug(
  ownedSlugs: readonly string[],
): Promise<Map<string, ProgramProgressView>> {
  const access = await getUserAccessContext();
  const now = new Date();
  const entitlementsBySlug = new Map<string, LessonAccessEntitlement | null>(
    access.status === "authenticated"
      ? access.entitlements.map((item) => [item.programSlug, item])
      : [],
  );
  const bundles = await getCurriculumForPrograms(ownedSlugs);
  const programs = bundles.map((bundle) => bundle.program);
  const rows = await getUserLessonProgress();
  return buildOwnedProgressBySlug(programs, rows, entitlementsBySlug, now);
}
