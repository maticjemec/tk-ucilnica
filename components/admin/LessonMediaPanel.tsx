"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  confirmLessonAudioUploadAction,
  confirmLessonWorksheetUploadAction,
  createLessonVideoUploadAction,
  detachLessonVideoAction,
  prepareLessonAudioUploadAction,
  prepareLessonWorksheetUploadAction,
  removeLessonAudioAction,
  removeLessonWorksheetAction,
} from "@/lib/admin/actions";
import {
  hasAttachedAudio,
  hasAttachedVideo,
  hasAttachedWorksheet,
  lessonMediaRoles,
  mediaRoleLabel,
  type AdminMediaRole,
} from "@/lib/admin/media-ui";
import type { AdminLessonListItem } from "@/lib/admin/types";
import type { ProgramContentType } from "@/lib/content/db-types";
import { getOwnedLessonPath } from "@/lib/owned-program/paths";
import { createClient } from "@/lib/supabase/client";

type LessonMediaPanelProps = {
  programSlug: string;
  lesson: AdminLessonListItem;
  contentType: ProgramContentType;
};

const VIDEO_STATUS_COPY: Record<string, string> = {
  preparing: "Video se pripravlja",
  ready: "Video je pripravljen",
  errored: "Napaka pri videu",
};

function fileLabel(path: string | null) {
  if (!path) {
    return null;
  }

  const name = path.split("/").pop();
  return name && !name.includes("\\") ? name : null;
}

function RoleBadge({ role }: { role: AdminMediaRole }) {
  return (
    <Badge variant={role === "orphaned" ? "warning" : role === "primary" ? "accent" : "muted"}>
      {mediaRoleLabel(role)}
    </Badge>
  );
}

