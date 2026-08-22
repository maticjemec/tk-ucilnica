"use client";

import { useState } from "react";
import { LessonForm } from "@/components/admin/LessonForm";
import { LessonMediaPanel } from "@/components/admin/LessonMediaPanel";
import type { AdminLessonListItem } from "@/lib/admin/types";
import type { ProgramContentType, ProgramSectionRow } from "@/lib/content/db-types";

type AdminLessonEditorProps = {
  programSlug: string;
  lesson: AdminLessonListItem;
  sections: ProgramSectionRow[];
};

export function AdminLessonEditor({
  programSlug,
  lesson,
  sections,
}: AdminLessonEditorProps) {
  const [contentType, setContentType] = useState<ProgramContentType>(
    lesson.content_type,
  );

  return (
    <>
      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl text-foreground">Lekcija</h2>
        <LessonForm
          programSlug={programSlug}
          lesson={lesson}
          sections={sections}
          nextOrder={lesson.lesson_order}
          contentType={contentType}
          onContentTypeChange={setContentType}
        />
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl text-foreground">Mediji</h2>
        <p className="mb-4 max-w-[42rem] text-sm text-muted">
          Vidni predvajalniki sledijo izbrani vrsti vsebine. Sprememba vrste
          ne zbriše datotek.
        </p>
        <LessonMediaPanel
          programSlug={programSlug}
          lesson={lesson}
          contentType={contentType}
        />
      </section>
    </>
  );
}
