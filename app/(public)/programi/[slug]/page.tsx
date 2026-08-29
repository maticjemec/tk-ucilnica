import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetailClient } from "@/components/program-detail/ProgramDetailClient";
import { QueryRecovery } from "@/components/ui/QueryRecovery";
import {
  areEntitlementsReadable,
  getUserAccessContext,
  ownsProgram,
} from "@/lib/auth/access";
import { overlayLocalProgramDetailExtras } from "@/lib/content/program-detail";
import { getProgramBySlug, getProgramBySlugResult } from "@/lib/programs";

type ProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return { title: "Program" };
  }

  return {
    title: program.title,
    description: program.shortDescription,
  };
}

export default async function ProgramDetailPage({
  params,
}: ProgramDetailPageProps) {
  const { slug } = await params;
  const [lookup, access] = await Promise.all([
    getProgramBySlugResult(slug),
    getUserAccessContext(),
  ]);

  if (!lookup.ok) {
    return (
      <QueryRecovery
        title="Programa trenutno ni mogoče naložiti."
        description="Poskusi znova čez trenutek. Če se stran ne naloži, se vrni na katalog."
      />
    );
  }

  if (!lookup.program) {
    notFound();
  }

  const owned = ownsProgram(access, slug);
  const program = overlayLocalProgramDetailExtras(lookup.program);
  const accessState = !areEntitlementsReadable(access)
    ? "unavailable"
    : owned
      ? "owned"
      : "public";

  return (
    <ProgramDetailClient
      program={{
        ...program,
        accessState,
      }}
      isAuthenticated={access.status === "authenticated"}
    />
  );
}
