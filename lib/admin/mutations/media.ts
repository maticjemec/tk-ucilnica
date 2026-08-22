import "server-only";

import { requireAdminMutation } from "@/lib/admin/auth";
import {
  ADMIN_SLUG,
  MAX_AUDIO_BYTES,
  MAX_WORKSHEET_BYTES,
} from "@/lib/admin/constants";
import { ADMIN_ERRORS, adminFail, adminOk } from "@/lib/admin/errors";
import { getAdminRequestOrigin } from "@/lib/admin/origin";
import { revalidateAdminLesson } from "@/lib/admin/revalidate";
import {
  audioExtensionFromName,
  isAllowedAudioMime,
} from "@/lib/admin/validation";
import {
  LESSON_AUDIO_BUCKET,
  LESSON_MATERIALS_BUCKET,
} from "@/lib/media/server/constants";
import { isAuthorizedLessonObjectPath } from "@/lib/media/server/paths";
import { createLessonVideoDirectUpload } from "@/lib/media/server/upload";
import { createAdminClient } from "@/lib/supabase/admin";

function readOptionalPath(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

async function loadLesson(programSlug: string, lessonSlug: string) {
  if (!ADMIN_SLUG.test(programSlug) || !ADMIN_SLUG.test(lessonSlug)) {
    return null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("lessons")
    .select(
      "id, slug, audio_path, worksheet_path, programs!inner ( slug )",
    )
    .eq("slug", lessonSlug)
    .eq("programs.slug", programSlug)
    .maybeSingle();

  if (error || !data || typeof data.id !== "string") {
    return null;
  }

  return {
    id: data.id,
    programSlug,
    lessonSlug,
    audioPath: readOptionalPath(data.audio_path),
    worksheetPath: readOptionalPath(data.worksheet_path),
  };
}

async function removeStorageObject(bucket: string, path: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return !error;
}

export async function createAdminLessonVideoUpload(input: {
  programSlug: string;
  lessonSlug: string;
}) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const lesson = await loadLesson(input.programSlug, input.lessonSlug);

  if (!lesson) {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  const origin = await getAdminRequestOrigin();

  if (!origin) {
    return adminFail(ADMIN_ERRORS.uploadVideo);
  }

  try {
    const upload = await createLessonVideoDirectUpload({
      lessonId: lesson.id,
      corsOrigin: origin,
    });
    revalidateAdminLesson(input.programSlug, input.lessonSlug);
    return adminOk({
      uploadUrl: upload.uploadUrl,
      timeoutSeconds: upload.timeoutSeconds,
    });
  } catch {
    console.error("[admin] Failed to create Mux direct upload.");
    return adminFail(ADMIN_ERRORS.uploadVideo);
  }
}

export async function prepareAdminAudioUpload(input: {
  programSlug: string;
  lessonSlug: string;
  filename: string;
  contentType: string;
  size: number;
}) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const lesson = await loadLesson(input.programSlug, input.lessonSlug);
  const ext = audioExtensionFromName(input.filename);

  const mimeOk =
    isAllowedAudioMime(input.contentType) ||
    (ext === "m4a" && input.contentType === "video/mp4");

  if (!lesson || !ext || !mimeOk) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  if (!Number.isFinite(input.size) || input.size <= 0 || input.size > MAX_AUDIO_BYTES) {
    return adminFail(ADMIN_ERRORS.uploadAudio);
  }

  const path = `programs/${lesson.programSlug}/lessons/${lesson.lessonSlug}/audio.${ext}`;

  if (!isAuthorizedLessonObjectPath(path, lesson.programSlug, lesson.lessonSlug)) {
    return adminFail(ADMIN_ERRORS.uploadAudio);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(LESSON_AUDIO_BUCKET)
    .createSignedUploadUrl(path, { upsert: true });

  if (error || !data?.token) {
    console.error("[admin] Failed to prepare audio upload.");
    return adminFail(ADMIN_ERRORS.uploadAudio);
  }

  return adminOk({
    bucket: LESSON_AUDIO_BUCKET,
    path,
    token: data.token,
  });
}

export async function confirmAdminAudioUpload(input: {
  programSlug: string;
  lessonSlug: string;
  path: string;
}) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const lesson = await loadLesson(input.programSlug, input.lessonSlug);

  if (
    !lesson ||
    !isAuthorizedLessonObjectPath(input.path, lesson.programSlug, lesson.lessonSlug) ||
    !input.path.startsWith(
      `programs/${lesson.programSlug}/lessons/${lesson.lessonSlug}/audio.`,
    )
  ) {
    return adminFail(ADMIN_ERRORS.uploadAudio);
  }

  const supabase = createAdminClient();
  const previousPath = lesson.audioPath;
  const { error } = await supabase
    .from("lessons")
    .update({ audio_path: input.path })
    .eq("id", lesson.id);

  if (error) {
    console.error("[admin] Failed to save audio path.");
    return adminFail(ADMIN_ERRORS.uploadAudio);
  }

  if (
    previousPath &&
    previousPath !== input.path &&
    isAuthorizedLessonObjectPath(
      previousPath,
      lesson.programSlug,
      lesson.lessonSlug,
    )
  ) {
    const removed = await removeStorageObject(LESSON_AUDIO_BUCKET, previousPath);

    if (!removed) {
      console.error("[admin] Failed to remove previous audio object.");
    }
  }

  revalidateAdminLesson(input.programSlug, input.lessonSlug);
  return adminOk();
}

export async function prepareAdminWorksheetUpload(input: {
  programSlug: string;
  lessonSlug: string;
  contentType: string;
  size: number;
}) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const lesson = await loadLesson(input.programSlug, input.lessonSlug);

  if (!lesson || input.contentType !== "application/pdf") {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  if (
    !Number.isFinite(input.size) ||
    input.size <= 0 ||
    input.size > MAX_WORKSHEET_BYTES
  ) {
    return adminFail(ADMIN_ERRORS.uploadWorksheet);
  }

  const path = `programs/${lesson.programSlug}/lessons/${lesson.lessonSlug}/worksheet.pdf`;
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(LESSON_MATERIALS_BUCKET)
    .createSignedUploadUrl(path, { upsert: true });

  if (error || !data?.token) {
    console.error("[admin] Failed to prepare worksheet upload.");
    return adminFail(ADMIN_ERRORS.uploadWorksheet);
  }

  return adminOk({
    bucket: LESSON_MATERIALS_BUCKET,
    path,
    token: data.token,
  });
}

export async function confirmAdminWorksheetUpload(input: {
  programSlug: string;
  lessonSlug: string;
  path: string;
}) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const lesson = await loadLesson(input.programSlug, input.lessonSlug);
  const expected = lesson
    ? `programs/${lesson.programSlug}/lessons/${lesson.lessonSlug}/worksheet.pdf`
    : null;

  if (!lesson || input.path !== expected) {
    return adminFail(ADMIN_ERRORS.uploadWorksheet);
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("lessons")
    .update({ worksheet_path: input.path })
    .eq("id", lesson.id);

  if (error) {
    console.error("[admin] Failed to save worksheet path.");
    return adminFail(ADMIN_ERRORS.uploadWorksheet);
  }

  revalidateAdminLesson(input.programSlug, input.lessonSlug);
  return adminOk();
}

export async function detachAdminLessonVideo(input: {
  programSlug: string;
  lessonSlug: string;
}) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const lesson = await loadLesson(input.programSlug, input.lessonSlug);

  if (!lesson) {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("lessons")
    .update({
      video_provider: null,
      video_playback_id: null,
      video_asset_id: null,
      video_status: null,
    })
    .eq("id", lesson.id);

  if (error) {
    console.error("[admin] Failed to detach lesson video.");
    return adminFail(ADMIN_ERRORS.removeVideo);
  }

  revalidateAdminLesson(input.programSlug, input.lessonSlug);
  return adminOk();
}

export async function removeAdminLessonAudio(input: {
  programSlug: string;
  lessonSlug: string;
}) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const lesson = await loadLesson(input.programSlug, input.lessonSlug);

  if (!lesson) {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  if (!lesson.audioPath) {
    return adminOk();
  }

  if (
    !isAuthorizedLessonObjectPath(
      lesson.audioPath,
      lesson.programSlug,
      lesson.lessonSlug,
    )
  ) {
    return adminFail(ADMIN_ERRORS.removeAudio);
  }

  const removed = await removeStorageObject(LESSON_AUDIO_BUCKET, lesson.audioPath);

  if (!removed) {
    console.error("[admin] Failed to delete audio object.");
    return adminFail(ADMIN_ERRORS.removeAudio);
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("lessons")
    .update({ audio_path: null })
    .eq("id", lesson.id);

  if (error) {
    console.error("[admin] Failed to clear audio path after storage delete.");
    return adminFail(ADMIN_ERRORS.removeAudio);
  }

  revalidateAdminLesson(input.programSlug, input.lessonSlug);
  return adminOk();
}

export async function removeAdminLessonWorksheet(input: {
  programSlug: string;
  lessonSlug: string;
}) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const lesson = await loadLesson(input.programSlug, input.lessonSlug);

  if (!lesson) {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  if (!lesson.worksheetPath) {
    return adminOk();
  }

  if (
    !isAuthorizedLessonObjectPath(
      lesson.worksheetPath,
      lesson.programSlug,
      lesson.lessonSlug,
    )
  ) {
    return adminFail(ADMIN_ERRORS.removeWorksheet);
  }

  const removed = await removeStorageObject(
    LESSON_MATERIALS_BUCKET,
    lesson.worksheetPath,
  );

  if (!removed) {
    console.error("[admin] Failed to delete worksheet object.");
    return adminFail(ADMIN_ERRORS.removeWorksheet);
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("lessons")
    .update({ worksheet_path: null })
    .eq("id", lesson.id);

  if (error) {
    console.error("[admin] Failed to clear worksheet path after storage delete.");
    return adminFail(ADMIN_ERRORS.removeWorksheet);
  }

  revalidateAdminLesson(input.programSlug, input.lessonSlug);
  return adminOk();
}
