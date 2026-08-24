import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetailClient } from "@/components/program-detail/ProgramDetailClient";
import { getUserAccessContext, ownsProgram } from "@/lib/auth/access";
import { overlayLocalProgramDetailExtras } from "@/lib/content/program-detail";
import { getProgramBySlug } from "@/lib/programs";

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
  const [identity, access] = await Promise.all([
    getProgramBySlug(slug),
    getUserAccessContext(),
  ]);

  if (!identity) {
    notFound();
  }
  const owned = ownsProgram(access, slug);
  const program = overlayLocalProgramDetailExtras(identity);

  return (
    <ProgramDetailClient
      program={{
        ...program,
        accessState: owned ? "owned" : "public",
      }}
      isAuthenticated={access.status === "authenticated"}
    />
  );
}
