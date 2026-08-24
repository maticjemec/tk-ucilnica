"use client";

import { useState } from "react";
import { ChevronRight, Download, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type {
  LessonResource,
  OwnedProgramMaterial,
} from "@/types/owned-program";

type OwnedMaterialsProps = {
  featured: OwnedProgramMaterial[];
  extra: LessonResource[];
  total: number;
};

function downloadHref(resource: { signedDownloadUrl?: string; href?: string }) {
  return resource.signedDownloadUrl ?? resource.href;
}

function DownloadLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm border border-accent/50 bg-transparent px-4 text-sm font-medium whitespace-nowrap text-accent transition-colors hover:border-accent hover:bg-accent/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
    >
      <Download className="h-4 w-4" strokeWidth={1.6} aria-hidden />
      {label}
    </a>
  );
}

export function OwnedMaterials({ featured, extra, total }: OwnedMaterialsProps) {
  const [expanded, setExpanded] = useState(false);

  if (total === 0) {
    return null;
  }

  return (
    <section aria-labelledby="owned-materials-heading">
      <h2
        id="owned-materials-heading"
        className="font-serif text-[1.45rem] leading-tight tracking-tight text-foreground sm:text-[1.6rem]"
      >
        Gradiva programa
      </h2>

      {featured.length > 0 ? (
        <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {featured.map((material) => {
            const href = downloadHref(material);

            return (
              <li key={material.id}>
                <Card padding="none" className="h-full px-4 py-4 sm:px-5">
                  <div className="flex h-full flex-col">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border text-accent">
                        <FileText className="h-4 w-4" strokeWidth={1.7} aria-hidden />
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

                    {href ? (
                      <div className="mt-4">
                        <DownloadLink href={href} label={material.downloadLabel} />
                      </div>
                    ) : null}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : null}

      {expanded && extra.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2.5">
          {extra.map((resource) => {
            const href = downloadHref(resource);

            return (
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
                    {href ? (
                      <DownloadLink href={href} label="Prenesi" />
                    ) : null}
                  </div>
                </Card>
              </li>
            );
          })}
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
