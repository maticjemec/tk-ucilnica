export type UserLessonProgressRow = {
  id: string;
  user_id: string;
  program_slug: string;
  lesson_slug: string;
  completed: boolean;
  completed_at: string | null;
  last_opened_at: string;
  created_at: string;
  updated_at: string;
};

export type ProgressWriteResult =
  | { ok: true }
  | { ok: false; error: string };
