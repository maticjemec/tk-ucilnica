import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getUserAccessContext, ownsProgram } from "@/lib/auth/access";
import {
  getOwnedLesson,
  getOwnedProgramBySlug,
} from "@/lib/content/owned-program";
import { canOpenLesson } from "@/lib/owned-program/access";
import {
  buildProgramProgressView,
  PROGRESS_SAVE_ERROR,
} from "@/lib/progress/helpers";
import { getProgramLessonProgress } from "@/lib/progress/queries";
import type { ProgressWriteResult } from "@/lib/progress/types";
import { createClient } from "@/lib/supabase/server";

const USER_LESSON_PROGRESS_TABLE = "user_lesson_progress";
const PROGRAM_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LESSON_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ProgressWriteContext = {
  supabase: SupabaseClient;
  userId: string;
  programSlug: string;
  lessonSlug: string;
};

async function getProgressWriteContext(
  programSlug: string,
  lessonSlug: string,
): Promise<ProgressWriteContext | null> {
  if (!PROGRAM_SLUG.test(programSlug) || !LESSON_SLUG.test(lessonSlug)) {
    return null;
  }

  const access = await getUserAccessContext();

  if (access.status !== "authenticated" || !ownsProgram(access, programSlug)) {
    return null;
  }

  const program = getOwnedProgramBySlug(programSlug);
  const lesson = program ? getOwnedLesson(program, lessonSlug) : undefined;

  if (!program || !lesson) {
    return null;
  }

  const rows = await getProgramLessonProgress(programSlug);
  const progress = buildProgramProgressView(program, rows);
  const completedIds = progress?.completedIds ?? new Set<string>();

  if (!canOpenLesson(program, lesson, completedIds)) {
    return null;
  }

  const supabase = await createClient();

  return {
    supabase,
    userId: access.user.id,
    programSlug,
    lessonSlug,
  };
}

function failWrite(error: unknown): ProgressWriteResult {
  console.error("[progress] Failed to save lesson progress.");
  void error;
  return { ok: false, error: PROGRESS_SAVE_ERROR };
}

async function findExistingRow(
  supabase: SupabaseClient,
  userId: string,
  programSlug: string,
  lessonSlug: string,
) {
  const { data, error } = await supabase
    .from(USER_LESSON_PROGRESS_TABLE)
    .select("id, completed, completed_at")
    .eq("user_id", userId)
    .eq("program_slug", programSlug)
    .eq("lesson_slug", lessonSlug)
    .maybeSingle();

  if (error) {
    return { error: true as const, row: null };
  }

  return { error: false as const, row: data };
}

/**
 * Upsert last_opened_at. completed is left unchanged on update.
 * Does not create rows for locked/inaccessible lessons.
 */
export async function markLessonOpened(
  programSlug: string,
  lessonSlug: string,
): Promise<ProgressWriteResult> {
  const context = await getProgressWriteContext(programSlug, lessonSlug);

  if (!context) {
    return { ok: false, error: PROGRESS_SAVE_ERROR };
  }

  const existing = await findExistingRow(
    context.supabase,
    context.userId,
    context.programSlug,
    context.lessonSlug,
  );

  if (existing.error) {
    return failWrite(null);
  }

  const openedAt = new Date().toISOString();

  if (existing.row && typeof existing.row.id === "string") {
    const { error } = await context.supabase
      .from(USER_LESSON_PROGRESS_TABLE)
      .update({ last_opened_at: openedAt })
      .eq("id", existing.row.id)
      .eq("user_id", context.userId);

    if (error) {
      return failWrite(error);
    }

    return { ok: true };
  }

  const { error } = await context.supabase.from(USER_LESSON_PROGRESS_TABLE).insert({
    user_id: context.userId,
    program_slug: context.programSlug,
    lesson_slug: context.lessonSlug,
    last_opened_at: openedAt,
  });

  if (error) {
    return failWrite(error);
  }

  return { ok: true };
}

/**
 * Persist completed = true. user_id comes from the server session only.
 */
export async function markLessonCompleted(
  programSlug: string,
  lessonSlug: string,
): Promise<ProgressWriteResult> {
  const context = await getProgressWriteContext(programSlug, lessonSlug);

  if (!context) {
    return { ok: false, error: PROGRESS_SAVE_ERROR };
  }

  const existing = await findExistingRow(
    context.supabase,
    context.userId,
    context.programSlug,
    context.lessonSlug,
  );

  if (existing.error) {
    return failWrite(null);
  }

  const now = new Date().toISOString();
  const alreadyCompleted = existing.row?.completed === true;
  const completedAt =
    alreadyCompleted && typeof existing.row?.completed_at === "string"
      ? existing.row.completed_at
      : now;

  if (existing.row && typeof existing.row.id === "string") {
    const { error } = await context.supabase
      .from(USER_LESSON_PROGRESS_TABLE)
      .update({
        completed: true,
        completed_at: completedAt,
        last_opened_at: now,
      })
      .eq("id", existing.row.id)
      .eq("user_id", context.userId);

    if (error) {
      return failWrite(error);
    }

    return { ok: true };
  }

  const { error } = await context.supabase.from(USER_LESSON_PROGRESS_TABLE).insert({
    user_id: context.userId,
    program_slug: context.programSlug,
    lesson_slug: context.lessonSlug,
    completed: true,
    completed_at: completedAt,
    last_opened_at: now,
  });

  if (error) {
    return failWrite(error);
  }

  return { ok: true };
}
