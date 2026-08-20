"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { LessonWorksheetSource } from "@/lib/media/types";

const MOCK_DOWNLOAD_MESSAGE =
  "Prenos bo na voljo, ko povežemo shrambo datotek.";

type LessonWorksheetProps = {
  worksheet: LessonWorksheetSource;
  description?: string;
};

export function LessonWorksheet({
  worksheet,
  description,
}: LessonWorksheetProps) {
  const [message, setMessage] = useState<string | null>(null);
  const downloadUrl = worksheet.signedDownloadUrl;

  return (
    <Card padding="none" className="px-5 py-6 sm:px-8 sm:py-8">
      <p className="ui-label">Delovni list</p>
      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-border bg-warning-soft text-accent">
          <FileText className="h-7 w-7" strokeWidth={1.5} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-[1.35rem] leading-snug font-medium tracking-tight text-foreground sm:text-[1.5rem]">
            {worksheet.title}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {worksheet.formatLabel} · {worksheet.sizeLabel}
          </p>
          {description ? (
            <p className="mt-3 max-w-[40rem] text-sm leading-relaxed text-muted sm:text-[0.95rem]">
              {description}
            </p>
          ) : null}

          {downloadUrl ? (
            <a
              href={downloadUrl}
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm border border-transparent bg-accent px-4 text-sm font-medium whitespace-nowrap text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
            >
              <Download className="h-4 w-4" strokeWidth={1.6} aria-hidden />
              Prenesi
            </a>
          ) : (
            <Button
              className="mt-5 w-full sm:w-auto"
              onClick={() => setMessage(MOCK_DOWNLOAD_MESSAGE)}
            >
              <Download className="h-4 w-4" strokeWidth={1.6} aria-hidden />
              Prenesi
            </Button>
          )}

          {message ? (
            <p className="mt-2 text-xs text-muted" role="status">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
