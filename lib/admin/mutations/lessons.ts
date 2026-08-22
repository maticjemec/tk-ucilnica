import "server-only";

import { requireAdminMutation } from "@/lib/admin/auth";
import { ADMIN_SLUG } from "@/lib/admin/constants";
import { ADMIN_ERRORS, adminFail, adminOk } from "@/lib/admin/errors";
import { revalidateAdminLesson } from "@/lib/admin/revalidate";
import type { CreateLessonInput, UpdateLessonInput } from "@/lib/admin/types";
import {
  parseBoolean,
  parseContentType,
  parseIsoDateTime,
  parseOptionalNonNegativeInt,
  parseOptionalPositiveInt,
  parseOptionalString,
  parsePositiveInt,
  parseRequiredString,
  parseSlug,
  parseUnlockModeField,
} from "@/lib/admin/validation";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function loadProgram(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("programs")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data || typeof data.id !== "string") {
    return null;
  }

  return data.id;
}

function parseLessonFields(input: CreateLessonInput | UpdateLessonInput) {
  const title = parseRequiredString(input.title, 200);
  const description = parseOptionalString(input.description, 20000);
  const lessonOrder = parsePositiveInt(input.lessonOrder);
  const durationMinutes = parseOptionalPositiveInt(input.durationMinutes);
  const contentType = parseContentType(input.contentType);
  const unlockMode = parseUnlockModeField(input.unlockMode);
  const unlockAt = parseIsoDateTime(input.unlockAt);
  const dayOffset = parseOptionalNonNegativeInt(input.dayOffset);
  const sectionId =
    input.sectionId && input.sectionId.length > 0 ? input.sectionId : null;

  if (
    !title ||
    description === undefined ||
    !lessonOrder ||
    durationMinutes === undefined ||
    !contentType ||
    !unlockMode.ok ||
    !unlockAt.ok ||
    dayOffset === undefined ||
    (sectionId && !UUID.test(sectionId))
  ) {
    return null;
  }

  return {
    title,
    description,
    lessonOrder,
    durationMinutes,
    contentType,
    unlockMode: unlockMode.value,
    unlockAt: unlockAt.value,
    dayOffset,
    sectionId,
    isPreview: parseBoolean(input.isPreview),
    isPublished: parseBoolean(input.isPublished),
  };
}

export async function createLesson(input: CreateLessonInput) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  if (!ADMIN_SLUG.test(input.programSlug)) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  const slug = parseSlug(input.slug);
  const fields = parseLessonFields(input);

  if (!slug || !fields) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  const programId = await loadProgram(input.programSlug);

  if (!programId) {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("lessons").insert({
    program_id: programId,
    section_id: fields.sectionId,
    slug,
    title: fields.title,
    description: fields.description,
    lesson_order: fields.lessonOrder,
    duration_minutes: fields.durationMinutes,
    content_type: fields.contentType,
    is_preview: fields.isPreview,
    is_published: fields.isPublished,
    unlock_mode: fields.unlockMode,
    unlock_at: fields.unlockAt,
    day_offset: fields.dayOffset,
  });

  if (error) {
    console.error("[admin] Failed to create lesson.");
    if (error.message.includes("slug")) {
      return adminFail(ADMIN_ERRORS.slugTaken);
    }
    if (error.message.includes("lesson_order")) {
      return adminFail(ADMIN_ERRORS.orderTaken);
    }
    return adminFail(ADMIN_ERRORS.saveLesson);
  }

  revalidateAdminLesson(input.programSlug, slug);
  return adminOk({ slug });
}

export async function updateLesson(input: UpdateLessonInput) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  if (!ADMIN_SLUG.test(input.programSlug)) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  const slug = parseSlug(input.slug);
  const fields = parseLessonFields(input);

  if (!slug || !fields) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  const programId = await loadProgram(input.programSlug);

  if (!programId) {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  const supabase = createAdminClient();
  const { data: existing, error: loadError } = await supabase
    .from("lessons")
    .select("id, slug")
    .eq("program_id", programId)
    .eq("slug", slug)
    .maybeSingle();

  if (loadError || !existing || typeof existing.id !== "string") {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  const { error } = await supabase
    .from("lessons")
    .update({
      section_id: fields.sectionId,
      title: fields.title,
      description: fields.description,
      lesson_order: fields.lessonOrder,
      duration_minutes: fields.durationMinutes,
      content_type: fields.contentType,
      is_preview: fields.isPreview,
      is_published: fields.isPublished,
      unlock_mode: fields.unlockMode,
      unlock_at: fields.unlockAt,
      day_offset: fields.dayOffset,
    })
    .eq("id", existing.id)
    .eq("program_id", programId)
    .eq("slug", slug);

  if (error) {
    console.error("[admin] Failed to update lesson.");
    if (error.message.includes("lesson_order")) {
      return adminFail(ADMIN_ERRORS.orderTaken);
    }
    return adminFail(ADMIN_ERRORS.saveLesson);
  }

  revalidateAdminLesson(input.programSlug, slug);
  return adminOk({ slug });
}

