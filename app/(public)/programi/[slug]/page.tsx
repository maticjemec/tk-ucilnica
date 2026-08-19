import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramDetailClient } from "@/components/program-detail/ProgramDetailClient";
import { getUserAccessContext, ownsProgram } from "@/lib/auth/access";
import {
  getProgramBySlug,
  getProgramSlugs,
} from "@/lib/content/program-detail";

type ProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProgramSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProgramDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

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
  const program = getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const access = await getUserAccessContext();
  const owned = ownsProgram(access, slug);

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