export function LessonMediaPanel({
  programSlug,
  lesson,
  contentType,
}: LessonMediaPanelProps) {
  const router = useRouter();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const roles = lessonMediaRoles(contentType, lesson);
  const classroomHref = getOwnedLessonPath(programSlug, lesson.slug);

  function resetNotes() {
    setError(null);
    setMessage(null);
  }

  async function uploadVideo(file: File) {
    resetNotes();
    setPending("video");

    const prepared = await createLessonVideoUploadAction({
      programSlug,
      lessonSlug: lesson.slug,
    });

    if (!prepared.ok) {
      setPending(null);
      setError(prepared.error);
      return;
    }

    try {
      const response = await fetch(prepared.data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      if (!response.ok) {
        throw new Error("upload failed");
      }

      setMessage("Video je naložen. Status se posodobi, ko Mux konča obdelavo.");
      router.refresh();
    } catch {
      setError("Nalaganje ni uspelo.");
    } finally {
      setPending(null);
    }
  }

  async function uploadAudio(file: File) {
    resetNotes();
    setPending("audio");

    const guessedType =
      file.type ||
      (file.name.toLowerCase().endsWith(".m4a") ? "audio/mp4" : "audio/mpeg");

    const prepared = await prepareLessonAudioUploadAction({
      programSlug,
      lessonSlug: lesson.slug,
      filename: file.name,
      contentType: guessedType,
      size: file.size,
    });

    if (!prepared.ok) {
      setPending(null);
      setError(prepared.error);
      return;
    }

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from(prepared.data.bucket)
      .uploadToSignedUrl(prepared.data.path, prepared.data.token, file, {
        contentType: guessedType,
      });

    if (uploadError) {
      setPending(null);
      setError("Nalaganje ni uspelo.");
      return;
    }

    const confirmed = await confirmLessonAudioUploadAction({
      programSlug,
      lessonSlug: lesson.slug,
      path: prepared.data.path,
    });

    setPending(null);

    if (!confirmed.ok) {
      setError(confirmed.error);
      return;
    }

    setMessage("Zvok je naložen.");
    router.refresh();
  }

  async function uploadWorksheet(file: File) {
    resetNotes();
    setPending("worksheet");

    const prepared = await prepareLessonWorksheetUploadAction({
      programSlug,
      lessonSlug: lesson.slug,
      contentType: file.type || "application/pdf",
      size: file.size,
    });

    if (!prepared.ok) {
      setPending(null);
      setError(prepared.error);
      return;
    }

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from(prepared.data.bucket)
      .uploadToSignedUrl(prepared.data.path, prepared.data.token, file, {
        contentType: "application/pdf",
      });

    if (uploadError) {
      setPending(null);
      setError("Nalaganje ni uspelo.");
      return;
    }

    const confirmed = await confirmLessonWorksheetUploadAction({
      programSlug,
      lessonSlug: lesson.slug,
      path: prepared.data.path,
    });

    setPending(null);

    if (!confirmed.ok) {
      setError(confirmed.error);
      return;
    }

    setMessage("PDF je naložen.");
    router.refresh();
  }

  async function detachVideo() {
    if (
      !window.confirm(
        "Odstraniti video s te lekcije? Datoteka v Muxu ostane in se ne izbriše.",
      )
    ) {
      return;
    }

    resetNotes();
    setPending("detach-video");
    const result = await detachLessonVideoAction({
      programSlug,
      lessonSlug: lesson.slug,
    });
    setPending(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessage("Video je odstranjen z lekcije.");
    router.refresh();
  }

  async function removeAudio() {
    if (!window.confirm("Trajno odstraniti zvočno datoteko s te lekcije?")) {
      return;
    }

    resetNotes();
    setPending("remove-audio");
    const result = await removeLessonAudioAction({
      programSlug,
      lessonSlug: lesson.slug,
    });
    setPending(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessage("Zvočna datoteka je odstranjena.");
    router.refresh();
  }

  async function removeWorksheet() {
    if (!window.confirm("Trajno odstraniti PDF s te lekcije?")) {
      return;
    }

    resetNotes();
    setPending("remove-worksheet");
    const result = await removeLessonWorksheetAction({
      programSlug,
      lessonSlug: lesson.slug,
    });
    setPending(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessage("PDF je odstranjen.");
    router.refresh();
  }

  const videoAttached = hasAttachedVideo(lesson);
  const audioAttached = hasAttachedAudio(lesson);
  const pdfAttached = hasAttachedWorksheet(lesson);
  const videoStatus =
    lesson.video_status && VIDEO_STATUS_COPY[lesson.video_status]
      ? VIDEO_STATUS_COPY[lesson.video_status]
      : videoAttached
        ? "Video je še vedno pripet"
        : "Ni videa";

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={classroomHref} className="text-sm text-accent hover:underline">
          Preveri v učilnici
        </Link>
        {roles.video === "primary" || videoAttached ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={pending !== null}
            onClick={() => router.refresh()}
          >
            Osveži status
          </Button>
        ) : null}
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {message ? <p className="text-sm text-success-foreground">{message}</p> : null}

      {roles.video ? (
        <Card padding="sm" className="grid gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-foreground">Video</h3>
              <p className="mt-1 text-[0.8125rem] text-muted">{videoStatus}</p>
              {roles.video === "orphaned" ? (
                <p className="mt-1 text-[0.75rem] text-warning-foreground">
                  Video je še vedno pripet. Udeleženec ga vidi le pri vrsti
                  Video ali Mešano.
                </p>
              ) : null}
              {lesson.video_status === "preparing" ? (
                <p className="mt-1 text-[0.75rem] text-muted">
                  Datoteka gre neposredno na Mux. Osveži stran po obdelavi.
                </p>
              ) : null}
            </div>
            <RoleBadge role={roles.video} />
          </div>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="sr-only"
            disabled={pending === "video"}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void uploadVideo(file);
              }
              event.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={pending !== null}
              onClick={() => videoInputRef.current?.click()}
            >
              {videoAttached ? "Zamenjaj video" : "Naloži video"}
            </Button>
            {videoAttached ? (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={pending !== null}
                onClick={() => void detachVideo()}
              >
                Odstrani video
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      {roles.audio ? (
        <Card padding="sm" className="grid gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-foreground">Zvok</h3>
              <p className="mt-1 text-[0.8125rem] text-muted">
                {audioAttached
                  ? "Zvočna datoteka je naložena"
                  : "Ni zvočne datoteke"}
                {audioAttached && fileLabel(lesson.audio_path)
                  ? ` · ${fileLabel(lesson.audio_path)}`
                  : null}
              </p>
              {roles.audio === "orphaned" ? (
                <p className="mt-1 text-[0.75rem] text-warning-foreground">
                  Zvok je še vedno pripet. Udeleženec ga vidi le pri vrsti
                  Avdio ali Mešano.
                </p>
              ) : null}
              <p className="mt-1 text-[0.75rem] text-muted">MP3 ali M4A.</p>
            </div>
            <RoleBadge role={roles.audio} />
          </div>
          <input
            ref={audioInputRef}
            type="file"
            accept=".mp3,.m4a,audio/mpeg,audio/mp4"
            className="sr-only"
            disabled={pending === "audio"}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void uploadAudio(file);
              }
              event.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={pending !== null}
              onClick={() => audioInputRef.current?.click()}
            >
              {audioAttached ? "Zamenjaj zvok" : "Naloži zvok"}
            </Button>
            {audioAttached ? (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={pending !== null}
                onClick={() => void removeAudio()}
              >
                Odstrani zvok
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      {roles.worksheet ? (
        <Card padding="sm" className="grid gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-foreground">PDF</h3>
              <p className="mt-1 text-[0.8125rem] text-muted">
                {pdfAttached ? "Delovni list je naložen" : "Ni PDF datoteke"}
                {pdfAttached && fileLabel(lesson.worksheet_path)
                  ? ` · ${fileLabel(lesson.worksheet_path)}`
                  : null}
              </p>
              {roles.worksheet === "orphaned" ? (
                <p className="mt-1 text-[0.75rem] text-warning-foreground">
                  PDF je še vedno pripet.
                </p>
              ) : roles.worksheet === "optional" ? (
                <p className="mt-1 text-[0.75rem] text-muted">
                  Neobvezen delovni list v razdelku gradiv.
                </p>
              ) : null}
            </div>
            <RoleBadge role={roles.worksheet} />
          </div>
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={pending === "worksheet"}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void uploadWorksheet(file);
              }
              event.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={pending !== null}
              onClick={() => pdfInputRef.current?.click()}
            >
              {pdfAttached ? "Zamenjaj PDF" : "Naloži PDF"}
            </Button>
            {pdfAttached ? (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={pending !== null}
                onClick={() => void removeWorksheet()}
              >
                Odstrani PDF
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
