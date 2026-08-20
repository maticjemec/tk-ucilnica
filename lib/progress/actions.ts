"use server";

import { revalidatePath } from "next/cache";
import { markLessonCompleted as persistLessonCompleted } from "@/lib/progress/mutations";
import type { ProgressWriteResult } from "@/lib/progress/types";

export type CompleteLessonResult = ProgressWriteResult;

export async function markLessonCompleted(
  programSlug: string,
  lessonSlug: string,
): Promise<CompleteLessonResult> {
  const result = await persistLessonCompleted(programSlug, lessonSlug);

  if (!result.ok) {
    return result;
  }

  revalidatePath("/");
  revalidatePath("/moji-programi");
  revalidatePath(`/moji-programi/${programSlug}`);
  revalidatePath(`/moji-programi/${programSlug}/lekcija/${lessonSlug}`);

  return result;
}
