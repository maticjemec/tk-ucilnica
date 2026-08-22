import "server-only";

import { cache } from "react";
import {
  getEntitlementForProgram,
  getUserAccessContext,
  ownsProgram,
} from "@/lib/auth/access";
import { IDENTITY_SLUG } from "@/lib/media/server/constants";
import { getOwnedLesson } from "@/lib/content/owned-program";
import { canOpenLesson } from "@/lib/owned-program/access";
import { buildProgramProgressView } from "@/lib/progress/helpers";
import { getProgramLessonProgress } from "@/lib/progress/queries";
import { getProgramWithCurriculum } from "@/lib/programs";
import { createClient } from "@/lib/supabase/server";

export type LessonMediaAccessReason =
  | "unauthenticated"
  | "no-entitlement"
  | "not-found"
  | "locked";

export type LessonMediaAccess =
  | {
      ok: true;
      programSlug: string;
      lessonSlug: string;
      lessonId: string;
      audioPath: string | null;
      worksheetPath: string | null;
    }
  | {
      ok: false;
      reason: LessonMediaAccessReason;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readOptionalPath(value: unknown) {
  if (value == null) {
    return null;
  }

  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

async function loadLessonMediaPaths(programSlug: string, lessonSlug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select(
      "audio_path, worksheet_path, slug, is_published, programs!inner ( slug, is_published )",
    )
    .eq("slug", lessonSlug)
    .eq("is_published", true)
    .eq("programs.slug", programSlug)
    .eq("programs.is_published", true)
    .maybeSingle();

  if (error || !isRecord(data)) {
    if (error) {
      console.error("[media] Failed to load lesson media paths.");
    }

    return null;
  }

  return {
    audioPath: readOptionalPath(data.audio_path),
    worksheetPath: readOptionalPath(data.worksheet_path),
  };
}

/**
 * Authoritative lesson media gate.
 *
 * Auth, entitlement, published curriculum, and unlock are checked with the
 * user-scoped server client. Object paths are read only from public.lessons.
 * Signed URLs are never created here.
 */
export const resolveLessonMediaAccess = cache(
  async (
    programSlug: string,
    lessonSlug: string,
  ): Promise<LessonMediaAccess> => {
    if (!IDENTITY_SLUG.test(programSlug) || !IDENTITY_SLUG.test(lessonSlug)) {
      return { ok: false, reason: "not-found" };
    }

    const access = await getUserAccessContext();

    if (access.status !== "authenticated") {
      return { ok: false, reason: "unauthenticated" };
    }

    if (!ownsProgram(access, programSlug)) {
      return { ok: false, reason: "no-entitlement" };
    }

    const entitlement = getEntitlementForProgram(access, programSlug);
    const now = new Date();
    const bundle = await getProgramWithCurriculum(programSlug);
    const program = bundle?.program;
    const lesson = program ? getOwnedLesson(program, lessonSlug) : undefined;

    if (!program || !lesson) {
      return { ok: false, reason: "not-found" };
    }

    const rows = await getProgramLessonProgress(programSlug);
    const progress = buildProgramProgressView(program, rows, {
      entitlement,
      now,
    });

    if (!canOpenLesson(program, lesson, progress.completedIds, { entitlement, now })) {
      return { ok: false, reason: "locked" };
    }

    const paths = await loadLessonMediaPaths(programSlug, lessonSlug);

    if (!paths) {
      return { ok: false, reason: "not-found" };
    }

    return {
      ok: true,
      programSlug,
      lessonSlug,
      lessonId: lesson.id,
      audioPath: paths.audioPath,
      worksheetPath: paths.worksheetPath,
    };
  },
);
