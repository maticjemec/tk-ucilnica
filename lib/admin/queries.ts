import "server-only";

import { requireAdminMutation } from "@/lib/admin/auth";
import { ADMIN_SLUG } from "@/lib/admin/constants";
import type {
  AdminHomeStats,
  AdminLessonListItem,
  AdminProgramDetail,
  AdminProgramListItem,
} from "@/lib/admin/types";
import { parseLessonRow, parseProgramSectionRow } from "@/lib/programs/curriculum";
import { parseProgramRow } from "@/lib/programs/mappers";
import { createAdminClient } from "@/lib/supabase/admin";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function adminDb() {
  const auth = await requireAdminMutation();

  if (!auth.ok) {
    return null;
  }

  return createAdminClient();
}

export async function getAdminHomeStats(): Promise<AdminHomeStats> {
  const supabase = await adminDb();

  if (!supabase) {
    return { total: 0, published: 0, draft: 0 };
  }

  const { data, error } = await supabase
    .from("programs")
    .select("is_published");

  if (error || !Array.isArray(data)) {
    console.error("[admin] Failed to load program stats.");
    return { total: 0, published: 0, draft: 0 };
  }

  const published = data.filter((row) => isRecord(row) && row.is_published === true)
    .length;

  return {
    total: data.length,
    published,
    draft: data.length - published,
  };
}

export async function getAdminPrograms(): Promise<AdminProgramListItem[]> {
  const supabase = await adminDb();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("programs")
    .select("*, lessons ( id, is_published )")
    .order("sort_order", { ascending: true });

  if (error || !Array.isArray(data)) {
    console.error("[admin] Failed to load programs.");
    return [];
  }

  const programs: AdminProgramListItem[] = [];

  for (const item of data) {
    const row = parseProgramRow(item);

    if (!row || !isRecord(item)) {
      continue;
    }

    const lessons = Array.isArray(item.lessons) ? item.lessons : [];
    const lessonPublished = lessons.filter(
      (lesson) => isRecord(lesson) && lesson.is_published === true,
    ).length;

    programs.push({
      ...row,
      lessonTotal: lessons.length,
      lessonPublished,
    });
  }

  return programs;
}

export async function getAdminProgramDetail(
  slug: string,
): Promise<AdminProgramDetail | null> {
  if (!ADMIN_SLUG.test(slug)) {
    return null;
  }

  const supabase = await adminDb();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("programs")
    .select(
      "*, program_sections ( * ), lessons ( * )",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[admin] Failed to load program detail.");
    return null;
  }

  const program = parseProgramRow(data);

  if (!program || !isRecord(data)) {
    return null;
  }

  const sections = (Array.isArray(data.program_sections) ? data.program_sections : [])
    .map(parseProgramSectionRow)
    .filter((row): row is NonNullable<typeof row> => Boolean(row))
    .sort((a, b) => a.section_order - b.section_order);

  const sectionTitles = new Map(sections.map((section) => [section.id, section.title]));

  const lessons: AdminLessonListItem[] = (Array.isArray(data.lessons) ? data.lessons : [])
    .map(parseLessonRow)
    .filter((row): row is NonNullable<typeof row> => Boolean(row))
    .sort((a, b) => a.lesson_order - b.lesson_order)
    .map((lesson) => ({
      ...lesson,
      sectionTitle: lesson.section_id
        ? sectionTitles.get(lesson.section_id) ?? null
        : null,
    }));

  return {
    program,
    sections,
    lessons,
    lessonTotal: lessons.length,
    lessonPublished: lessons.filter((lesson) => lesson.is_published).length,
  };
}

export async function getAdminLesson(
  programSlug: string,
  lessonSlug: string,
) {
  const detail = await getAdminProgramDetail(programSlug);

  if (!detail) {
    return null;
  }

  const lesson = detail.lessons.find((item) => item.slug === lessonSlug);

  if (!lesson) {
    return null;
  }

  return {
    program: detail.program,
    sections: detail.sections,
    lesson,
  };
}
