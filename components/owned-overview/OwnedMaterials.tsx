"use client";

import { useState } from "react";
import { Bell, ChevronRight, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type {
  LessonResource,
  OwnedProgramMaterial,
} from "@/types/owned-program";

const MOCK_DOWNLOAD_MESSAGE =
  "Prenos bo na voljo, ko povežemo shrambo datotek.";

type OwnedMaterialsProps = {
  featured: OwnedProgramMaterial[];
  extra: LessonResource[];
  total: number;
};

function materialIcon(title: string) {
  if (title.toLowerCase().includes("opomnik")) {
    return Bell;
  }

  return FileText;
}

export function OwnedMaterials({ featured, extra, total }: OwnedMaterialsProps) {
  const [expanded, setExpanded] = useState(false);
  const [messageById, setMessageById] = useState<Record<string, string>>({});

  function requestDownload(id: string) {
    setMessageById((current) => ({
      ...current,
      [id]: MOCK_DOWNLOAD_MESSAGE,
    }));
  }

  return (
    <section aria-labelledby="owned-materials-heading">
      <h2
        id="owned-materials-heading"
        className="font-serif text-[1.45rem] leading-tight tracking-tight text-foreground sm:text-[1.6rem]"
      >
        Gradiva programa
      </h2>

      <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {featured.map((material) => {
          const Icon = materialIcon(material.title);

          return (
            <li key={material.id}>
              <Card padding="none" className="h-full px-4 py-4 sm:px-5">
                <div className="flex h-full flex-col">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border text-accent">
                      <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm leading-snug font-medium text-foreground">
                        {material.title}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-muted">
                        {material.subtitle}
                      </p>
                      <p className="mt-1 text-[0.75rem] text-muted">
                        {material.formatLabel} · {material.sizeLabel}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => requestDownload(material.id)}
                  >
                    <Download className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                    {material.downloadLabel}
                  </Button>
                  {messageById[material.id] ? (
                    <p className="mt-2 text-xs text-muted" role="status">
                      {messageById[material.id]}
                    </p>
                  ) : null}
                </div>
              </Card>
            </li>
          );
        })}
      </ul>

      {expanded && extra.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2.5">
          {extra.map((resource) => (
            <li key={resource.id}>
              <Card padding="none" className="px-4 py-3.5 sm:px-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border text-accent">
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
                  <Button
                    variant="outline"
                    className="w-full shrink-0 sm:w-auto"
                    onClick={() => requestDownload(resource.id)}
                  >
                    <Download className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                    Prenesi
                  </Button>
                </div>
                {messageById[resource.id] ? (
                  <p className="mt-2 text-xs text-muted" role="status">
                    {messageById[resource.id]}
                  </p>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      ) : null}

      {extra.length > 0 ? (
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-1 text-sm text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Skrij dodatna gradiva" : `Prikaži vsa gradiva (${total})`}
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-90",
            )}
            strokeWidth={1.8}
            aria-hidden
          />
        </button>
      ) : null}
    </section>
  );
}
