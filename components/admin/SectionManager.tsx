"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminInput, AdminTextarea } from "@/components/admin/fields";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  createSectionAction,
  moveSectionAction,
  updateSectionAction,
} from "@/lib/admin/actions";
import type { ProgramSectionRow } from "@/lib/content/db-types";

type SectionManagerProps = {
  programSlug: string;
  sections: ProgramSectionRow[];
  nextOrder: number;
};

export function SectionManager({
  programSlug,
  sections,
  nextOrder,
}: SectionManagerProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  async function refreshAfter(
    key: string,
    action: () => Promise<{ ok: true } | { ok: false; error: string }>,
  ) {
    setPending(key);
    setError(null);
    const result = await action();
    setPending(null);

    if (!result.ok) {
      setError(result.error);
      return false;
    }

    router.refresh();
    return true;
  }

  return (
    <div className="grid gap-4">
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {sections.map((section, index) => (
        <Card key={section.id} padding="sm" className="grid gap-3">
          <form
            className="grid gap-3 sm:grid-cols-[1fr_6rem]"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              void refreshAfter(section.id, () =>
                updateSectionAction({
                  programSlug,
                  sectionId: section.id,
                  title: String(form.get("title") ?? ""),
                  description: String(form.get("description") ?? ""),
                  sectionOrder: String(form.get("sectionOrder") ?? ""),
                }),
              );
            }}
          >
            <AdminInput
              id={`section-title-${section.id}`}
              label="Naslov razdelka"
              name="title"
              defaultValue={section.title}
            />
            <AdminInput
              id={`section-order-${section.id}`}
              label="Vrstni red"
              name="sectionOrder"
              type="number"
              min="1"
              defaultValue={section.section_order}
            />
            <AdminTextarea
              id={`section-description-${section.id}`}
              label="Opis"
              name="description"
              className="sm:col-span-2"
              rows={2}
              defaultValue={section.description ?? ""}
            />
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button type="submit" size="sm" disabled={pending === section.id}>
                Shrani
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={index === 0 || pending === section.id}
                onClick={() =>
                  void refreshAfter(`${section.id}-up`, () =>
                    moveSectionAction({
                      programSlug,
                      sectionId: section.id,
                      direction: "up",
                    }),
                  )
                }
              >
                Gor
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={index === sections.length - 1 || pending === section.id}
                onClick={() =>
                  void refreshAfter(`${section.id}-down`, () =>
                    moveSectionAction({
                      programSlug,
                      sectionId: section.id,
                      direction: "down",
                    }),
                  )
                }
              >
                Dol
              </Button>
            </div>
          </form>
        </Card>
      ))}

      <Card padding="sm">
        <p className="mb-3 text-sm font-medium text-foreground">Nov razdelek</p>
        <form
          key={nextOrder}
          className="grid gap-3 sm:grid-cols-[1fr_6rem]"
          onSubmit={(event) => {
            event.preventDefault();
            const formElement = event.currentTarget;
            const form = new FormData(formElement);
            void refreshAfter("create", () =>
              createSectionAction({
                programSlug,
                title: String(form.get("title") ?? ""),
                description: String(form.get("description") ?? ""),
                sectionOrder: String(form.get("sectionOrder") ?? nextOrder),
              }),
            ).then((created) => {
              if (created) {
                formElement.reset();
              }
            });
          }}
        >
          <AdminInput id="new-section-title" label="Naslov" name="title" required />
          <AdminInput
            id="new-section-order"
            label="Vrstni red"
            name="sectionOrder"
            type="number"
            min="1"
            defaultValue={nextOrder}
          />
          <AdminTextarea
            id="new-section-description"
            label="Opis"
            name="description"
            className="sm:col-span-2"
            rows={2}
          />
          <Button type="submit" size="sm" disabled={pending === "create"}>
            Dodaj razdelek
          </Button>
        </form>
      </Card>
    </div>
  );
}
