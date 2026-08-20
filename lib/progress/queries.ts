import "server-only";

import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getUserAccessContext } from "@/lib/auth/access";
import { createClient } from "@/lib/supabase/server";
import type { UserLessonProgressRow } from "@/lib/progress/types";

const USER_LESSON_PROGRESS_TABLE = "user_lesson_progress";

const USER_LESSON_PROGRESS_COLUMNS =
  "id, user_id, program_slug, lesson_slug, completed, completed_at, last_opened_at, created_at, updated_at";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRequiredString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function parseUserLessonProgressRow(
  value: unknown,
): UserLessonProgressRow | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readRequiredString(value.id);
  const userId = readRequiredString(value.user_id);
  const programSlug = readRequiredString(value.program_slug);
  const lessonSlug = readRequiredString(value.lesson_slug);
  const lastOpenedAt = readRequiredString(value.last_opened_at);
  const createdAt = readRequiredString(value.created_at);
  const updatedAt = readRequiredString(value.updated_at);

  if (
    !id ||
    !userId ||
    !programSlug ||
    !lessonSlug ||
    !lastOpenedAt ||
    !createdAt ||
    !updatedAt ||
    typeof value.completed !== "boolean"
  ) {
    return null;
  }

  if (value.completed_at != null && typeof value.completed_at !== "string") {
    return null;
  }

  return {
    id,
    user_id: userId,
    program_slug: programSlug,
    lesson_slug: lessonSlug,
    completed: value.completed,
    completed_at: value.completed_at ?? null,
    last_opened_at: lastOpenedAt,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

/**
 * Server-only progress reader.
 *
 * Queries public.user_lesson_progress with the authenticated user's session.
 * Fails closed: query errors and invalid rows yield an empty list.
 */
export async function fetchUserLessonProgress(
  supabase: SupabaseClient,
  userId: string,
  programSlug?: string,
): Promise<UserLessonProgressRow[]> {
  let query = supabase
    .from(USER_LESSON_PROGRESS_TABLE)
    .select(USER_LESSON_PROGRESS_COLUMNS)
    .eq("user_id", userId);

  if (programSlug) {
    query = query.eq("program_slug", programSlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[progress] Failed to load lesson progress.");
    return [];
  }

  if (!Array.isArray(data)) {
    console.error("[progress] Failed to load lesson progress.");
    return [];
  }

  const rows: UserLessonProgressRow[] = [];

  for (const item of data) {
    const row = parseUserLessonProgressRow(item);

    if (row) {
      rows.push(row);
    }
  }

  return rows;
}

export const getUserLessonProgress = cache(
  async (): Promise<UserLessonProgressRow[]> => {
    const access = await getUserAccessContext();

    if (access.status !== "authenticated") {
      return [];
    }

    const supabase = await createClient();
    return fetchUserLessonProgress(supabase, access.user.id);
  },
);

export async function getProgramLessonProgress(programSlug: string) {
  const rows = await getUserLessonProgress();
  return rows.filter((row) => row.program_slug === programSlug);
}
