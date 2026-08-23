"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  confirmProgramCoverUploadAction,
  prepareProgramCoverUploadAction,
  removeProgramCoverAction,
} from "@/lib/admin/actions";
import { ADMIN_ERRORS } from "@/lib/admin/errors";
import { MAX_COVER_BYTES } from "@/lib/admin/constants";
import {
  isAllowedCoverMime,
  resolveCoverExtension,
} from "@/lib/admin/validation";
import { getProgramVisual } from "@/lib/programs/visuals";
import { createClient } from "@/lib/supabase/client";

type ProgramCoverPanelProps = {
  programSlug: string;
  title: string;
  coverImageUrl: string | null;
};

function validateCoverFile(file: File) {
  if (file.size > MAX_COVER_BYTES) {
    return ADMIN_ERRORS.coverSize;
  }

  const contentType = file.type;
  const extension = resolveCoverExtension(file.name, contentType);

  if (!isAllowedCoverMime(contentType) || !extension) {
    return ADMIN_ERRORS.coverType;
  }

  return null;
}

export function ProgramCoverPanel({
  programSlug,
  title,
  coverImageUrl,
}: ProgramCoverPanelProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const visual = getProgramVisual(programSlug, title);
  const hasImage = Boolean(coverImageUrl);

  function resetNotes() {
    setError(null);
    setMessage(null);
  }

  async function uploadCover(file: File) {
    resetNotes();

    const invalid = validateCoverFile(file);

    if (invalid) {
      setError(invalid);
      return;
    }

    setPending(true);

    const prepared = await prepareProgramCoverUploadAction({
      programSlug,
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });

    if (!prepared.ok) {
      setPending(false);
      setError(prepared.error);
      return;
    }

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from(prepared.data.bucket)
      .uploadToSignedUrl(prepared.data.path, prepared.data.token, file, {
        contentType: file.type,
      });

    if (uploadError) {
      setPending(false);
      setError(ADMIN_ERRORS.uploadCover);
      return;
    }

    const confirmed = await confirmProgramCoverUploadAction({
      programSlug,
      path: prepared.data.path,
    });

    setPending(false);

    if (!confirmed.ok) {
      setError(confirmed.error);
      return;
    }

    setMessage("Naslovna slika je shranjena.");
    router.refresh();
  }

  async function removeCover() {
    if (!window.confirm("Ali želiš odstraniti naslovno sliko programa?")) {
      return;
    }

    resetNotes();
    setPending(true);

    const result = await removeProgramCoverAction({ programSlug });

    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessage("Naslovna slika je odstranjena.");
    router.refresh();
  }

  return (
    <Card padding="sm" className="grid gap-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Naslovna slika</h3>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
          {hasImage
            ? "Trenutna slika se prikaže na javnih karticah in strani programa."
            : "Program še nima naslovne slike."}
        </p>
      </div>

      <CoverMedia
        alt={visual.imageAlt}
        imageSrc={coverImageUrl ?? undefined}
        sizes="(min-width: 768px) 36rem, 100vw"
        className="aspect-[16/9] w-full max-w-[36rem] rounded-sm bg-border/40"
      >
        <ProgramPlaceholder visual={visual.visual} />
      </CoverMedia>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="sr-only"
        disabled={pending}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";

          if (file) {
            void uploadCover(file);
          }
        }}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
          {pending
            ? "Nalaganje slike …"
            : hasImage
              ? "Zamenjaj sliko"
              : "Naloži naslovno sliko"}
        </Button>
        {hasImage ? (
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={pending}
            onClick={() => void removeCover()}
          >
            Odstrani sliko
          </Button>
        ) : null}
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {message ? (
        <p className="text-sm text-success-foreground">{message}</p>
      ) : null}
    </Card>
  );
}
