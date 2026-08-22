import "server-only";

import { requireAdminMutation } from "@/lib/admin/auth";
import { ADMIN_SLUG } from "@/lib/admin/constants";
import { ADMIN_ERRORS, adminFail, adminOk } from "@/lib/admin/errors";
import { revalidateAdminProgram } from "@/lib/admin/revalidate";
import type { CreateSectionInput, UpdateSectionInput } from "@/lib/admin/types";
import {
  parseOptionalString,
  parsePositiveInt,
  parseRequiredString,
} from "@/lib/admin/validation";
import { createAdminClient } from "@/lib/supabase/admin";

const SECTION_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function loadProgramId(slug: string) {
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

export async function createSection(input: CreateSectionInput) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  if (!ADMIN_SLUG.test(input.programSlug)) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  const title = parseRequiredString(input.title, 200);
  const description = parseOptionalString(input.description, 2000);
  const sectionOrder = parsePositiveInt(input.sectionOrder);

  if (!title || description === undefined || !sectionOrder) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  const programId = await loadProgramId(input.programSlug);

  if (!programId) {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("program_sections").insert({
    program_id: programId,
    title,
    description,
    section_order: sectionOrder,
  });

  if (error) {
    console.error("[admin] Failed to create section.");
    return adminFail(
      error.message.includes("section_order")
        ? ADMIN_ERRORS.orderTaken
        : ADMIN_ERRORS.saveSection,
    );
  }

  revalidateAdminProgram(input.programSlug);
  return adminOk();
}

export async function updateSection(input: UpdateSectionInput) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  if (!ADMIN_SLUG.test(input.programSlug) || !SECTION_UUID.test(input.sectionId)) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  const title = parseRequiredString(input.title, 200);
  const description = parseOptionalString(input.description, 2000);
  const sectionOrder = parsePositiveInt(input.sectionOrder);

  if (!title || description === undefined || !sectionOrder) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  const programId = await loadProgramId(input.programSlug);

  if (!programId) {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("program_sections")
    .update({
      title,
      description,
      section_order: sectionOrder,
    })
    .eq("id", input.sectionId)
    .eq("program_id", programId);

  if (error) {
    console.error("[admin] Failed to update section.");
    return adminFail(
      error.message.includes("section_order")
        ? ADMIN_ERRORS.orderTaken
        : ADMIN_ERRORS.saveSection,
    );
  }

  revalidateAdminProgram(input.programSlug);
  return adminOk();
}

export async function moveSection(input: {
  programSlug: string;
  sectionId: string;
  direction: "up" | "down";
}) {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return auth;
  }

  if (!ADMIN_SLUG.test(input.programSlug) || !SECTION_UUID.test(input.sectionId)) {
    return adminFail(ADMIN_ERRORS.invalidInput);
  }

  const programId = await loadProgramId(input.programSlug);

  if (!programId) {
    return adminFail(ADMIN_ERRORS.notFound);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("program_sections")
    .select("id, section_order")
    .eq("program_id", programId)
    .order("section_order", { ascending: true });

  if (error || !Array.isArray(data)) {
    return adminFail(ADMIN_ERRORS.saveSection);
  }

  const index = data.findIndex((row) => row.id === input.sectionId);
  const swapIndex = input.direction === "up" ? index - 1 : index + 1;
  const current = data[index];
  const neighbor = data[swapIndex];

  if (!current || !neighbor) {
    return adminOk();
  }

  const currentOrder = current.section_order;
  const neighborOrder = neighbor.section_order;
  const tempOrder = 100000 + currentOrder;

  const first = await supabase
    .from("program_sections")
    .update({ section_order: tempOrder })
    .eq("id", current.id)
    .eq("program_id", programId);

  if (first.error) {
    return adminFail(ADMIN_ERRORS.saveSection);
  }

  const second = await supabase
    .from("program_sections")
    .update({ section_order: currentOrder })
    .eq("id", neighbor.id)
    .eq("program_id", programId);

  if (second.error) {
    return adminFail(ADMIN_ERRORS.saveSection);
  }

  const third = await supabase
    .from("program_sections")
    .update({ section_order: neighborOrder })
    .eq("id", current.id)
    .eq("program_id", programId);

  if (third.error) {
    return adminFail(ADMIN_ERRORS.saveSection);
  }

  revalidateAdminProgram(input.programSlug);
  return adminOk();
}
