"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminCheckbox,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/fields";
import { Button } from "@/components/ui/Button";
import { createLessonAction, updateLessonAction } from "@/lib/admin/actions";
import {
  ADMIN_CONTENT_TYPES,
  ADMIN_UNLOCK_MODES,
  CONTENT_TYPE_HINTS,
} from "@/lib/admin/constants";
import { slugifyTitle } from "@/lib/admin/validation";
import type { AdminLessonListItem } from "@/lib/admin/types";
import type { ProgramContentType, ProgramSectionRow } from "@/lib/content/db-types";

type LessonFormProps = {
  programSlug: string;
  lesson?: AdminLessonListItem;
  sections: ProgramSectionRow[];
  nextOrder: number;
  contentType?: ProgramContentType;
  onContentTypeChange?: (value: ProgramContentType) => void;
};

const CONTENT_LABELS: Record<ProgramContentType, string> = {
  video: "Video",
  audio: "Avdio",
  text: "Besedilo",
  worksheet: "Delovni list",
  mixed: "Mešano",
};

const UNLOCK_LABELS = {
  all: "Vse odprto",
  sequential: "Zaporedno",
  drip: "Drip",
};

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function LessonForm({
  programSlug,
  lesson,
  sections,
  nextOrder,
  contentType: contentTypeProp,
  onContentTypeChange,
}: LessonFormProps) {
  const router = useRouter();
  const isCreate = !lesson;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [slug, setSlug] = useState(lesson?.slug ?? "");
  const [internalContentType, setInternalContentType] =
    useState<ProgramContentType>(lesson?.content_type ?? "video");
  const contentType = contentTypeProp ?? internalContentType;

  function setContentType(value: ProgramContentType) {
    onContentTypeChange?.(value);

    if (contentTypeProp === undefined) {
      setInternalContentType(value);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      programSlug,
      title: String(form.get("title") ?? ""),
      slug,
      description: String(form.get("description") ?? ""),
      sectionId: String(form.get("sectionId") ?? "") || null,
      lessonOrder: String(form.get("lessonOrder") ?? ""),
      durationMinutes: String(form.get("durationMinutes") ?? ""),
      contentType,
      isPreview: form.get("isPreview") === "on",
      isPublished: form.get("isPublished") === "on",
      unlockMode: String(form.get("unlockMode") ?? "") || null,
      unlockAt: String(form.get("unlockAt") ?? "") || null,
      dayOffset: String(form.get("dayOffset") ?? "") || null,
    };

    const result = isCreate
      ? await createLessonAction(payload)
      : await updateLessonAction(payload);

    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(`/admin/programi/${programSlug}/lekcije/${result.data.slug}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <AdminInput
        id="title"
        label="Naslov lekcije"
        required
        defaultValue={lesson?.title ?? ""}
        onChange={(event) => {
          if (isCreate && !slug) {
            setSlug(slugifyTitle(event.target.value));
          }
        }}
      />

      <AdminInput
        id="slug"
        label="Slug"
        required
        value={slug}
        readOnly={!isCreate}
        onChange={(event) => {
          if (isCreate) {
            setSlug(event.target.value.toLowerCase());
          }
        }}
        hint={
          isCreate
            ? "Male črke, številke in vezaji."
            : "Obstoječi slug je zaklenjen, da ne zlomi napredka."
        }
      />

      <AdminTextarea
        id="description"
        label="Opis / besedilo lekcije"
        hint="Za tekstovne lekcije je to vsebina, ki jo vidi udeleženec."
        rows={8}
        defaultValue={lesson?.description ?? ""}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminSelect
          id="sectionId"
          label="Razdelek"
          defaultValue={lesson?.section_id ?? ""}
        >
          <option value="">Brez razdelka</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.section_order}. {section.title}
            </option>
          ))}
        </AdminSelect>
        <AdminInput
          id="lessonOrder"
          label="Vrstni red"
          type="number"
          min="1"
          required
          defaultValue={lesson?.lesson_order ?? nextOrder}
        />
        <AdminInput
          id="durationMinutes"
          label="Trajanje (minute)"
          type="number"
          min="1"
          defaultValue={lesson?.duration_minutes ?? ""}
        />
        <AdminSelect
          id="contentType"
          label="Vrsta vsebine"
          value={contentType}
          onChange={(event) =>
            setContentType(event.target.value as ProgramContentType)
          }
          hint={`${CONTENT_TYPE_HINTS[contentType]} Sprememba vrste ne zbriše obstoječih datotek.`}
        >
          {ADMIN_CONTENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {CONTENT_LABELS[type]}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect
          id="unlockMode"
          label="Odklepanje"
          defaultValue={lesson?.unlock_mode ?? ""}
          hint="Prazno pomeni privzet način programa."
        >
          <option value="">Privzeto (program)</option>
          {ADMIN_UNLOCK_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {UNLOCK_LABELS[mode]}
            </option>
          ))}
        </AdminSelect>
        <AdminInput
          id="unlockAt"
          label="Odkleni ob (drip)"
          type="datetime-local"
          defaultValue={toDateTimeLocal(lesson?.unlock_at ?? null)}
        />
        <AdminInput
          id="dayOffset"
          label="Zamik dni (drip)"
          type="number"
          min="0"
          defaultValue={lesson?.day_offset ?? ""}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AdminCheckbox
          id="isPublished"
          label="Objavljeno"
          hint="Neobjavljene lekcije niso v učnem načrtu udeleženca."
          defaultChecked={lesson?.is_published ?? false}
        />
        <AdminCheckbox
          id="isPreview"
          label="Predogled"
          defaultChecked={lesson?.is_preview ?? false}
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Shranjujem…" : isCreate ? "Ustvari lekcijo" : "Shrani lekcijo"}
      </Button>
    </form>
  );
}
