import "server-only";

import { revalidatePath } from "next/cache";

export function revalidateAdminProgram(slug: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/programi");
  revalidatePath(`/admin/programi/${slug}`);
  revalidatePath(`/admin/programi/${slug}`, "layout");
  revalidatePath(`/admin/programi/${slug}/lekcije/nova`);
  revalidatePath("/programi");
  revalidatePath(`/programi/${slug}`);
  revalidatePath("/moji-programi");
  revalidatePath(`/moji-programi/${slug}`);
  revalidatePath("/");
}

export function revalidateAdminLesson(programSlug: string, lessonSlug: string) {
  revalidateAdminProgram(programSlug);
  revalidatePath(`/admin/programi/${programSlug}/lekcije/${lessonSlug}`);
  revalidatePath(`/moji-programi/${programSlug}/lekcija/${lessonSlug}`);
}
