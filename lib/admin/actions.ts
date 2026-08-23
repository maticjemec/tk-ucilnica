"use server";

import { createProgram, updateProgram } from "@/lib/admin/mutations/programs";
import { createLesson, updateLesson } from "@/lib/admin/mutations/lessons";
import {
  confirmAdminProgramCoverUpload,
  prepareAdminProgramCoverUpload,
  removeAdminProgramCover,
} from "@/lib/admin/mutations/covers";
import {
  confirmAdminAudioUpload,
  confirmAdminWorksheetUpload,
  createAdminLessonVideoUpload,
  detachAdminLessonVideo,
  prepareAdminAudioUpload,
  prepareAdminWorksheetUpload,
  removeAdminLessonAudio,
  removeAdminLessonWorksheet,
} from "@/lib/admin/mutations/media";
import {
  createSection,
  moveSection,
  updateSection,
} from "@/lib/admin/mutations/sections";
import type {
  CreateLessonInput,
  CreateProgramInput,
  CreateSectionInput,
  UpdateLessonInput,
  UpdateProgramInput,
  UpdateSectionInput,
} from "@/lib/admin/types";

export async function createProgramAction(input: CreateProgramInput) {
  return createProgram(input);
}

export async function updateProgramAction(input: UpdateProgramInput) {
  return updateProgram(input);
}

export async function prepareProgramCoverUploadAction(input: {
  programSlug: string;
  filename: string;
  contentType: string;
  size: number;
}) {
  return prepareAdminProgramCoverUpload(input);
}

export async function confirmProgramCoverUploadAction(input: {
  programSlug: string;
  path: string;
}) {
  return confirmAdminProgramCoverUpload(input);
}

export async function removeProgramCoverAction(input: { programSlug: string }) {
  return removeAdminProgramCover(input);
}

export async function createSectionAction(input: CreateSectionInput) {
  return createSection(input);
}

export async function updateSectionAction(input: UpdateSectionInput) {
  return updateSection(input);
}

export async function moveSectionAction(input: {
  programSlug: string;
  sectionId: string;
  direction: "up" | "down";
}) {
  return moveSection(input);
}

export async function createLessonAction(input: CreateLessonInput) {
  return createLesson(input);
}

export async function updateLessonAction(input: UpdateLessonInput) {
  return updateLesson(input);
}

export async function createLessonVideoUploadAction(input: {
  programSlug: string;
  lessonSlug: string;
}) {
  return createAdminLessonVideoUpload(input);
}

export async function prepareLessonAudioUploadAction(input: {
  programSlug: string;
  lessonSlug: string;
  filename: string;
  contentType: string;
  size: number;
}) {
  return prepareAdminAudioUpload(input);
}

export async function confirmLessonAudioUploadAction(input: {
  programSlug: string;
  lessonSlug: string;
  path: string;
}) {
  return confirmAdminAudioUpload(input);
}

export async function prepareLessonWorksheetUploadAction(input: {
  programSlug: string;
  lessonSlug: string;
  contentType: string;
  size: number;
}) {
  return prepareAdminWorksheetUpload(input);
}

export async function confirmLessonWorksheetUploadAction(input: {
  programSlug: string;
  lessonSlug: string;
  path: string;
}) {
  return confirmAdminWorksheetUpload(input);
}

export async function detachLessonVideoAction(input: {
  programSlug: string;
  lessonSlug: string;
}) {
  return detachAdminLessonVideo(input);
}

export async function removeLessonAudioAction(input: {
  programSlug: string;
  lessonSlug: string;
}) {
  return removeAdminLessonAudio(input);
}

export async function removeLessonWorksheetAction(input: {
  programSlug: string;
  lessonSlug: string;
}) {
  return removeAdminLessonWorksheet(input);
}
