import "server-only";

import { requireAdminMutation } from "@/lib/admin/auth";
import { ADMIN_ERRORS, adminFail, adminOk } from "@/lib/admin/errors";
import { revalidateAdminProgram } from "@/lib/admin/revalidate";
import type { CreateProgramInput, UpdateProgramInput } from "@/lib/admin/types";
import {
  categoryLabel,
  parseBoolean,
  parseCategory,
  parseHttpUrl,
  parseNonNegativeInt,
  parseOptionalString,
  parsePriceCents,
  parseRequiredString,
  parseSlug,
} from "@/lib/admin/validation";
import { createAdminClient } from "@/lib/supabase/admin";

function uniqueViolation(message: string) {
  return message.includes("programs_slug") || message.includes("slug");
}

export async function createProgram(input: CreateProgramInput) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const title = parseRequiredString(input.title, 200);
  const slug = parseSlug(input.slug);
  const category = parseCategory(input.category);
  const priceCents = parsePriceCents(input.priceEur);
  const lessonCount = parseNonNegativeInt(input.lessonCount);
  const sortOrder = parseNonNegativeInt(input.sortOrder);
  const currency = parseRequiredString(input.currency, 8) ?? "EUR";
  const subtitle = parseOptionalString(input.subtitle, 300);
  const shortDescription = parseOptionalString(input.shortDescription, 500);
  const longDescription = parseOptionalString(input.longDescription, 8000);
  const durationLabel = parseOptionalString(input.durationLabel, 80);
  const difficulty = parseOptionalString(input.difficulty, 80);
  const coverImageUrl = parseHttpUrl(input.coverImageUrl);

  if (
    !title ||
    !slug ||
    !category ||
    priceCents == null ||
    lessonCount == null ||
    sortOrder == null ||
    subtitle === undefined ||
    shortDescription === undefined ||
    longDescription === undefined ||
    durationLabel === undefined ||
    difficulty === undefined ||
    coverImageUrl === undefined
  ) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("programs").insert({
    title,
    slug,
    subtitle,
    short_description: shortDescription,
    long_description: longDescription,
    category,
    category_label: categoryLabel(category),
    price_cents: priceCents,
    currency,
    duration_label: durationLabel,
    difficulty,
    lesson_count: lessonCount,
    is_published: parseBoolean(input.isPublished),
    is_featured: parseBoolean(input.isFeatured),
    sort_order: sortOrder,
    cover_image_url: coverImageUrl,
  });

  if (error) {
    console.error("[admin] Failed to create program.");
    return adminFail(
      uniqueViolation(error.message) ? ADMIN_ERRORS.slugTaken : ADMIN_ERRORS.saveProgram,
    );
  }

  revalidateAdminProgram(slug);
  return adminOk({ slug });
}

export async function updateProgram(input: UpdateProgramInput) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  const slug = parseSlug(input.slug);
  const title = parseRequiredString(input.title, 200);
  const category = parseCategory(input.category);
  const priceCents = parsePriceCents(input.priceEur);
  const lessonCount = parseNonNegativeInt(input.lessonCount);
  const sortOrder = parseNonNegativeInt(input.sortOrder);
  const currency = parseRequiredString(input.currency, 8) ?? "EUR";
  const subtitle = parseOptionalString(input.subtitle, 300);
  const shortDescription = parseOptionalString(input.shortDescription, 500);
  const longDescription = parseOptionalString(input.longDescription, 8000);
  const durationLabel = parseOptionalString(input.durationLabel, 80);
  const difficulty = parseOptionalString(input.difficulty, 80);
  const coverImageUrl = parseHttpUrl(input.coverImageUrl);

  if (
    !slug ||
    !title ||
    !category ||
    priceCents == null ||
    lessonCount == null ||
    sortOrder == null ||
    subtitle === undefined ||
    shortDescription === undefined ||
    longDescription === undefined ||
    durationLabel === undefined ||
    difficulty === undefined ||
    coverImageUrl === undefined
  ) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  const supabase = createAdminClient();
  const { data: existing, error: loadError } = await supabase
    .from("programs")
    .select("id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (loadError || !existing || typeof existing.id !== "string") {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  const { error } = await supabase
    .from("programs")
    .update({
      title,
      subtitle,
      short_description: shortDescription,
      long_description: longDescription,
      category,
      category_label: categoryLabel(category),
      price_cents: priceCents,
      currency,
      duration_label: durationLabel,
      difficulty,
      lesson_count: lessonCount,
      is_published: parseBoolean(input.isPublished),
      is_featured: parseBoolean(input.isFeatured),
      sort_order: sortOrder,
      cover_image_url: coverImageUrl,
    })
    .eq("id", existing.id)
    .eq("slug", slug);

  if (error) {
    console.error("[admin] Failed to update program.");
    return adminFail(ADMIN_ERRORS.saveProgram);
  }

  revalidateAdminProgram(slug);
  return adminOk({ slug });
}
