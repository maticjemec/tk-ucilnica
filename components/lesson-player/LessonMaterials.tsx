"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { LessonResource } from "@/types/owned-program";

type LessonMaterialsProps = {
  resources: LessonResource[];
};

function ResourceDownload({
  resource,
  onMockDownload,
}: {
  resource: LessonResource;
  onMockDownload: () => void;
}) {
  const downloadUrl = resource.signedDownloadUrl ?? resource.href;

  if (downloadUrl) {
    return (
      <a
        href={downloadUrl}
        className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-sm border border-accent/50 bg-transparent px-4 text-sm font-medium whitespace-nowrap text-accent transition-colors hover:border-accent hover:bg-accent/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
      >
        <Download className="h-4 w-4" strokeWidth={1.6} aria-hidden />
        Prenesi
      </a>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-full shrink-0 sm:w-auto"
      disabled
      onClick={onMockDownload}
    >
      <Download className="h-4 w-4" strokeWidth={1.6} aria-hidden />
      Ni na voljo
    </Button>
  );
}

export function LessonMaterials({ resources }: LessonMaterialsProps) {
  const [messageById, setMessageById] = useState<Record<string, string>>({});

  if (resources.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="lesson-materials-heading" className="flex h-full min-w-0 flex-col">
      <h3
        id="lesson-materials-heading"
        className="text-[0.95rem] font-semibold tracking-tight text-foreground"
      >
        Gradiva za to lekcijo
      </h3>

      <ul className="mt-3 flex flex-col gap-2.5">
        {resources.map((resource) => (
          <li key={resource.id}>
            <div className="flex flex-col gap-3 rounded-md border border-border bg-canvas/70 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border bg-surface text-accent">
                  <FileText className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm leading-snug font-medium text-foreground">
                    {resource.title}
                  </p>
                  <p className="mt-0.5 text-[0.8rem] text-muted">
                    {resource.formatLabel} · {resource.sizeLabel}
                  </p>
                </div>
              </div>

              <ResourceDownload
                resource={resource}
                onMockDownload={() => {
                  setMessageById((current) => ({
                    ...current,
                    [resource.id]: "Prenos trenutno ni na voljo.",
                  }));
                }}
              />
            </div>
            {messageById[resource.id] ? (
              <p className="mt-1.5 text-xs text-muted" role="status">
                {messageById[resource.id]}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
