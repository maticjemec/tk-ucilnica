import "server-only";

import { requireAdminMutation } from "@/lib/admin/auth";
import { ADMIN_SLUG, MAX_COVER_BYTES } from "@/lib/admin/constants";
import { ADMIN_ERRORS, adminFail, adminOk } from "@/lib/admin/errors";
import { revalidateAdminProgram } from "@/lib/admin/revalidate";
import { resolveCoverExtension } from "@/lib/admin/validation";
import { PROGRAM_COVERS_BUCKET } from "@/lib/media/server/constants";
import {
  looksLikeCoverImage,
  ownedProgramCoverPathFromUrl,
  programCoverObjectPath,
  programCoverPublicUrl,
} from "@/lib/media/server/covers";
import { isAuthorizedProgramCoverPath } from "@/lib/media/server/paths";
import { createAdminClient } from "@/lib/supabase/admin";

function readOptionalUrl(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

async function loadProgram(programSlug: string) {
  if (!ADMIN_SLUG.test(programSlug)) {
    return null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("programs")
    .select("id, slug, cover_image_url")
    .eq("slug", programSlug)
    .maybeSingle();

  if (error || !data || typeof data.id !== "string" || typeof data.slug !== "string") {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    coverImageUrl: readOptionalUrl(data.cover_image_url),
  };
}

async function removeStorageObject(path: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(PROGRAM_COVERS_BUCKET)
    .remove([path]);
  return !error;
}

export async function prepareAdminProgramCoverUpload(input: {
  programSlug: string;
  filename: string;
  contentType: string;
  size: number;
}) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const program = await loadProgram(input.programSlug);
  const extension = resolveCoverExtension(input.filename, input.contentType);

  if (!program) {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  if (!extension) {
    return adminFail(ADMIN_ERRORS.coverType);
  }

  if (!Number.isFinite(input.size) || input.size <= 0) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  if (input.size > MAX_COVER_BYTES) {
    return adminFail(ADMIN_ERRORS.coverSize);
  }

  const path = programCoverObjectPath(program.slug, extension);

  if (!isAuthorizedProgramCoverPath(path, program.slug)) {
    return adminFail(ADMIN_ERRORS.uploadCover);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(PROGRAM_COVERS_BUCKET)
    .createSignedUploadUrl(path, { upsert: true });

  if (error || !data?.token) {
    console.error("[admin] Failed to prepare program cover upload.");
    return adminFail(ADMIN_ERRORS.uploadCover);
  }

  return adminOk({
    bucket: PROGRAM_COVERS_BUCKET,
    path,
    token: data.token,
  });
}

export async function confirmAdminProgramCoverUpload(input: {
  programSlug: string;
  path: string;
}) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const program = await loadProgram(input.programSlug);

  if (
    !program ||
    !isAuthorizedProgramCoverPath(input.path, program.slug)
  ) {
    return adminFail(ADMIN_ERRORS.uploadCover);
  }

  const expectedPrefix = `programs/${program.slug}/cover.`;

  if (!input.path.startsWith(expectedPrefix)) {
    return adminFail(ADMIN_ERRORS.uploadCover);
  }

  const extension = input.path.slice(expectedPrefix.length);
  const supabase = createAdminClient();
  const { data: object, error: downloadError } = await supabase.storage
    .from(PROGRAM_COVERS_BUCKET)
    .download(input.path);

  if (downloadError || !object) {
    console.error("[admin] Failed to inspect uploaded program cover.");
    return adminFail(ADMIN_ERRORS.uploadCover);
  }

  const bytes = new Uint8Array(await object.arrayBuffer());

  if (!looksLikeCoverImage(bytes, extension)) {
    await removeStorageObject(input.path);
    return adminFail(ADMIN_ERRORS.coverType);
  }

  const publicUrl = programCoverPublicUrl(input.path);

  if (!publicUrl) {
    return adminFail(ADMIN_ERRORS.uploadCover);
  }

  const storedUrl = `${publicUrl}?v=${Date.now()}`;
  const previousPath = program.coverImageUrl
    ? ownedProgramCoverPathFromUrl(program.coverImageUrl, program.slug)
    : null;

  const { error } = await supabase
    .from("programs")
    .update({ cover_image_url: storedUrl })
    .eq("id", program.id)
    .eq("slug", program.slug);

  if (error) {
    console.error("[admin] Failed to save program cover URL.");
    return adminFail(ADMIN_ERRORS.uploadCover);
  }

  if (previousPath && previousPath !== input.path) {
    const removed = await removeStorageObject(previousPath);

    if (!removed) {
      console.error("[admin] Failed to remove previous program cover object.");
    }
  }

  revalidateAdminProgram(program.slug);
  return adminOk({ coverImageUrl: storedUrl });
}

export async function removeAdminProgramCover(input: { programSlug: string }) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const program = await loadProgram(input.programSlug);

  if (!program) {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  const ownedPath = program.coverImageUrl
    ? ownedProgramCoverPathFromUrl(program.coverImageUrl, program.slug)
    : null;

  if (ownedPath) {
    const removed = await removeStorageObject(ownedPath);

    if (!removed) {
      console.error("[admin] Failed to delete program cover object.");
      return adminFail(ADMIN_ERRORS.removeCover);
    }
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("programs")
    .update({ cover_image_url: null })
    .eq("id", program.id)
    .eq("slug", program.slug);

  if (error) {
    console.error("[admin] Failed to clear program cover URL.");
    return adminFail(ADMIN_ERRORS.removeCover);
  }

  revalidateAdminProgram(program.slug);
  return adminOk();
}
