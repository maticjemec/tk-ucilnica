import Link from "next/link";

export function AdminDenied() {
  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col justify-center px-6 py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
        Admin
      </p>
      <h1 className="page-title mt-3">Nimate dostopa</h1>
      <p className="page-subtitle mt-2">
        Ta vmesnik je na voljo samo pooblaščenim administratorjem.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 w-fit items-center rounded-sm border border-accent/50 px-4 text-sm font-medium text-accent hover:bg-accent/5"
      >
        Nazaj v učilnico
      </Link>
    </main>
  );
}
