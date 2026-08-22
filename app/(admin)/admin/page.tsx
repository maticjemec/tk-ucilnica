import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAdminHomeStats } from "@/lib/admin/queries";

export default async function AdminHomePage() {
  const stats = await getAdminHomeStats();

  return (
    <>
      <PageHeader
        title="Admin"
        subtitle="Upravljanje programov in lekcij."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card padding="sm">
          <p className="text-xs tracking-[0.12em] text-muted uppercase">Programi</p>
          <p className="mt-2 font-serif text-3xl text-foreground">{stats.total}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs tracking-[0.12em] text-muted uppercase">Objavljeni</p>
          <p className="mt-2 font-serif text-3xl text-foreground">{stats.published}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs tracking-[0.12em] text-muted uppercase">Osnutki</p>
          <p className="mt-2 font-serif text-3xl text-foreground">{stats.draft}</p>
        </Card>
      </div>
      <Card padding="sm" className="mt-6">
        <h2 className="text-sm font-medium text-foreground">Programi</h2>
        <p className="mt-1 text-sm text-muted">
          Ustvari, urejaj in objavljaj programe ter njihove lekcije.
        </p>
        <Link
          href="/admin/programi"
          className="mt-4 inline-flex h-10 items-center rounded-sm bg-accent px-4 text-sm font-medium text-accent-foreground"
        >
          Upravljaj programe
        </Link>
      </Card>
    </>
  );
}
