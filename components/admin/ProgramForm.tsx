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
import { createProgramAction, updateProgramAction } from "@/lib/admin/actions";
import { ADMIN_CATEGORIES } from "@/lib/admin/constants";
import { centsToEur, slugifyTitle } from "@/lib/admin/validation";
import type { ProgramRow } from "@/lib/content/db-types";

type ProgramFormProps = {
  program?: ProgramRow;
  nextSortOrder?: number;
};

export function ProgramForm({ program, nextSortOrder = 1 }: ProgramFormProps) {
  const router = useRouter();
  const isCreate = !program;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [slug, setSlug] = useState(program?.slug ?? "");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title") ?? ""),
      slug,
      subtitle: String(form.get("subtitle") ?? ""),
      shortDescription: String(form.get("shortDescription") ?? ""),
      longDescription: String(form.get("longDescription") ?? ""),
      category: String(form.get("category") ?? ""),
      priceEur: String(form.get("priceEur") ?? "0"),
      currency: String(form.get("currency") ?? "EUR"),
      durationLabel: String(form.get("durationLabel") ?? ""),
      difficulty: String(form.get("difficulty") ?? ""),
      lessonCount: String(form.get("lessonCount") ?? "0"),
      isPublished: form.get("isPublished") === "on",
      isFeatured: form.get("isFeatured") === "on",
      sortOrder: String(form.get("sortOrder") ?? "0"),
    };

    const result = isCreate
      ? await createProgramAction(payload)
      : await updateProgramAction(payload);

    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    router.push(`/admin/programi/${result.data.slug}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <AdminInput
        id="title"
        label="Naslov"
        required
        defaultValue={program?.title ?? ""}
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
            ? "Male črke, številke in vezaji. Po objavi ga ne spreminjaj."
            : "Obstoječi slug je zaklenjen, da ne zlomi vpisov in napredka."
        }
      />

      <AdminInput
        id="subtitle"
        label="Podnaslov"
        defaultValue={program?.subtitle ?? ""}
      />
      <AdminTextarea
        id="shortDescription"
        label="Kratek opis"
        defaultValue={program?.short_description ?? ""}
        rows={3}
      />
      <AdminTextarea
        id="longDescription"
        label="Daljši opis"
        defaultValue={program?.long_description ?? ""}
        rows={6}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminSelect
          id="category"
          label="Kategorija"
          defaultValue={program?.category ?? "growth"}
        >
          {ADMIN_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </AdminSelect>
        <AdminInput
          id="priceEur"
          label="Cena (EUR)"
          type="number"
          min="0"
          step="0.01"
          defaultValue={program ? centsToEur(program.price_cents) : "0"}
        />
        <AdminInput
          id="currency"
          label="Valuta"
          defaultValue={program?.currency ?? "EUR"}
        />
        <AdminInput
          id="durationLabel"
          label="Trajanje"
          defaultValue={program?.duration_label ?? ""}
          placeholder="21 dni"
        />
        <AdminInput
          id="difficulty"
          label="Zahtevnost"
          defaultValue={program?.difficulty ?? "Vseh stopenj"}
        />
        <AdminInput
          id="lessonCount"
          label="Število lekcij (katalog)"
          type="number"
          min="0"
          step="1"
          defaultValue={program?.lesson_count ?? 0}
          hint="Ročno polje za javni katalog. Dejansko število lekcij je prikazano ločeno."
        />
        <AdminInput
          id="sortOrder"
          label="Vrstni red"
          type="number"
          min="0"
          step="1"
          defaultValue={program?.sort_order ?? nextSortOrder}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AdminCheckbox
          id="isPublished"
          label="Objavljeno"
          hint="Neobjavljeni programi niso vidni v katalogu."
          defaultChecked={program?.is_published ?? false}
        />
        <AdminCheckbox
          id="isFeatured"
          label="Izpostavljeno"
          defaultChecked={program?.is_featured ?? false}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Shranjujem…" : isCreate ? "Ustvari program" : "Shrani program"}
        </Button>
      </div>
    </form>
  );
}
